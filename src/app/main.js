const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
// Scintillement de la grille
const alphaMin = 0.4;
const alphaMax = 0.4;
const speed = 0.05;
let time = 0;
/************************/
canvas.width = innerWidth
canvas.height = innerHeight

class Player {
    constructor() {
        this.mouseX = 0;
        this.mouseY = 0;
        this.angle = 0;
        this.velocity = { x: 0, y: 0 };
        this.position = {
            x: canvas.width / 2,
            y: canvas.height / 2
        };
        this.keys = {
            z: { pressed: false },
            q: { pressed: false },
            s: { pressed: false },
            d: { pressed: false },
        };
        this.shootingInterval;
        this.input = this.keyInput.bind(this);
        this.initPlayerEvent();
        //DebugTools
        this.lastTime = performance.now();
        this.frameCount = 0;
        this.fps = 0;
    }

    initPlayerEvent() {
        addEventListener('contextmenu', (event) => this.contextMenu(event));
        addEventListener('mousemove', (event) => this.mouseXY(event));
        addEventListener('mousedown', (event) => this.mouseDown(event));
        addEventListener('mouseup', (event) => this.mouseUp(event));
        addEventListener('keydown', this.input);
        addEventListener('keyup', this.input);
    }

    contextMenu(event) {
        event.preventDefault();
    }

    mouseXY(event) {
        this.mouseX = event.clientX;
        this.mouseY = event.clientY;
    }

    mouseDown(event) {
        const { button } = event;
        switch (button) {
            case 0:
                this.shoot();
                if (!this.shootingInterval) {
                    this.shootingInterval = setInterval(() => {
                        this.shoot();
                    }, 150);
                }
                break;
            case 1:
                event.preventDefault();
                break;
            case 2:
                break;
        }
    }

    mouseUp({ button }) {
        if (button === 0) {
            clearInterval(this.shootingInterval);
            this.shootingInterval = null;
        }
    }

    keyInput({ key, type }) {
        const isKeyDown = type === 'keydown';
        switch (key) {
            case 'z':
                this.keys.z.pressed = isKeyDown;
                this.velocity.y = isKeyDown ? -10 : (this.keys.s.pressed ? 10 : 0);
                break;
            case 'q':
                this.keys.q.pressed = isKeyDown;
                this.velocity.x = isKeyDown ? -10 : (this.keys.d.pressed ? 10 : 0);
                break;
            case 's':
                this.keys.s.pressed = isKeyDown;
                this.velocity.y = isKeyDown ? 10 : (this.keys.z.pressed ? -10 : 0);
                break;
            case 'd':
                this.keys.d.pressed = isKeyDown;
                this.velocity.x = isKeyDown ? 10 : (this.keys.q.pressed ? -10 : 0);
                break;
            case ' ':
                break;
        }
    }

    shoot() {
        if (this.mouseX !== 0 && this.mouseY !== 0) {
            const directionX = this.mouseX - this.position.x;
            const directionY = this.mouseY - this.position.y;
            const magnitude = Math.sqrt(directionX * directionX + directionY * directionY);
            const velocityX = (directionX / magnitude) * 11;
            const velocityY = (directionY / magnitude) * 11;
            const startDistance = 55;
            const projectileStartPositionX = this.position.x + Math.cos(this.angle - Math.PI / 2) * startDistance;
            const projectileStartPositionY = this.position.y + Math.sin(this.angle - Math.PI / 2) * startDistance;

            projectiles.push(
                new Projectile({
                    position: {
                        x: projectileStartPositionX,
                        y: projectileStartPositionY
                    },
                    velocity: {
                        x: velocityX,
                        y: velocityY
                    }
                })
            );
        }
    }

    setAngle() {
        if (this.mouseX !== 0 && this.mouseY !== 0) {
            const directionX = this.mouseX - this.position.x;
            const directionY = this.mouseY - this.position.y;
            this.angle = Math.atan2(directionY, directionX) + Math.PI / 2;
        } else {
            this.angle = Math.PI * 2;
        }
    }

