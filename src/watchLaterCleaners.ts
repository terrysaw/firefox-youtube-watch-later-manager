import * as Extractor from "./youtubeExtractor"

export function cleanWatchLaterPage() : boolean
{
    let success : boolean = true
    let playlist_videos : HTMLElement | null = Extractor.extractWatchLaterPagePlaylist()
    if (playlist_videos)
    {
        let videos : HTMLCollection = playlist_videos.children
        console.log(`Video count: ${videos.length}`)
        for (var i = 0; i < videos.length; i++)
        {
            let video = videos[i];
            let button : HTMLElement | null = Extractor.extractOptionsButton(video)
            let percent : number = Extractor.extractWatchedPercent(video)
            console.log(`Watched percent: ${percent}`)
            if (percent > 80)
            {
                if (button === null || typeof(button) === "undefined")
                {
                    console.log("Options button undefined")
                    success = false
                    return success
                }

                button.click()

                let removeButton : HTMLButtonElement | undefined = undefined
                new Promise(() =>
                {
                    setTimeout(() =>
                    {
                        removeButton = Extractor.extractRemoveButton() as HTMLButtonElement | undefined
                    }, 10)
                })
                .then(() =>
                {
                  if (typeof(removeButton) !== "undefined")
                  {
                      removeButton.click()
                  }
                  else
                  {
                      success = false
                  }
                })
            }
        }
    }

    return success;
}


export function cleanPlayingVideo() : boolean
{
    (document.querySelector("ytd-popup-container") as HTMLElement).style.setProperty("opacity", "0", "important")
    let success : boolean = true
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
        for (let i = 0; i < 3; i++) 
        {
            setTimeout(() => 
            {
              document.dispatchEvent(new KeyboardEvent(
                'keydown', 
                {
                    key: 'Escape',
                    keyCode: 27,
                    which: 27,
                    bubbles: true,
                    cancelable: true
                }
              ));
            }, i * 800);
        }
              
        setTimeout(() =>
                {
                    (document.querySelector("ytd-popup-container") as HTMLElement).style.opacity = "1"
                }, 2000)
    }
    else
    {
        success = false;
    }

    return success;
}
