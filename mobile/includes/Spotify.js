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

export const getLibrary = async (token) => {
return fetch('https://api.spotify.com/v1/me/tracks?limit=50', {
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

export const getLibraryNext = async (url, token) => {
return fetch(url, {
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

