import * as THREE from 'three'
import Experience from '../Experience.js'
import WaterFloor from './WaterFloor.js'
import StemObjectGroup from './StemObjectGroup.js'

export default class World
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

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

    handleIntersections (rayCaster, event) {
        this.stemObjectGroup.handleIntersections(rayCaster, event)
    }

    update()
    {
        if (this.waterFloor)
            this.waterFloor.update()
        if (this.stemObjectGroup)
            this.stemObjectGroup.update()
    }
}