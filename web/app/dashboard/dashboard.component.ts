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
  private library: any;
  private queue: any;
  private joined: boolean;
  private roomName: string;
  private error: string;
  private socket = io('http://'+ environment.host + ':' + environment.socket_port);

  ngOnInit() {
    console.log(environment);
    var self = this;
    self.room = new RoomVM.Room;
    self.library = [];

    // create a handler for error messages, updating them as the server passes them back
    // handler to be called upon return of an error message from Socket.io
    this.socket.on('error-message', function (data) {
      self.error = data;
    });

    // create a handler for when the room is updated or changed
    this.socket.on('room-update', function (data) {
      console.log("Room update:", data);
      self.room = data.room;
      self.joined = true;

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
        console.log(this.library);
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
    }, (err) => {
      if(err.status !== 401){
        console.log(err);
      }// end if not unauthorized error
    });
  }// end function initRoom

  addTrack(item){
    //console.log(item);
    var track_id = item.track.id;
    
    this.socket.emit('add-track', { room: this.room.name, track_id: track_id });
  }// end function addTrack

}// end class DashboardComponent
