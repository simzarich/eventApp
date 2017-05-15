

var auth={
	authenticate: function (role) {
		return function(req, res, next){

			if(!req.session.admin_id){
				res.redirect('/login');
				return;
			}

			if(role && req.session.admin_id.role !=role ){
				res.redirect('/login')
				return;
			}

			next();
		}
	}
};
module.exports = auth;