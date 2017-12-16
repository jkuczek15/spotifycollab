// This file contains environment variables that are defined for the entire project
// The scopes variable is used to access different portions of the Spotify API and is often changed

module.exports = {
  production: false,
  host: '127.0.0.1',
  ws_port: '3000',
  socket_port: '4000',
  api_port: '10010',
  client_id: 'b6f40e9463ba406792aa0914d5c64bcb',
  client_secret: 'b46c432f728b4131b90eb0109604f010',
  scopes: 'user-read-private user-read-email user-library-read '+
          'playlist-modify-private playlist-modify-public playlist-read-private '+
          'user-modify-playback-state user-read-currently-playing'
};
