
document.addEventListener('yt-navigate-finish', () => {
  console.log('YouTube navigation finished');
  if (window.location.href.endsWith("playlist?list=WL"))
  {
	setTimeout(()=>{}, 5000)
  	let playlist_videos : HTMLElement | null = document.querySelector("ytd-playlist-video-list-renderer>#contents")
  	if (playlist_videos)
  	{
		let videos : HTMLCollection = playlist_videos.children
		console.log(videos.length)
  		for (var i = 0; i < videos.length; i++)
  		{
			let video = videos[i];
			let button : HTMLButtonElement | null = video?.querySelector("#menu>ytd-menu-renderer>yt-icon-button")
			button?.click()
  			console.log(video)
			break;
  		}
  	}
  	else
  	{
  		alert("Couldn't find playlsit videos")
  	}
  }
})
