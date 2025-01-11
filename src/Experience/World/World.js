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

            //this.ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
            //this.scene.add(this.ambientLight)
            //this.directionalLight = new THREE.DirectionalLight(0xffffff, 1)
            //this.scene.add(this.directionalLight)

            this.envMap = this.resources.items.skyEnvMap
            this.envMap.mapping = THREE.EquirectangularReflectionMapping
            this.scene.background = this.envMap
            this.scene.environment = this.envMap

            // TODO: add fog
        })
    }

    update()
    {
        if (this.waterFloor)
            this.waterFloor.update()
        if (this.stemObjectGroup)
            this.stemObjectGroup.update()
    }
}