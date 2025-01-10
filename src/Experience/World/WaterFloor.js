import * as THREE from 'three'
import Experience from '../Experience.js'
import { Water } from 'three/addons/objects/Water.js';

export default class WaterFloor
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        this.normalMap = this.resources.items.waterNormalTexture
        this.normalMap.wrapS = this.normalMap.wrapT = THREE.RepeatWrapping

        this.water = new Water(new THREE.PlaneGeometry(500, 500),
            {
                textureWidth: 2048,
                textureHeight: 2048,
                waterNormals: this.normalMap,
                //sunDirection: new THREE.Vector3(), // this was commented
                sunColor: 0x111111,
                waterColor: 0x111111,
                distortionScale: 3.7,
                fog: true
            }
        )

        this.water.rotation.x = - Math.PI / 2
        this.waterUniforms = this.water.material.uniforms

        this.scene.add(this.water)
    }

    update() {
        this.water.material.uniforms[ 'time' ].value += this.experience.time.delta / 1000
    }
}