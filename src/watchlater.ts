import * as Extractor from "./youtubeExtractor"

document.addEventListener('yt-navigate-finish', () => {
    console.log('YouTube navigation finished');
    if (window.location.href.endsWith("playlist?list=WL"))
    {
        let playlist_videos : HTMLElement | null = Extractor.extractWatchLaterPagePlaylist()
        if (playlist_videos)
        {
            let videos : HTMLCollection = playlist_videos.children
            console.log(`Video count: ${videos.length}`)
            for (var i = 0; i < videos.length; i++)
            {
                let video = videos[i];
                let button : HTMLElement | null = Extractor.extractOptionsButton(video)
                //button?.click()
                let percent : number = Extractor.extractWatchedPercent(video)
                console.log(`Watched percent: ${percent}`)
                if (percent > 80)
                {
                    button?.click()
                    setTimeout(() =>
                    {
                        let removeButton : Element | undefined = Extractor.extractRemoveButton();
                        (removeButton as HTMLButtonElement)?.click()
                    }, 10)
                }
            }
        }
        else
        {
            alert("Couldn't find playlsit videos")
        }
    }
})
