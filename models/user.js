var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var user_schema = new Schema({
	oauthID: Number,
	name: String,
	photo: String,
	created: Date
});

// create a user model
var User = mongoose.model('User', user_schema);

module.exports = User;