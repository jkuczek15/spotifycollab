import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { WindowService } from '../../includes/window.service';
import { Router } from '@angular/router';
import { RouteHelper } from '../../includes/utils/route-helper.module'
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {
  // Use the client window sessionStorage for local storage
  public window;
  public storedURL;
  public debugLogout: boolean = false;
  constructor(private http: Http,
              private winRef: WindowService,
              private router: Router,
              private routeControl: RouteHelper) { this.window = winRef.nativeWindow; }

  saveUser(user) {
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
    return user['room'] || null;
  }// end function getRoom

  getUserID(){
    // returns the spotify id of the user
    var user = this.getUser();
    return user['id'] || null
  }// end function getUserID

  getToken(){
    var user = this.getUser();
    return user['access_token'] || null;
  }// end function getToken

  loggedIn() {
    // determine if the current user is logged in
    return this.getUser() != null;
  }// end function loggedIn

  isHost(room){
    var host = this.getHost(room);
    return this.loggedIn() && host.id == this.getUser().id;
  }// end function isHost

  getHost(room){
    var host = room.users.find(function(user){
      return user.host === true;
    });
    return host || null;
  }// end function isHost

  logout(){
    // log the user out by removing them from session
    this.window.sessionStorage.removeItem('user');
    this.routeControl.routeChange();
    this.router.navigateByUrl('/');
  }// end function logout

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