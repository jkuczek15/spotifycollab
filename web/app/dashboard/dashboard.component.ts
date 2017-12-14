import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { DashboardService } from './dashboard.service'
import { HttpClient } from '../../includes/http-client.service';
import { DerpPipe } from '../../includes/derp.pipe';
import { RouteHelper } from '../../includes/utils/route-helper.module';
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
  private socket = io('http://'+ environment.host + ':' + environment.socket_port);
  
  ngOnInit() {
    this.socket.heartbeatTimeout = 20000; // reconnect if not received heartbeat for 20 seconds
    var self = this;
    self.room = new RoomVM.Room;
    self.library = [];

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
      self.socket.emit('subscribe', { room: self.room.name });
    }// end if the session room is not null

    // create a handler for when the room is updated or changed
    this.socket.on('room-update', function (data) {
      // get the new room information
      // first check if we have a null room update
      if(data.room == null){
        self.room = new RoomVM.Room;
        self.joined = false;
        self.isHost = false;
        self.error = null;
      }else{
        self.room = data.room;
        self.joined = true;
        if(data.created) {
          // this room was just created, initialize the room
          // first create a playlist we will use
          self.initRoom(self.room.name);
        }// end if the room was recently created
      }// end if the room is null
     
      // save the room data to the session in case they refresh the page
      self.authentication.saveRoom(data.room);

      console.log("Room update:", data);
    });

    this.socket.on('end-room', function (data) {
      // get the new room information
      self.socket.emit()
      self.joined = false;
      self.room = data.room;
      self.joined = true;

      // save the room data to the session in case they refresh the page
      self.authentication.saveRoom(self.room);

      if(data.created) {
        // this room was just created, initialize the room
        // first create a playlist we will use
        self.initRoom(self.room.name);
      }// end if the room was recently created
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
    this.socket.emit('join-room', { user: this.authentication.getUser(), room: this.roomName });
  }// end function joinRoom

  hostRoom(){
    this.socket.emit('create-room', { user: this.authentication.getUser(), room: this.roomName });
  }// end function hostRoom

  leaveRoom(){
    if(this.isHost){
      var message = 'end-room';  
    }else{
      var message = 'leave-room';
    }// end if the user is a host

    this.socket.emit(message, { user: this.authentication.getUser(), room: this.room.name });
  }// end function leaveRoom

  initRoom(roomName){
    // function should be called as soon as host gets the OK to create a room
    var playlist = {
      description: "Boom room playlist",
      public: false,
      name: "Boom Room - " + roomName
    };
    this.dashboardService.createPlaylist(this.authentication.getUserID(), playlist).then((data: any) => {
      // load the queue into the client side and emit a socket message telling everyone
      // that the queue has been created
      this.queue = data;
      this.socket.emit('create-queue', { room: this.room.name, queue: data });
      this.isHost = true;
    }, (err) => {
      if(err.status !== 401){
        console.log(err);
      }// end if not unauthorized error
    });
  }// end function initRoom

  play(){
    // start playing the user's playlist queue from the first song
    var data = {
      context_uri: this.room.queue.uri,
      offset: {"position" : 0}
    };

    this.dashboardService.play(data).then((data: any) => {
      // load the queue into the client side and emit a socket message telling everyone
      // that the queue has been created
      console.log(data);
    }, (err) => {
      if(err.status !== 401){
        console.log(err);
      }// end if not unauthorized error
    });
  }// end function play

  addTrack(item){
    this.socket.emit('add-track', { room: this.room.name, track: item.track });
  }// end function addTrack

}// end class DashboardComponent
