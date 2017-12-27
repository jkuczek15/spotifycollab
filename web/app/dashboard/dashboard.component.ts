import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { DashboardService } from './dashboard.service';
import { QueueService } from '../queue/queue.service';
import { HttpClient } from '../../includes/http-client.service';
import { DerpPipe } from '../../includes/derp.pipe';
import { RouteHelper } from '../../includes/utils/route-helper.module';
import { Observable } from 'rxjs/Rx';
import { last } from '@angular/router/src/utils/collection';
import { validateConfig } from '@angular/router/src/config';
import * as RoomVM from '../../includes/viewModels/Room';
import * as io from "socket.io-client";
import * as ons from 'onsenui';
import { Environment }from '../../../environments/environment';
import { QueueComponent } from '../queue/queue.component';
// required to use jQuery
declare var $: any;

@Component({
  selector: 'ons-page[dashboard]',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private authentication: AuthService,
              private dashboardService: DashboardService,
              private queueService: QueueService,
              private routeControl: RouteHelper,
              private http: HttpClient) { }

  private environment = new Environment();

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
  
  // use the socket connection provided by the authentication service
  private socket = this.authentication.socket;

  ngOnInit() {
    // variable initialization
    var playbackRefreshInterval = 1000;
    this.room = new RoomVM.Room;
    this.queue = [];
    this.library = [];
    this.currentlyPlaying = {};
    this.isPlaying = false;
    this.roomName = "";
    this.user = this.authentication.getUser();

    // require that the user be logged in to access the dashboard
    if(!this.authentication.requireLogin()) return false;
    
    // check if we have room information stored in the session,
    // if we do, we should use this before displaying the 'join' form
    var room = this.authentication.getRoom();
    
    if(room != null) {
      // subscribe the user to the room since refreshing the page
      // causes the user to get a new socket connection
      this.socket.emit('subscribe', { roomName: room.name });
    }// end if the session room is not null

    // create a handler for error messages, updating them as the server passes them back
    // handler to be called upon return of an error message from Socket.io
    this.socket.on('error-message', (data) => {
      this.error = data;
    });

    // create a handler for when the room is updated or changed
    this.socket.on('room-update', (data) => {
      // get the new room information
      // first check if we have a null room update
      // this means that user left the room or host user ended the room
      if(data.room == null) {
        // unsubscribe the user from the room and reset the screen
        this.socket.emit('unsubscribe', { roomName: this.room.name });
        this.authentication.removeRoom();
        this.room = new RoomVM.Room;
        this.joined = false;
        this.isHost = false;
        this.error = null;
      }else{
        // update the room with the new information
        this.room = data.room;
        this.joined = true;
        this.authentication.saveRoom(data.room);
      }// end if the room is null
      
      // console.log("Room update:", data);
    });

    // create a handler for when the host's playback changes
    this.socket.on('playback-update', (data) => {
      if(!this.joined || data.context == null || this.room == null || data.context.uri !== this.room.contextUri) return;
      // the user has joined, and there is current
      // playback data available related to the assigned room
      this.contextUri = data.context.uri;
      this.isPlaying = data.is_playing;
    
      if(data.item == null) {
        this.currentlyPlaying = { id: -1 };
      }else{
        this.currentlyPlaying = data.item;
      }// end if we have a currently playing item

      // console.log("Playback Update:", data);
    });

    // set up an interval function to run and request playlist data from Spotify
    // this is the only way to ensure that we have the same playback data as Spotify
    Observable.interval(playbackRefreshInterval).subscribe(x => {
      if(!this.joined || !this.authentication.isHost() || this.queue === undefined || !this.authentication.loggedIn()) return;
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
  }// end ngOnInit function

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
    if(!data) return;
    
    if(this.contextUri !== this.room.contextUri) {
      // user isn't playing the playlist assigned for the room
      this.socket.emit('playback-broadcast', { roomName: this.room.name, playback: data });
      return;
    }// end if the user isn't playing the playlist assigned to the room

    // the user has joined, and there is current
    // playback data available related to the room's playlist
    if(this.currentlyPlaying != null && this.currentlyPlaying.id !== data.item.id) {
      // the currently playing song has changed
      // remove the track from the queue
      this.removeTrack(this.currentlyPlaying, 0, () => {
        var queue = this.queue;
        if(queue.length != 0) {
          // the length of the queue is nonzero after removing a track
          var next_track = this.queue[0].track;
          var position = this.findTrackPosition(data.item.id);
          
          if(next_track.id !== data.item.id) {
            // the next track to be played differs from the currently playing track
            // we need to reorder the playlist and put the currently playing track at the top of the queue
            var reorder = {
              range_start: position-1,
              insert_before: 0
            };
            this.dashboardService.reorderPlaylist(this.user.id, this.room.playlistId, reorder).then((data: any) => {
              // successfully reordered the playlist, now update it on the client side and emit a message
              // to all the users in the room
              this.socket.emit('playlist-broadcast', { roomName: this.room.name });
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

    var play_callback = () => {
      this.dashboardService.play(data).then((data: any) => {}, (err) => {
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

  pause(callback) {
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
    this.dashboardService.nextTrack().then((data: any) => { }, (err) => {
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

  addTrack(item) {
    // adding a track is avaiable to everyone, this means we need to emit a 
    // socket message and the socket will perform the actual API request
    // to Spotify, this is because we won't have the host's API access token
    // when making a request from a normal user
    this.socket.emit('add-track', { track: item.track, room: this.room });
  }// end function addTrack

  findTrackPosition(id) {
    return this.queue.findIndex(function(item){
      return item.track.id === id
    });
  }// end function findTrackById

  deparam(querystring) {
    // remove any preceding url and split
    querystring = querystring.substring(querystring.indexOf('?')+1).split('&');
    var params = {}, pair, d = decodeURIComponent, i;
    // march and parse
    for (i = querystring.length; i > 0;) {
      pair = querystring[--i].split('=');
      params[d(pair[0])] = d(pair[1]);
    }
  
    return params;
  }// end function deparam

}// end class DashboardComponent
