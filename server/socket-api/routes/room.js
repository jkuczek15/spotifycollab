var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var Room = require('../models/Room.js');
var methodOverride = require('method-override');
var cors = require('cors');

server.listen(4000);

var rooms = [];

// socket io
io.on('connection', function (socket) {
  socket.on('subscribe', function(room) { 
    console.log('joining room', room);
    socket.join(room); 
  })
  
  socket.on('unsubscribe', function(room) {  
    console.log('leaving room', room);
    socket.leave(room); 
  })
  
  socket.on('send', function(data) {
    console.log('sending message');
    io.sockets.in(data.room).emit('message', data);
  });

  socket.on('create-room', function(data) {
    // Initialize the room, first check
    // that the room doesn't exist yet
    if(rooms.includes(data.room)){
      io.sockets.emit('message', "Room already created");
    }else{
      rooms.push(data.room);
      io.sockets.in(data.room).emit('message', data);
    }// end if the room hasn't been created
  });

});

app.post('/send/:room/', function(req, res) {
  var room = req.params.room
      message = req.body;

  io.sockets.in(room).emit('message', { room: room, message: message });

  res.end('message sent');
});


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

module.exports = router;