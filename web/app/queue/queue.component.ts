import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { QueueService } from './queue.service';
import { OnDestroy, AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'ons-page[queue]',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.css']
})
export class QueueComponent implements OnInit, OnDestroy {

  private socket = this.authentication.socket;
  private room: any;
  private queue: any;

  constructor(private authentication: AuthService,
              private queueService: QueueService) { }

  ngOnInit() {
    this.room = this.authentication.getRoom();
    // create a handler for when the playlist is updated or changed
    this.socket.on('playlist-update', (data) => {
      this.getPlaylist();
    });
    this.getPlaylist();
  }// end ngOnInit function

  getPlaylist(){
    this.queueService.getPlaylist(this.room.playlistUri+'/tracks').then((data: any) => {
      // successful response, set the queue data
      this.queue = data.items;
    }, (err) => {
      if(err.status !== 401){
        console.log(err);
      }// end if not unauthorized error
    });
  }// end function getPlaylist

  ngOnDestroy(){
    this.socket.removeListener('playlist-update');
  }// end ngOnDestroy function

}// end class QueueComponent
