import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { DashboardService } from './dashboard.service'
import { HttpClient } from '../../includes/http-client.service';
import { DerpPipe } from '../../includes/derp.pipe';
import { RouteHelper } from '../../includes/utils/route-helper.module';
import { Observable } from 'rxjs/Rx';
import { last } from '@angular/router/src/utils/collection';
import { validateConfig } from '@angular/router/src/config';
import * as RoomVM from '../../includes/viewModels/Room';
import * as io from "socket.io-client";
import * as environment from '../../../environments/environment';
// required to use jQuery
declare var $: any;

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

  // main objects displayed on the dashboard
  public room: any;
  private user: any;
  private library: any;
  private queue: any;
  private currentlyPlaying: any;
  
  // booleans to help determine which content to show
  private isHost: boolean;
  private joined: boolean;
  private isPlaying: boolean;
  
  // strings related to forms and content
  private roomName: string;
  private error: string;
  private contextUri: string;
  
  // make a socket.io connection to the server
  private socket = io('http://'+ environment.host + ':' + environment.socket_port);
  
  ngOnInit() {
    // variable initialization
    var playbackRefreshInterval = 1000;
    var self = this;
    self.room = new RoomVM.Room;
    self.queue = [];
    self.library = [];
    self.currentlyPlaying = {};
    self.isPlaying = false;
    self.roomName = "";
    self.user = this.authentication.getUser();

    // require that the user be logged in to access the dashboard
    if(!self.authentication.requireLogin()) return false;

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
    self.socket.on('error-message', function (data) {
      self.error = data;
    });

    // create a handler for when the room is updated or changed
    self.socket.on('room-update', function (data) {
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
        if(data.joined) {
          // if they recently joined, we need to get the tracks from the playlist
          self.dashboardService.getPlaylist(self.room.playlistUri+'/tracks').then((data: any) => {
            // successful response, set the queue data
            self.queue = data.items;
            self.joined = true;
          }, (err) => {
            if(err.status !== 401){
              console.log(err);
            }// end if not unauthorized error
          });
        }// end if the user just joined or created the playlist
        self.authentication.saveRoom(data.room.name);
      }// end if the room is null
     
      // console.log("Room update:", data);
    });

    // create a handler for when the playlist is updated or changed
    self.socket.on('playlist-update', function (data) {
      self.dashboardService.getPlaylist(self.room.playlistUri+'/tracks').then((data: any) => {
        // successful response, set the queue data
        self.queue = data.items;
      }, (err) => {
        if(err.status !== 401){
          console.log(err);
        }// end if not unauthorized error
      });
    });

    // create a handler for when the host's playback changes
    self.socket.on('playback-update', function (data) {
      if(self.joined && data.context != null && self.room != null && data.context.uri === self.room.contextUri){
        // the user has joined, and there is current
        // playback data available related to the assigned room
        self.contextUri = data.context.uri;
        self.isPlaying = data.is_playing;
      
        if(data.item == null) {
          self.currentlyPlaying = { id: -1 };
        }else{
          self.currentlyPlaying = data.item;
        }// end if we have a currently playing item

        // console.log("Playback Update:", data);
      }// end if playback data has a context
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
    self.isHost = self.authentication.isHost();
    self.getLibrary();
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
  }// end function getLibrary

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
        this.socket.emit('create-room', { user: this.user, roomName: this.roomName, playlistUri: data.href, playlistId: data.id, contextUri: data.uri });
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
    this.dashboardService.removePlaylist(this.user.id, this.room.playlistId).then((data: any) => {
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
    if(!this.joined || !this.isHost || this.queue === undefined || !data) return;
    
    if(this.contextUri != this.room.contextUri) {
      // user isn't playing the playlist assigned for the room
      this.socket.emit('playback-broadcast', { roomName: this.room.name, playback: data });
      return;
    }// end if the user isn't playing the playlist assigned to the room

    // the user has joined, and there is current
    // playback data available related to the room's playlist
    if(this.currentlyPlaying != null && this.currentlyPlaying.id !== data.item.id) {
      // the currently playing song has changed
      // remove the track from the queue
      var self = this;
      this.removeTrack(this.currentlyPlaying, 0, function() {
        var queue = self.queue;
        if(queue.length != 0) {
          // the length of the queue is nonzero after removing a track
          var next_track = self.queue[0].track;
          var position = self.findTrackPosition(data.item.id);
          
          if(next_track.id !== data.item.id) {
            // the next track to be played differs from the currently playing track
            // we need to reorder the playlist and put the currently playing track at the top of the queue
            var reorder = {
              range_start: position-1,
              insert_before: 0
            };
            self.dashboardService.reorderPlaylist(self.user.id, self.room.playlistId, reorder).then((data: any) => {
              // successfully reordered the playlist, now update it on the client side and emit a message
              // to all the users in the room
              self.socket.emit('playlist-broadcast', { roomName: self.room.name });
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
  }// end function updatePlayback

  play(offset=0){
    // start playing the user's playlist queue from the first song
    var self = this;
    var data;

    if(this.contextUri !== this.room.contextUri || offset != 0) {
      // this means the user hasn't started playing the playlist yet,
      // or they selected a different playlist/album from the spotify app
      // in either case, we want to tell spotify to play the playlist from the beginning
      data = {
        context_uri: this.room.contextUri,
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
    this.dashboardService.removeTrack(this.user.id, this.room.playlistId, data).then((data: any) => {
      // successfully remove the track from the Spotify playlist
      // run a callback if we have it, otherwise broadcast a playlist update to the rest of the room
      if(callback){
        callback();
      }else{
        this.socket.emit('playlist-broadcast', { roomName: this.room.name });
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
    return this.queue.findIndex(function(item){
      return item.track.id === id
    });
  }// end function findTrackById

}// end class DashboardComponent
