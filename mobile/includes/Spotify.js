export const createPlaylist = async (token, user_id, data) => {
return fetch('https://api.spotify.com/v1/users/'+user_id+'/playlists', {
            body: JSON.stringify(data),
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token
            }
        }).then(function(response) {
            return response.json();
        }, function(error) {
            console.log(error);
        });
};

export const removePlaylist = async (token, user_id, playlist_id) => {
return fetch('https://api.spotify.com/v1/users/'+user_id+'/playlists/'+playlist_id+'/followers', {
        method: "DELETE",
        headers: {
          'Authorization': 'Bearer ' + token
        }
    }).then(function(response) {
        return response;
    }, function(error) {
        console.log(error);
    });
};

export const getLibrary = async (token, offset) => {
return fetch('https://api.spotify.com/v1/me/tracks?limit=50&offset='+offset, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        }).then(function(response) {
            return response.json();
        }, function(error) {
            console.log(error);
        });
};

export const getPlaylists = async (token) => {
return fetch('https://api.spotify.com/v1/me/playlists', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        }).then(function(response) {
            return response.json();
        }, function(error) {
            console.log(error);
        });
};

export const getPlaylist = async (token, playlist_url) => {
return fetch(playlist_url+'/tracks', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        }).then(function(response) {
            return response.json();
        }, function(error) {
            console.log(error);
        });
};

export const search = async (token, query) => {
return fetch('https://api.spotify.com/v1/search?type=track&q='+query, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        }).then(function(response) {
            return response.json();
        }, function(error) {
            console.log(error);
        });
};

export const devices = async (token) => {
return fetch('https://api.spotify.com/v1/me/player/devices', {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        }).then(function(response) {
            return response.json();
        }, function(error) {
            console.log(error);
        });
};


export const play = async (token, device_id, data) => {
return fetch('https://api.spotify.com/v1/me/player/play?device_id='+device_id, {
            body: JSON.stringify(data),
            method: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        }).then(function(response) {
            return response;
        }, function(error) {
            console.log(error);
        });
};

export const userInfo = async (token) => {
return fetch('https://api.spotify.com/v1/me', {
            method: "GET",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token
            }
        }).then(function(response) {
          return response.json();
        }, function(error) {
          console.log(error);
        });
};

