import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { AuthService } from '../app/auth/auth.service';

@Injectable()
export class HttpClient {

  constructor(private http: Http,
              private authentication: AuthService) {}

  createAuthorizationHeader(headers: Headers) {
    headers.append('Authorization', 'Bearer ' + this.authentication.getToken()); 
  }// end function createAuthorizationHeader

  get(url) {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.get(url, {
      headers: headers
    });
  }// end function get

  post(url, data) {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.post(url, data, {
      headers: headers
    });
  }// end function post

}// end class HttpClient