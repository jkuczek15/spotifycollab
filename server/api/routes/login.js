var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var app = express();
var User = require('../models/User.js');

/* LOGIN [RETURNS JWT TOKEN] */
router.post('/', function(req, res, next) {
  // Authenticate the user using passport
  passport.authenticate('local', function(err, user, info) {
    var token;

    // If Passport throws/catches an error
    if (err) {
      res.status(404).json(err);
      return;
    }// end if passport had an error

    // If a user is found
    if(user){
      token = user.generateJwt();
      res.status(200);
      res.json({
        "token" : token
      });
    } else {
      // If user is not found
      res.status(401).json(info);
    }// end if we found a user

  })(req, res);
});

module.exports = router;