var Admin = require('../models/admin').Admin;
var Events = require('../models/events').Events;
var owner_check = require('./admin_permission');
module.exports = function (req,res,next) {
	Events.findbyId(req.params.id)
		.populate('creator')
		.exec(function(err,events){
			if (events != null && owner_check(events,req,res)){
				console.log('encontre el evento' + events.creator);
				res.locals.events = events;
				next();
			}else{
				res.redirect('/allEventcreated');
			}
		})
}
