import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { RouteHelper } from '../../../includes/utils/route-helper.module';
import { WindowService } from '../../../includes/window.service';
import { DashboardService } from '../../dashboard/dashboard.service';
import { Observable } from 'rxjs/Observable';
import * as environment from '../../../../environments/environment';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap/typeahead/typeahead';
import { NgbTypeaheadConfig } from '@ng-bootstrap/ng-bootstrap/typeahead/typeahead-config';
var querystring = require('querystring');
import * as io from "socket.io-client";
declare var $: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  providers: [NgbTypeahead, NgbTypeaheadConfig]
})
export class NavbarComponent implements OnInit, AfterViewInit {

  // Initialize view model variables
  public loggedIn;
  private activeNavID;
  private spotifyLoginUrl;
  private currentPath;
  private arry: any;
  private searchMusic: any;
  private searchFormatter: any;
  private searchTrack: any;

  // make a socket.io connection to the server
  private socket = io('http://'+ environment.host + ':' + environment.socket_port);

  constructor(private authentication: AuthService,
              private routeControl: RouteHelper,
              private window: WindowService,
              private dashboardService: DashboardService) { }

  ngOnInit() {
    let self = this;

    // Initialize the autocomplete search box with the search music service
    this.searchMusic = (text$: Observable<string>) => text$
      .debounceTime(200)
      .distinctUntilChanged()
      .switchMap(term => this.dashboardService.searchMusic(term)     
    );

    // Initialize an input formatter for the autocomplete box
    this.searchFormatter = (x: {name: string, artists: any }) => x.name + ' - ' + x.artists[0].name;

    // Initially, the active tab will be the home link
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

  addTrack(event){
    var track = event.item;
    this.socket.emit('add-track', { track: track, room: this.authentication.getRoom() });
  }// end function addTrack

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
