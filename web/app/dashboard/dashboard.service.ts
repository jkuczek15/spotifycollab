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

  getPlaylist(playlistUri){
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

  addTrack(user_id, playlist_id, track_id) {
    return new Promise((resolve, reject) => {
      this.http.post('https://api.spotify.com/v1/users/'+user_id+'/playlists/'+playlist_id+'/tracks?uris=' + encodeURIComponent('spotify:track:'+track_id), null)
        .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }// end function addTrack

  removeTrack(user_id, playlist_id, data) {
    return new Promise((resolve, reject) => {
      this.http.delete('https://api.spotify.com/v1/users/'+user_id+'/playlists/'+playlist_id+'/tracks', data)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }// end function nextTrack

  createPlaylist(user_id, data) {
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

  removePlaylist(user_id, playlist_id) {
    return new Promise((resolve, reject) => {
      this.http.delete('https://api.spotify.com/v1/users/'+user_id+'/playlists/'+playlist_id+'/followers', null)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }// end function createPlaylist

  reorderPlaylist(user_id, playlist_id, data) {
    return new Promise((resolve, reject) => {
      this.http.put('https://api.spotify.com/v1/users/'+user_id+'/playlists/'+playlist_id+'/tracks', data)
        .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }// end function reorderPlaylist

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
