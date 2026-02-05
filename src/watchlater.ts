import * as Extractor from "./youtubeExtractor"
import * as Cleaners from "./watchLaterCleaners"

document.addEventListener('yt-navigate-finish', () => {
    console.log('YouTube navigation finished');
    if (window.location.href.endsWith("playlist?list=WL"))
    {
        Cleaners.cleanWatchLaterPage()
    }
    else if (window.location.href.includes("/watch") && window.location.href.includes("list=WL"))
    {
        let player : HTMLVideoElement | null = Extractor.extractPlayer() as HTMLVideoElement
        if (player)
        {
            let triggered = false;
  
            player.addEventListener('timeupdate', () => {
                if (triggered) return;

                const percent = (player.currentTime / player.duration) * 100;

                if (percent >= 50) {
                  triggered = true;
                  Cleaners.cleanPlayingVideo()
                }
            });
        }
    }
})
