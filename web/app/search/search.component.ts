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

  constructor(private searchService: SearchService,
              private authentication: AuthService) { }

  ngOnInit() {
    
  }// end ngOnInit

  searchFocus(){
    this.hideTabs = true;
    console.log('teest');
  }

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