    playerCharacter(centerX, centerY) {
        ctx.shadowBlur = 0;
        ctx.shadowColor = "transparent";
        /***************************************************/
        /**************************************************/
        let coreVertex = [
            { x: 29.477317810058594, y: 44.32225036621094 },
            { x: 0, y: 0 },
            { x: 58.95463562011719, y: 0 }
        ];
        const scaleFactor = 3.5;
        const originCore = { x: 379.5226745605469, y: 349.4304504394531 };
        const originTop = { x: 364.75115966796875, y: 210 };
        const originLeft = { x: 427.7571105957031, y: 422.7299499511719 };
        const originRight = { x: 390.24277114868164, y: 422.72998046875 };
        const topOffsetX = originTop.x - originCore.x;
        const topOffsetY = originTop.y - originCore.y;
        const leftOffsetX = originLeft.x - originCore.x;
        const leftOffsetY = originLeft.y - originCore.y;
        const rightOffsetX = originRight.x - originCore.x;
        const rightOffsetY = originRight.y - originCore.y;
        const centroid = {
            x: (coreVertex[0].x + coreVertex[1].x + coreVertex[2].x) / 3,
            y: (coreVertex[0].y + coreVertex[1].y + coreVertex[2].y) / 3
        };

        let topVertex = [
            { x: 44.24871826171875, y: 0 },
            { x: 88.4974365234375, y: 116.9615003291502 },
            { x: 73.90994698660714, y: 138.5070343017578 },
            { x: 44.24871826171875, y: 138.5070343017578 },
            { x: 14.587489536830356, y: 138.5070343017578 },
            { x: 0, y: 116.9615003291502 },
            { x: 44.24871826171875, y: 0 }
        ];

        let leftVertex = [
            { x: 34.00217456967882, y: 0.3341954330971908 },
            { x: 113.8794937133789, y: 0 },
            { x: 95.84704022121825, y: 23.690196990966797 },
            { x: -0.000017731476828929914, y: 22.49586612881881 },
            { x: 34.00217456967882, y: 0.3341954330971908 }
        ];

        let rightVertex = [
            { x: 34.00219245764052, y: 0.3341932300729972 },
            { x: 113.8794937133789, y: 0 },
            { x: 95.8470545315876, y: 23.6901912689209 },
            { x: 0.000006662286783228688, y: 22.49585127720473 },
            { x: 34.00219245764052, y: 0.3341932300729972 }
        ];

        coreVertex = coreVertex.map(vertex => ({
            x: (vertex.x - centroid.x) / scaleFactor,
            y: (vertex.y - centroid.y) / scaleFactor
        }));

        topVertex = topVertex.map(vertex => ({
            x: (vertex.x + topOffsetX - centroid.x) / scaleFactor,
            y: (vertex.y + topOffsetY - centroid.y) / scaleFactor
        }));

        leftVertex = leftVertex.map(vertex => ({
            x: (vertex.x + leftOffsetX - centroid.x - 78) / scaleFactor,
            y: (vertex.y + leftOffsetY - centroid.y - 40) / scaleFactor
        }));

        rightVertex = rightVertex.map(vertex => ({
            x: (vertex.x + rightOffsetX - centroid.x - 40) / scaleFactor,
            y: (vertex.y + rightOffsetY - centroid.y - 40) / scaleFactor
        }));

        // Core //
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(0);
        ctx.beginPath();
        ctx.moveTo(coreVertex[0].x, coreVertex[0].y);
        ctx.lineTo(coreVertex[1].x, coreVertex[1].y);
        ctx.lineTo(coreVertex[2].x, coreVertex[2].y);
        ctx.closePath();
        ctx.fillStyle = 'rgba(45, 45, 45, 1)';
        ctx.fill();
        ctx.restore();

        // Top //
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(0);
        ctx.beginPath();
        ctx.moveTo(topVertex[0].x, topVertex[0].y);
        ctx.lineTo(topVertex[1].x, topVertex[1].y);
        ctx.lineTo(topVertex[2].x, topVertex[2].y);
        ctx.lineTo(topVertex[3].x, topVertex[3].y);
        ctx.lineTo(topVertex[4].x, topVertex[4].y);
        ctx.lineTo(topVertex[5].x, topVertex[5].y);
        ctx.lineTo(topVertex[6].x, topVertex[6].y);
        ctx.closePath();
        ctx.fillStyle = 'rgba(255, 255, 255, 1)';
        ctx.fill();
        ctx.restore();

        // Left //
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(-2.1622128102625267);
        ctx.scale(1, -1);
        ctx.beginPath();
        ctx.moveTo(leftVertex[0].x, leftVertex[0].y);
        ctx.lineTo(leftVertex[1].x, leftVertex[1].y);
        ctx.lineTo(leftVertex[2].x, leftVertex[2].y);
        ctx.lineTo(leftVertex[3].x, leftVertex[3].y);
        ctx.lineTo(leftVertex[4].x, leftVertex[4].y);
        ctx.closePath();
        ctx.fillStyle = 'rgba(255, 255, 255, 1)';
        ctx.fill();
        ctx.restore();

        // Right //
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(-0.9793798433272664);
        ctx.beginPath();
        ctx.moveTo(rightVertex[0].x, rightVertex[0].y);
        ctx.lineTo(rightVertex[1].x, rightVertex[1].y);
        ctx.lineTo(rightVertex[2].x, rightVertex[2].y);
        ctx.lineTo(rightVertex[3].x, rightVertex[3].y);
        ctx.lineTo(rightVertex[4].x, rightVertex[4].y);
        ctx.closePath();
        ctx.fillStyle = 'rgba(255, 255, 255, 1)';
        ctx.fill();
        ctx.restore();
    }

