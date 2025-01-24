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
        this.id = data.id != null ? data.id : uuidv4()
        this.serverId = data.serverId != null ? data.serverId : null
        this.isSelf = data.self

        if (!this.isSelf) {
            this.mesh = this.renderPlayerModel()
            this.experience.scene.add(this.mesh)
            console.log('rendered player')
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
        this.addNameLabel(mesh)

        return mesh
    }

    addNameLabel(mesh) {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const size = 256
        const distance = mesh.position.distanceTo(this.experience.camera.instance.position)
        const textSize = 256//Math.round(size / distance)
        canvas.width = textSize
        canvas.height = textSize
        ctx.fillStyle = '#ffffff'
        ctx.textAlign = 'center'
        ctx.font = `24px "Courier New", monospace`;
        const text = '<' + this.name + '>'
        ctx.fillText(text, textSize / 2, textSize / 2)

        const texture = new THREE.CanvasTexture(canvas)
        texture.minFilter = THREE.LinearFilter

        const geometry = new THREE.PlaneGeometry(1, 1)
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            side: THREE.DoubleSide
        })

        this.nameLabel = new THREE.Mesh(geometry, material)
        this.nameLabel.position.set(0, 0.5, 0)
        mesh.add(this.nameLabel)
    }

    delete () {
        console.log('deleting player ', this)
        if (this.mesh) {
            this.experience.scene.remove(this.mesh)
    
            if (this.mesh.geometry) this.mesh.geometry.dispose()
            if (this.mesh.material) this.mesh.material.dispose()
    
            this.mesh = null
        }
    }

    update () {
        if (this.isSelf) {
            const oldPosition = new THREE.Vector3().copy(this.position)
            this.updatePosition(this.experience.camera.instance.position)

            if (oldPosition.x !== this.position.x || oldPosition.y !== this.position.y || oldPosition.z !== this.position.z) {
                const currentTime = this.experience.time.elapsed
                if (!this.lastUpdateTime || currentTime - this.lastUpdateTime >= 50) {
                    this.lastUpdateTime = currentTime
                    console.log('sending player position')
                    this.experience.socketMessenger.sendPlayerPositionUpdated(this)
                }
            }
        } else if (this.mesh) {
            // interpolate mesh position to object position
            this.mesh.position.lerp(this.position, 0.1)

            if (this.nameLabel) {
                this.nameLabel.lookAt(this.experience.camera.instance.position)
                const distanceToCamera = this.mesh.position.distanceTo(this.experience.camera.instance.position)
                const textSize = distanceToCamera / 10
                this.nameLabel.scale.set(textSize, textSize, 1)
            }
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

    get(playerId) {
        return this.players[playerId]
    }

    delete(playerId) {
        const player = this.get(playerId)

        if (player) {
            player.delete()

            delete this.players[playerId]
        } else {
            console.warn(`Player with ID ${playerId} not found.`)
        }
    }

    getAllPlayers() {
        return Object.values(this.players)
    }

    update() {
        for (const player of this.getAllPlayers()) {
            player.update()
        }
    }
}