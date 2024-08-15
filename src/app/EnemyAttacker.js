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
        this.polygons = [
            new SAT.Polygon(new SAT.Vector(), [
                new SAT.Vector(0, 8.442),
                new SAT.Vector(-8.422, -4.221),
                new SAT.Vector(8.422, -4.221)
            ]),
            new SAT.Polygon(new SAT.Vector(), [
                new SAT.Vector(0, -30),
                new SAT.Vector(12.642, -10.640),
                new SAT.Vector(8.474, -4.484),
                new SAT.Vector(-8.474, -4.484),
                new SAT.Vector(-12.642, -10.640)
            ]),
            new SAT.Polygon(new SAT.Vector(), [
                new SAT.Vector(-13.097, -10.007),
                new SAT.Vector(-16.5, -1.957),
                new SAT.Vector(-0.292, 20.586),
                new SAT.Vector(-0.452, 8.991)
            ]),
            new SAT.Polygon(new SAT.Vector(), [
                new SAT.Vector(13.174, -10.123),
                new SAT.Vector(16.5, -1.957),
                new SAT.Vector(0.370, 20.471),
                new SAT.Vector(0.530, 8.875)
            ])
        ];
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

    getCollision() {
        return this.polygons.map(poly => {
            let rotatedPoints = poly.points.map(point => {
                const rotatedX = Math.cos(this.angle) * point.x - Math.sin(this.angle) * point.y;
                const rotatedY = Math.sin(this.angle) * point.x + Math.cos(this.angle) * point.y;
                return new SAT.Vector(rotatedX, rotatedY);
            });
            let movedPoly = new SAT.Polygon(new SAT.Vector(), rotatedPoints);
            movedPoly.translate(this.position.x, this.position.y);

            return movedPoly;
        });
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

    enemyCollisionBox() {
        this.polygons.forEach(poly => {
            const satPolygon = new SAT.Polygon(new SAT.Vector(0, 0), poly.points);
    
            this.ctx.beginPath();
            const points = satPolygon.points;
            this.ctx.moveTo(points[0].x + satPolygon.pos.x, points[0].y + satPolygon.pos.y);
            for (let i = 1; i < points.length; i++) {
                this.ctx.lineTo(points[i].x + satPolygon.pos.x, points[i].y + satPolygon.pos.y);
            }
            this.ctx.closePath();
            this.ctx.strokeStyle = 'red';
            this.ctx.stroke();
    
            /*points.forEach(point => {
                const x = point.x + satPolygon.pos.x;
                const y = point.y + satPolygon.pos.y;
                this.ctx.fillStyle = 'blue';
                this.ctx.beginPath();
                this.ctx.arc(x, y, 2, 0, 2 * Math.PI);
                this.ctx.fill();
            });*/
        });
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
        //this.enemyCollisionBox();
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