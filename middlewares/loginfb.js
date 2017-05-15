var passport = require('passport')
var FacebookStrategy = require('passport-facebook').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

passport.serializeUser(function(user,done){
  done(null,user);
});
passport.deserializeUser(function(user,done){
  done(null,user);
});

passport.use(new FacebookStrategy({
    clientID:'305066353223328',
    clientSecret:'a8c7e12293794a14357c32ab4b5953d9',
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
    function(accessToken, refreshToken, profile, done) {
      User.findOne({ oauthID: profile.id },function(err,user){
        if(err){
          console.log(err);
        }
        if(!err && user !== null){
          done(null,user);
        }else {
          user = new User({
          oauthID: profile.id,
          name: profile.displayName,
          photo: profile.photos[0].value,
          created: Date.now()
        });
        user.save(function(err){
          if(err){
            console.log(err);
          }else{
            console.log("guardamos su usuario exitosamente");
            done(null,user);
          }
        });
      }
    });
  }
 ));