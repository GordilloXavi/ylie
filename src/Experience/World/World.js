import * as THREE from 'three'
import Experience from '../Experience.js'
import WaterFloor from './WaterFloor.js'
import StemObjectGroup from './StemObjectGroup.js'

export default class World
{
    constructor()
    {
        this.experience = new Experience()
        this.camera = this.experience.camera.instance
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.rayCaster = new THREE.Raycaster()
        this.players = {}

        // Wait for resources
        this.resources.on('ready', () =>
        {
            // Setup
            this.waterFloor = new WaterFloor()
            this.stemObjectGroup = new StemObjectGroup()

            this.envMap = this.resources.items.skyEnvMap
            this.envMap.mapping = THREE.EquirectangularReflectionMapping
            this.scene.background = this.envMap
            this.scene.environment = this.envMap
            this.scene.backgroundIntensity = 0.7
            this.scene.environmentIntensity = 0.7
        })
    }

    addPlayer(player) {
        this.players[player.id] = {
            id: player.id,
            name: player.name,
            position: player.position
        }
    }

    removePlayer() {
        this.players[player.id] = null
    }

    updatePlayerPosition(playerId, position) {
        this.players[playerId].position = {
            x: position.x,
            y: position.y,
            z: position.z
        }
    }

    handleIntersections () {
        if (this.stemObjectGroup) this.stemObjectGroup.handleIntersections(this.rayCaster)
    }

    handleClick (event) {
        this.stemObjectGroup.handleClick(event)
        console.log('players: ', this.players) // TODO: delete
    }

    update()
    {
        this.rayCaster.setFromCamera(new THREE.Vector2(0, 0), this.camera)
        this.handleIntersections()
        if (this.waterFloor)
            this.waterFloor.update()
        if (this.stemObjectGroup)
            this.stemObjectGroup.update()
    }
}