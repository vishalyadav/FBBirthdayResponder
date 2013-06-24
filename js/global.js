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
	$("#login").click(function(){
    FB.getLoginStatus(function(response) {
      if(response.status === 'connected') {
        testAPI();
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
  $("#doeverything").click(function(){
    FB.api(
    {
      method: "fql.query",
      query: "SELECT birthday_date FROM user WHERE uid = me()"
    },
        function(response) {
          var birthday = response[0].birthday_date.split("/");
          var startdate = new Date(birthday[2], birthday[0], birthday[1], 0, 0, 0, 0);
          var enddate = new Date(birthday[2], birthday[0], birthday[1], 23, 59, 59, 999);
          startdate = Math.round(startdate.getTime()/1000);
          enddate = Math.round(enddate.getTime()/1000);
          var testdate = new Date(2013, 5, 16);
          testdate = Math.round(testdate.getTime()/1000);
          ttt = new Date(2013, 5, 16, 23, 59, 59, 999);
          ttt = Math.round(ttt.getTime()/1000);
          FB.api(
          {
            method: "fql.query",
            query: "SELECT read_stream FROM permissions WHERE uid = me()"
          },
            function(response) {
              console.log(response[0].read_stream);   //indicates we are reading the stream
              FB.api(
              {
                method: "fql.query",
                query: "SELECT post_id,message,comments FROM stream WHERE source_id = me() AND filter_key = 'others'"
              },
                  function(response) {
                    for(var i = 0; i < response.length; i++) {
                      if (response[i].message.length != 0) {
                        postids.push(response[i].post_id);
                      }
                    }
                    console.log(postids.length);
                    doResponse();
                  }
          );
        });
  });
  });

  function doResponse(){
    console.log(postids[0]);
  }

  function dologin(){
    FB.login(function(response) {
      if(response.authResponse) {
        testAPI();
      }
      else {
        //login was cancelled
      }
    }, {scope: 'user_birthday, read_stream, publish_stream'});
  }
  // Load the SDK asynchronously
  (function(d){
     var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement('script'); js.id = id; js.async = true;
     js.src = "http://connect.facebook.net/en_US/all.js";
     ref.parentNode.insertBefore(js, ref);
   }(document));

  function testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
      console.log('Good to see you, ' + response.name + '.');
    });
  }
});