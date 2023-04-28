const monsters = {
    Emby: {
        position: {
            x: 200,
            y: 350
        },
        image: {
            src: './img/embySprite.png'
        },
        frames: {
            max: 4,
            hold: 40
        },
        animate: true,
        name: "Emby",
        attacks: [attacks.Tackle, attacks.Fireball, attacks.Torch]

    },
    Draggle: {
        position: {
            x: 600,
            y: 170
        },
        image: {
            src: './img/draggleSprite.png'
        },
        frames: {
            max: 4,
            hold: 80
        },
        animate: true,
        isEnemy: true,
        name: "Draggle",
        attacks: [attacks.Tackle, attacks.Fireball]

    },
    Mage: {
        position: {
            x: 150,
            y: 170
        },
        image: {
            src: './img/mage.png'
        },
        name: "Mage",
        attacks: [attacks.Torch, attacks.Fireball]

    }
}