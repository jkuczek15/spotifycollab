var jwt = require('express-jwt');
exports.auth = jwt({
  secret: 'MY_SECRET',
  userProperty: 'payload'
});