class Boundary {

    constructor({position, width = 48, height = 48}) {
        this.position = position;
        this.width = width;
        this.height = height;
    }

    draw(c) {
        // c.fillStyle = 'rgb(52,164,161, 0.4)'
        c.fillStyle = 'transparent'
        c.fillRect(this.position.x, this.position.y, this.width , this.height)
    }
}

class Sprite {
    constructor ({position, velocity, image, sprites,  frames = { max: 1, current: 0}}) {
        this.position = position;
        this.image = image;
        this.frames = frames;
        this.sprites = {...sprites}
        this.image.onload = () => {
            this.width = this.image.width / this.frames.max
            this.height = this.image.height 
        }
    }

    draw(c) {

        c.drawImage(
            this.image,
            this.width * this.frames.current,
            0,
            this.width,
            this.height,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );

    }
}

class Spell {
    constructor({name = 'fireball',position, image,  speedAnimation, frames = {max: 1, current:0 }, isDelete}){
        this.name = name;
        this.position = position;
        this.image = image;
        this.frames = frames;
        this.isDelete = isDelete;
        this.speedAnimation = speedAnimation;
        this.image.onload = () => {
            this.width = this.image.width / this.frames.max
            this.height = this.image.height 
        }
    }
    delete(){
        this.isDelete = true;
    }

    draw(c) {

        if (this.isDelete){
            return;
        }
        
        c.save(); // Сохраняем состояние контекста

        if (this.flip) {
            c.scale(-1, 1); // Отражаем по оси X
            c.translate(-this.position.x * 2 - this.width, 0); // Корректируем позицию
        }

        c.drawImage(
            this.image,
            this.width * this.frames.current,
            0,
            this.width,
            this.height,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );

        c.restore(); // Восстанавливаем состояние контекста
    }
}

class Monster {
    constructor({position, image, spells, targetWidth, spawner, targetHeight, powerAttack = 10, hp = { maxHp: 100, currentHp: 0}, flip = false, frames = { max: 1, current: 0}}) {
        this.position = position;
        this.image = image;
        this.frames = frames;
        this.hp = hp;
        this.spells = spells;
        this.hp.currentHp = hp.maxHp;
        this.powerAttack = powerAttack;
        this.flip = flip;
        this.isDelete = false;
        this.targetWidth = targetWidth;
        this.targetHeight = targetHeight;
        this.spawner = spawner;  // Сохранение ссылки на спавнер
        this.canAttack = true;
        this.image.onload = () => {
            this.width = this.image.width / this.frames.max;
            this.height = this.image.height;
        }
    }

    delete() {
        this.isDelete = true;
        this.spawner.setHaveEnemy(false);  // Изменение состояния в SpawnerMonster
    }
    

    getHit() {
        let hit = 10;
        let count = 0;
        let freames = 0;
        const start = this.position.x;
        this.canAttack = false;
        const getHiting = () => {
            freames += 1;
            if (freames >= 5){
                hit = hit * -1;
                this.position.x = start + hit
                count += 1;
                freames = 0;
            }
            
            if (count >= 5){
                this.position.x = start;
                this.canAttack = true;
                return;
            }

            requestAnimationFrame(getHiting);
        }   
        requestAnimationFrame(getHiting);
    }

    draw(c) {

        if (this.isDelete){
            return;
        }

        c.save();

        let scaleX = this.targetWidth === undefined ? 1 : this.targetWidth / this.width;
        let scaleY = this.targetHeight === undefined ? 1 : this.targetHeight / this.height;

        if (this.flip) {
            c.scale(-scaleX, scaleY);
            c.translate(-this.position.x * 2 - this.width, 0);
        } else {
            c.scale(scaleX, scaleY);
        }
        c.drawImage(
            this.image,
            this.width * this.frames.current,
            0,
            this.width,
            this.height,
            this.position.x / scaleX,
            this.position.y / scaleY,
            this.width,
            this.height
        );

        c.restore();
    }

