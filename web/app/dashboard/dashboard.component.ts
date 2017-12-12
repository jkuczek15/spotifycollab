import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { DashboardService } from './dashboard.service'
import { HttpClient } from '../../includes/http-client.service';
import { DerpPipe } from '../../includes/derp.pipe';
import { RouteHelper } from '../../includes/utils/route-helper.module';
import * as PlaylistVM from '../../includes/viewModels/Playlist.js';
import * as io from "socket.io-client";
import { last } from '@angular/router/src/utils/collection';
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
  private playlists;
  private roomName: string;
  private messageText: string;
  private joined: boolean;
  private error: string;
  private socket = io('http://localhost:4000');

  ngOnInit() {
    this.socket.on('message', function (data) {
      console.log(data);
    });
    this.getPlaylists();
  }// end ngOnInit function

  getPlaylists() {
      var user = this.authentication.getUser();
      var self = this;
      this.playlists = new PlaylistVM.Playlist();

      // Grab our playlist data using the service
      this.dashboardService.getPlaylists().then((data: any) => {
        this.playlists = data.items;
        console.log(this.playlists);
      }, (err) => {
        if(err.status !== 401){
          console.log(err);
        }// end if not unauthorized error
      });
  }// end function getPlaylists()

  joinRoom(){
    this.dashboardService.getRooms().then((rooms: any[]) => {
      // first check if this room exists
      if(rooms.includes(this.roomName)){
        // the room exists, subscribe the user to this room
        console.log('Successfully joined room: ' + this.roomName);
        this.socket.emit('subscribe', this.roomName);
        this.joined = true;
      }else{
        // room doesn't exist, throw an error to user
        this.error = "Room does not exist";
      }// end if room exists
    }, (err) => {
      console.log(err);
    });

    return true;
  }// end function joinRoom

  hostRoom(){
    this.dashboardService.getRooms().then((rooms: any[]) => {
      // first check if this room exists
      if(rooms.includes(this.roomName)){
        // the room exists, throw an error and don't let them create this room
        this.error = 'Could not create room, room already exists'; 
      }else{
        // room doesn't exist, create it now and subscribe 
        // the current user to the room
        console.log("Successfully created room: " + this.roomName);
        this.socket.emit('create-room', { user: this.authentication.getUser(), room: this.roomName });
        this.socket.emit('subscribe', this.roomName);
        this.joined = true;
      }// end if room exists
    }, (err) => {
      console.log(err);
    });
  }// end function hostRoom

  sendMessage(){ 
   this.socket.emit('send', { room: this.roomName, message: this.messageText });
  }// end function sendMessage
  
}// end class DashboardComponent
