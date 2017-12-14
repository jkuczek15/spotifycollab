var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var Room = require('../models/Room.js');
var methodOverride = require('method-override');
var cors = require('cors');
var request = require('request');

server.listen(4000);

// contains all our created (open) listening rooms
var rooms = [];

// socket io
io.on('connection', function (socket) {
  
  socket.on('join-room', function(data) {
    // Initialize the room, first check
    // that the room doesn't exist yet
    if(data.room in rooms){
      // the room exists, add this user
      var user = data.user;
      var room = data.room;

      // add the new user to the room and subscribe
      // the current user's socket to the room 
      rooms[room].users.push(user);
      socket.join(room);

      // send a message to all users in the room (including recently joined user)  
      io.sockets.in(room).emit('room-update', {room: rooms[room]});
    }else{
      // send an error back to the socket that sent this request
      socket.emit('error-message', "Room does not exist yet. Click 'host' to start one now!");      
    }// end if the room hasn't been created
  });

  socket.on('create-room', function(data) {
    // Initialize the room, first check
    // that the room doesn't exist yet
    if(data.room in rooms){
      // send an error back to the socket that sent this request
      socket.emit('error-message', "Room already created");
    }else{
      // the room does not exist, create it now
      var room = data.room;
      var user = data.user;

      // set the host variable to true since this is the user who created the room
      // initialize the room with an empty play queue
      user['host'] = true;
      rooms[room] = {
        name: room,
        users: [user],
        queue: { tracks: {} }
      };
     
      // join the current socket to the room and send message to all users in room
      socket.join(room);
      io.sockets.in(room).emit('room-update', { room: rooms[room], created: true });
    }// end if the room hasn't been created
  });

  socket.on('create-queue', function(data) {
    var room = data.room;
    rooms[room].queue = data.queue;
    io.sockets.in(room).emit('room-update', { room: rooms[room] });    
  });

  socket.on('add-track', function(data) {
    // get the room and track from the emitted socket message
    var track = data.track;
    var roomName = data.room;
    
    // first find the host user's information
    var room = rooms[roomName];
    var host = room.users.find(function(user){
      return user.host === true;
    });

    // setup the request for adding a new track
    var options = {
      url:  'https://api.spotify.com/v1/users/'+host.id+'/playlists/'+room.queue.id+'/tracks?position=0&uris=' + encodeURIComponent('spotify:track:'+track.id),
      headers: {
          'Authorization': 'Bearer ' + host.access_token,
          'Content-Type' : 'application/json'
      }
    };

    // make the request for adding a new track
    request.post(options, function(error, response, body){
      rooms[roomName].queue.tracks.items.push(track);
      io.sockets.in(roomName).emit('room-update', { room: rooms[roomName] });
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

module.exports = router;