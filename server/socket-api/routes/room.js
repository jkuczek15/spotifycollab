var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var app = express();
var server = require('http').createServer(app);
var Room = require('../models/Room.js');
var methodOverride = require('method-override');
var request = require('request');
var environment = require('../../../environments/environment');

// initialize socket.io
const io = require('socket.io')(server);

// socket io
io.on('connection', function (socket) {
  
  socket.on('subscribe', function(data){
    // subscribe the user to the room and emit
    // data related to that room
    var roomName = data.roomName;
    Room.findOne({ name: roomName }, function(error, room) {
      if(error) throw error;
      if(room != null){
        socket.join(room.name);
        socket.emit('room-update', { room: room });
      }// end if room exists
    });
  });

  socket.on('unsubscribe', function(data){
    // unsubscribe a user from a room, note that this is different
    // from leaving a room because it is only called when the host user
    // chooses to end the room
    socket.leave(data.roomName);
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
          io.sockets.in(room.name).emit('room-update', { room: room });
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
      queue: { tracks: {'key': 'value'} }
    };

    // create the room and save it to MongoDB
    var room = new Room(room);
    var error = null;
    room.save(function(error, room) {
      if(error){
        // there was an error when inserting data into MongoDB
        // currently this can only be a duplicate key error
        socket.emit('error-message', "Room already created");
      }else{
        // there was no error, we've successful created the room
        // and saved it to the database, join the room and emit 
        // a room update message to the host client
        // setup the request for adding a new playlist
        room.queue = data.queue;
        room.save(function(error, room) {
          socket.join(room.name);
          socket.emit('room-update', { room: room, created: true });
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

  socket.on('room-broadcast', function(data) {
    var newRoom = data.room;
    var roomName = data.roomName;
    // save the new room information to the database and emit
    // a message to all sockets in the room telling them that the
    // room data has been updated
    Room.replaceOne({ _id: newRoom._id }, newRoom, function(error, body){
      io.sockets.in(roomName).emit('room-update', { room: newRoom });
    });
  });

  socket.on('playback-broadcast', function(data) {
    var playback = data.playback;
    var roomName = data.roomName;
    io.sockets.in(roomName).emit('playback-update', playback);
  });

});

server.listen(4000);

module.exports = router;