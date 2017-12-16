import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { AuthService } from '../app/auth/auth.service';
import { RequestOptions } from '@angular/http';

@Injectable()
export class HttpClient {

  constructor(private http: Http,
              private authentication: AuthService) {}

  createAuthorizationHeader(headers: Headers) {
    headers.append('Authorization', 'Bearer ' + this.authentication.getToken()); 
  }// end function createAuthorizationHeader

  createCORSHeader(headers: Headers){
    headers.append('Access-Control-Allow-Origin', "*");
    headers.append('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  }// end function createCORSHeader

  get(url, cors=false) {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    if(cors){
      this.createCORSHeader(headers);
    }// end if enabling CORS
    return this.http.get(url, {
      headers: headers
    });
  }// end function get

  post(url, data, cors=false) {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    if(cors){
      this.createCORSHeader(headers);
    }// end if enabling CORS
    return this.http.post(url, data, {
      headers: headers
    });
  }// end function post

  put(url, data, cors=false) {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    if(cors){
      this.createCORSHeader(headers);
    }// end if enabling CORS
    return this.http.put(url, data, {
      headers: headers
    });
  }// end function post

  delete(url, data, cors=false) {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    if(cors){
      this.createCORSHeader(headers);
    }// end if enabling CORS
    return this.http.delete(url, new RequestOptions({
      headers: headers,
      body: data
    }));
  }// end function delete

}// end class HttpClient