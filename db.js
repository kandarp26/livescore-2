var mongoose = require('mongoose');
var Schema   = mongoose.Schema;


var Team = new Schema({
    name    : String,
});


var Commentary = new Schema({
    commentarydata    : String,
});


var Feed = new Schema({
    team1    	:String,
	team2	 	:String,
	toss	 	:String,
	batball  	:String,
	message  	:String,
	innings	 	:String,
	run		 	:String,
	run_type 	:String,
	ball	 	:String,
	over_flag	:String
});

var Score = new Schema({
	match_number	:String,
	innings			:String,
	run				:String,
	wicket 			:String,
	over 			:String,
	runbyball		:String,
	totalball		:String,
	updated_at		:Date,
});

mongoose.model('Feed', Feed);
mongoose.model('Team', Team);
mongoose.model('Score', Score);

mongoose.model('Commentary', Commentary);
mongoose.connect( 'mongodb://localhost/live-score');