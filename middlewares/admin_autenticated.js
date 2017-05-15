var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var Admin = mongoose.model('Admin');

passport.serializeUser(function(admin,done){
  done(null,admin);
});
passport.deserializeUser(function(admin,done){
	Admin.findById(id, function(err,admin){
		done(err,admin);
	});
});

passport.use('admin',new LocalStrategy(
	function (username, password, done) {
		Admin.findOne({username:_id,
			password:password_admin
		}, function(err,admin){
			if(err) {return done(err);}
			if(!admin){
				return done(null, false,{message:'email incorrecto.'});
			}
			if(!admin.validPassword(password)){
				return done(null,false,{message:'password incorrecto.'});
			}
			return done(null,admin);
		});
	}
));