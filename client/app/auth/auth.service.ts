import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { WindowService } from '../../includes/window.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {
  // Use the client window sessionStorage for local storage
  public window;
  public storedURL;
  public debugLogout: boolean = false;
  constructor(private http: Http,
              private winRef: WindowService,
              private router: Router) { this.window = winRef.nativeWindow; }

  saveUser(user) {
    this.window.sessionStorage['user'] = JSON.stringify(user || null);
  }// end function saveUser

  getUser() {
    return JSON.parse(this.window.sessionStorage['user'] || null);
  }// end function getUser

  getToken(){
    var user = this.getUser();
    return user['access_token'] || null;
  }// end function getToken

  loggedIn() {
    // determine if the current user is logged in
    return this.getUser() != null;
  }// end function loggedIn

  logout(){
    // log the user out by removing them from session
    if(!environment.production){
      this.debugLogout = true;
    }// end if we are not in production environment

    window.sessionStorage.removeItem('user');
    this.router.navigateByUrl('/login');
  }// end function logout

  requireLogin() {
    // Include this at the top of 'ngOnInit' to require login
    if(!this.loggedIn()) {
      // user is not logged in, send them to the login page with an error
      this.storedURL = this.router.url;
      this.router.navigateByUrl('/login/auth_required');
    }// end if the user is not logged in

  }// end function to simpfy required login logic

  redirectIfLoggedIn(url) {
    // Redirect a user to 'url' if they are logged in
    if(this.loggedIn()) {
      this.router.navigateByUrl(url);
      // scroll to the top of the page
      this.window.scrollTo(0,0);
    }// end if the user is logged in

  }// end function to redirect the user if they are logged in
  
}// end class AuthService