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

  createPlaylist(user_id, data){
    return new Promise((resolve, reject) => {
      this.http.post('https://api.spotify.com/v1/users/'+user_id+'/playlists', data)
        .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }// end function createPlaylist

}// end class DashboardService
