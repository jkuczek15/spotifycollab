// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

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