var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

passport.use(new LocalStrategy({
    usernameField: 'email'
  },
  function(username, password, done) {
    User.findOne({ email: username }, function (err, user) {
      if (err) { return done(err); }
      
      // Return if user not found or password is wrong
      if (!user || !user.validPassword(password)) {
        return done(null, false, {
          message: 'Incorrect email address or password.'
        });
      }// end if user not found or invalid password

      // If credentials are correct, return the user object
      return done(null, user);
    });
  }
));