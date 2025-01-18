import * as THREE from 'three'

import { v4 as uuidv4 } from 'uuid'
import Experience from '../Experience'

export class Player
{
    constructor(data)
    {
        this.experience = new Experience()
        this.name = data.name
        this.position = data.position
        this.id = uuidv4()
        this.serverId = null
        this.isSelf = data.self

        if (!this.isSelf) {
            this.mesh = this.renderPlayerModel()
            this.experience.scene.add(this.mesh)
        }
        this.updatePosition(this.position)
    }

    renderPlayerModel() {
        const geometry = new THREE.SphereGeometry(0.3)
        const material = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            }
        )

        const mesh = new THREE.Mesh(geometry, material)

        return mesh
    }

    delete () {
        // TODO: remove from scene, dispose geometry etc
    }

    update () {

    }

    updatePosition(position) {
        this.position.x = this.position.x
        this.position.y = this.position.y
        this.position.z = this.position.z

        if (!this.isSelf && this.mesh) {
            this.mesh.position.x = this.position.x
            this.mesh.position.y = 5//this.position.y * 2
            this.mesh.position.z = this.position.z
        }
    }

    updatePosition(position) {
        this.position.x = position.x
        this.position.y = position.y
        this.position.z = position.z
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