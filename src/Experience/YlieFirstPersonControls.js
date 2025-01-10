import * as THREE from 'three'

import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js'
import Experience from './Experience'


export default class YlieFirstPersonControls 
{
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.camera = this.experience.camera.instance
        this.controls = new PointerLockControls( this.camera, document.body )

        this.velocity = new THREE.Vector3()
        this.velocityDecay = 0.1
        this.movementSpeed = 10
        this.sprintingMovementSpeed = 27
        this.movementCounter = 0
        this.footstepAmplitude = 80
        this.footstepFreq = 1.2
        this.direction = new THREE.Vector3()
        this.pointerSpeed = 0.6
        this.movingForward = false
        this.movingBackward = false
        this.movingLeft = false
        this.movingRight = false
        this.sprinting = false
        this.justBeganSprinting = false
        this.sprintTime = 0


        document.addEventListener( 'keydown', this.handleKeyDown )
        document.addEventListener( 'keyup', this.handleKeyUp )
        document.addEventListener( 'keypress', this.handleKeyPress)
        document.addEventListener( 'click', this.handleClick)
    }

    isFullScreen () {
        return document.fullscreenElement
    }

    enterFullscreen () {
        this.experience.canvas.requestFullscreen()
    }

    exitFullScreen () {
        document.exitFullscreen()
    }

    handleKeyPress = (event) => {
        if (event.code == 'KeyF') {
            if (!this.isFullScreen()) {
                this.controls.lock()
                this.enterFullscreen()
            } else {
                this.exitFullScreen()
            }
        }
    }

    handleClick = (event) => {
        this.controls.lock()
    }

    handleKeyDown = (event) => {
        switch ( event.code ) {
            case 'ArrowUp':
            case 'KeyW':
                this.movingForward = true
                break
    
            case 'ArrowLeft':
            case 'KeyA':
                this.movingLeft = true
                break
    
            case 'ArrowDown':
            case 'KeyS':
                this.movingBackward = true
                break
    
            case 'ArrowRight':
            case 'KeyD':
                this.movingRight = true
                break
            
            case 'ShiftRight':
            case 'ShiftLeft':
                this.sprinting = true
                this.justBeganSprinting = true
                break
        }
    }

    handleKeyUp = (event) => {
        switch ( event.code ) {
            case 'ArrowUp':
            case 'KeyW':
                this.movingForward = false
                break
    
            case 'ArrowLeft':
            case 'KeyA':
                this.movingLeft = false
                break
    
            case 'ArrowDown':
            case 'KeyS':
                this.movingBackward = false
                break
    
            case 'ArrowRight':
            case 'KeyD':
                this.movingRight = false
                break
    
            case 'ShiftRight':
            case 'ShiftLeft':
                this.sprinting = false
                break
        }
    }

    update() {
        if (this.justBeganSprinting) {
            this.sprintTime = 0
            this.justBeganSprinting = false
        }
        if (this.sprinting) {
            this.sprintTime += this.experience.time.delta
        }

        let currentMovementSpeed = this.sprinting ? this.sprintingMovementSpeed : this.movementSpeed

        this.velocity.x -= this.velocity.x * this.experience.time.delta * 1/this.velocityDecay
        this.velocity.z -= this.velocity.z * this.experience.time.delta * 1/this.velocityDecay

        this.direction.z = Number( this.movingForward ) - Number( this.movingBackward )
        this.direction.x = Number( this.movingRight ) - Number( this.movingLeft )
        this.direction.normalize()

        if ( this.movingForward || this.movingBackward ) this.velocity.z -= this.direction.z * this.experience.time.delta
        if ( this.movingLeft || this.movingRight ) this.velocity.x -= this.direction.x * this.experience.time.delta

        let moveRightAmount = - this.velocity.x * this.experience.time.delta * currentMovementSpeed
        let moveForwardAmount = - this.velocity.z * this.experience.time.delta * currentMovementSpeed

        this.controls.moveRight( moveRightAmount )
        this.controls.moveForward( moveForwardAmount )

        /*
        // Footsteps
        if (moveForward || moveBackward || moveLeft || moveRight) {
            cameraControlParams.movementCounter += this.experience.time.delta
            const footstepHeight = Math.sin(-Math.PI/2 + cameraControlParams.movementCounter * (currentMovementSpeed) / cameraControlParams.footstepFreq) / cameraControlParams.footstepAmplitude + 1/cameraControlParams.footstepAmplitude
            if (footstepHeight * cameraControlParams.footstepAmplitude > 1.5) {
                let footstepPlaying = false
                for (let i = 0; i < footsteps.audios.length && !footstepPlaying; i++) footstepPlaying = footsteps.audios[i].isPlaying
                
                if (!footstepPlaying) {
                    footsteps.audios[footsteps.currentIndex].play()
                    footsteps.currentIndex = (footsteps.currentIndex + 1) % footsteps.audios.length
                }
            }
            // breathing sound
            if (sprinting && sprintTime > 3 && !breathingAudio.isPlaying) {
                breathingAudio.play()
            }
            camera.position.y = cameraControlParams.initialY + footstepHeight
        } else {
            const footstepHeight = Math.sin(-Math.PI/2 + cameraControlParams.movementCounter * (currentMovementSpeed) / cameraControlParams.footstepFreq) / cameraControlParams.footstepAmplitude + 1/cameraControlParams.footstepAmplitude
            if (footstepHeight > 0.0005) {
                camera.position.y = cameraControlParams.initialY + footstepHeight
                cameraControlParams.movementCounter += frameElapsedTime
            } else{
                cameraControlParams.movementCounter = 0
                camera.position.y = cameraControlParams.initialY
            }
        }
        */
    }
}
