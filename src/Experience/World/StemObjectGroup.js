import * as THREE from 'three'
import Experience from "../Experience"

class StemObject {
    constructor (audio_buffer, position, color) {
        this.experience = new Experience()
        this.camera = this.experience.camera.instance
        this.auaudio_buffer = audio_buffer

        this.mesh = this.createMesh(color)
        this.mesh.position.set(position.x, position.y, position.z)
        this.isBeingGrabbed = false

        this.positionalSound = new THREE.PositionalAudio(this.experience.camera.audioListener)
        this.positionalSound.setBuffer( audio_buffer )
        //positionalSound.setRefDistance( audioParams.distanceFactor )
        // positionalSound.setMaxDistance(1) does not work for some reason
        //positionalSound.setRolloffFactor(audioParams.rolloffFactor)
        this.positionalSound.setLoop(true)
        //this.positionalSound.setVolume(audioParams.look1SongVolume)
        this.mesh.add(this.positionalSound)

    }

    isPlaying () {
        return this.positionalSound.isPlaying
    }

    createMesh (color) {
        const geometry = new THREE.IcosahedronGeometry(.3)
        const material = new THREE.MeshStandardMaterial({ color: color })

        const cube = new THREE.Mesh(geometry, material)

        return cube
    }

    playSound() {
        this.positionalSound.play()
    }

    handleClick (rayCaster, event) {
        if (!this.isBeingGrabbed) {
            const intersections = rayCaster.intersectObject(this.mesh)

            if (intersections.length > 0) {
                if (intersections[0].distance < 4){
                    this.isBeingGrabbed = true
                    console.log('intersecting cube')
                }
            }
        } else {
            this.isBeingGrabbed = false
        }
    }

    updatePositionToGrab () {
        console.log('updating pos')
        console.log('cam: ', this.camera)
        const distance = 3.5//this.mesh.position.distanceTo(this.camera.position)

        const cameraDirection = new THREE.Vector3()
        this.camera.getWorldDirection(cameraDirection)

        // Position the cube in front of the camera
        const cameraPosition = new THREE.Vector3()
        this.camera.getWorldPosition(cameraPosition)

        this.mesh.position.copy(
            cameraPosition.add(cameraDirection.multiplyScalar(distance))
        )
        this.mesh.position.y = Math.max(this.mesh.position.y, 0) 
    }

    update () {
        if (this.isBeingGrabbed) {
            this.updatePositionToGrab()
        }
        this.mesh.rotation.x += this.experience.time.delta
        this.mesh.rotation.y += this.experience.time.delta
    }
}

export default class StemObjectGroup {
    constructor () {
        this.experience = new Experience()
        const objectHeight = 0.5

        const bass_stem_position = new THREE.Vector3(2, objectHeight, -11)
        const drums_stem_position = new THREE.Vector3(0, objectHeight, -11)
        const guitars_stem_position = new THREE.Vector3(-4, objectHeight, -11)
        const synths_stem_position = new THREE.Vector3(4, objectHeight, -11)
        const vocals_stem_position = new THREE.Vector3(-2, objectHeight, -11)

        const bass_stem_color = 0x00ff00
        const drums_stem_color = 0xffffff
        const guitars_stem_color = 0xff0000
        const synths_stem_color = 0x0000ff
        const vocals_stem_color = 0xffff00

        this.bass_stem_object = new StemObject(this.experience.resources.items.soul_net_bass, bass_stem_position, bass_stem_color)
        this.drums_stem_object = new StemObject(this.experience.resources.items.soul_net_drums, drums_stem_position, drums_stem_color)
        this.guitars_stem_object = new StemObject(this.experience.resources.items.soul_net_guitars, guitars_stem_position, guitars_stem_color)
        this.synths_stem_object = new StemObject(this.experience.resources.items.soul_net_synths, synths_stem_position, synths_stem_color)
        this.vocals_stem_object = new StemObject(this.experience.resources.items.soul_net_vocals, vocals_stem_position, vocals_stem_color)

        this.experience.scene.add(this.bass_stem_object.mesh)
        this.experience.scene.add(this.drums_stem_object.mesh)
        this.experience.scene.add(this.guitars_stem_object.mesh)
        this.experience.scene.add(this.synths_stem_object.mesh)
        this.experience.scene.add(this.vocals_stem_object.mesh)
    }

    playAllSounds() {
        if (! this.bass_stem_object.isPlaying() ) {
            this.bass_stem_object.playSound()
            this.drums_stem_object.playSound()
            this.guitars_stem_object.playSound()
            this.synths_stem_object.playSound()
            this.vocals_stem_object.playSound()
        }
    }

    getAllInstances() {
        return [
            this.bass_stem_object,
            this.drums_stem_object,
            this.guitars_stem_object,
            this.synths_stem_object,
            this.vocals_stem_object,
        ]
    }

    handleIntersections(rayCaster, event) {
        if (event.type == 'click') {
            let instances = this.getAllInstances()
            instances.forEach((instance, index) => {
                instance.handleClick(rayCaster, event)
            })
        }
    }

    update () {
        this.bass_stem_object.update()
        this.drums_stem_object.update()
        this.guitars_stem_object.update()
        this.synths_stem_object.update()
        this.vocals_stem_object.update()
    }
}