import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SearchService } from './search.service';
import { AuthService } from '../auth/auth.service';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
// required to use jQuery
declare var $: any;

@Component({
  selector: 'ons-page[search]',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  private searchString: string = "";
  private searchItems: any;
  private hideTabs: boolean = false;
  private socket = this.authentication.socket;

  constructor(private searchService: SearchService,
              private authentication: AuthService) { }

  ngOnInit() { }// end ngOnInit

  searchFocus(){
    this.hideTabs = true;
  }

  addTrack(track){
    // adding a track is avaiable to everyone, this means we need to emit a 
    // socket message and the socket will perform the actual API request
    // to Spotify, this is because we won't have the host's API access token
    // when making a request from a normal user
    this.socket.emit('add-track', { track: track, room: this.authentication.getRoom() });
  }// end function add track

  searchMusic() {
    if(this.searchString){
      // If we have a valid search string, perform the search
      this.searchService.searchMusic(this.searchString).then((data: any) => {
        this.searchItems = data;
      }, (err) => {
        if(err.status !== 401){
          console.log(err);
        }// end if not unauthorized error
      });
    }else{
      this.searchItems = [];
    }// end if we have a search string
   
  }// end function searchMusic

}// end class SearchComponent