    draw() {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.angle);
        this.setAngle();
        this.playerCharacter(0, 0);
        ctx.restore();
    }

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        const entityBoundaries = 35;
        if (this.position.x - entityBoundaries < 0) this.position.x = entityBoundaries;
        if (this.position.x + entityBoundaries > canvas.width) this.position.x = canvas.width - entityBoundaries;
        if (this.position.y - entityBoundaries < 0) this.position.y = entityBoundaries;
        if (this.position.y + entityBoundaries > canvas.height) this.position.y = canvas.height - entityBoundaries;
    }

    debugTools() {
        this.frameCount++;
        const currentTime = performance.now();
        const delta = currentTime - this.lastTime;
        if (delta >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.lastTime = currentTime;
        }
        ctx.shadowBlur = 0;
        ctx.shadowColor = "transparent";
        ctx.font = '18px Comic Sans MS';
        ctx.fillStyle = 'white';
        ctx.fillText(`FPS: ${this.fps}`, this.mouseX + 15, this.mouseY + 25);
        ctx.fillText(`Angle: ${this.angle.toFixed(3)}`, this.mouseX + 15, this.mouseY + 50);
        ctx.fillText(`Player: X: ${this.position.x}, Y: ${this.position.y}`, this.mouseX + 15, this.mouseY + 75);
        ctx.fillText(`Mouse: X: ${this.mouseX}, Y: ${this.mouseY}`, this.mouseX + 15, this.mouseY + 100);
    }
}

class Projectile {
    constructor({ position, velocity }) {
        this.frontWidth = 7;
        this.rearWidth = 4;
        this.length = 25;
        this.angle = 0;
        this.position = position;
        this.velocity = velocity;
    }

    laserForm(ctx, x, y, frontWidth, rearWidth, length, radius) {
        ctx.beginPath();
        // Move to the rear left corner
        ctx.moveTo(x, y + rearWidth / 2);
        // Draw rear left curve
        ctx.arcTo(x, y - rearWidth / 2, x + radius, y - rearWidth / 2, radius);
        // Draw rear line to front left
        ctx.lineTo(x + length - radius, y - frontWidth / 2);
        // Draw front left curve
        ctx.arcTo(x + length, y - frontWidth / 2, x + length, y - frontWidth / 2 + radius, radius);
        // Draw front line to front right
        ctx.arcTo(x + length, y + frontWidth / 2, x + length - radius, y + frontWidth / 2, radius);
        // Draw rear right line
        ctx.lineTo(x + radius, y + rearWidth / 2);
        // Draw rear right curve
        ctx.arcTo(x, y + rearWidth / 2, x, y - rearWidth / 2, radius);
        ctx.closePath();
        ctx.fillStyle = 'white';
        ctx.fill();
    }

    laserEnergy(ctx, x, y, frontWidth, rearWidth, length, radius) {
        ctx.shadowColor = 'rgba(255, 165, 0)';
        ctx.shadowBlur = 4;
        this.laserForm(ctx, x, y, frontWidth, rearWidth, length, radius);

        ctx.shadowColor = 'rgba(255, 165, 0)';
        ctx.shadowBlur = 4;
        this.laserForm(ctx, x, y, frontWidth, rearWidth, length, radius);

        ctx.shadowColor = 'rgba(255, 165, 0)';
        ctx.shadowBlur = 3;
        this.laserForm(ctx, x, y, frontWidth, rearWidth, length, radius);
    }

    draw() {
        ctx.save();
        this.angle = Math.atan2(this.velocity.y, this.velocity.x);
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.angle);
        this.laserEnergy(ctx, -this.length / 2, 0, this.frontWidth, this.rearWidth, this.length, 5);
        ctx.restore();
    }

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

const player = new Player()
const projectiles = []

function grid(alpha) {
    const spacing = 35;
    ctx.shadowBlur = 0;
    ctx.shadowColor = "transparent";
    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
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

function innerShadow(ctx) {
    const shadowWidth = 30; // Élargir pour un flou plus doux
    const innerColor = 'rgba(0, 0, 0, 0.6)'; // Couleur sombre pour l'ombre
    const outerColor = 'rgba(0, 0, 0, 0)'; // Transparent à l'extérieur
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

function run() {
    let gameLoop;
    try {
        gameLoop = requestAnimationFrame(run)
        ctx.fillStyle = '#B5AD8F'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        for (let i = projectiles.length - 1; i >= 0; i--) {
            if (projectiles[i].position.x < 0 || projectiles[i].position.x > canvas.width ||
                projectiles[i].position.y < 0 || projectiles[i].position.y > canvas.height) {
                projectiles.splice(i, 1);
            } else {
                projectiles[i].update();
            }
        }

        const alpha = alphaMin + (alphaMax - alphaMin) * (Math.sin(time) * 0.5 + 0.5);
        time += speed;
        grid(alpha);
        innerShadow(ctx);
        player.update()
        player.debugTools()

    } catch (error) {
        console.error('An error occurred:\n', error)
        cancelAnimationFrame(gameLoop)
        ctx.fillStyle = 'black'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
}

run()

addEventListener('mouseover', () => {
    canvas.classList.add('reticule');
});
addEventListener('mouseout', () => {
    canvas.classList.remove('reticule');
});
