import Map from './Map.js';
import Player from './Player.js';
import Enemy from './EnemyAttacker.js';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = innerWidth
canvas.height = innerHeight

const map = new Map(ctx, canvas.width, canvas.height);
const player = new Player(ctx, canvas.width, canvas.height);
const enemy = new Enemy(ctx, canvas.width, canvas.height);

async function dataLoading() {
    await player.initData();
    await enemy.initData();
    executeCoreLoop();
}

function executeCoreLoop() {
    let gameLoop;
    try {
        gameLoop = requestAnimationFrame(executeCoreLoop)
        ctx.fillStyle = '#B5AD8F'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        map.grid();
        map.innerShadow();
        player.update()
        player.debugTools()
        enemy.update()
        enemy.debugTools()

    } catch (error) {
        console.error(error)
        cancelAnimationFrame(gameLoop)
        ctx.fillStyle = 'black'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
}

dataLoading()

addEventListener('mouseover', () => {
    canvas.classList.add('reticule');
});
addEventListener('mouseout', () => {
    canvas.classList.remove('reticule');
});
