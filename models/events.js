var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var events_schema = new Schema({
	name_event:{type: String,require:true},
	location_event:{type: String, require:true},
	description_event:{type: String, require:true,maxlength:[240,'Describe tu evento con 240 characteres']},
	starttime_event:{type: String},
	endtime_event:{type: String},
	startdate_event: Date,
	enddate_event: Date,
	extension:{type:String, require:true},
	creator:{type:Schema.Types.ObjectId, ref:'Admin'}

});

var Events = mongoose.model('Events',events_schema);
module.exports.Events = Events;