    attack(enemy, speed, spellName){

        const spell = this.spells.find(s => s.name === spellName);

        if (!spell) {
            console.error('Spell not found!');
            return;
        }

        const spellImg = new Image();
        spellImg.src = spell.imageSrc

        const spellAttack = new Spell({
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            name: this.spells.name,
            image: spellImg,
            speedAnimation: spell.speedAnimation,
            frames: {
                max: spell.frames.max,
                current:0,
            },
        })

        enemy.hp.currentHp -= this.powerAttack;

        const deltaX = enemy.position.x  - spellAttack.position.x;
        const deltaY = enemy.position.y - spellAttack.position.y;
        const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
        const speedX = (deltaX / distance) * speed;
        const speedY = (deltaY / distance) * speed;
        const isMovingRight = deltaX > 0;

        const moveSpellAttack = () => {
            
            spellAttack.position.x += speedX; 
            spellAttack.position.y += speedY;

            if (
                (isMovingRight && spellAttack.position.x >= enemy.position.x) || 
                (!isMovingRight && spellAttack.position.x <= enemy.position.x)
            ) {
                spellAttack.delete();
                enemy.getHit();
                return; 
            }
    
            requestAnimationFrame(moveSpellAttack);
        }
    
        requestAnimationFrame(moveSpellAttack);

        return spellAttack;
    }
}

class SpawnerMonster {
    static width = 48;
    static height = 48;

    constructor({position, maxEnemy = 1, haveEnemy = false}) {
        this.position = position;
        this.width = SpawnerMonster.width;
        this.height = SpawnerMonster.height;
        this.maxEnemy = maxEnemy;
        this.haveEnemy = haveEnemy;
        this.enemy = null;
    }

    setHaveEnemy(value) {
        this.haveEnemy = value;
    }

    draw(c) {
        c.fillStyle = 'red';
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    spawn(objDraw) {

        if (objDraw.activeEnemy.length < this.maxEnemy && !this.haveEnemy) {
            const enemyDraggleImg = new Image();
            enemyDraggleImg.src = './img/draggleSprite.png';
            this.haveEnemy = true;
            const enemy = new Monster({
                position: {
                    ...this.position
                },
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
                ],
                targetWidth: this.width,
                targetHeight: this.height,
                spawner: this,  // Передаем ссылку на текущий объект SpawnerMonster
            });
            this.enemy = enemy;
            objDraw.activeEnemy.push(enemy);
            objDraw.movables.push(enemy);
            objDraw.drawables.push(enemy);
        }

    }
}


class Battle {
    constructor(myMonster, enemy, battleBackground, objDraw, player, BattlePosition) {
        this.myMonster = myMonster;
        this.enemy = enemy;
        this.player = player;
        this.startMyMonsterPosition = {...this.myMonster.position}
        this.startEnemyPosition = {...this.enemy.position}
        this.BattlePosition = BattlePosition;
        this.battleBackground = battleBackground;
        this.objDraw = objDraw;
        this.copyObjDraw = {...this.objDraw}

        this.enemyTextHp = document.querySelector('.EnemyHpBar > .textHp');
        this.currentHpEnemy = document.querySelector('.currentHpEnemy');

        this.myTextHp = document.querySelector('.myHpBar > .textHp');
        this.currentHpMy = document.querySelector('.currentHpMy');

        this.interfaceBattle = document.querySelector('.interface');
        this.hpBar = document.querySelectorAll('.hpBar');

        this.isBattle = false;
    }

    getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    updateHpBar(character, textHpElement, currentHpElement) {
        textHpElement.textContent = `${character.hp.currentHp}/${character.hp.maxHp}`;
        currentHpElement.style.width = `${(character.hp.currentHp / character.hp.maxHp) * 100}%`;
    }

    createSpellInterface() {
        if (this.myMonster.hp.currentHp <= 0) {
            this.displayBattleEndMessage('You lose');
            return;
        }
        
        this.interfaceBattle.innerHTML = '';

        this.enemy.spells.forEach((spell) => {
            const btn = document.createElement('button');
            btn.classList.add('battleBtn');
            btn.textContent = spell.name;

            btn.addEventListener('click', () => {
                const attack = this.myMonster.attack(this.enemy, 10, spell.name);
                this.objDraw.fireballs.push(attack);
                this.updateHpBar(this.enemy, this.enemyTextHp, this.currentHpEnemy);
                this.showAttackResult();
            });

            this.interfaceBattle.appendChild(btn);
        });
    }

