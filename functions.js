function rectangleCollision({ rectangle1, rectangle2 }) {
    return (rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y + rectangle1.height / 2 <= rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y)
}
function animate() {
    const animationId = window.requestAnimationFrame(animate)
    background.draw()
    // boundaries.forEach(boundary => {
    //     boundary.draw()
    // })
    // battlezones.forEach(battlezone => {
    //     battlezone.draw()
    // })

    // interactzones.forEach(interactzone => {
    //     interactzone.draw()
    // })
    player.draw()
    merchant.draw()
    foreground.draw()

    player.animate = false

    if (battle.initiated) return
    if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
        for (let i = 0; i < battlezones.length; i++) {
            const battlezone = battlezones[i]
            const overlappingArea = (Math.min(player.position.x + player.width, battlezone.position.x + battlezone.width)
                - Math.max(player.position.x, battlezone.position.x)) * (Math.min(player.position.y + player.height, battlezone.position.y + battlezone.height)
                    - Math.max(player.position.y, battlezone.position.y))
            if (
                rectangleCollision({
                    rectangle1: player,
                    rectangle2: battlezone
                }) && overlappingArea > (player.height * player.width) / 2
                && Math.random() < 0.02
            ) {
                console.log("battle activated")
                audio.map.stop()
                audio.initBattle.play()
                audio.battle.play()
                battle.initiated = true
                // deactivate current animation loop
                window.cancelAnimationFrame(animationId)
                gsap.to('#overlappingDiv', {
                    opacity: 1,
                    repeat: 3,
                    yoyo: true,
                    duration: 0.3,
                    onComplete() {
                        gsap.to('#overlappingDiv', {
                            opacity: 1,
                            duration: 0.3,
                            onComplete() {
                                initBattle()
                                animateBattle()
                                gsap.to('#overlappingDiv', {
                                    opacity: 0,
                                    duration: 0.3
                                })
                            }
                        })

                    }

                })
                break
            }
        }
    }
    let canInteract = false
    for (let i = 0; i < interactzones.length; i++) {
        const interactzone = interactzones[i]
        if (
            rectangleCollision({
                rectangle1: player,
                rectangle2: interactzone
            })
        ) {
            canInteract = true
        }
    }

    if (keys.e.pressed && lastPress === 'e' && canInteract) {
        player.animate = false
        console.log("inside of if e pressed")
        player.interact()

    }

    if (keys.w.pressed && lastPress === 'w') {
        player.animate = true
        player.image = player.sprites.up

        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangleCollision({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary, position: {
                            x: boundary.position.x,
                            y: boundary.position.y + 3
                        }
                    }
                })
            ) {
                player.animate = false
                break
            }
        }

        if (player.animate) {
            movables.forEach((movable) => {
                movable.position.y += 3

            })
        }
    }

    else if (keys.a.pressed && lastPress === 'a') {
        player.animate = true
        player.image = player.sprites.left
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangleCollision({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary, position: {
                            x: boundary.position.x + 3,
                            y: boundary.position.y
                        }
                    }
                })
            ) {
                player.animate = false
                break
            }
        }

        if (player.animate) {
            movables.forEach((movable) => {
                movable.position.x += 3

            })
        }
    }
    else if (keys.s.pressed && lastPress === 's') {
        player.animate = true
        player.image = player.sprites.down
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangleCollision({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary, position: {
                            x: boundary.position.x,
                            y: boundary.position.y - 3
                        }
                    }
                })
            ) {
                player.animate = false
                break
            }
        }


        if (player.animate) {
            movables.forEach((movable) => {
                movable.position.y -= 3

            })
        }
    }
    else if (keys.d.pressed && lastPress === 'd') {
        player.animate = true
        player.image = player.sprites.right
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangleCollision({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary, position: {
                            x: boundary.position.x - 3,
                            y: boundary.position.y
                        }
                    }
                })
            ) {
                player.animate = false
                break
            }
        }


        if (player.animate) {
            movables.forEach((movable) => {
                movable.position.x -= 3

            })
        }
    }
}
// variable for storing animation ID for battle  
let battleAnimationId

function initBattle() {
    draggleSprite = new Monster(monsters.Draggle)
    mageSprite = new Monster(monsters.Mage)
    //embySprite = new Monster(monsters.Emby)
    renderedSprites = [draggleSprite, mageSprite]
    document.querySelector('#uiBox').style.display = 'block'
    document.querySelector('#attackDialogueBox').style.display = 'none'
    document.querySelector('#enemyHealthBar').style.width = '100%'
    document.querySelector('#playerHealthBar').style.width = '100%'
    document.querySelector('#attacksBox').replaceChildren()

    //our attack queue
    queue = []

    mageSprite.attacks.forEach(attack => {
        const attackButton = document.createElement('button')
        attackButton.innerHTML = attack.name
        document.querySelector('#attacksBox').append(attackButton)
    })

    //listen for events for our attacks
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', (e) => {
            const currentAttack = attacks[e.currentTarget.innerHTML]
            mageSprite.attack({
                attack: currentAttack,
                receiver: draggleSprite, renderedSprites
            })

            //check if enemy is still alive
            if (draggleSprite.health <= 0) {
                queue.push(() => {
                    draggleSprite.faint()
                })

                //fade screen to black after winning
                queue.push(() => {
                    gsap.to('#overlappingDiv', {
                        opacity: 1, onComplete() {
                            cancelAnimationFrame(battleAnimationId)
                            animate()
                            gsap.to('#overlappingDiv', {
                                opacity: 0
                            })
                            document.querySelector('#uiBox').style.display = 'none'
                            //allow the player to move again after battle
                            battle.initiated = false
                            audio.map.play()

                        }
                    })
                })

            }
            //enemy attacks here
            const randomAttack = Math.random()
            queue.push(() => {
                if (randomAttack >= 0.5) {
                    draggleSprite.attack({
                        attack: attacks.Tackle,
                        receiver: mageSprite, renderedSprites
                    })
                } else {
                    draggleSprite.attack({
                        attack: attacks.Fireball,
                        receiver: mageSprite, renderedSprites
                    })
                }
                //check if player is still alive
                if (mageSprite.health <= 0) {
                    queue.push(() => {
                        mageSprite.faint()
                    })
                    //fade screen to black after winning
                    queue.push(() => {
                        gsap.to('#overlappingDiv', {
                            opacity: 1, onComplete() {
                                cancelAnimationFrame(battleAnimationId)
                                animate()
                                gsap.to('#overlappingDiv', {
                                    opacity: 0
                                })
                                document.querySelector('#uiBox').style.display = 'none'
                                //allow the player to move again after battle
                                battle.initiated = false
                            }
                        })
                    })
                }
            })

        })

        button.addEventListener('mouseenter', (e) => {
            const currentAttack = attacks[e.currentTarget.innerHTML]
            document.querySelector('#attackTypeBox').innerHTML = currentAttack.type
            document.querySelector('#attackTypeBox').style.color = currentAttack.color
        })
    })

}

//animation scene for battle sequence
function animateBattle() {
    battleAnimationId = window.requestAnimationFrame(animateBattle)
    battleBackground.draw()

    renderedSprites.forEach((sprite) => {
        sprite.draw()
    })
}