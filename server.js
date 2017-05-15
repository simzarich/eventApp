var express = require('express'),
	path = require('path'),
	bodyParser = require('body-parser'),
	cons = require('consolidate'),
	dust = require('dustjs-helpers'),
	pg = require('pg'),
	app = express(),
	mongoose = require('mongoose');
	Events = require('./models/events').Events;
	Admin = require('./models/admin').Admin;
	User = require('./models/user');
	fs = require('fs');
	formidable = require('express-formidable');
	session_middleware = require('./middlewares/session');
	login_fb = require('./middlewares/loginfb');
	cookieSession = require('cookie-session');
var admin_finder_middleware = require('./middlewares/find_event');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var auth= require('./middlewares/auth');
var adminAuth = require('./middlewares/admin_autenticated');
var methodOverride = require('method-override');
//var User = mongoose.model('User');

//db connect string
mongoose.connect('mongodb://localhost/eventsdb')


//assign dust engine to .dust files
app.engine('dust', cons.dust);

// default ext. dust
app.set('view engine', 'dust');
app.set('views', __dirname+ '/views');



app.use(express.static(path.join(__dirname,'public')));//set public folder
app.use(bodyParser.json());//body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(formidable.parse({ keepExtensions: true }));//formidable middleware for upload files
app.use(methodOverride('_method'));
//cookie session holder
app.use(cookieSession({
	name:'session',
	keys:['key1','key2']
}));

//passport login 
app.use(passport.initialize());
app.use(passport.session());

//app.use('/app2',login_fb).passport;

//middleware


app.use('/server',session_middleware);
app.listen(3000,function(){
	console.log('server iniciado en puerto 3000');

	

	//app.use('/app2',login_fb);

	//EVENTOS
	app.get('/', function (req, res) {
		console.log(req.session.admin_id);
		console.log('cookies:',req.cookies);
		console.log(req.session.email_admin);
		Events.find({})
		.exec(function(err,events){
			if(err) console.log(err);
			res.render('index',{events:events});
		})
	});

	//POST EVENTS
	app.post('/add', function (req, res) {
		var event = new Events({
			name_event: req.body.name_event,
			location_event: req.body.location_event,
			description_event: req.body.description_event,
			starttime_event: req.body.starttime_event,
			endtime_event: req.body.endtime_event,
			startdate_event: req.body.startdate_event,
			enddate_event: req.body.enddate_event,
			extension : req.body.file_event.name.split('.').pop()
		});
		var extension = req.body.file_event.name.split('.').pop();
		console.log(extension)
		event.save().then(function(err){
			fs.rename(
				req.body.file_event.path,
				'public/image/'+event._id+'.'+extension)

			console.log('Guardamos el evento exitosamente')
		},
		function(err){
			if(err){
				console.log(String(err));
				console.log('no pudimos guardar la informacion')
			}
		});
		res.redirect('/div');
	});

	//DELETE EVENTS
	app.delete('/delete/:id',function(req,res){
		Events.findOneAndRemove({_id:req.params.id}, function(err){
			if(!err){
				res.redirect('/admin/home');
			}else{
				console.log(err);
				res.redirect('/admin/home');
			}
		});
	});


	//PUT - EDIT 
	app.get('/edit/:id',function(req,res){
		Events.find({_id:req.params.id})
		.exec(function(err,events){
			if(err) console.log(err);
			res.render('edit',{events:events})
		});
	});
	app.put('/edit/:id',function(req,res){
		res.locals.event.name_event = req.body.name_event;
		res.locals.event.location_event = req.body.location_event;
		res.locals.event.description_event = req.body.description_event;
		res.locals.event.starttime_event = req.body.starttime_event;
		res.locals.event.endtime_event = req.body.endtime_event;
		res.locals.event.startdate_event = req.body.startdate_event;
		res.locals.event.enddate_event = req.body.enddate_event;
		res.locals.event.save(function(err){
			if(!err){
				res.render('/admin/newEvent');
			}else{
				res.render('/edit/'+req.params.id);
			}
		res.send(200)
		});
	});

	app.get('/div', function (req, res) {
		console.log(req.session.admin_id);
		Events.find({})
		.exec(function(err,events){
			if(err) console.log(err);
			res.render('div',{events:events});
		});
	});
	app.get('/user', function (req, res) {
		User.find({})
		.exec(function(err,users){
			if(err) console.log(err);
			res.render('user',{users:users});
		});
	});


	//SHOW evento
	app.get('/show/:id',function(req,res){
		Events.find({_id:req.params.id})
		.exec(function(err,events){
			if(err) console.log(err);
			res.render('show',{events:events})

		});
	});
	//app.all('/comprar/:name_event*',passport.authenticate('facebook'));
	app.get('/comprar/:name_event',function(req,res){
		Events.find({name_event:req.params.name_event})
		.exec(function(err,events){
			if(err) console.log(err);
			res.render('comprar/comprar',{events:events})

		});
	});


	//ADMIN


	app.get('/login',function(req,res){
		res.render('login');
	});
	//app.all('/admin/*', session_middleware);
	//app.all('/admin/*',passport.authenticate('admin', { failureRedirect: '/login' }));
	//app.all('/admin/*', auth.authenticate('Admin'));
	app.get('/admin/newEvent', function (req, res) {
		console.log(req.session.admin_id);
	    res.render('admin/newEvent');
	});
	app.get('/admin/home', function (req, res) {
		Events.find({})
			.populate('creator')
			.exec(function(err, events){
				if(err) console.log(err);
				console.log(req.session.admin_id);
				res.render('admin/home',{events: events});
			})
	});
	//SESSION ADMIN HOLDER

	app.post('/sessions',function(req,res){
		Admin.findOne({email_admin:req.body.email_admin,
			password_admin:req.body.password_admin
		}, function(err,admin){
			req.session.admin_id = admin._id;
			res.redirect('admin/newEvent');
		});
	});
	//CREATE ADMIN USER
	app.post('/susers',function(req, res){
		var admin = new Admin({
			email_admin: req.body.email_admin,
			password_admin: req.body.password_admin,
			password_confirmation: req.body.password_confirmation
		});
		admin.save().then(function(us){
			res.send('Guardamos exitosamente su informacion para acceder como Administrador')
			res.redirect('/admin/admin')
		},
		function(err){
			if(err){
				console.log(String(err));
				res.send('no pudimos crear su usuario')
				res.redirect('/signup')
			}
		});

	});

	app.get('/signup',function(req,res){
		Admin.find(function(err,doc){
			console.log(doc);
			res.render('signup');
		});
	});


	//facebook login
	app.get('/auth/facebook',
	  passport.authenticate('facebook'));

	app.get('/auth/facebook/callback',
	  passport.authenticate('facebook', { failureRedirect: '/login' }),
	  function(req, res) {
	    // Successful authentication, redirect home.
	    res.redirect('/');
	  });

	app.get('/logout', function(req, res){
	  req.logout();
	  req.session = null;
	  res.redirect('/');

	});


});