import GameContext from './GameContext.js';
import Physics from './Physics.js';
import CoordsLoader from './CoordsLoader.js';
import PartsLoader from './PartsLoader.js';
import Projectile from './Projectile.js';
import enemyT1v1 from '../config/EnemyAttacker.js';
import EntityMovementEffect from './EntityMovementEffect.js';

class EnemyAttacker {
    constructor() {
        this.loadResources();
        this.initProperties();
    }

    async characterData() {
        await this.coordsLoader.loadCoords();
        await this.partsLoader.loadParts();
        //console.log('Enemy parts loaded:', this.partsLoader.parts);
    }

    loadResources() {
        this.gameContext = new GameContext('entities');
        this.ctx = this.gameContext.getContext();
        this.canvasWidth = this.gameContext.getWidth();
        this.canvasHeight = this.gameContext.getHeight();
        this.physics = new Physics();
        this.coordsLoader = new CoordsLoader('src/data/EnemyAttacker.json');
        this.partsLoader = new PartsLoader(this.coordsLoader, enemyT1v1, 'enemyT1v1');
        this.movementEffect = new EntityMovementEffect('enemy');
    }

    initProperties() {
        this.angle = 0;
        this.speed = 7;
        this.projectiles = [];
        this.velocity = { x: 0, y: 0 };
        this.position = {
            x: this.canvasWidth / 2 + 70,
            y: this.canvasHeight / 2 + 70
        };
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

    enemyCharacter() {
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
        this.enemyCharacter();
        this.setAngle();
        this.ctx.restore();
    }

    update() {
        this.update_physics();
        this.update_position();
        this.update_enemyBounds();
        this.update_movementEffect();
        this.draw();
    }

    update_physics() {
        this.physics.update();
    }

    update_position() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }

    update_enemyBounds() {
        const windowLimit = 32;
        if (this.position.x - windowLimit < 0) this.position.x = windowLimit;
        if (this.position.x + windowLimit > this.canvasWidth) this.position.x = this.canvasWidth - windowLimit;
        if (this.position.y - windowLimit < 0) this.position.y = windowLimit;
        if (this.position.y + windowLimit > this.canvasHeight) this.position.y = this.canvasHeight - windowLimit;
    }

    update_movementEffect() {
        this.movementEffect.update(this, this.ctx);
    }

    debugTools() {
        this.ctx.shadowBlur = 0;
        this.ctx.shadowColor = "transparent";
        this.ctx.font = '18px Comic Sans MS';
        this.ctx.fillStyle = 'white';
        this.ctx.fillText(`Enemy: X: ${this.position.x}, Y: ${this.position.y}`, this.position.x + 15, this.position.y + 25);
        this.ctx.fillText(`Angle: ${this.angle.toFixed(3)}`, this.position.x + 15, this.position.y + 50);
    }
}

export default EnemyAttacker;