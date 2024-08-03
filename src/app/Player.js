import Projectile from './Projectile.js';
import CoordsLoader from './CoordsLoader.js';
import PartsLoader from './PartsLoader.js';
import basicPlayer from '../config/PlayerCharacter.js';
import EntityMovementEffect from './EntityMovementEffect';

class Player {
    constructor(ctx, canvasWidth, canvasHeight) {
        this.ctx = ctx;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.loadResources();
        this.initProperties();
        this.initPlayerEvent();
        this.initFramerateCalculation();
    }

    async initData() {
        await this.coordsLoader.loadCoords();
        await this.partsLoader.loadParts();
    }

    loadResources() {
        this.coordsLoader = new CoordsLoader('src/data/PlayerCharacter.json');
        this.partsLoader = new PartsLoader(this.coordsLoader, basicPlayer, 'basicPlayer');
        this.movementEffect = new EntityMovementEffect('player');
    }

    initProperties() {
        this.mouseX = 0;
        this.mouseY = 0;
        this.angle = 0;
        this.speed = 7;
        this.projectiles = [];
        this.velocity = { x: 0, y: 0 };
        this.position = {
            x: this.canvasWidth / 2,
            y: this.canvasHeight / 2
        };
        this.keys = {
            z: { pressed: false },
            q: { pressed: false },
            s: { pressed: false },
            d: { pressed: false },
        };
    }

    initPlayerEvent() {
        this.input = this.keyInput.bind(this);
        addEventListener('contextmenu', (event) => this.contextMenu(event));
        addEventListener('mousemove', (event) => this.mouseXY(event));
        addEventListener('mousedown', (event) => this.mouseDown(event));
        addEventListener('mouseup', (event) => this.mouseUp(event));
        addEventListener('keydown', this.input);
        addEventListener('keyup', this.input);
    }

    initFramerateCalculation() {
        this.lastTime = performance.now();
        this.frameCount = 0;
        this.fps = 0;
    }

    getPosition() {
        return {
            x: this.position.x,
            y: this.position.y
        };
    }

    getAngle() {
        return this.angle;
    }

    isMoving() {
        return this.velocity.x !== 0 || this.velocity.y !== 0;
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
                    },);
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
                this.velocity.y = isKeyDown ? -this.speed : (this.keys.s.pressed ? this.speed : 0);
                break;
            case 'q':
                this.keys.q.pressed = isKeyDown;
                this.velocity.x = isKeyDown ? -this.speed : (this.keys.d.pressed ? this.speed : 0);
                break;
            case 's':
                this.keys.s.pressed = isKeyDown;
                this.velocity.y = isKeyDown ? this.speed : (this.keys.z.pressed ? -this.speed : 0);
                break;
            case 'd':
                this.keys.d.pressed = isKeyDown;
                this.velocity.x = isKeyDown ? this.speed : (this.keys.q.pressed ? -this.speed : 0);
                break;
            case ' ':
                break;
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

    shoot() {
        const projectile = Projectile.createProjectile(this, this.mouseX, this.mouseY);
        if (projectile) {
            this.projectiles.push(projectile);
        }
    }

    playerCharacter() {
        this.ctx.shadowBlur = 0;
        this.partsLoader.entityAssembler(this.ctx);
    }

    /*zoneEffect(x, y, radius) {
        this.ctx.shadowBlur = 0;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2, false);
        this.ctx.fillStyle = `rgba(255, 255, 255, 0.2)`;
        this.ctx.strokeStyle = `rgba(255, 255, 255, 0.4)`;
        this.ctx.stroke();
        this.ctx.fill();
        this.ctx.closePath();
    }*/

    draw() {
        this.ctx.save();
        this.ctx.translate(this.position.x, this.position.y);
        this.ctx.rotate(this.angle);
        //this.zoneEffect(0, 0, 50);
        this.playerCharacter();
        this.setAngle();
        this.ctx.restore();
    }

    update() {
        this.update_position();
        this.update_playerBounds();
        this.update_projectiles();
        this.update_movementEffect();
    }

    update_position() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }

    update_playerBounds() {
        const windowLimit = 32;
        if (this.position.x - windowLimit < 0) this.position.x = windowLimit;
        if (this.position.x + windowLimit > this.canvasWidth) this.position.x = this.canvasWidth - windowLimit;
        if (this.position.y - windowLimit < 0) this.position.y = windowLimit;
        if (this.position.y + windowLimit > this.canvasHeight) this.position.y = this.canvasHeight - windowLimit;
    }

    update_projectiles() {
        const activeProjectiles = [];
        this.projectiles.forEach((projectile) => {
            projectile.update(this.ctx);
            if (projectile.position.x >= 0 && projectile.position.x <= this.ctx.canvas.width &&
                projectile.position.y >= 0 && projectile.position.y <= this.ctx.canvas.height) {
                activeProjectiles.push(projectile);
            }
        });
        this.projectiles = activeProjectiles;
    }

    update_movementEffect() {
        this.movementEffect.update(this, this.ctx);
        this.draw();
    }

    debugTools() {
        /***** FPS *****/
        this.frameCount++;
        const currentTime = performance.now();
        const delta = currentTime - this.lastTime;
        if (delta >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.lastTime = currentTime;
        }
        /***************/
        this.ctx.shadowBlur = 0;
        this.ctx.shadowColor = "transparent";
        this.ctx.font = '18px Comic Sans MS';
        this.ctx.fillStyle = 'white';
        this.ctx.fillText(`FPS: ${this.fps}`, this.mouseX + 15, this.mouseY + 25);
        this.ctx.fillText(`Angle: ${this.angle.toFixed(3)}`, this.mouseX + 15, this.mouseY + 50);
        this.ctx.fillText(`Player: X: ${this.position.x}, Y: ${this.position.y}`, this.mouseX + 15, this.mouseY + 75);
        this.ctx.fillText(`Mouse: X: ${this.mouseX}, Y: ${this.mouseY}`, this.mouseX + 15, this.mouseY + 100);
    }
}

export default Player;