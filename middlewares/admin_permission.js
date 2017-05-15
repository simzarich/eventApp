var Admin = require('../models/admin').Admin;
var Events = require('../models/events').Events;

module.exports = function (events, req, res ) {
	// true = tienepermiso
	//false = no tiene permiso
	if(req.method == 'GET' && req.path.indexOf('div') < 0){
		return true;
	}
	if(typeof events.creator._id.toString() == res.locals.admin._id){
		return true;
	}
	return false;

}