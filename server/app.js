var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');

// Initalize the express application
var app = express();

// Initialize the node logger
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'false'}));
app.use(express.static(path.join(__dirname, '/../', 'client', 'dist')));

// For all public routes, send our index.html file
// We will let the Angular Router handle it from there
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, '/../', 'client', 'dist', 'index.html'));
});

var chat = require('./api/routes/chat');

app.use('/api/chat', chat);

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