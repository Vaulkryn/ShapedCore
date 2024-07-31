import Player from './Player.js';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = innerWidth
canvas.height = innerHeight

const player = new Player(ctx, canvas.width, canvas.height);

function grid() {
    const spacing = 35;
    ctx.shadowBlur = 0;
    ctx.shadowColor = "transparent";
    ctx.strokeStyle = `rgba(255, 255, 255, 0.4)`;
    ctx.lineWidth = 1;
    for (let x = 0; x <= canvas.width; x += spacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += spacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

function innerShadow() {
    const shadowWidth = 30;
    const innerColor = 'rgba(0, 0, 0, 0.6)';
    const outerColor = 'rgba(0, 0, 0, 0)';
    ctx.shadowBlur = 4;
    ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
    // Top
    let gradient = ctx.createLinearGradient(0, 0, 0, shadowWidth);
    gradient.addColorStop(0, innerColor);
    gradient.addColorStop(1, outerColor);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, ctx.canvas.width, shadowWidth);
    // Bottom
    gradient = ctx.createLinearGradient(0, ctx.canvas.height - shadowWidth, 0, ctx.canvas.height);
    gradient.addColorStop(0, outerColor);
    gradient.addColorStop(1, innerColor);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, ctx.canvas.height - shadowWidth, ctx.canvas.width, shadowWidth);
    // Left
    gradient = ctx.createLinearGradient(0, 0, shadowWidth, 0);
    gradient.addColorStop(0, innerColor);
    gradient.addColorStop(1, outerColor);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, shadowWidth, ctx.canvas.height);
    // Right
    gradient = ctx.createLinearGradient(ctx.canvas.width - shadowWidth, 0, ctx.canvas.width, 0);
    gradient.addColorStop(0, outerColor);
    gradient.addColorStop(1, innerColor);
    ctx.fillStyle = gradient;
    ctx.fillRect(ctx.canvas.width - shadowWidth, 0, shadowWidth, ctx.canvas.height);
}

async function dataLoading() {
    await player.initData();
    executeCoreLoop();
}

function executeCoreLoop() {
    let gameLoop;
    try {
        gameLoop = requestAnimationFrame(executeCoreLoop)
        ctx.fillStyle = '#B5AD8F'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        grid();
        innerShadow();
        player.update()
        player.debugTools()
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
