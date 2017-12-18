import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { DashboardService } from './dashboard.service'
import { HttpClient } from '../../includes/http-client.service';
import { DerpPipe } from '../../includes/derp.pipe';
import { RouteHelper } from '../../includes/utils/route-helper.module';
import { Observable } from 'rxjs/Rx';
import * as LibraryVM from '../../includes/viewModels/Library.js';
import * as RoomVM from '../../includes/viewModels/Room.js';
import * as io from "socket.io-client";
import { last } from '@angular/router/src/utils/collection';
import * as environment from '../../../environments/environment';
import { validateConfig } from '@angular/router/src/config';
declare var $: any;

/*
  TODO:
  Currently, we are storing the entire queue in the database when we only need to store the url.
  When playlist updates are made, the host should send a socket message telling all users in the current
  room to refresh the playlist, we also may need to make the playlist public in order for this to work.
  This is a lot more efficient, will make the code more readable, and will take some load off of the socket.io server
*/
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private authentication: AuthService,
              private dashboardService: DashboardService,
              private routeControl: RouteHelper,
              private http: HttpClient) { }

  // the user data from spotify (includes access token)
  public room: any;
  private isHost: boolean;
  private library: any;
  private joined: boolean;
  private roomName: string;
  private error: string;
  private isPlaying: boolean;
  private currentlyPlaying: any;
  private contextUri: string;
  private user: any;
  private socket = io('http://'+ environment.host + ':' + environment.socket_port);
  
  ngOnInit() {
    // variable initialization
    var playbackRefreshInterval = 1000;
    var self = this;
    self.room = new RoomVM.Room;
    self.library = [];
    self.currentlyPlaying = {};
    this.isPlaying = false;
    this.roomName = "";
    this.user = this.authentication.getUser();

    // require that the user be logged in to access the dashboard
    if(!this.authentication.requireLogin()) return false;

    // check if we have room information stored in the session,
    // if we do, we should use this before displaying the 'join' form
    var roomName = self.authentication.getRoom();
    
    if(roomName != null){
      // subscribe the user to the room since refreshing the page
      // causes the user to get a new socket connection
      self.socket.emit('subscribe', { roomName: roomName });
    }// end if the session room is not null

    // create a handler for error messages, updating them as the server passes them back
    // handler to be called upon return of an error message from Socket.io
    this.socket.on('error-message', function (data) {
      self.error = data;
    });

    // create a handler for when the room is updated or changed
    this.socket.on('room-update', function (data) {
      // get the new room information
      // first check if we have a null room update
      // this means that user left the room or host user ended the room
      if(data.room == null) {
        // unsubscribe the user from the room and reset the screen
        self.socket.emit('unsubscribe', { roomName: self.room.name });
        self.authentication.removeRoom();
        self.room = new RoomVM.Room;
        self.joined = false;
        self.isHost = false;
        self.error = null;
      }else{
        // update the room with the new information
        self.room = data.room;
        self.joined = true;
        self.authentication.saveRoom(data.room.name);
      }// end if the room is null
     
      console.log("Room update:", data);
    });

    // create a handler for when the host's playback changes
    this.socket.on('playback-update', function (data) {
      if(self.joined) {
        // the user has joined, and there is current
        // playback data available
        self.isPlaying = data.is_playing;
        
        if(data.item == null) {
          self.currentlyPlaying = { id: -1 };
        }else{
          self.currentlyPlaying = data.item;
        }// end if there is no currently playing track
        
        if(data.context){
          self.contextUri = data.context.uri;
        }// end if playback data has a context
  
        //console.log("Playback Update:", data);
      }// end if user has joined a room, is the host, and we have playback data
    });

    // set up an interval function to run and request playlist data from Spotify
    // this is the only way to ensure that we have the same playback data as Spotify
    Observable.interval(playbackRefreshInterval).subscribe(x => {
      this.dashboardService.currentlyPlaying().then((data: any) => {
        // successful response, music should now be playing via
        // the spotify application
        this.updatePlayback(data);
      }, (err) => {
        if(err.status !== 401){
          console.log(err);
        }// end if not unauthorized error
      });
    });

    // set the isHost variable so that we can display different items
    // based on the host condition
    this.isHost = this.authentication.isHost();
    this.getLibrary();
  }// end ngOnInit function

  getLibrary() {
    // Grab our playlist data using the service
    this.dashboardService.getLibrary().then((data: any) => {
      this.library = data.items;
    }, (err) => {
      if(err.status !== 401){
        console.log(err);
      }// end if not unauthorized error
    });
  }// end function getPlaylists()

  joinRoom(){
    if(this.roomName.search(/^$|\s+/) == 0){
      // the room name is empty
      this.error = "Please enter a room name.";
    }else{
      // the room name is not empty
      this.socket.emit('join-room', { user: this.user, roomName: this.roomName });
    }// end if the room name is empty
  }// end function joinRoom

  hostRoom(){
    if(this.roomName.search(/^$|\s+/) == 0){
      // the room name is empty
      this.error = "Please enter a room name.";
    }else{
      // the room name is not empty, create the playlist
      // and initialize the room with an empty queue
      var data = {
        description: "Boom room playlist",
        public: false,
        name: "Boom Room - " + this.roomName
      };
      this.dashboardService.createPlaylist(this.user.id, data).then((data: any) => {
        // successfully created a new Spotify playlist
        // show the user the dashboard with their new playlist
        this.socket.emit('create-room', { user: this.user, roomName: this.roomName, queue: data });
        this.isHost = this.authentication.setHost(true);
      }, (err) => {
        if(err.status !== 401){
          console.log(err);
        }// end if not unauthorized error
      });
    }// end if the room name is empty
  }// end function createPlaylist

  leaveRoom(){
    this.socket.emit('leave-room', { user: this.user, room: this.room });
  }// end function leaveRoom

  endRoom(){
    this.dashboardService.removePlaylist(this.user.id, this.room.queue.id).then((data: any) => {
      // successfully removed/unfollowed the Spotify playlist
      // send a socket message to tell all the users in the room that it is closed
      this.socket.emit('end-room', { user: this.user, room: this.room });
    }, (err) => {
      if(err.status !== 401){
        console.log(err);
      }// end if not unauthorized error
    });
  }// end function endRoom

  updatePlayback(data) {
    // updating and checking playback data should always happen
    // from the host of the room, the host will then emit socket 
    // messages telling other users that the playback data has changed
    if(this.joined && this.isHost && data) {
      // the user has joined, and there is current
      // playback data available
      if(this.currentlyPlaying != null && this.contextUri === this.room.queue.uri && this.currentlyPlaying.id !== data.item.id) {
        // the currently playing song has changed
        // remove the track from the queue
        var self = this;
        this.removeTrack(this.currentlyPlaying, 0, function() {
          var queue = self.room.queue.tracks.items;
          if(queue.length != 0){
            // the length of the queue is nonzero after removing a track
            var next_track = self.room.queue.tracks.items[0];
            var position = self.findTrackPosition(data.item.id);
            if(next_track.id !== data.item.id){
              // the next track to be played differs from the currently playing track
              // we need to reorder the playlist and put the currently playing track at the top of the queue
              var reorder = {
                range_start: position,
                insert_before: 0
              };
              self.dashboardService.reorderPlaylist(self.user.id, self.room.queue.id, reorder).then((data: any) => {
                // successfully reordered the playlist, now update it on the client side and emit a message
                // to all the users in the room
                var tmp = self.room.queue.tracks.items[position];
                self.room.queue.tracks.items.splice(position, 1);
                self.room.queue.tracks.items.unshift(tmp);
                self.socket.emit('room-broadcast', { room: self.room });
              }, (err) => {
                if(err.status !== 401){
                  console.log(err);
                }// end if not unauthorized error
              });
            }// end if the next track to be played is not the same as currently playing track
          }// end if the length of the queue is non-zero
        });

        
      }// end if the currently playing song has changed

      this.socket.emit('playback-broadcast', { roomName: this.room.name, playback: data });
    }// end if user has joined a room, is the host, and we have playback data
  }// end function updatePlayback

  play(offset=0){
    // start playing the user's playlist queue from the first song
    var self = this;
    var data;

    if(this.contextUri !== this.room.queue.uri || offset != 0){
      // this means the user hasn't started playing the playlist yet,
      // or they selected a different playlist/album from the spotify app
      // in either case, we want to tell spotify to play the playlist from the beginning
      data = {
        context_uri: this.room.queue.uri,
        offset: { "position" : offset }
      };
    }else{
      data = null;
    }// end if the currently playing context doesn't match the room context

    var play_callback = function() {
      self.dashboardService.play(data).then((data: any) => {}, (err) => {
        if(err.status !== 401){
          console.log(err);
        }// end if not unauthorized error
      });
    }// end function play_callback

    if(this.isPlaying) {
      // if we are currently playing, we need to pause, this is due
      // to the Spotify web api functionality
      this.pause(play_callback);
    }else{
      // we aren't currently playing, just run the request as normal
      play_callback();
    }// end if currently playing

  }// end function play

  pause(callback){
    this.dashboardService.pause().then((data: any) => {
      if(callback){
        callback();
      }// end if we have a callback function
    }, (err) => {
      if(err.status !== 401){
        console.log(err);
      }// end if not unauthorized error
    });
  }// end function pause
  
  nextTrack() {
    this.dashboardService.nextTrack().then((data: any) => {
      // successful response, music should now be playing via
      // the spotify application
      console.log(data);
    }, (err) => {
      if(err.status !== 401){
        console.log(err);
      }// end if not unauthorized error
    });
  }// end function nextTrack

  removeTrack(track, position, callback) {
    var data = {
      tracks: [{
        uri: track.uri,
        positions: [position]
      }]
    };
    this.dashboardService.removeTrack(this.user.id, this.room.queue.id, data).then((data: any) => {
      // successfully remove the track from the Spotify playlist
      // broadcast this new queue to the rest of the people in the room
      this.room.queue.tracks.items.splice(position, 1);
      if(callback){
        callback();
      }else{
        this.socket.emit('room-broadcast', { roomName: this.room.name, room: this.room });
      }// end if we have a callback function to run
    }, (err) => {
      if(err.status !== 401){
        console.log(err);
      }// end if not unauthorized error
    });
  }// end function removeTrack

  addTrack(item){
    // adding a track is avaiable to everyone, this means we need to emit a 
    // socket message and the socket will perform the actual API request
    // to Spotify, this is because we won't have the host's API access token
    // when making a request from a normal user
    this.socket.emit('add-track', { track: item.track, room: this.room });
  }// end function addTrack

  findTrackPosition(id){
    return this.room.queue.tracks.items.findIndex(function(track){
      return track.id === id
    });
  }// end function findTrackById

}// end class DashboardComponent
