require( './db' );
var express = require("express");
var jf = require('jsonfile');
var mongoose = require('mongoose');
var app = express();
var port = 70;
var io = require('socket.io').listen(app.listen(port,'192.168.101.204'));
var Team        = mongoose.model('Team');
var Commentary  = mongoose.model('Commentary');
var Score  = mongoose.model('Score');
var Feed  = mongoose.model('Feed');
var Entities = require('html-entities').AllHtmlEntities;
var last = 0;


entities = new Entities();



app.set('views', __dirname + '/tpl');
app.set('view engine', "ejs");
app.engine('ejs', require('ejs').__express);
app.get("/", function(req, res){
     Commentary.find().sort({'_id': -1}).exec(function (err, commentary){
		Feed.findOne().sort({'_id': -1}).exec(function (err, feed){
			Score.findOne().sort({'updated_at':-1}).exec(function (err, score){
				
				if(score){
					if(score.innings == 1){
						score_1 = score;
						score_2 = '';
						last = 1;
						res.render("page",{commentary : commentary,feed :feed,score_1:score_1,score_2:score_2});
					}else {
							last = 2;
							score_2 = score;
							Score.findOne({match_number:score_2.match_number,innings:1}).exec(function (err, score){
							score_1 = score;
							//console.log(entities.decode(score_1.runbyball));
							res.render("page",{commentary : commentary,feed :feed,score_1:score_1,score_2:score_2});
						});
					}
				}else{
					score_1 = "";
					score_2 = '';
					res.render("page",{commentary : commentary,feed :feed,score_1:score_1,score_2:score_2});
				}
				
			});
			
		});
	});
});




app.get("/admin9904050326", function(req, res){
	Team.find().exec(function (err, team){
	Commentary.find().sort({'_id': -1}).exec(function (err, commentary){
		Feed.findOne().sort({'_id': -1}).exec(function (err, feed){
			Score.findOne().sort({'updated_at':-1}).exec(function (err, score){
				if(score){
					if(score.innings == 1){
						score_1 = score;
						score_2 = '';
						res.render( 'adminpage', {teams : team,commentary : commentary,feed :feed,score_1:score_1,score_2:score_2});
					}else {
						score_2 = score;
						Score.findOne({match_number:score_2.match_number,innings:1}).exec(function (err, score){
						score_1 = score;
						//console.log(entities.decode(score_1.runbyball));
						res.render( 'adminpage', {teams : team,commentary : commentary,feed :feed,score_1:score_1,score_2:score_2});
						//res.render("page",{commentary : commentary,feed :feed,score_1:score_1,score_2:score_2,entities});
						});
					}
				}else {
					score_1 = "";
					score_2 = "";
					res.render( 'adminpage', {teams : team,commentary : commentary,feed :feed,score_1:score_1,score_2:score_2});
				}
				
				
			});
			
		});
	});
});

	
      
		
    
});


app.get("/admin/team", function(req, res){
});


io.sockets.on('connection', function (socket) {
    socket.on('send', function (data) {
		
		console.log("last"+last);
		if(last){
			if(last != data.innings){
				data.change_innings = 1;
			}
		}

		console.log(data.change_innings);
		last = data.innings;
		Score.findOne({match_number :data.matchnumber,innings:data.innings}).exec(function (err, match_number){
			if(!match_number){
				if(parseInt(data.ball)){
					overdata = 0.1
				}else {
					overdata = 0.0
				}
				
				if(data.run == ''){
					data.run = 0;
					runbyball = '';
				}else{
					runbyball = data.run;	
				}
				
				if(data.wicket == ''){
					data.wicket = 0;
				}
				
				new Score({
							match_number : data.matchnumber,
							innings:data.innings,
							run:data.run,
							wicket:data.wicket,
							over:overdata,
							runbyball:runbyball,
							totalball:data.ball,
							updated_at: Date.now(),
						}).save(function ( err, commentarydata, count ){});
			}else {
			
				if(data.run !=''){
					match_number.run = parseInt(match_number.run) + parseInt(data.run);
				}
				
				if(data.run_type != 'No Ball'){
					if(data.ball != ''){
						match_number.totalball = parseInt(match_number.totalball) + parseInt(data.ball);
						over = parseInt(match_number.totalball / 6);
						overball = match_number.totalball % 6;
						match_number.over = over+'.'+overball;
					} 
				}
				

				if(data.run!=''){
					match_number.runbyball = match_number.runbyball + '&nbsp;' + data.run;
				}

				if(data.wicket!='' && data.wicket!=0){
					match_number.runbyball = match_number.runbyball + 'W';
				}


                if(data.run_type == 'No Ball'){
					match_number.runbyball = match_number.runbyball + 'n';
				}


				if(!(match_number.totalball % 6) && data.run_type != 'No Ball'){
					match_number.runbyball = match_number.runbyball + '&nbsp;' + "|";
				}

				match_number.updated_at = Date.now();
				
				match_number.wicket = parseInt(match_number.wicket) + parseInt(data.wicket);
                //match_number.runbyball = match_number.runbyball + '&nbsp;' + match_number.run;

				match_number.save()
			}
		});


		console.log(data);
		var com = data.message;
		io.sockets.emit('message', data);
		if(com != ''){
			new Commentary({commentarydata: com}).save(function ( err, commentarydata, count ){});
		}

		new Feed(data).save(function ( err, commentarydata, count ){});
    });
});

app.use(express.static(__dirname + '/public'));


console.log("Listening on port " + port);