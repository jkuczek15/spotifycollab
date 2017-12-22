import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { HttpClient } from '../../includes/http-client.service';
import { WindowService } from '../../includes/window.service';
import { Router } from '@angular/router';
import { RouteHelper } from '../../includes/utils/route-helper.module';
import { Environment } from '../../../environments/environment';
import * as io from "socket.io-client";
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {
  // Use the client window sessionStorage for local storage
  public window;
  public storedURL;
  public debugLogout: boolean = false;
  private environment = new Environment();

  // make a socket.io connection to the server
  // make sure we are using web sockets instead of long polling
  public socket = io('http://'+ this.environment.host + ':' + this.environment.socket_port, 
                      { transports: ['websocket'], upgrade: false });

  constructor(private http: Http,
              private winRef: WindowService,
              private router: Router,
              private routeControl: RouteHelper) { this.window = winRef.nativeWindow; }

  saveUser(user) {
    // function called to save the user 
    this.window.sessionStorage['user'] = JSON.stringify(user || null);
  }// end function saveUser

  getUser() {
    return JSON.parse(this.window.sessionStorage['user'] || null);
  }// end function getUser

  saveRoom(room){
    var user = this.getUser();
    user['room'] = room;
    this.saveUser(user); 
  }// end function setRoom

  getRoom(){
    var user = this.getUser();
    return user == null ? null : user['room'];
  }// end function getRoom

  removeRoom(){
    var user = this.getUser();
    if(user){
      delete user['room'];
      this.saveUser(user);
    }// end if user exists
  }// end function removeRoom

  getUserID(){
    // returns the spotify id of the user
    var user = this.getUser();
    return user == null ? null : user['id'];
  }// end function getUserID

  saveToken(token){
    var user = this.getUser();
    if(user) {
      user['access_token'] = token;
      user['login_time'] = new Date().getTime() / 1000;
      this.saveUser(user);
    }// end if user exists
  }// end function saveToken

  getToken(){
    var user = this.getUser();
    return user == null ? null : user['access_token'];
  }// end function getToken

  loggedIn() {
    // determine if the current user is logged in
    return this.getUser() != null;
  }// end function loggedIn

  joined(){
    var room = this.getRoom();
    return room == null ? false : true;
  }// end function joined

  setHost(host){
    var user = this.getUser();
    user['host'] = host;
    this.saveUser(user);
    return host;
  }// end function setHost

  isHost(){
    var user = this.getUser();
    return user['host'] == true;
  }// end function isHost

  getHost(room){
    var host = room.users.find(function(user){
      return user.host === true;
    });
    return host || null;
  }// end function isHost

  logout(){
    // check if the user is in a room, if so we need to 
    // clean some things up
    if(this.joined()){
      if(this.isHost()){
        this.socket.emit('end-room', { user: this.getUser(), room: this.getRoom() });
      }else{
        this.socket.emit('leave-room', { user: this.getUser(), room: this.getRoom() });
      }// end if user is the host of a room
    }// end if user has joined a room

    // log the user out by removing them from session
    this.window.sessionStorage.removeItem('user');
    this.routeControl.routeChange();
    this.router.navigateByUrl('/');
  }// end function logout

  init_refresh_token(user){
    this.socket.emit('init_refresh_token', { refresh_token: user.refresh_token, expires_in: user.expires_in });
    this.socket.on('access_token_update', (data) => {
      this.saveToken(data.access_token);
    });
  }// end function init_refresh_token

  requireLogin() {
    // Include this at the top of 'ngOnInit' to require login
    if(!this.loggedIn()) {
      // user is not logged in, send them to the login page with an error
      this.storedURL = this.router.url;
      this.routeControl.routeChange();
      this.router.navigateByUrl('/');
      return false;
    }// end if the user is not logged in
    return true;
  }// end function to simpfy required login logic

  redirectIfLoggedIn(url) {
    // Redirect a user to 'url' if they are logged in
    if(this.loggedIn()) {
      this.router.navigateByUrl(url);
      // scroll to the top of the page
      this.window.scrollTo(0,0);
    }// end if the user is logged in
  }// end function to redirect the user if they are logged in
  
}// end class AuthService