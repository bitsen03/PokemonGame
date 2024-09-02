import collisions from "./collisions.js";
import houseCollisions from "./houseCollisons.js";
import respawnMap from "./respawnMonster.js";
import { Boundary, Sprite, Monster, Battle, SpawnerMonster, House } from "./classes.js";
import eventMoveKey from "./help/move/eventMoveKey.js";
import move from "./help/move/moveLogick.js";
import animationUnit from "./help/animationUnit.js";
import rectangleCollisions from "./help/rectangleCollosoons.js";

const canvas = document.querySelector('canvas');

const c = canvas.getContext('2d')
// c.fillRect(0, 0, canvas.width, canvas.height);

canvas.width = 1024;
canvas.height = 576;
const speedAnimation = 20;

const offSet = {
    x: -600,
    y: -250,
}
const offSetHouse = {
    x: -265,
    y: -430,
}
const enemyPosition = {
    position: {
        x: 820,
        y: 140,
    }
}
const myPockemonPosition = {
    position: {
        x: 300,
        y: 330,
    }
}
const BattlePosition = {
    enemyPosition,
    myPockemonPosition,
}

const npcPosition = {
    x: 300, 
    y: 100,
}

const collisionsMap = [];
const collisionsHouse = [];

for (let i = 0; i < collisions.length; i += 70) {
   collisionsMap.push(collisions.slice(i, 70 + i)) 
}

const boundaries = [];

collisionsMap.forEach((row, i) => {
    row.forEach((el, j) => {
        if (el === 1025){
            boundaries.push(
                new Boundary({
                    position: {
                        x: j * 48 + offSet.x,
                        y: i * 48 + offSet.y, 
                    }
                }
            ))
        }
    })
})

for (let i = 0; i < houseCollisions.length; i += 40) {
    collisionsHouse.push(houseCollisions.slice(i, 40 + i)) 
}
const boundariesHouse = [];

collisionsHouse.forEach((row, i) => {
    row.forEach((el, j) => {
        if (el === 39){
            boundariesHouse.push(
                new Boundary({
                    position: {
                        x: j * 40 + offSetHouse.x,
                        y: i * 40 + offSetHouse.y, 
                    },
                    width: 40,
                    height: 40,
                }
            ))
        }
    })
})

const spawnerMap = [];

for (let i = 0; i < respawnMap.length; i += 70) {
    spawnerMap.push(respawnMap.slice(i, 70 + i)) 
}

const renderSpawn = [];




spawnerMap.forEach((row, i) => {
    row.forEach((el, j) => {
        if (el === 1025){
            renderSpawn.push(
                new SpawnerMonster({
                    position: {
                        x: j * SpawnerMonster.width + offSet.x,
                        y: i * SpawnerMonster.height + offSet.y, 
                    },
                    maxEnemy: 1
                })
            )
        }
    })
})


const npcIdleImg = new Image();
npcIdleImg.src = './img/npcIdle.png';

const map = new Image();
map.src = './img/Map.png';

const houseImg = new Image();
houseImg.src = './img/house.png'

const forgegroundMap = new Image();
forgegroundMap.src = './img/forgeground.png';

const playerDownImage = new Image();
playerDownImage.src = './img/playerDown.png';

const playerUpImage = new Image();
playerUpImage.src = './img/playerUp.png';

const playerLeftImage = new Image();
playerLeftImage.src = './img/playerLeft.png';

const playerRightImage = new Image();
playerRightImage.src = './img/playerRight.png';

const battleBacrgoundImg = new Image();
battleBacrgoundImg.src = './img/battleBackground.png';

const myDraggleImg = new Image();
myDraggleImg.src = './img/draggleSprite.png';

const enemyDraggleImg = new Image();
enemyDraggleImg.src = './img/draggleSprite.png';


