const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

const collisionsMap = []
for (let i = 0; i < collisions.length; i += 70) {
    collisionsMap.push(collisions.slice(i, 70 + i))

}

const battlezonesMap = []
for (let i = 0; i < battlezonesData.length; i += 70) {
    battlezonesMap.push(battlezonesData.slice(i, 70 + i))
}

const interactsMap = []
for (let i = 0; i < interacts.length; i += 70) {
    interactsMap.push(interacts.slice(i, 70 + i))
}


const boundaries = []

//create offset to use for positioning things on the map
const offset = {
    x: -1850,
    y: -600
}

//create collisions, going through each row then each tile in that row
collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1025) {
            boundaries.push(
                new Boundary({
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y
                    }
                })
            )
        }
    })
})

const battlezones = []

battlezonesMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1025) {
            battlezones.push(
                new Boundary({
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y
                    }
                })
            )
        }
    })
})

const interactzones = []

interactsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1025) {
            interactzones.push(
                new Boundary({
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y
                    }
                })
            )
        }
    })
})

const image = new Image();
image.src = './img/pokemonTownOne.png';

const foregroundImage = new Image();
foregroundImage.src = './img/foreGroundPokeTown.png';

const playerDownImage = new Image();
playerDownImage.src = './img/playerDown.png';

const playerUpImage = new Image();
playerUpImage.src = './img/playerUp.png';

const playerLeftImage = new Image();
playerLeftImage.src = './img/playerLeft.png';

const playerRightImage = new Image();
playerRightImage.src = './img/playerRight.png';

const battleBackgroundImage = new Image()
battleBackgroundImage.src = "./img/pokemonBattleScene.png"

const merchantImage = new Image()
merchantImage.src = "./img/merchant.png"

const player = new Sprite({
    position: {
        x: canvas.width / 2 - 192 / 8,       // x of character model 192 pixel width of sprite
        y: canvas.height / 2 - 68 / 2      // y of character model 68 pixel height of sprite
    },
    image: playerDownImage,
    frames: {
        max: 4,
        hold: 10
    },
    sprites: {
        up: playerUpImage,
        left: playerLeftImage,
        right: playerRightImage,
        down: playerDownImage
    }
})

const merchant = new Sprite({
    position: {
        x: -218,
        y: 665
    },
    image: merchantImage

})

const background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: image
});

const foreground = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: foregroundImage
});

const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    },
    e: {
        pressed: false
    }
}

const movables = [background, ...boundaries, foreground, ...battlezones, merchant, ...interactzones] //... is the spread operator, will place   all array items in another array


let lastPress = ''
window.addEventListener('keydown', (e) => {

    switch (e.key) {
        case 'w':
            keys.w.pressed = true;
            lastPress = 'w'
            break;
        case 'a':
            keys.a.pressed = true;
            lastPress = 'a'
            break;
        case 's':
            keys.s.pressed = true;
            lastPress = 's'
            break;
        case 'd':
            keys.d.pressed = true;
            lastPress = 'd'
            break;
        case 'e':
            keys.e.pressed = true;
            lastPress = 'e'
            break;
    }
}
)

window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'w':
            keys.w.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
        case 's':
            keys.s.pressed = false;
            break;
        case 'd':
            keys.d.pressed = false;
            break;
        case 'e':
            keys.e.pressed = false;
            break;
    }
}
)

let clicked = false
addEventListener('click', () => {
    if (!clicked) {
        audio.map.play()
        clicked = true
    }
})