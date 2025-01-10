import Experience from '../Experience.js'
import Environment from './Environment.js'
import WaterFloor from './WaterFloor.js'

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
            // TODO: add fog
            // TODO: add lights

        })
    }

    update()
    {
        if (this.waterFloor)
            this.waterFloor.update()
    }
}