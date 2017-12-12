'use strict';

// Required includes
var SwaggerExpress = require('swagger-express-mw');
var mongoose = require('mongoose');
var app = require('express')();

// Connect to mongoDB
/* Uncomment to connect to database
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/database', {
    useMongoClient: true
}).then(() =>  console.log('MongoDB Connection Successful'))
  .catch((err) => console.error(err));
*/

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