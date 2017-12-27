import { Component, ViewChild } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { QueueComponent } from '../queue/queue.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { LibraryComponent } from '../library/library.component';
import { SearchComponent } from '../search/search.component';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
// required to use jQuery
declare var $: any;

@Component({
  selector: 'tabbar',
  templateUrl: './tabbar.component.html',
  styleUrls: ['./tabbar.component.css']
})
export class TabbarComponent {

  private hideTabs: boolean = false;
  private socket = this.authentication.socket;

  // initialize our tab components
  dashboard = DashboardComponent;
  queue = QueueComponent;
  library = LibraryComponent;
  search = SearchComponent;

  constructor(private authentication: AuthService) {}

  refreshQueue() {
    this.socket.emit('playlist-broadcast-self');
  }// end function refreshQueue

}// end class TabbarComponent