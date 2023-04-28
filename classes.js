class Sprite {
    constructor({
        position,
        image,
        frames = { max: 1, hold: 10 },
        sprites = [],
        animate = false,
        rotation = 0 }) {
        this.position = position
        this.image = new Image()
        this.frames = { ...frames, val: 0, elapsed: 0 }
        this.image.onload = () => {
            this.width = this.image.width / this.frames.max
            this.height = this.image.height
        }
        this.image.src = image.src

        this.animate = animate
        this.sprites = sprites
        this.opacity = 1
        this.rotation = rotation
    }

    draw() {
        ctx.save()
        ctx.translate(this.position.x + this.width / 2, this.position.y + this.height / 2)
        ctx.rotate(this.rotation)
        ctx.translate(-this.position.x - this.width / 2, -this.position.y - this.height / 2)
        ctx.globalAlpha = this.opacity
        ctx.drawImage(
            this.image,
            this.frames.val * this.width,
            0,
            this.image.width / this.frames.max,
            this.image.height,
            this.position.x,
            this.position.y,
            this.image.width / this.frames.max,
            this.image.height                              // height of character model
        )
        ctx.restore()

        if (!this.animate) return

        if (this.frames.max > 1) {
            this.frames.elapsed++
        }

        if (this.frames.elapsed % this.frames.hold === 0) {
            if (this.frames.val < this.frames.max - 1) {
                this.frames.val++
            } else {
                this.frames.val = 0
            }
        }

    }

    interact() {

        document.querySelector('#npcDialogueBox').innerHTML = "Greetings Traveler, what brings you to the quaint town of Oakbrooke?"
        document.querySelector('#npcInteract').style.display = 'block'
        document.querySelector('#npcInteract').addEventListener('click', (e) => {
            e.currentTarget.style.display = 'none'
            console.log('clicked dialogue')
        })
        console.log("interacting")
    }
    endInteract() {

        document.querySelector('#npcInteract').style.display = 'none'
    }
}

class Monster extends Sprite {
    constructor({
        position,
        image,
        frames = { max: 1, hold: 10 },
        sprites,
        animate = false,
        rotation = 0,
        isEnemy = false,
        name,
        attacks
    }) {
        super({
            position,
            image,
            frames,
            sprites,
            animate,
            rotation
        })
        this.health = 100
        this.isEnemy = isEnemy
        this.name = name
        this.attacks = attacks

    }

    faint() {
        console.log('faint')
        gsap.to(this, {
            opacity: 0
        })
        document.querySelector('#attackDialogueBox').innerHTML = this.name + ' fainted!'
        audio.battle.stop()
        audio.victory.play()
    }

    //we can use gsap.to for animating our sprite. if we want multiple in succession, create timeline and use that with multiple .to()
    attack({ attack, receiver, renderedSprites }) {
        //when we attack we want to unhide our dialogue box
        document.querySelector('#attackDialogueBox').style.display = 'block'
        document.querySelector('#attackDialogueBox').innerHTML = this.name + ' used ' + attack.name
        let healthBar = '#enemyHealthBar'

        switch (attack.name) {
            case 'Tackle':
                const tl = gsap.timeline()
                receiver.health = receiver.health - attack.damage

                let movementDistance = 20
                if (this.isEnemy) movementDistance = -20

                if (this.isEnemy) healthBar = '#playerHealthBar'
                tl.to(this.position, {
                    x: this.position.x - 20
                }).to(this.position, {
                    x: this.position.x + 40,
                    duration: 0.1,
                    //enemy being hit
                    onComplete: () => {
                        gsap.to(healthBar, {
                            width: receiver.health + '%'
                        })
                        gsap.to(receiver.position, {
                            x: receiver.position.x + 10,
                            yoyo: true,
                            repeat: 4,
                            duration: 0.08
                        })
                        gsap.to(receiver, {
                            opacity: 0,
                            repeat: 5,
                            yoyo: true,
                            duration: 0.08
                        })
                        audio.tackleHit.play()
                    }
                }).to(this.position, {
                    x: this.position.x
                })
                break
            case 'Fireball':
                receiver.health = receiver.health - attack.damage
                let rotation = 0
                if (this.isEnemy) {
                    rotation = -2.8
                    healthBar = '#playerHealthBar'
                }

                const fireballImage = new Image();
                fireballImage.src = './img/fireball.png';
                const fireballSprite = new Sprite({
                    position: {
                        x: this.position.x + 200,
                        y: this.position.y + 100
                    },
                    image: fireballImage,
                    frames: {
                        max: 4,
                        hold: 20
                    },
                    animate: true, rotation: rotation
                })

                let receiverPosX = receiver.position.x
                let receiverPosY = receiver.position.y
                if (this.isEnemy) {
                    fireballSprite.position.x = this.position.x
                    fireballSprite.position.y = this.position.y
                    receiverPosX = receiver.position.x + 200
                    receiverPosY = receiver.position.y + 100
                }

                renderedSprites.splice(1, 0, fireballSprite)
                audio.initFireball.play()

                gsap.to(fireballSprite.position, {
                    x: receiverPosX,
                    y: receiverPosY,
                    onComplete: () => {
                        renderedSprites.splice(1, 1)

                        gsap.to(healthBar, {
                            width: receiver.health + '%'
                        })
                        gsap.to(receiver.position, {
                            x: receiver.position.x + 10,
                            yoyo: true,
                            repeat: 4,
                            duration: 0.08
                        })
                        gsap.to(receiver, {
                            opacity: 0,
                            repeat: 5,
                            yoyo: true,
                            duration: 0.08
                        })
                        audio.fireballHit.play()
                    }
                })
                break
            case 'Torch':
                //let burnCount
                receiver.health = receiver.health - attack.damage
                if (this.isEnemy) rotation = -2.8
                if (this.isEnemy) healthBar = '#playerHealthBar'
                const torchX = receiver.position.x + 25
                const torchY = receiver.position.y + 50
                const torchImage = new Image();
                torchImage.src = './img/torch.png';
                const torchSprite = new Sprite({
                    position: {
                        x: torchX,
                        y: torchY
                    },
                    image: torchImage,
                    frames: {
                        max: 4,
                        hold: 20
                    },
                    animate: true
                })
                renderedSprites.splice(1, 0, torchSprite)
                audio.initFireball.play()
                gsap.to(torchSprite.position, {
                    x: torchX,
                    y: torchY,
                    onComplete: () => {
                        renderedSprites.splice(1, 1)

                        gsap.to(healthBar, {
                            width: receiver.health + '%'
                        })
                        gsap.to(receiver.position, {
                            x: receiver.position.x + 10,
                            yoyo: true,
                            repeat: 4,
                            duration: 0.08
                        })
                        gsap.to(receiver, {
                            opacity: 0,
                            repeat: 5,
                            yoyo: true,
                            duration: 0.08
                        })
                        audio.fireballHit.play()
                    }
                })

                break
        }
    }

}
//this is 48 because our map is 12x12 and we zoomed in 4x before importing 
class Boundary {
    static width = 48
    static height = 48
    constructor({ position }) {
        this.position = position
        this.width = 48
        this.height = 48
    }


    draw() {
        ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}