import { Injectable } from '@angular/core';
import { HttpClient } from '../../includes/http-client.service';

@Injectable()
export class QueueService {

  constructor(private http: HttpClient) { }

  getPlaylist(playlistUri) {
    return new Promise((resolve, reject) => {
      this.http.get(playlistUri)
        .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }// end function getPlaylist

}// end class QueueService
