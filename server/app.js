var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Room = require('./models/Room.js');

// Initalize the express application
var app = express();
 
// Initialize CORs for cross-domain origin requests
var cors = require('cors');

// Connect to mongoDB
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/database', {
    useMongoClient: true
}).then(() =>  console.log('MongoDB Connection Successful'))
  .catch((err) => console.error(err));

var config = {
  appRoot: __dirname // required config
};

// Enable preflight requests
// Include before other routes
app.options('*', cors()); 

// Activate cors
app.use(cors());

// Initialize the node logger
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'false'}));
app.use(express.static(path.join(__dirname, '/../', 'web', 'dist')));

// Activate the socket.io room routes
var room = require('./socket-api/routes/room');
app.use('/api/room', room);

// For all public routes, send our index.html file
// We will let the Angular Router handle it from there
app.get('/rooms', function(req, res) {
  let query = req.query.q;
  Room.find({name: new RegExp(query)}, function(err, rooms){
    res.json(rooms);
  });
});

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
app.use(function(err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  
  // Send our error messages to browser console for debugging
  res.status(err.status || 500);
  res.send({
    message: err.message,
    error: err
  });
  return;
});

module.exports = app;