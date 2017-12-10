import { Injectable } from '@angular/core';
import { Response } from '@angular/http'
import { HttpClient } from '../../includes/http-client.service';

@Injectable()
export class DashboardService {

  constructor(private http: HttpClient) { }

  getPlaylists() {
    return new Promise((resolve, reject) => {
      this.http.get('https://api.spotify.com/v1/me/playlists')
        .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }// end function getChatByRoom

  getRooms() {
    return new Promise((resolve, reject) => {
      this.http.get('http://127.0.0.1:4000/rooms')
        .map((res: Response) => res.json())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }// end function getChatByRoom

}// end class DashboardService
