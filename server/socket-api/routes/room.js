var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var app = express();
var server = require('http').createServer(app);
var Room = require('../models/Room.js');
var methodOverride = require('method-override');
var cors = require('cors');
var request = require('request');
var environment = require('../../../environments/environment');
var Room = require('../models/Room');

// initialize socket.io with custom settings
const io = require('socket.io')(server, {
  serveClient: false,
  pingInterval: 10000,
  pingTimeout: 80000,
  cookie: false
});

// socket io
io.on('connection', function (socket) {
  
  socket.on('subscribe', function(data){
    var roomName = data.roomName;
    Room.findOne({ name: roomName }, function(error, room) {
      if(error) throw error;
      if(room != null){
        socket.join(room.name);
      }// end if room exists
    });
  });

  socket.on('unsubscribe', function(data){
    var roomName = data.roomName;
    socket.leave(roomName);
  });

  socket.on('leave-room', function(data) {
    var room = data.room;
    var user = data.user;

    // update the users property of the room to remove the current 
    // user from the room
    Room.update(
      { name: room.name }, 
      { $pull: { "users": user } },
      function(error, body) {
        // update was successful, emit a socket message with new track added
        room.users = room.users.filter(function(u) {
          return u.id !== user.id;
        });
        socket.emit('room-update', { room: null });
        socket.leave(room.name);
        io.sockets.in(room.name).emit('room-update', { room: room });
      }// end callback function
    );
  });

  socket.on('end-room', function(data) {
    var room = data.room;
    var host = room.users[0];
    var queue = room.queue;

    // delete the room from the Mongo database
    Room.remove({ name: room.name }, function(error, body) { 
      // emit a null room update so all sockets know to
      // stop displaying the room
      io.sockets.in(room.name).emit('room-update', { room: null });
      
      // send a request to spotify to delete the playlist
      // we need the host's access token
      var options = {
        url:  'https://api.spotify.com/v1/users/'+host.id+'/playlists/'+queue.id+'/followers',
        headers: {
            'Authorization': 'Bearer ' + host.access_token
        }
      };

      // send the delete request
      request.delete(options, function(error, response, body){
        console.log('Successfully deleted playlist.');
      });
    });
  });

  socket.on('join-room', function(data) {
    var user = data.user;
    var roomName = data.roomName;

    // check if a room exists before we join it
    Room.findOne({ name: roomName }, function(error, room) {
      if(error) throw error;
      if(room == null){
        // send an error back to the socket that sent this request
        socket.emit('error-message', "Room does not exist yet. Click 'host' to start one now!");
      }else{
        // subscribe the current user's socket to the room
        //console.log(room);
        room.users.push(user);
        room.save(function(error, room){
          socket.join(room.name);
          io.sockets.in(room.name).emit('room-update', {room: room});
        });
      }// end if room is null
    });
  });

  socket.on('create-room', function(data) {
    // create a new room based on parameters sent to us
    var roomName = data.roomName;
    var user = data.user;

    // set the host variable to true since this is the user who created the room
    // initialize the room with an empty play queue
    user['host'] = true;
    var room = {
      name: roomName,
      users: [user],
      queue: { tracks: {'1': '1'} }
    };

    // create the room and save it to MongoDB
    var dbRoom = new Room(room);
    var error = null;
    dbRoom.save(function(error, room) {
      if(error){
        // there was an error when inserting data into MongoDB
        // currently this can only be a duplicate key error
        socket.emit('error-message', "Room already created");
      }else{
        // there was no error, we've successful created the room
        // and saved it to the database, join the room and emit 
        // a room update message to the host client
        // setup the request for adding a new playlist
        var options = {
          url:  'https://api.spotify.com/v1/users/'+user['id']+'/playlists',
          headers: {
            'Authorization': 'Bearer ' + user['access_token'],
            'Content-Type' : 'application/json'
          },
          json: {
            description: "Boom room playlist",
            public: false,
            name: "Boom Room - " + room.name
          }
        };

        // make the request for adding a new playlist
        // upon completion of the request, store the playlist information
        // in the database and return a socket message to the host who 
        // created the room
        request.post(options, function(error, response, queue){
          room.queue = queue;
          room.save(function(error, room){
            socket.join(room.name);
            socket.emit('room-update', { room: room, created: true });
          });
        });  
      }// end if error
    });
  });

  socket.on('add-track', function(data) {
    var track = data.track;
    var room = data.room;

    // host will always be the first person in the room
    var host = room.users[0];

    // setup the request for adding a new track
    var options = {
      url:  'https://api.spotify.com/v1/users/'+host.id+'/playlists/'+room.queue.id+'/tracks?uris=' + encodeURIComponent('spotify:track:'+track.id),
      headers: {
        'Authorization': 'Bearer ' + host.access_token,
        'Content-Type' : 'application/json'
      }
    };

    // make the request for adding a new track
    request.post(options, function(error, response, body) {
      Room.update(
        { name: room.name }, 
        { $push: { "queue.tracks.items": track } },
        function(error, body) {
          // update was successful, emit a socket message with new track added
          room.queue.tracks.items.push(track);
          io.sockets.in(room.name).emit('room-update', { room: room });
        }// end callback function
      );
    });
  });
});


/*
We only need this if we want to make direct API requests from the client
to the Socket.io server

// Initialize a CORS preflight request for this particular route
// This includes both the options and delete request
app.options('/rooms', cors());
app.delete('/rooms', cors(), function(req, res){
  res.json({ text: 'Success' });
});

// Enable CORS for this request
app.get('/rooms', cors(), function (req, res, next) {
  res.json(rooms);
});
*/

server.listen(4000);

module.exports = router;