import { Component, OnInit } from '@angular/core';
import { LibraryService } from './library.service';

@Component({
  selector: 'ons-page[library]',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent implements OnInit {

  private library: any;

  constructor(private libraryService: LibraryService) { }

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

}// end class LibraryComponent
