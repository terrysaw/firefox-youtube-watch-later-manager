export function extractWatchLaterPagePlaylist() : HTMLElement | null
{
        return document.querySelector("ytd-playlist-video-list-renderer>#contents")
}

export function extractWatchedPercent(video : Element | null) : number
{
    let watchedPercent = 0
    let playbackNode : HTMLElement | null | undefined = video?.querySelector("#progress")
    if (typeof(playbackNode) !== "undefined" && playbackNode != null)
    {
        watchedPercent = parseInt(playbackNode.style.width.replace("%", ""))
    }
    return watchedPercent
}

export function extractOptionsButton(video : Element | null) : HTMLElement | null
{
    if (!video)
    {
        return null;
    }

    return video?.querySelector("#menu>ytd-menu-renderer>yt-icon-button")
}

export function extractRemoveButton() : Element | undefined
{
    return document.querySelector("ytd-popup-container>tp-yt-iron-dropdown>div>ytd-menu-popup-renderer>tp-yt-paper-listbox")?.children[2]
}
