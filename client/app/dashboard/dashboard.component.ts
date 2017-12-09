import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { DashboardService } from './dashboard.service'
import { HttpClient } from '../../includes/http-client.service';
import { DerpPipe } from '../../includes/derp.pipe';
import * as PlaylistVM from '../../includes/viewModels/Playlist.js';
declare var $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private authentication: AuthService,
              private dashboardService: DashboardService) { }

  // the user data from spotify (includes access token)
  private playlists;

  ngOnInit() {
    var user = this.getHashParams();

    // TODO, this needs to be validated much better
    if(Object.keys(user).length !== 0 || user.constructor !== Object){
      this.authentication.saveUser(user);
    }// end if we have valid hash params

    this.getPlaylists();
  }// end ngOnInit function

  getPlaylists() {
      var user = this.authentication.getUser();
      var self = this;
      this.playlists = new PlaylistVM.Playlist();

      // Grab our playlist data using the service
      this.dashboardService.getPlaylists().then((data: any) => {
        console.log(data.items);
        this.playlists = data.items;
      }, (err) => {
        if(err.status !== 401){
          console.log(err);
        }// end if not unauthorized error
      });
  }// end function getPlaylists()

  joinRoom(){
    console.log('Join Room');
    return true;
  }// end template roomform

  hostRoom(){
    console.log('Host Room');
    return true;
  }// end template roomform

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

}// end class DashboardComponent
