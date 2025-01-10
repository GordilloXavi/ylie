import * as THREE from 'three'
import Experience from "../Experience"

class StemObject {
    constructor (audio_buffer, position, audioListener) { ///, position, color) { // TODO: add position and color
        this.experience = new Experience()
        this.auaudio_buffer = audio_buffer

        this.mesh = this.createMesh()
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

    createMesh () {
        const geometry = new THREE.BoxGeometry(.3, .3, .3)
        const material = new THREE.MeshBasicMaterial({ color: 0xe0ffe0 })
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

        const bass_stem_position = new THREE.Vector3(5, .7, 0)
        const drums_stem_position = new THREE.Vector3(1.545, .7, 4.755)
        const guitars_stem_position = new THREE.Vector3(-4.045, .7, 2.938)
        const synths_stem_position = new THREE.Vector3(-4.045, .7, -2.938)
        const vocals_stem_position = new THREE.Vector3(1.545, .7, -4.755)

        this.bass_stem_object = new StemObject(this.experience.resources.items.soul_net_bass, bass_stem_position)
        this.drums_stem_object = new StemObject(this.experience.resources.items.soul_net_drums, drums_stem_position)
        this.guitars_stem_object = new StemObject(this.experience.resources.items.soul_net_guitars, guitars_stem_position)
        this.synths_stem_object = new StemObject(this.experience.resources.items.soul_net_synths, synths_stem_position)
        this.vocals_stem_object = new StemObject(this.experience.resources.items.soul_net_vocals, vocals_stem_position)

        this.experience.scene.add(this.bass_stem_object.mesh)
        this.experience.scene.add(this.drums_stem_object.mesh)
        this.experience.scene.add(this.guitars_stem_object.mesh)
        this.experience.scene.add(this.synths_stem_object.mesh)
        this.experience.scene.add(this.vocals_stem_object.mesh)

        this.bass_stem_object.playSound()
        this.drums_stem_object.playSound()
        this.guitars_stem_object.playSound()
        this.synths_stem_object.playSound()
        this.vocals_stem_object.playSound()

    }

    update () {
        this.bass_stem_object.update()
    }
}