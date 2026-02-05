import * as Extractor from "./youtubeExtractor"

export function cleanWatchLaterPage(percentCheckOnly : boolean, percentThreshold : number) : void
{
    let playlist_videos : HTMLElement | null = Extractor.extractPlaylist()
    if (playlist_videos)
    {
        let videos : HTMLCollection = playlist_videos.children
        for (var i = 0; i < videos.length; i++)
        {
            let video : HTMLElement = videos[i] as HTMLElement;
            let button : HTMLElement | null = Extractor.extractPlaylistActionButton(video)
            setTimeout(() => {
                let percent : number = Extractor.extractPlaylistWatchedPercent(video)
                if (percent > percentThreshold || (!percentCheckOnly && percent > 0))
                {
                    if (button === null || typeof(button) === "undefined")
                    {
                        return
                    }

                    button.click()

                    let removeButton : HTMLButtonElement | undefined = undefined
                    setTimeout(() => {
                        removeButton = Extractor.extractPlaylistRemoveButton() as HTMLButtonElement | undefined
                          if (typeof(removeButton) !== "undefined")
                          {
                              removeButton.click()
                          }
                    }, 200)
                }
            }, 500 * i);
        }
    }
}


export function cleanPlayingVideo() : void
{
    (document.querySelector("ytd-popup-container") as HTMLElement).style.setProperty("opacity", "0%", "!important")
    let saveButton : HTMLButtonElement | null = Extractor.extractPlayerSaveButton()

    if (saveButton)
    {
        saveButton.click()
        // Wait 500ms to allow WatchLater button to appear
        setTimeout(() => {
            let watchLaterButton : HTMLButtonElement | null = Extractor.extractPlayerWatchLaterButton() 
            if (watchLaterButton)
            {
                let isInWatchLater : boolean = Extractor.extractInWatchLater(watchLaterButton)
                if (isInWatchLater)
                {
                    watchLaterButton.click()
                }
            }
        }, 750)
              
    }

    setTimeout(() => {
                (document.querySelector("ytd-popup-container") as HTMLElement).style.opacity = "100%"
    }, 900)
}
