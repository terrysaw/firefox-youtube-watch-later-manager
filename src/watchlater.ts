import * as Extractor from "./extractor"
import * as Cleaners from "./cleaner"
import { defaultsMap as options } from "./options"

function getOption(option: string) : any
{
    return (options as any)[option]
}

function loadSettings()
{
    let getting = browser.storage.sync.get(Object.keys(options))
    getting.then((results) => {
        for (let key in results)
        {
            (options as any)[key] = results[key]
        }
    })
}

document.addEventListener('yt-navigate-finish', () => {
    if (getOption("playlistEnabled") && window.location.href.endsWith("playlist?list=WL"))
    {
        Cleaners.cleanWatchLaterPage(getOption("percentCheckOnly"), getOption("percentThreshold"))
    }
    else if (getOption("playerEnabled") && window.location.href.includes("/watch") && (!getOption("openPlaylistOnly") || window.location.href.includes("list=WL")))
    {
        let player : HTMLVideoElement | null = Extractor.extractPlayer() as HTMLVideoElement
        if (player)
        {
            let triggered = false;
  
            player.addEventListener('timeupdate', () => {
                if (triggered) return;

                const percent = (player.currentTime / player.duration) * 100;

                if (percent >= 1) {
                  triggered = true;
                  Cleaners.cleanPlayingVideo()
                }
            });
        }
    }
})

loadSettings()
