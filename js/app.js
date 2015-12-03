$(document).ready(function(){
	//Phonegap Device Event
	document.addEventListener('deviceready', onDeviceReady,false);
});

function onDeviceReady(){
	$.ajaxSetup({ cache: true });
	$.getScript('//connect.facebook.net/en_US/sdk.js', function(){
    FB.init({
      appId: '175994742752247',
      version: 'v2.3' // or v2.0, v2.1, v2.2, v2.3
    });     
    $('#loginbutton,#feedbutton').removeAttr('disabled');
    FB.getLoginStatus(updateStatusCallback);
  });

	// Login Button Handler
	$('#fb_login').click(function(){
		login();
	});

	// Logout Button Handler
	$('#fb_logout').click(function(){
		logout();
	});

	//Post submit handler
	$('#fb_form').submit(function(e){
		e.preventDefault();
		var post = $('#post').val();
		submitPost(post);
	});
}

function updateStatusCallback(response){
	if (response.status == 'connected'){
		localStorage.setItem("is_logged_in", "1");
	} else if (response.status == 'not_authorized'){
		localStorage.setItem("is_logged_in", "0");
	} else {	
		console.log('You are not authorized and not logged in.')
	}
	refresh();
}

function login() {
	FB.login(function(response) {
		if(response.status == 'connected'){
			localStorage.setItem("is_logged_in", "1");
			refresh();
		}
	}, {scope: 'email, public_profile, user_posts, publish_actions, user_photos'});
}

function refresh(){
	if(localStorage.is_logged_in == "1"){
		getPicture();
		getPosts();
		$('#fb_login').hide();
		$('#fb_logout').show();
		$('#fb_form').show();
		$('.posts').show();
	}else{
		$('#fb_login').show();
		$('#fb_logout').hide();
		$('#fb_form').hide();
		$('.posts').hide();
		removePicture();
	}

}

function getPicture(){
	FB.api('/me/picture', function(response){
		$('#pic').attr('src', response.data.url);

	});
}
function logout(){
	FB.logout(function(response){
		localStorage.setItem("is_logged_in", "0");
		refresh();
	});
}

function removePicture(){
	$('#pic').attr('src', 'img/logo.png');
}

function getPosts(){
	FB.api('/me/feed', function(response){
		if(!response || response.error) {
			console.log('Error occured');
		} else {
			console.log(response.data);
			for(i=0; i<response.data.length; i++){
				if(response.data[i].status_type=='mobile_status_update'){
					var post_html = '<div class="post"' +
						'<p>' + response.data[i].message + '</p>' +
						'<p><em>Posted: ' + response.data[i].created_time+'</em></p></div>';

					$('#fb_posts').append(post_html);
				}
			}
		}
	});
}

function submitPost(post){
	FB.api('/me/feed', 'post', {message: post}, function(response){
		if(!response || response.error) {
			console.log('Error occured');
		} else {
			console.log(response.data);
			var post_html = '<div class="post">' +
			'<p>' + post + '</p>' +
			'</div>';

			$('#fb_posts').prepend(post_html);
		}	
	});
}