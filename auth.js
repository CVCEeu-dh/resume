/*

  authentication mechanism
  ===

*/
var settings        = require('./settings'),
    passport        = require('passport'),

    LocalStrategy   = require('passport-local').Strategy,
    TwitterStrategy = require('passport-twitter').Strategy,
    GoogleStrategy  = require('passport-google-oauth').OAuth2Strategy,
    

    User            = require('./models/user');
    

// auth mechanism: Local
passport.use(new LocalStrategy(function (username, password, done) {
  // get user having username or email = username and check if encription matches and check if 
  User.check({
    username: username,
    password: password
  }, function(err, user) {
    // console.log(err, user)
    if(err)
      done({reason: 'credentials not matching', error: err});
    else if(user.props.status != 'enabled')
      done({reason: 'user is NOT active, its status should be enabled', found: user.status});
    else
      done(null, user);
  });
}));


/*
  Auth mechanism for twitter
*/
passport.use(new TwitterStrategy({
    consumerKey: settings.twitter.consumer_key,
    consumerSecret: settings.twitter.consumer_secret,
    callbackURL: settings.baseurl + "/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {
    User.create({
      email: '@' + profile.displayName,
      username: '@' + profile.displayName,
      firstname: '@' + profile.displayName,
      salt: '',
      password:'',
      status: 'enabled',
      strategy: 'twitter',
      about: '' + profile.description,
      picture: profile.photos? profile.photos.pop().value: '',
    },  function(err, user) {
      console.log('twitter:', err? 'error': 'ok');
      if(err) {
        console.log(err)
        done(err);
      } else
        done(null, user);
    });
  }
));


/*
  Auth mechanism for google
*/
passport.use(new GoogleStrategy({
    clientID: settings.google.clientId,
    clientSecret: settings.google.clientSecret,
    callbackURL:  settings.baseurl + "/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    User.create({
      email: 'g@' + profile.id,
      username: profile.displayName + profile.id,
      firstname: profile.displayName,
      gender: profile.gender || '',
      salt: '',
      password:'',
      status: 'enabled',
      strategy: 'google',
      about: '' + profile.description || '',
      picture: profile.photos? profile.photos.pop().value: '',
    },  function(err, user) {
      console.log('google:', err? 'error': 'ok');
      if(err) {
        console.log(err);
        done(err);
      } else
        done(null, user);
    });
  }
));



passport.serializeUser(function(user, done) {
  done(null, {
    firstname: user.props.firstname,
    lastname:  user.props.lastname,
    username:  user.username,
    uid:       user.uid,
    picture:   user.props.picture
  });
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

exports.passport = passport;