const enemyDraggle = new Monster({
    ...enemyPosition,
    image: enemyDraggleImg,
    frames: {
        max: 4,
        current: 0,
    },
    powerAttack: 10,
    spells: [
        {
            name: 'fireball',
            type: 'fire',
            imageSrc: './img/fireball.png',
            frames: { max: 4 },
            speedAnimation: 10,
        },
        {
            name: 'Waterball',
            type: 'Water',
            imageSrc: './img/waterball.png',
            frames: { max: 21 },
            speedAnimation: 1,
        }
    ]
})

const myDraggle = new Monster({
    ...myPockemonPosition,
    image: myDraggleImg,
    frames: {
        max: 4,
        current: 0,
    },
    flip:true,
    spells: [
        {
            name: 'fireball',
            type: 'fire',
            imageSrc: './img/fireball.png', 
            frames: { max: 4 },
            speedAnimation: 4,
        },
        {
            name: 'Waterball',
            type: 'Water',
            imageSrc: './img/waterball.png',
            frames: { max: 21 },
            speedAnimation: 4,
        }
    ]
})

const battleBacrgound = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    image: battleBacrgoundImg,
})

const bacrgound = new Sprite({
    position: {
        x: offSet.x,
        y: offSet.y,
    },
    image: map,
})
const forgeground = new Sprite({
    position: {
        x: offSet.x,
        y: offSet.y,
    },
    image: forgegroundMap,
})

const player = new Sprite({
    position: {
        x: canvas.width / 2 - playerDownImage.width / 2, 
        y: canvas.height / 2 - playerDownImage.height / 2,
    },
    image: playerDownImage,
    frames: {
        max: 4,
        current: 0,
    },
    sprites: {
        playerDownImage,
        playerUpImage,
        playerLeftImage,
        playerRightImage,
     }
},)

const house = new Sprite({
    position: {
        x: offSetHouse.x,
        y: offSetHouse.y,
    },
    image: houseImg,
})

const npc = new Sprite({
    position: {
        x: npcPosition.x, 
        y: npcPosition.y,
    },
    image: npcIdleImg,
    frames: {
        max: 4,
        current: 0,
    },
},)

const objDraw = {
    movables: [bacrgound, ...boundaries, forgeground, ...renderSpawn, npc],
    drawables: [bacrgound, ...boundaries, npc, player, forgeground],
    fireballs: [],
    activeEnemy: [],
    collisions: boundaries,
}   


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
    lastKey: ''
}

eventMoveKey(keys);

window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'o' ) {
        renderSpawn.forEach((el) => {
            if (rectangleCollisions({rectangle1:player, rectangle2:el}) && el.haveEnemy ){
                const battleInstance1 = new Battle(myDraggle, el.enemy, battleBacrgound, objDraw, player, BattlePosition, el.haveEnemy);
                if (!battleInstance1.isBattle){
                    battleInstance1.startBattle();
                }
            }
        })
    }
    // if (e.key.toLowerCase() === 'p') {
    //     if (battleInstance1.isBattle){
    //         battleInstance1.endBattle();
    //     }
    // }
});
const houseQ = new House({background:house, objDraw:objDraw, player:player, boundariesHouse});

window.addEventListener('keydown', (e) => {

    if (e.key.toLowerCase() === 'q') {
        if (houseQ.isBattle) {
            houseQ.endBattle();
        } else {
            c.clearRect(0, 0, canvas.width, canvas.height);
            houseQ.startBattle();
        }

    }
});

function animate () {
    renderSpawn.sort(() => Math.random() - 0.5).forEach((el) => el.spawn(objDraw))
    window.requestAnimationFrame(animate);
    [...objDraw.drawables, ...objDraw.fireballs].forEach((el) => el.draw(c));
    [ ...objDraw.fireballs ].forEach((ball) =>{animationUnit(ball, ball.speedAnimation)});
    [enemyDraggle, myDraggle, ...objDraw.activeEnemy, npc].forEach((monster) => animationUnit(monster, speedAnimation));
    move(keys, player, objDraw.collisions, objDraw.movables) 
}

animate();
