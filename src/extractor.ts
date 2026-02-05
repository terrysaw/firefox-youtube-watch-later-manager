export function extractPlaylist() : HTMLElement | null
{
        return document.querySelector("ytd-playlist-video-list-renderer>#contents")
}

export function extractPlaylistWatchedPercent(video : HTMLElement | null) : number
{
    let watchedPercent = 0
    let playbackNode : HTMLElement | null | undefined = video?.querySelector("#progress")
    if (typeof(playbackNode) !== "undefined" && playbackNode != null)
    {
        watchedPercent = parseInt(playbackNode.style.width.replace("%", ""))
    }
    return watchedPercent
}

export function extractPlaylistActionButton(video : HTMLElement | null) : HTMLElement | null
{
    if (!video)
    {
        return null;
    }

    return video?.querySelector("button[aria-label^=\"Action\"]")
}

export function extractPlaylistRemoveButton() : HTMLElement | null
{
    // The remove from Watch Later button doesn't actually have a button with an aria-label, so we will have to get it this way
    return document.querySelector("ytd-popup-container>tp-yt-iron-dropdown>div>ytd-menu-popup-renderer>tp-yt-paper-listbox")?.children[2] as HTMLElement | null
}

export function extractPlayer() : HTMLVideoElement | null
{
    return document.querySelector("video")
}

export function extractPlayerMenuButton() : HTMLButtonElement | null
{
    return document.querySelector("yt-button-shape#button-shape>button") as HTMLButtonElement | null
}

export function extractPlayerSaveButton() : HTMLButtonElement | null
{
    let topRow : HTMLDivElement | null = document.querySelector("div#top-row")
    if (topRow)
    {
        let saveButton : HTMLButtonElement | null = topRow.querySelector("button[aria-label^=\"Save\"]")
        if (saveButton)
        {
            return saveButton
        }

        extractPlayerMoreButton()?.click()
        new Promise(() => {
            setTimeout(()=>{}, 500)
        })
        return document.querySelector("button[aria-label^=\"Save\"]")
    }

    return null;
}

export function extractPlayerMoreButton() : HTMLButtonElement | null
{
    let topRow : HTMLDivElement | null = document.querySelector("div#top-row")
    if (topRow)
    {
        return topRow?.querySelector("button[aria-label^=\"More\"]")
    }

    return null;
}

export function extractPlayerWatchLaterButton() : HTMLButtonElement | null
{
    return document.querySelector("yt-list-item-view-model[aria-label^=\"Watch later\"]")
}

export function extractInWatchLater(watchLaterButton : HTMLElement) : boolean
{
    // This specific path element with this specific vector data is used to indicate whether a video is in the Watch Later playlist
    let inPlaylistFlag : HTMLElement | null = watchLaterButton.querySelector("path[d=\"M19 2H5a2 2 0 00-2 2v16.887c0 1.266 1.382 2.048 2.469 1.399L12 18.366l6.531 3.919c1.087.652 2.469-.131 2.469-1.397V4a2 2 0 00-2-2Z\"]")
    return inPlaylistFlag !== null
}
