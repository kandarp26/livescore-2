window.onload = function() {
    var messages = [];
    var socket = io.connect('http://192.168.101.204:70');

    var sendButton = document.getElementById("send");
	var content = document.getElementById("content");

	var sc_team1 = document.getElementById("sc_team1");
	var sc_team2 = document.getElementById("sc_team2");

	var sc_toss = document.getElementById("sc_toss");
	var sc_batboll = document.getElementById("sc_batboll");
	var wicket     = document.getElementById("wicket");
	

    socket.on('message', function (data) {
		var  matchscoreCard = document.getElementById("matchscoreCard");

		if(data.change_innings){
			matchscoreCard.innerHTML = "";
		}

		//console.log(data);
		if(data.team1 != '' && data.team1 != 'undefined' ){
			sc_team1.innerHTML = data.team1;
		}

		if(data.team2 != '' && data.team2 != 'undefined'){
			sc_team2.innerHTML = data.team2;
		}

		if(data.toss != '' && data.toss != 'undefined'){
			sc_toss.innerHTML = data.toss;
		}

		if(data.batball != '' && data.batball!= 'undefined'){
			sc_batboll.innerHTML = data.batball;
		}

		if(data.message) {
			messages.push(data.message);
            var html = '';
            for(var i=0; i<messages.length; i++) {
                html = '<p>'+messages[i] +'</p>' + html;
            }

            content.innerHTML = "<p>"+data.message+"</p>"+ content.innerHTML ;
        } else {
            console.log("There is a problem:", data);
        }
		
		if(data.run != '' && data.run!= 'undefined'){
			var  run = document.getElementById("run_"+data.innings);
			totalrun = parseInt(run.innerHTML)  + parseInt(data.run);
			run.innerHTML  = totalrun;
			matchscoreCard.innerHTML = matchscoreCard.innerHTML + '&nbsp;' + data.run;
			if(data.run_type == 'No Ball'){
				matchscoreCard.innerHTML = matchscoreCard.innerHTML + 'n' ;
			}
		} 
		
		if(data.wicket != '' && data.wicket!= 'undefined' && data.wicket!= 0){
			var  wicket = document.getElementById("wicket_"+data.innings);
			totalwicket = parseInt(wicket.innerHTML)  + parseInt(data.wicket);
			wicket.innerHTML  = totalwicket;
			matchscoreCard.innerHTML = matchscoreCard.innerHTML + 'W';
		}
		
		
		if(data.ball != '' && data.ball!= 'undefined'){
			var  matchscoreCard = document.getElementById("matchscoreCard");
			
			var  ball = document.getElementById("totalball_"+data.innings);
			if(data.run_type != 'No Ball'){
				
				totalball = parseInt(ball.value) + parseInt(data.ball);
				ball.value = totalball
				over = parseInt(totalball / 6);
				overball = totalball % 6;
				over = over +"."+overball;
				
				
				var  overdata = document.getElementById("over_"+data.innings);
				overdata.innerHTML = over;
				
				
				if(!(totalball % 6)){
					matchscoreCard.innerHTML = matchscoreCard.innerHTML + '&nbsp;|';
				}
				
			}
		}
    });
 
    sendButton.onclick = function() {
		var matchnumber =  document.getElementById("matchnumber");
		if(!matchnumber.value){
			alert("Please Enter Unique Match Number");
			return false;
		}

		var commentary = document.getElementById("commentary");
		var team1   = document.getElementById("team1");
		var team2   = document.getElementById("team2");
		var toss    = document.getElementById("toss");
		var batball = document.getElementById("batball");
		var innings1 = document.getElementById("innings1").checked;
		var innings2 = document.getElementById("innings2").checked;

		if(innings1){
			innings = 1;
		} else if (innings2){
			innings = 2;
		}else {
			alert("Please select Innings");
			return false;
		}


		var run     = document.getElementById("run");
		var wicket     = document.getElementById("wicket");
		var run_type= document.getElementById("run_type");
		var ball    = document.getElementById("ball");
		var over_flag    = document.getElementById("over_flag");
		var matchnumber =  document.getElementById("matchnumber");
		
		
		alert(wicket.value);
		if(wicket.value == 'NaN' || wicket.value == ''){
			wicketValue = 0;
		}else {
			wicketValue = wicket.value;
		}
		
		if(run.value == 'NaN'){
			runValue = '';
		}else{
			runValue = run.value;
		}
		
		if(batball.value == 'NaN'){
			batballValue = '';
		}else{
			batballValue = batball.value;
		}
		
		socket.emit('send', {
								message: commentary.value,
								team1:team1.value,
								team2:team2.value,
								toss:toss.value,
								batball:batball.value,
								innings:innings,
								run:runValue,
								run_type:run_type.value,
								ball:ball.value,
								over_flag:over_flag.checked,
								matchnumber:matchnumber.value,
								wicket:wicketValue,
							}
					);
		
					
        commentary.value = '';
    };
}