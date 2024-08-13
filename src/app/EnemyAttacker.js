import GameContext from './GameContext.js';
import GameEngine from './GameEngine.js';
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
    }

    loadResources() {
        this.gameContext = new GameContext('entities');
        this.ctx = this.gameContext.getContext();
        this.canvasWidth = this.gameContext.getWidth();
        this.canvasHeight = this.gameContext.getHeight();
        this.gameEngine = new GameEngine();
        this.coordsLoader = new CoordsLoader('src/data/EnemyAttacker.json');
        this.partsLoader = new PartsLoader(this.coordsLoader, enemyT1v1, 'enemyT1v1', this);
        this.movementEffect = new EntityMovementEffect('enemy');
    }

    initProperties() {
        this.angle = 0;
        this.speed = 7;
        this.vertices = [];
        this.velocity = { x: 0, y: 0 };
        this.position = { x: this.canvasWidth / 2 + 250, y: this.canvasHeight / 2 };
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

    setAngle() {}

    shoot() {}

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
        this.gameEngine.update();
        this.draw();
    }

    debugTools() {
        this.ctx.shadowBlur = 0;
        this.ctx.shadowColor = "transparent";
        this.ctx.font = '18px Comic Sans MS';
        this.ctx.fillStyle = 'white';
        this.ctx.fillText(`Enemy: X: ${this.position.x}, Y: ${this.position.y}`, this.position.x + 15, this.position.y + 25);
    }
}

export default EnemyAttacker;