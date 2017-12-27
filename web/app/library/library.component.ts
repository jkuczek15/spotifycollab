import { Component, OnInit } from '@angular/core';
import { LibraryService } from './library.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'ons-page[library]',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent implements OnInit {

  private socket = this.authentication.socket;
  private library: any;

  constructor(private libraryService: LibraryService,
              private authentication: AuthService) { }

  ngOnInit() {
    this.getLibrary();
  }// end ngOnInit

  getLibrary() {
    // Grab our playlist data using the service
    this.libraryService.getLibrary().then((data: any) => {
      this.library = data.items;
      console.log(this.library);
    }, (err) => {
      if(err.status !== 401){
        console.log(err);
      }// end if not unauthorized error
    });
  }// end function getLibrary

  addTrack(track){
    // adding a track is avaiable to everyone, this means we need to emit a 
    // socket message and the socket will perform the actual API request
    // to Spotify, this is because we won't have the host's API access token
    // when making a request from a normal user
    this.socket.emit('add-track', { track: track, room: this.authentication.getRoom() });
  }// end function add track

}// end class LibraryComponent
