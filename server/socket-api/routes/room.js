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

// contains all our open listening rooms
var rooms  = {};

// socket io
io.on('connection', function (socket) {

  socket.on('subscribe', function(data){
    var room = data.room;
    socket.join(room);
  });

  socket.on('unsubscribe', function(data){
    var room = data.room;
    socket.leave(room);
  });

  socket.on('leave-room', function(data) {
    var room = data.room;
    var user = data.user;
    rooms.users = rooms.users.filter(function(u) {
      return u.id !== user.id;
    });
    socket.leave(room);
  });

  socket.on('end-room', function(data) {
    var room = data.room;

    // delete this room from our stored rooms array
    delete rooms[room];

    // emit a null room update so all sockets know to
    // stop displaying the room
    io.sockets.in(room).emit('room-update', { room: null });
    
    // force all the sockets in the current room to leave the room
    // tell all the joined sockets that this room doesnt exist anymore
    var roomSockets = io.sockets.in(room).clients().sockets;
    Object.keys(roomSockets).forEach(function(id) {
        roomSockets[id].leave();
    });
  });

  socket.on('join-room', function(data) {
    // Initialize the room, first check
    // that the room doesn't exist yet
    var roomName = data.room
    
    if(roomName in rooms){
      // the room exists, add this user
      var user = data.user;
      var room = rooms[roomName];
      
      // add the new user to the room
      // first check if duplicate user exists
      var dupe = room.users.find(function(dupe_user){
        return dupe_user.id === user.id;
      });
      
      if(dupe === undefined){
        rooms[roomName].users.push(user);
      }// end if we don't have a duplicate user

      // subscribe the current user's socket to the room
      socket.join(room);
      
      // send a message to all users in the room (including recently joined user)  
      io.sockets.in(room).emit('room-update', {room: rooms[roomName]});
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
    
    // find the host user's information
    // the host will always be the first user in the room
    var room = rooms[roomName];
    var host = room.users[0];

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