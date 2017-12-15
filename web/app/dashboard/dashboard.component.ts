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

  // the user data from spotify (includes access token)
  public room: any;
  private isHost: boolean;
  private library: any;
  private queue: any;
  private joined: boolean;
  private roomName: string;
  private error: string;
  private isPlaying: boolean;
  private currentlyPlaying: any;
  private contextUri: string;
  private socket = io('http://'+ environment.host + ':' + environment.socket_port);
  
  ngOnInit() {
    // variable initialization
    var playbackRefreshInterval = 1000;
    var self = this;
    self.room = new RoomVM.Room;
    self.library = [];
    self.currentlyPlaying = {};
    this.isPlaying = false;

    // create a handler for error messages, updating them as the server passes them back
    // handler to be called upon return of an error message from Socket.io
    this.socket.on('error-message', function (data) {
      self.error = data;
    });

    // check if we have room information stored in the session,
    // if we do, we should use this before displaying the 'join' form
    var room = self.authentication.getRoom();
    
    if(room != null){
      self.room = room;
      self.joined = true;
      self.isHost = this.authentication.isHost(self.room);
      self.queue = room.queue;

      // subscribe the user to the room since refreshing the page
      // causes the user to get a new socket connection
      self.socket.emit('subscribe', { roomName: self.room.name });
    }// end if the session room is not null

    // create a handler for when the room is updated or changed
    this.socket.on('room-update', function (data) {
      // get the new room information
      // first check if we have a null room update
      // this means that user left the room or host user ended the room
      if(data.room == null){
        self.socket.emit('unsubscribe', { roomName: self.room.name });
        self.room = new RoomVM.Room;
        self.joined = false;
        self.isHost = false;
        self.error = null;
      }else{
        self.room = data.room;
        self.joined = true;
        if(data.created){
          self.isHost = true;
        }// end if the room was just created
      }// end if the room is null
     
      // save the room data to the session in case they refresh the page
      self.authentication.saveRoom(data.room);

      console.log("Room update:", data);
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

    this.getLibrary();
  }// end ngOnInit function

  getLibrary() {
    var user = this.authentication.getUser();
    var self = this;

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
    this.socket.emit('join-room', { user: this.authentication.getUser(), roomName: this.roomName });
  }// end function joinRoom

  hostRoom(){
    this.socket.emit('create-room', { user: this.authentication.getUser(), roomName: this.roomName });
  }// end function hostRoom

  leaveRoom(){
    if(this.isHost){
      var message = 'end-room';  
    }else{
      var message = 'leave-room';
    }// end if the user is a host

    this.socket.emit(message, { user: this.authentication.getUser(), room: this.room });
  }// end function leaveRoom

  updatePlayback(data) {
    if(data){
      this.isPlaying = data.is_playing;
      this.currentlyPlaying = data.item;
      
      if(data.context){
        this.contextUri = data.context.uri;
      }// end if playback data has a context
      
      console.log("Playback Update:", data);
    }// end if we have valid playback data
   
  }// end function updatePlayback

  play(event){
    // start playing the user's playlist queue from the first song
    var self = this;
    
    var data;
    if(this.contextUri !== this.room.queue.uri){
      // this means the user hasn't started playing the playlist yet,
      // or they selected a different playlist/album from the spotify app
      // in either case, we want to tell spotify to play the playlist from the beginning
      data = {
        context_uri: this.room.queue.uri,
        offset: {"position" : 0}
      };
    }else{
      data = null;
    }// end if the currently playing context doesn't match the room context

    this.dashboardService.play(data).then((data: any) => {}, (err) => {
      if(err.status !== 401){
        console.log(err);
      }// end if not unauthorized error
    });
  }// end function play

  pause(event){
    this.dashboardService.pause().then((data: any) => {}, (err) => {
      if(err.status !== 401){
        console.log(err);
      }// end if not unauthorized error
    });
  }// end function pause
  
  nextTrack(event){
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

  addTrack(item){
    this.socket.emit('add-track', { room: this.room, track: item.track });
  }// end function addTrack

}// end class DashboardComponent
