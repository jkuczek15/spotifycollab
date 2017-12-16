'use strict';

// Required includes
var SwaggerExpress = require('swagger-express-mw');
var mongoose = require('mongoose');
var app = require('express')();

var config = {
  appRoot: __dirname // required config
};

// Configure and initialize Swagger (REST-Api Framework)
SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 10010;
  app.listen(port);
});

module.exports = app; // for testing