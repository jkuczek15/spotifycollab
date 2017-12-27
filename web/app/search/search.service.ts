import { Injectable } from '@angular/core';
import { HttpClient } from '../../includes/http-client.service';
import { of } from 'rxjs/observable/of';

@Injectable()
export class SearchService {

  constructor(private http: HttpClient) { }

  searchMusic(query){
    return new Promise((resolve, reject) => {
      this.http.get('https://api.spotify.com/v1/search?q='+encodeURIComponent(query)+'&type=track', null)
        .map(res => res.json().tracks.items)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }// end if we have a valid search query

}// end class SearchService
