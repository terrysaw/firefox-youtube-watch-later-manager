export type Options = {
    playlistEnabled: boolean,
    playerEnabled: boolean,
    openPlaylistOnly: boolean,
    percentCheckOnly: boolean,
    percentThreshold: number,
    debug: boolean
}

export const defaultsMap : Options = {
    playlistEnabled: true,
    playerEnabled: true,
    openPlaylistOnly: false,
    percentCheckOnly: true,
    percentThreshold: 50,
    debug: false
}

export type OptionsKey = keyof typeof defaultsMap

export let options : Options

function getValue(selector: string) : string | boolean
{
    let el : Element | null = document.querySelector(selector)
    if (el instanceof HTMLInputElement)
    {
        if (el.type === "checkbox")
        {
            return el.checked
        }

        return el.value
    }

    return ""
}

function setValue(selector: string, value: any) : void
{
    let el : Element | null = document.querySelector(selector)
    if (el instanceof HTMLInputElement)
    {
        if (el.type === "checkbox")
        {
            el.checked = value
            return;
        }

        el.value = value
    }
}

function saveOptions(e: SubmitEvent) : void
{
    e.preventDefault();
    e.stopPropagation();
    let submitter = e.submitter
    if (submitter?.id === "save")
    {
        let toSave : Options = defaultsMap
        for (let key in toSave)
        {
            (toSave as any)[key] = getValue(`#${key}`)
        }
        browser.storage.sync.set(toSave)
    }
    else
    {
        restoreDefaults()
    }
}

function restoreDefaults() : void
{
    let toSave = {}
    for (let key in defaultsMap)
    {
        (toSave as any)[key] = (defaultsMap as any)[key]
    }
    browser.storage.sync.set(toSave)
    .then(restoreOptions)
}

function restoreOptions() : void
{
    function onError(error: Error)
    {
        console.log(`Error: ${error}`)
    }


    let getting = browser.storage.sync.get(Object.keys(defaultsMap));
    getting.then((result) => {
        for (let key in result)
        {
            let value = result[key] !== undefined ? result[key] : (defaultsMap as any)[key]
            setValue(`#${key}`, value)
        }
    }, onError)
}

document.addEventListener("DOMContentLoaded", restoreOptions)
document.querySelector("form")?.addEventListener("submit", saveOptions)
