import { Injectable } from '@angular/core';
import { Response } from '@angular/http'
import { HttpClient } from '../../includes/http-client.service';

@Injectable()
export class DashboardService {

  constructor(private http: HttpClient) { }

  getLibrary() {
    return new Promise((resolve, reject) => {
      this.http.get('https://api.spotify.com/v1/me/tracks?limit=50')
        .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }// end function getChatByRoom

  play(data){
    return new Promise((resolve, reject) => {
      this.http.put('https://api.spotify.com/v1/me/player/play', data)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }// end function play

  pause(){
    return new Promise((resolve, reject) => {
      this.http.put('https://api.spotify.com/v1/me/player/pause', null)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }// end function pause

  nextTrack(){
    return new Promise((resolve, reject) => {
      this.http.post('https://api.spotify.com/v1/me/player/next', null)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }// end function nextTrack

  currentlyPlaying(){
    return new Promise((resolve, reject) => {
      this.http.get('https://api.spotify.com/v1/me/player/currently-playing', null)
        .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }// end function currentlyPlaying

}// end class DashboardService
