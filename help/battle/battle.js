const enemyTextHp = document.querySelector('.EnemyHpBar > .textHp');
const currentHpEnemy = document.querySelector('.currentHpEnemy');

const myTextHp = document.querySelector('.myHpBar > .textHp');
const currentHpMy = document.querySelector('.currentHpMy');

const interfaceBattle = document.querySelector('.interface');
const hpBar = document.querySelectorAll('.hpBar');

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

const updateHpBar = (character, textHpElement, currentHpElement) => {
    textHpElement.textContent = `${character.hp.currentHp}/${character.hp.maxHp}`;
    currentHpElement.style.width = `${(character.hp.currentHp / character.hp.maxHp) * 100}%`;
};

const createSpellInterface = (enemy, player, drawables) => {
    if (player.hp.currentHp <= 0) {
        displayBattleEndMessage('You lose');
        return;
    }
    
    interfaceBattle.innerHTML = ''; 

    enemy.spells.forEach((spell) => {
        const btn = document.createElement('button');
        btn.classList.add('battleBtn');
        btn.textContent = spell.name;

        btn.addEventListener('click', () => {
            const attack = player.attack(enemy, 10, spell.name);
            drawables.fireballs.push(attack);
            updateHpBar(enemy, enemyTextHp, currentHpEnemy);
            showAttackResult(player, enemy, drawables);
        });

        interfaceBattle.appendChild(btn);
    });
};

const showAttackResult = (player, enemy, drawables) => {
    const button = document.createElement('button');
    button.classList.add('battleBtn');

    if (enemy.hp.currentHp <= 0) {
        displayBattleEndMessage('You win');
        return;
    }

    button.textContent = `You hit him for ${player.powerAttack}. Enemy has ${enemy.hp.currentHp} HP left.`;
    interfaceBattle.innerHTML = '';

    button.addEventListener('click', () => {
        const randomSpell = enemy.spells[getRandomInt(enemy.spells.length)].name;
        const attack = enemy.attack(player, 10, randomSpell);
        drawables.fireballs.push(attack);
        updateHpBar(player, myTextHp, currentHpMy);

        if (player.hp.currentHp > 0) {
            createSpellInterface(enemy, player, drawables);
        } else {
            displayBattleEndMessage('You lose');
        }
    });

    interfaceBattle.appendChild(button);
};

const displayBattleEndMessage = (message) => {
    interfaceBattle.innerHTML = '';
    const button = document.createElement('button');
    button.classList.add('battleBtn');
    button.textContent = message;
    button.addEventListener('click', () => {
        endBattle();
    })
    interfaceBattle.appendChild(button);
};

const startBattle = (player, enemy, background, battleState, objDraw) => {
    updateHpBar(enemy, enemyTextHp, currentHpEnemy);
    updateHpBar(player, myTextHp, currentHpMy);
    objDraw.drawables.push(background, enemy, player);

    interfaceBattle.classList.remove('unActive');
    hpBar.forEach((el) => el.classList.remove('unActive'));

    createSpellInterface(enemy, player, objDraw);

    objDraw.movables = [];
    battleState.isBattle = true;
};

const endBattle = (enemy, battleState, background, boundaries, player, foreground, objDraw) => {
    interfaceBattle.classList.add('unActive');
    hpBar.forEach((el) => el.classList.add('unActive'));
    objDraw.drawables = [background, ...boundaries, player, foreground];
    enemy.hp.currentHp = enemy.hp.maxHp;
    interfaceBattle.innerHTML = '';
    objDraw.fireballs = [];
    objDraw.movables = [background, ...boundaries, foreground];
    battleState.isBattle = false;
};

export { endBattle, startBattle };
