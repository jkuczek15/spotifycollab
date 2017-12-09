var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var app = express();
var User = mongoose.model('User');
var authConfig = require('../config');

/* PROFILE [RETURNS USER] */
router.get('/', authConfig.auth, function(req, res, next) {
  // If no user ID exists in the JWT return a 401
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
    // Otherwise continue
    User.findById(req.payload._id).exec(function(err, user) {
      res.status(200).json(user);
    });
  }// end if we don't have the required payload ID
});

module.exports = router;