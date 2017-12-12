import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ChatService {

  constructor(private http: Http) { }

  getChatByRoom(room) {
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

  saveChat(data) {
    return new Promise((resolve, reject) => {
        this.http.post('/api/chat', data)
          .map(res => res.json())
          .subscribe(res => {
            resolve(res);
          }, (err) => {
            reject(err);
          });
    });
  }// end function saveChat

}// end class ChatService