import { io } from "socket.io-client"
import Experience from './Experience.js'


export default class SocketMessenger
{
    constructor()
    {
        this.experience = new Experience()
        this.world = this.experience.world
        this.socket = io('https://seal-app-hivs4.ondigitalocean.app')

        this.socket.on('connect', () => {
            console.log('connected_to_server, adding player')
            const selfPlayer = this.world.getSelfPlayer()
            const playerData = {
                name: selfPlayer.name,
                position: selfPlayer.position,
                id: selfPlayer.id
            }
            this.socket.emit("register_player", playerData)
        })

        // Listen for disconnection
        this.socket.on("player_disconnected", (data) => {
            // remove disconnected player
            console.log("player disconnected: ", data)
        })

        this.socket.on('server_response', (data) => {
            console.log('yaaaay ', data)
        })

        this.socket.on("player_added", (data) => {
            console.log('new player added: ', data)
            if (data.client_id == this.selfPlayer.id) {
                this.selfPlayer.serverId = data.id
            } else {
                this.world.addPlayer(data)
            }
            
        })

        this.listenToPlayerPositionUpdates()
    }

    listenToPlayerPositionUpdates() {
        this.socket.on('player_position_updated', (data) => {
            const playerId = data.player_id
            const playerPosition = data.player_position
            this.world.updatePlayerPosition(playerId, playerPosition)
        })
    }

    sendPlayerPositionUpdated(player) {
        this.socket.emit('update_player_position', {
            playerId: player.id,
            position: player.position
        })
    }

    sendObjectPosition(objectId, objectPosition) {
        // TODO: update the positions of the stems shapes
    }
}