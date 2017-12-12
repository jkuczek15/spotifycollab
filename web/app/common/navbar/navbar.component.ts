import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { RouteHelper } from '../../../includes/utils/route-helper.module';
import { WindowService } from '../../../includes/window.service'
import 'rxjs/add/operator/filter';
var querystring = require('querystring');
declare var $: any;

// required variables for Spotify authentication
var client_id = 'b6f40e9463ba406792aa0914d5c64bcb';  // Your client id
var scope = 'user-read-private user-read-email';
var redirect_uri = 'http://127.0.0.1:10010/user';    // Your redirect uri

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, AfterViewInit {

  // Initialize view model variables
  public loggedIn;
  private activeNavID;
  private spotify_login_url;

  constructor(private authentication: AuthService,
              private routeControl: RouteHelper,
              private window: WindowService) { }

  ngOnInit() {
    // Initially, the active tab will be the home link
    let self = this;
    this.activeNavID = 'home-link';

    // Create the spotify authorization link
    this.spotify_login_url = 'https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri
    });
  
    // Function to be called each time the route changes
    this.routeControl.onRouteChange(function(data) {
      self.loggedIn = self.authentication.loggedIn();
    });
  }// end ngOnInit function

  ngAfterViewInit(){
    let currentPath = this.window.nativeWindow.location.pathname
    if(currentPath == '/'){
      // on the home page, add the active class on load
      this.addActive(this.activeNavID);
    }// end if current page is the index
  }// end ngAfterViewInit function

  postScroll(id, reachedTarget) {
    // called each time user clicks link and scrolls to section
    if(reachedTarget) {
       this.removeActive(this.activeNavID);
       this.addActive(id);
    }// end if they reached the scroll position
  }// end function postScroll

  addActive(id) {
    $('#' + id).addClass("active");
    this.activeNavID = id;
  }// end function addActive

  removeActive(id) {
    $('#' + id).removeClass("active");
    this.activeNavID = null;
  }// end function removeActive

  logout() {
    this.loggedIn = false;
    this.authentication.logout();
    return false;
  }// end logout function

}// end class NavBarComponent
