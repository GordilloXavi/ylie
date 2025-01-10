import * as THREE from 'three'
import Experience from "../Experience"

class StemObject {
    constructor (audio_buffer, position, color) { ///, position, color) { // TODO: add position and color
        this.experience = new Experience()
        this.auaudio_buffer = audio_buffer

        this.mesh = this.createMesh(color)
        this.mesh.position.set(position.x, position.y, position.z)

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
        const geometry = new THREE.BoxGeometry(.3, .3, .3)
        const material = new THREE.MeshBasicMaterial({ color: color })
        const cube = new THREE.Mesh(geometry, material)

        return cube
    }

    playSound() {
        this.positionalSound.play()
    }

    update () {
        this.mesh.rotation.x += this.experience.time.delta
        this.mesh.rotation.y += this.experience.time.delta
    }
}

export default class StemObjectGroup {
    constructor () {
        // TODO: here we will need to pass arguments with the audio paths, the positions and the models
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

        /*
        this.bass_stem_object.playSound()
        this.drums_stem_object.playSound()
        this.guitars_stem_object.playSound()
        this.synths_stem_object.playSound()
        this.vocals_stem_object.playSound()
        */
    }

    playAllSounds() {
        if (! this.bass_stem_object.isPlaying() ) {
            console.log('trying to start play')
            this.bass_stem_object.playSound()
            this.drums_stem_object.playSound()
            this.guitars_stem_object.playSound()
            this.synths_stem_object.playSound()
            this.vocals_stem_object.playSound()
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