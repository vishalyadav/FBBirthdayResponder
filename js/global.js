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

  function dologin(){
    FB.login(function(response) {
      if(response.authResponse) {
        testAPI();
      }
      else {
        //login was cancelled
      }
    }, {scope: 'user_birthday'});
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