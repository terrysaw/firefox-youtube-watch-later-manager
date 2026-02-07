export type Entity = {
    id: number,
    state: string,
    data: Object
}

export type State = (entity: Entity, stateMachine: StateMachine) => string

export class StateMachine
{
    activeQueue : Array<Entity> = []
    timeout: number
    interval: number = -1
    stateMap: Map<String,State> = new Map()
    retryCount: number = 0
    maxRetry: number = 25

    constructor(timeout: number = 500)
    {
        this.timeout = timeout
    }

    start()
    {
        this.interval = setInterval(() => {
            if (this.activeQueue.length <= 0) return;

            let entity : Entity = this.activeQueue[0]
            let state: string = entity["state"]

            if (state === null || typeof(state) === "undefined")
            {
                this.next()
                return
            }

            let stateCallable : State | undefined = this.stateMap.get(state)

            if (stateCallable && typeof(stateCallable) !== "undefined")
            {
                let newState : string = stateCallable(entity, this)
                if (entity.state !== newState)
                {
                    entity.state = newState
                    this.retryCount = 0
                }
                else
                {
                    this.retryCount += 1
                }

                if (this.retryCount >= this.maxRetry)
                {
                    this.next()
                    this.retryCount = 0
                    alert("ERROR: Too many retries trying to remove from watch later! Please contact the Watch Later Manager author if this persists")
                    return ""
                }
            }
            else
            {
                this.next()
                return
            }

        }, this.timeout)
    }

    addState(stateName: string, state: State)
    {
        this.stateMap.set(stateName, state)
    }

    next()
    {
        this.activeQueue.shift()
        this.retryCount = 0
    }

    end()
    {
        if (this.interval >= 0) clearInterval(this.interval)
    }
}
