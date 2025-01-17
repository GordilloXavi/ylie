import { v4 as uuidv4 } from 'uuid'

export class Player
{
    constructor(data)
    {
        this.name = data.name
        this.position = data.position
        this.id = uuidv4()
        this.serverId = null
        this.isSelf = data.self

        this.renderPlayerModel()
    }

    renderPlayerModel() {
        // TODO: draw a ball or something and later a proper model
    }

    delete () {
        // TODO: dispose geometry etc
    }

    update() {

    }
}


export class PlayerPool 
{
    constructor() {
        this.players = {}
    }

    add(player) {
        this.players[player.id] = player
    }

    delete(playerId) {
        this.players[playerId].delete()
        this.players[playerId] = null
    }

    update() {

    }
}