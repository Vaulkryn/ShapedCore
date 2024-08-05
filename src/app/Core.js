import GameContext from './GameContext.js';
import Map from './Map.js';
import Player from './Player.js';
import EnemyAttacker from './EnemyAttacker.js';

const backgroundCtx = GameContext.getInstance('background');
const entitiesCtx = GameContext.getInstance('entities');
const gameloopErrorCtx = GameContext.getInstance('gameloopError');
const map = new Map();
const player = new Player();
const enemy = new EnemyAttacker();

async function dataLoading() {
    await player.characterData();
    await enemy.characterData();
    executeCoreLoop();
}

function executeCoreLoop() {
    let gameLoop;
    try {
        gameLoop = requestAnimationFrame(executeCoreLoop)

        backgroundCtx.fillCanvas();
        entitiesCtx.fillCanvas();
        map.draw();
        player.update();
        player.debugTools();
        enemy.update()
        enemy.debugTools()

    } catch (error) {
        console.error(error)
        cancelAnimationFrame(gameLoop)
        gameloopErrorCtx.fillCanvas();
    }
}

dataLoading()