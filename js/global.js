$(document).ready(function() {
	// Additional JS functions here
    window.fbAsyncInit = function() {
      FB.init({
        appId      : '486095544793129', // App ID
        channelUrl : '/channel.html', // Channel File
        status     : true, // check login status
        cookie     : true, // enable cookies to allow the server to access the session
        xfbml      : true  // parse XFBML
      });

    // Additional init code here
    };
  var postids = [];
  var accesstoken;
	$("#login").click(function(){
    FB.getLoginStatus(function(response) {
      if(response.status === 'connected') {
        $("#login").hide();
        $("#respondbutton").show();
        $("#logout").show();
        alert('You\'re already logged in!');
      }
      else if (response.status === 'not_authorized') {
        dologin();
      }
      else {
        dologin();
      }
    }, true);
	});

  // Get birthday
  // 
  $("#respondbutton").click(function(){
    FB.api(
    {
      method: "fql.query",
      query: "SELECT birthday_date FROM user WHERE uid = me()"
    },
        function(response) {
          $("#respondbutton").hide();
          console.log(response);
          var birthday = response[0].birthday_date.split("/");
          var today = new Date();
          var year = today.getFullYear();
          var startdate = new Date(year, birthday[0]-1, birthday[1], 0, 0, 0, 0);
          if(today.getTime() < startdate.getTime()) {
            year = year-1;
            startdate.setFullYear(year);
          }
          var enddate = new Date(year, birthday[0]-1, birthday[1], 23, 59, 59, 999);
          startdate = Math.round(startdate.getTime()/1000);
          enddate = Math.round(enddate.getTime()/1000);
          //var testdate = new Date(2013, 5, 16);
          //testdate = Math.round(testdate.getTime()/1000);
          //ttt = new Date(2013, 5, 16, 23, 59, 59, 999);
          //ttt = Math.round(ttt.getTime()/1000);
          FB.api(
          {
            method: "fql.query",
            query: "SELECT read_stream, publish_stream FROM permissions WHERE uid = me()"
          },
            function(response) {
              $("h2").hide();
              if(response[0].read_stream === "0" || response[0].publish_stream === "0") {
                $("#login").show();
                $("#respondbutton").hide();
                $("#logout").hide();
                FB.logout();
                alert("We need your permission to respond to your friends. Please log in again.");
              }
              else {
              FB.api(
              {
                method: "fql.query",
                query: "SELECT post_id,message,comment_info,created_time,actor_id FROM stream WHERE source_id = me() AND filter_key = 'others' AND created_time <= " + enddate + " AND created_time >= " + startdate + "LIMIT 800"
              },
                  function(response) {
                    for(var i = 0; i < response.length; i++) {
                      if (response[i].message.length != 0 && response[i].comment_info.comment_count < 1) {
                        var lower = response[i].message.toLowerCase();
                        if(lower.indexOf("birthday") > -1 || lower.indexOf("bday") > -1 || lower.indexOf("happy") > -1 || lower.indexOf("anniversary") > -1) {
                          postids.push(response[i].post_id);
                          console.log(response[i].created_time);
                          console.log(response[i].comment_info);
                          $("#imagegrid").append('<a href="https://www.facebook.com/'+response[i].actor_id+'" target="_blank"><img src="https://graph.facebook.com/'+response[i].actor_id+'/picture" width="30" height="30"></a>');
                        }
                      }
                    }
                    console.log(startdate);
                    console.log(enddate);
                    console.log(postids.length);
                    doResponse();
                  }
          );
        }
        });
  });
  });

  function doResponse(){
    var myresponse = "Thank you!"
    for(var i = 0; i < postids.length; i++) {
      console.log(postids[i]);
      FB.api('/'+postids[i]+'/comments', 'post', { message: myresponse }, function(response) {
        if (!response || response.error) {
        }
      });
    }
    $("#numberwishes").html(postids.length);
    $(".everythingdone").show();
    $("#imagegrid").show();
    $("#logout").hide();
  }

  function dologin(){
    FB.login(function(response) {
      if(response.authResponse) {
        $("#login").hide();
        $("#respondbutton").show();
        $("#logout").show();
      }
      else {
        //login was cancelled
      }
    }, {scope: 'user_birthday, read_stream, publish_stream'});
  }

  $("#logout").click(function() {
    FB.logout(function() {
      $("#login").show();
      $("#respondbutton").hide();
      $("#logout").hide();
      $("h2").show();
      $(".everythingdone").hide();
      $("#imagegrid").hide();
    });
  });

  // Load the SDK asynchronously
  (function(d){
     var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement('script'); js.id = id; js.async = true;
     js.src = "http://connect.facebook.net/en_US/all.js";
     ref.parentNode.insertBefore(js, ref);
   }(document));

});