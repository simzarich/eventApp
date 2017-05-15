var express = require('express'),
	path = require('path'),
	bodyParser = require('body-parser'),
	cons = require('consolidate'),
	dust = require('dustjs-helpers'),
	pg = require('pg'),
	app = express();
	mongoose = require('mongoose');

//db connect string
var connect = 'postgres://rich092:123456@localhost/eventsdb';

//assign dust engine to .dust files
app.engine('dust', cons.dust);

// default ext. dust
app.set('view engine', 'dust');
app.set('views', __dirname+ '/views');


//set public folder
app.use(express.static(path.join(__dirname,'public')));

//body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.listen(3000,function(){
	console.log('server iniciado en puerto 3000');

	app.get('/', function (req, res) {

		pg.connect(connect,function(err, client,done){
			if(err){
				return console.error('error fetching client from pool', err);
			}
			client.query('SELECT * FROM actividad',function(err, result){
				if(err){
					return console.error('error runing query', err);
				}
				res.render('index',{actividad: result.rows});
			});
		});
	});

	app.get('/admin', function (req, res) {
	    res.render('admin');
	});


	app.post('/add', function (req, res) {
		pg.connect(connect,function(err, client,done){
			if(err){
				return console.error('error fetching client from pool', err);
			}
			client.query("INSERT INTO actividad(name_event, location_event, file_event, startdate_event, starttime_event, enddate_event, endtime_event) VALUES($1, $2, $3, $4, $5, $6, $7)",
				[req.body.name_event,req.body.location_event,req.body.file_event,req.body.startdate_event,req.body.starttime_event,req.body.enddate_event,req.body.endtime_event]);
			done();
			res.redirect('/');
			});
		});

	app.get('/div', function (req, res) {
		pg.connect(connect,function(err, client,done){
			if(err){
				return console.error('error fetching client from pool', err);
			}
			client.query('SELECT * FROM actividad',function(err, result){
				if(err){
					return console.error('error runing query', err);
				}
				res.render('div',{actividad: result.rows});

			});
		});

	});

});