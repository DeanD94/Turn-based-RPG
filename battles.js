const battle = {
    initiated: false
}

const battleBackground = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    image: battleBackgroundImage
})

//sprite variables
let mageSprite
//let embySprite
let draggleSprite
let renderedSprites

//our attack queue
let queue


//animate()
initBattle()
animateBattle()

//hide the dialogue box when the player clicks
document.querySelector('#attackDialogueBox').addEventListener('click', (e) => {
    //if queue has an item, call our enemy attack function /w populated attack
    if (queue.length > 0) {
        queue[0]()
        queue.shift()
        //when queue is empty hide dialogue box
    } else e.currentTarget.style.display = 'none'
    console.log('clicked dialogue')
})