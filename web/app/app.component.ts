import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouteHelper } from '../includes/utils/route-helper.module';
import { AuthService } from './auth/auth.service';
import { PageScrollConfig } from 'ng2-page-scroll';
import { DoCheck, AfterContentInit } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  // Boolean variables to keep track if we are displaying certain elements
  public show_sidebar_left: boolean = true;
  public show_sidebar_right: boolean = true;
  public show_item_spacing: boolean = false;
  private hiddenUrls: any;

  constructor(private router: Router,
              private routeControl: RouteHelper,
              private authentication: AuthService) 
              {
                PageScrollConfig.defaultScrollOffset = 40;
                PageScrollConfig.defaultDuration = 350; // anchor link scroll speed
              }// end appComponent constructor

  ngOnInit() {
    let self = this;

    // check if we have a new user in the url parameters
    var user = this.getHashParams();
    
    // TODO, this needs to be validated much better
    if(Object.keys(user).length !== 0 || user.constructor !== Object){
      this.authentication.saveUser(user);
    }// end if we have valid hash params
    
    // List of URL's to determine if we are showing/hiding certain elements
    this.hiddenUrls = {
      no_item_spacing: ['/', '/login', '/register'],
      no_sidebar_right: ['/', '/login', '/register', '/dashboard'],
      no_sidebar_left: []
    };

    // Function to be called each time the route changes
    this.routeControl.onRouteChange(function() {
      // scroll to the top of the page
      window.scrollTo(0,0);
      // grab the current URL
      let url = self.router.url;

      if(self.authentication.loggedIn()) {
        // user is logged in, determine when to show sidebars
        self.displayHandler(url, 'show_sidebar_left');
      } else {
        // hide the left sidebar if the user is not logged in
        self.show_sidebar_left = false;
      }// end if the user is logged in, show the sidebar

      self.displayHandler(url, 'show_item_spacing');  
      self.displayHandler(url, 'show_sidebar_right');
    });
  }// end ngOninit function

  displayHandler(url, key) {
    // handler for hiding certain components
    let hiddenUrls = this.hiddenUrls[key.replace('show', 'no')];
    
    if(hiddenUrls.length === 0) {
      // if we have a length of 0, we want to show this everywhere
      this[key] = true;
      return;
    }// end if hiddenUrls.length == 0

    for(let str of hiddenUrls) {
      // for loop over all routes to hide
      if(url !== '/' && str !== '/') {
        this[key] = url.indexOf(str) == -1;
        if(!this[key]) {
          break;
        }// end if
      } else if(url !== '/' && str === '/' && hiddenUrls.length === 1) {
        // we have the home page in our array of length 1
        this[key] = true;
      }else {
        this[key] = false;  
      }// end if we are not on home page

    }// end for loop over no_sidebar_right

  }// end function displayHandler

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

}// end class AppComponent