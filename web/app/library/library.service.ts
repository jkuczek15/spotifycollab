import { Injectable } from '@angular/core';
import { HttpClient } from '../../includes/http-client.service';

@Injectable()
export class LibraryService {

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

}// end class LibraryService
