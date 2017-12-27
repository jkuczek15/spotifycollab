import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouteHelper } from '../includes/utils/route-helper.module';
import { AuthService } from './auth/auth.service';
import { FormService } from './form.service';
import { Environment }from '../../environments/environment';
import * as ons from 'onsenui';
var querystring = require('querystring');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  // page components for the tab bar once a user
  // successfully joins a room
  
  private loggedIn: boolean;
  private joined: boolean;
  private spotifyLoginUrl: string;
  private roomName: string = "";
  private user: any;
  private environment: any = new Environment();
  private socket: any = this.authentication.socket;

  constructor(private authentication: AuthService,
              private formService: FormService,
              private router: Router) { }// end appComponent constructor

  ngOnInit() {
    var redirect_uri = 'http://'+ this.environment.host + ':' + this.environment.api_port + '/user';
    this.spotifyLoginUrl = 'https://accounts.spotify.com/authorize?' +
        querystring.stringify({
        response_type: 'code',
        client_id: this.environment.client_id,
        scope: this.environment.scopes,
        redirect_uri: redirect_uri
    });

    // check if we have a new user in the url parameters
    var user = this.getHashParams();
   
    if(Object.keys(user).length !== 0 || user.constructor !== Object) {
      this.authentication.saveUser(user);
      this.authentication.init_refresh_token(user);
    }// end if we have valid hash params

    // check if the user is logged in and if the user has joined a room
    this.user = this.authentication.getUser();
    this.loggedIn = this.authentication.loggedIn();
    this.joined = this.authentication.joined();

    // create a handler for error messages sent to us from the server
    this.socket.on('error-message', (data) => {
      ons.notification.alert(data);
    });
    // create a handler for when the room is updated or changed
    this.socket.on('room-update', (data) => {
      // get the new room information
      // first check if we have a null room update
      // this means that user left the room or host user ended the room
      if(data.room == null) {
        // unsubscribe the user from the room and reset the screen
        this.authentication.removeRoom();
        this.joined = false;
      }else{
        // get the new room information
        // first check if we have a null room update
        // this means that user left the room or host user ended the room
        this.authentication.saveRoom(data.room);
        this.joined = true;
      }// end if we have a null room update
    });
  }// end ngOninit function

  join() {
    if(this.roomName.search(/^$|\s+/) == 0){
      // the room name is empty
      ons.notification.alert("Please enter a room name.");
    }else{
      // the room name is not empty
      this.socket.emit('join-room', { user: this.authentication.getUser(), roomName: this.roomName });
    }// end if the room name is empty
  }// end function join

  host() {
    if(this.roomName.search(/^$|\s+/) == 0){
      // the room name is empty
      ons.notification.alert("Please enter a room name.");
    }else{
      // the room name is not empty, create the playlist
      // and initialize the room with an empty queue
      var data = {
        description: "Boom room playlist",
        public: false,
        name: "Boom Room - " + this.roomName
      };
      this.formService.createPlaylist(this.user.id, data).then((data: any) => {
        // successfully created a new Spotify playlist
        // show the user the dashboard with their new playlist
        this.authentication.setHost(true);
        this.socket.emit('create-room', { user: this.user, roomName: this.roomName, playlistUri: data.href, playlistId: data.id, contextUri: data.uri });
      }, (err) => {
        if(err.status !== 401){
          console.log(err);
        }// end if not unauthorized error
      });
    }// end if the room name is empty
  }// end function host

  /**
    * Obtains parameters from the hash of the URL
    * @return Object
  */
  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
        hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }// end function getHashParams

}// end class AppComponent