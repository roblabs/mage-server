module.exports = function(p***REMOVED***port) {

  var LocalStrategy = require('p***REMOVED***port-local').Strategy
    , User = require('../models/user');

  p***REMOVED***port.use(new LocalStrategy(
    function(username, p***REMOVED***word, done) {
      console.log('Authenticating user: ' + username);
      User.getUserByUsername(username, function(err, user) {
        if (err) { return done(err); }

        if (!user) {
          console.log('Failed login attempt: User with username ' + username + ' not found');
          return done(null, false, { message: "User with username '" + username + "' not found" });
        }

        user.validP***REMOVED***word(p***REMOVED***word, function(err, isValid) {
          if (err) {
            return done(err);
          }

          if (!isValid) {
            console.log('Failed login attempt: User with username ' + username + ' provided an invalid p***REMOVED***word');
            return done(null, false);
          }

          return done(null, user);
        });
      });
    }
  ));
}