    showAttackResult() {
        const button = document.createElement('button');
        button.classList.add('battleBtn');

        if (this.enemy.hp.currentHp <= 0) {
            this.displayBattleEndMessage('You win');
            return;
        }

        button.textContent = `You hit him for ${this.myMonster.powerAttack}. Enemy has ${this.enemy.hp.currentHp} HP left.`;
        this.interfaceBattle.innerHTML = '';

        button.addEventListener('click', () => {
            const randomSpell = this.enemy.spells[this.getRandomInt(this.enemy.spells.length)].name;
            const attack = this.enemy.attack(this.myMonster, 10, randomSpell);
            this.objDraw.fireballs.push(attack);
            this.updateHpBar(this.myMonster, this.myTextHp, this.currentHpMy);

            if (this.myMonster.hp.currentHp > 0) {
                this.createSpellInterface();
            } else {
                this.displayBattleEndMessage('You lose');
            }
        });

        this.interfaceBattle.appendChild(button);
    }

    displayBattleEndMessage(message) {
        this.interfaceBattle.innerHTML = '';
        const button = document.createElement('button');
        button.classList.add('battleBtn');
        button.textContent = message;
        button.addEventListener('click', () => {
            if (message === 'You win'){
                this.enemy.delete();
                this.objDraw.activeEnemy = [];
            }
            this.endBattle();
        });
        this.interfaceBattle.appendChild(button);
    }

    startBattle() {
        this.enemy.position = this.BattlePosition.enemyPosition.position;
        this.myMonster.position = this.BattlePosition.myPockemonPosition.position;

        this.updateHpBar(this.enemy, this.enemyTextHp, this.currentHpEnemy);
        this.updateHpBar(this.myMonster, this.myTextHp, this.currentHpMy);
        this.objDraw.drawables = [this.battleBackground, this.enemy, this.myMonster,];

        this.interfaceBattle.classList.remove('unActive');
        this.hpBar.forEach((el) => el.classList.remove('unActive'));

        this.createSpellInterface();
        this.objDraw.movables = [];
        this.isBattle = true;
    }

    endBattle() {
        this.interfaceBattle.classList.add('unActive');
        this.hpBar.forEach((el) => el.classList.add('unActive'));
        this.objDraw.drawables = [...this.copyObjDraw.drawables];
        this.enemy.hp.currentHp = this.enemy.hp.maxHp;
        this.myMonster.hp.currentHp = this.myMonster.hp.maxHp;
        this.interfaceBattle.innerHTML = '';
        this.objDraw.fireballs = [];
        this.objDraw.movables = [...this.copyObjDraw.movables];
        this.isBattle = false;
        this.enemy.position = this.startEnemyPosition;
    }
}

class House {
    constructor({background, objDraw, player, BattlePosition, boundariesHouse}) {
        this.player = player;
        this.startPlayerPosition = {...this.player.position}
        this.BattlePosition = BattlePosition;
        this.background = background;
        this.objDraw = objDraw;
        this.copyObjDraw = {...this.objDraw}
        this.boundariesHouse = boundariesHouse;
        this.isBattle = false;
    }
 
    startBattle() {
        this.objDraw.collisions =  this.boundariesHouse
        this.objDraw.drawables = [this.background, this.player, ...this.boundariesHouse];
        this.objDraw.movables = [this.background, ...this.boundariesHouse];
        this.isBattle = true;
    }

    endBattle() {
        this.objDraw.collisions = [...this.copyObjDraw.collisions]
        this.objDraw.drawables = [...this.copyObjDraw.drawables];
        this.objDraw.movables = [...this.copyObjDraw.movables];
        this.isBattle = false;
        this.player.position = this.startPlayerPosition;
    }
}

export {Boundary, Sprite, Monster, Spell, Battle, SpawnerMonster, House}