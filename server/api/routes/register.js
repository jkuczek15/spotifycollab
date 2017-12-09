var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var app = express();
var User = require('../models/User.js');

/* REGISTER [RETURNS JWT TOKEN] */
router.post('/', function(req, res, next) {
  // Create a new user and set hash/salt using the password
  var user = new User();
  user.username = req.body.username;
  user.email = req.body.email;
  user.setPassword(req.body.password);

  User.create(user, function (err, post) {
    if (err) return next(err);
    var token;
    token = user.generateJwt();
    res.status(200);
    res.json({
      "token" : token
    });
  });
});

module.exports = router;