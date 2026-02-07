import { defaultsMap as options } from "./options"
import { StateMachine, Entity } from "./statemachine"

type PlaylistVideoEntity = {
    videoElement: HTMLElement
}

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
    // Clean watch later playlist
    if (getOption("playlistEnabled") && window.location.href.endsWith("playlist?list=WL"))
    {
        let videos_container : HTMLElement | null = document.querySelector("ytd-playlist-video-list-renderer>#contents")
        if (videos_container)
        {
            let videos = videos_container.children

            for (var i = 0; i < videos.length; i++) 
            {
                let video : HTMLElement = videos[i] as HTMLElement
                let entity : Entity = {
                    id: i,
                    state: "PLAYLIST_NEW",
                    data: {
                        videoElement: video
                    }
                }

                stateMachine.activeQueue.push(entity)
            }
        }
    }
    // Clean video once watched enough
    else if (getOption("playerEnabled") && window.location.href.includes("/watch") && (!getOption("openPlaylistOnly") || window.location.href.includes("list=WL")))
    {
        if (getOption("percentCheckOnly"))
        {
            let player : HTMLVideoElement | null = document.querySelector("video")
            if (player)
            {
                let triggered = false;
      
                player.addEventListener('timeupdate', () => {
                    if (triggered) return;

                    const percent = (player.currentTime / player.duration) * 100;

                    if (percent >= 1) {
                      triggered = true;
                      let entity : Entity = {
                          id: 0,
                          state: "PLAYER_NEW",
                          data: {}
                      }

                      stateMachine.activeQueue.push(entity)
                    }
                });
            }
        }
        else
        {
            let entity : Entity = {
                id: 0,
                state: "PLAYER_NEW",
                data: {}
            }

            stateMachine.activeQueue.push(entity)
        }
    }
})

loadSettings()

let stateMachine = new StateMachine(50)

/** Playlist states */
stateMachine.addState("PLAYLIST_NEW", (entity, stateMachine) => {
    let entityData = entity.data as PlaylistVideoEntity
    let video : HTMLElement = entityData["videoElement"]
    let watchedPercentDiv : HTMLElement | null = video.querySelector("#progress")
    if (watchedPercentDiv)
    {
        let watchedPercent : number = parseInt(watchedPercentDiv.style.width.replace("%", ""))
        if (!getOption("percentCheckOnly") || watchedPercent > getOption("percentThreshold"))
        {
            return "PLAYLIST_HIDE_POPUPS"
        }
    }

    stateMachine.next()
    return ""
})

stateMachine.addState("PLAYLIST_HIDE_POPUPS", (entity, stateMachine) => {
    (document.querySelector("ytd-popup-container") as HTMLElement)?.style.setProperty("opacity", "0%", "important")
    return "PLAYLIST_ACTION_BUTTON"
})

stateMachine.addState("PLAYLIST_ACTION_BUTTON", (entity, _stateMachine) => {
    let entityData = entity.data as PlaylistVideoEntity
    let video : HTMLElement = entityData["videoElement"]
    let actionButton : HTMLButtonElement | null = video.querySelector("button[aria-label^=\"Action\"]")

    if (actionButton)
    {
        actionButton.click()
        return "PLAYLIST_REMOVE_BUTTON"
    }

    return entity.state
})

stateMachine.addState("PLAYLIST_REMOVE_BUTTON", (entity, _stateMachine) => {
    let actionOptionsPanel : HTMLElement | null = document.querySelector("ytd-popup-container>tp-yt-iron-dropdown>div>ytd-menu-popup-renderer>tp-yt-paper-listbox")

    if (actionOptionsPanel)
    {
        let removeButton : HTMLButtonElement | undefined = actionOptionsPanel.children[2] as HTMLButtonElement | undefined
        if (removeButton && typeof(removeButton) !== "undefined")
        {
            removeButton.click()
            console.log(`Video after click: ${(entity.data as any)["videoElement"]}`)
            return "PLAYLIST_REVEAL_POPUPS"
        }
    }

    return entity.state
})

stateMachine.addState("PLAYLIST_REVEAL_POPUPS", (_entity, stateMachine) => {
    (document.querySelector("ytd-popup-container") as HTMLElement)?.style.setProperty("opacity", "100%", "important")

    stateMachine.next()
    return ""
})

/** Player states */
stateMachine.addState("PLAYER_NEW", (_entity, _stateMachine) => {
    (document.querySelector("ytd-popup-container") as HTMLElement)?.style.setProperty("opacity", "0%", "important")

    return "PLAYER_TRY_SAVE"
})

stateMachine.addState("PLAYER_TRY_SAVE", (entity, _stateMachine) => {
    let saveButton : HTMLButtonElement | null = document.querySelector("button[aria-label^=\"Save\"]")
    if (saveButton)
    {
        saveButton.click()
        return "PLAYER_REMOVE_BUTTON"
    }
    else
    {
        return "PLAYER_MORE_BUTTON"
    }
})

stateMachine.addState("PLAYER_MORE_BUTTON", (entity, _stateMachine) => {
    let topRow : HTMLDivElement | null = document.querySelector("div#top-row")
    if (topRow)
    {
        let moreButton : HTMLButtonElement | null = topRow.querySelector("button[aria-label^=\"More\"]")
        
        if (moreButton)
        {
            moreButton.click()
            
            return "PLAYER_TRY_SAVE"
        }
    }

    return entity.state
})

stateMachine.addState("PLAYER_REMOVE_BUTTON", (entity, _stateMachine) => {
    let watchLaterButton : HTMLButtonElement | null = document.querySelector("yt-list-item-view-model[aria-label^=\"Watch later\"]")

    if (watchLaterButton)
    {
        watchLaterButton.click()
        
        return "PLAYER_REVEAL_POPUP"
    }

    return entity.state
})

stateMachine.addState("PLAYER_REVEAL_POPUP", (entity, stateMachine) => {
    (document.querySelector("ytd-popup-container") as HTMLElement)?.style.setProperty("opacity", "100%", "important")

    stateMachine.next()
    return ""
})

stateMachine.start()
