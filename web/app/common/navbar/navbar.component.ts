import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { RouteHelper } from '../../../includes/utils/route-helper.module';
import { WindowService } from '../../../includes/window.service';
import * as environment from '../../../../environments/environment';
import 'rxjs/add/operator/filter';
var querystring = require('querystring');
declare var $: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, AfterViewInit {

  // Initialize view model variables
  public loggedIn;
  private activeNavID;
  private spotifyLoginUrl;
  private currentPath;

  constructor(private authentication: AuthService,
              private routeControl: RouteHelper,
              private window: WindowService) { }

  ngOnInit() {
    // Initially, the active tab will be the home link
    let self = this;
    this.activeNavID = 'home-link';
    this.currentPath = this.window.nativeWindow.location.pathname; 
    var redirect_uri = 'http://'+ environment.host + ':' + environment.api_port + '/user';
  
    // Create the spotify authorization link
    this.spotifyLoginUrl = 'https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: environment.client_id,
      scope: environment.scopes,
      redirect_uri: redirect_uri
    });
    
    // Function to be called each time the route changes
    this.routeControl.onRouteChange(function(data) {
      self.loggedIn = self.authentication.loggedIn();
      self.currentPath = self.window.nativeWindow.location.pathname;
      if(self.currentPath !== '/'){
        self.removeActive(self.activeNavID);
      }// end if on the index page
    });
  }// end ngOnInit function

  ngAfterViewInit(){
    if(this.currentPath == '/'){
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
