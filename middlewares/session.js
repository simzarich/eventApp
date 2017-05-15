var mongoose = require('mongoose');
var Admin = require('../models/admin');


module.exports = function(req, res, next){
	if(req.session.admin_id){
		res.redirect('/login')
	}
	else{
		Admin.findByID(req.session.admin_id, function(err,admin){
			if(err){
				console.log(err);
				res.redirect('/login');
			}else{
				res.locals = {admin:admin};
				next()
			}
		});
	}
}