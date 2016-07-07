

var player_init = function(songs){
	Amplitude.init({
	"songs": songs,
	"default_album_art": "images/no-cover.png",
	"dynamic_mode" : true
});
}

$('.amplitude-play-pause').click(function(){
   togglePlay();
});

$(".song-playlist-x").click(function(event){
	event.preventDefault();
	
	playing = false;
});

var playing = false;

var togglePlay = function(){
	if(playing){
       $('#play-button').html('<i class="material-icons">play_arrow</i>');
       playing = false;
   } 
   else{
       $('#play-button').html('<i class="material-icons">pause</i>');
       playing = true;
   }
}


var init = function(){
	var songs_playlist = [];
	
	$('#playlist li').each(function(index, element){
		var temp_song = {};
		temp_song['name'] = $('.song-playlist-x', element).text();
		temp_song['url'] = $('.song-playlist-x', element).attr('href');
		
		songs_playlist.push(temp_song);
	});
	
	console.log(songs_playlist);
	player_init(songs_playlist);
}

$('#song-search').click(function(event) {
	$('#search_results').html('<div class="preloader-wrapper big active"><div class="spinner-layer spinner-blue-only"><div class="gap-patch"><div class="circle"></div></div></div></div>')
    $.get("/search/"+$('#search_term').val(), function(data, status){
        $('#search_results').html(data);
        $('.song_get_youtube').click(function(event) {
    		event.preventDefault();
    		$.get($(this).attr('href'),function(data){
    		console.log(data);
    		if(data == "Song Already Exists"){
    			alert(data);
    		}
    		else{
    			
    			var len_song = $('#playlist li').length;
    			var newSong = '<div class="amplitude-play-pause amplitude-paused clicked-not-handled col s10" amplitude-song-index="'+ len_song +'"><a class="song-playlist-x" href="/audio/'+data.youtube_id+'"><span class="truncate">'+data.title+'</span></a></div>';
    			//newSong.addEventListener('click', Amplitude.clickHandler);
    			var new_l_ele = $('<li class="row"/>');
    			$(new_l_ele).append(newSong);
    			$(new_l_ele).append('<a href="/audio/'+data.youtube_id+'"><i class="material-icons col s2 md-18">file_download</i></a>')
    			
    			window.setTimeout( function(){
    			$('#playlist').append(new_l_ele);
    			$('.clicked-not-handled').click(Amplitude.clickHandler);
    			$('.clicked-not-handled').click(function(event){
					event.preventDefault();
					playing = false;
					togglePlay();
				});
    			$('.clicked-not-handled').removeClass('clicked-not-handled');
    			Amplitude.addSong({
    				'name': data.title,
    				'url': '/audio/'+data.youtube_id
    			});
    			}, 10000 );
    			
    		}
    });
});
    });
})
init();