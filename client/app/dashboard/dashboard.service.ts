import { Injectable } from '@angular/core';
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

}// end class DashboardService
