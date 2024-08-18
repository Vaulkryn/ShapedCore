import GameContext from './GameContext.js';
import GameEngine from './GameEngine.js';
import CoordsLoader from './CoordsLoader.js';
import PartsLoader from './PartsLoader.js';
import Projectile from './Projectile.js';
import basicPlayer from '../config/PlayerCharacter.js';
import EntityMovementEffect from './EntityMovementEffect.js';

class Player {
    constructor() {
        this.loadResources();
        this.initProperties();
        this.initPlayerEvent();
        this.initFramerateCalculation();
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
        this.coordsLoader = new CoordsLoader('src/data/PlayerCharacter.json');
        this.partsLoader = new PartsLoader(this.coordsLoader, basicPlayer, 'basicPlayer', this);
        this.movementEffect = new EntityMovementEffect('player');
    }

    initProperties() {
        this.mouseX = 0;
        this.mouseY = 0;
        this.angle = 0;
        this.speed = 7;
        this.poise = 250;
        this.repelForce = 2;
        this.polygons = [
            new SAT.Polygon(new SAT.Vector(), [
                new SAT.Vector(0, 8.442),
                new SAT.Vector(-8.422, -4.221),
                new SAT.Vector(8.422, -4.221)
            ]),
            new SAT.Polygon(new SAT.Vector(), [
                new SAT.Vector(0, -44.058),
                new SAT.Vector(12.642, -10.640),
                new SAT.Vector(8.474, -4.484),
                new SAT.Vector(-8.474, -4.484),
                new SAT.Vector(-12.642, -10.640)
            ]),
            new SAT.Polygon(new SAT.Vector(), [
                new SAT.Vector(-13.097, -10.007),
                new SAT.Vector(-15.843, -1.957),
                new SAT.Vector(-0.292, 20.586),
                new SAT.Vector(-0.452, 8.991)
            ]),
            new SAT.Polygon(new SAT.Vector(), [
                new SAT.Vector(13.174, -10.123),
                new SAT.Vector(15.843, -1.957),
                new SAT.Vector(0.370, 20.471),
                new SAT.Vector(0.530, 8.875)
            ])
        ];
        this.velocity = { x: 0, y: 0 };
        this.position = { x: this.canvasWidth / 2, y: this.canvasHeight / 2 };
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
                this.shoot('laser', this.mouseX, this.mouseY);
                if (!this.shootingInterval) {
                    this.shootingInterval = setInterval(() => {
                        this.shoot('laser', this.mouseX, this.mouseY);
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

    shoot(weaponType, mouseX, mouseY) {
        let projectile;
        if (weaponType === 'laser') {
            projectile = Projectile.createProjectile(this, mouseX, mouseY);
        } else {
            // Other weapons
        }
        if (projectile) {
            this.gameEngine.addProjectile(projectile);
        }
    }

    playerCharacter() {
        this.ctx.shadowBlur = 0;
        this.partsLoader.entityAssembler(this.ctx);
    }

    playerCollisionBox() {
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
        // this.zoneEffect(0, 0, 50);
        this.playerCharacter();
        //this.playerCollisionBox();
        this.setAngle();
        this.ctx.restore();
    }

    update() {
        this.gameEngine.update();
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
        this.ctx.fillText(`Player: X: ${this.position.x.toFixed(0)}, Y: ${this.position.y}`, this.mouseX + 15, this.mouseY + 75);
        this.ctx.fillText(`Mouse: X: ${this.mouseX}, Y: ${this.mouseY}`, this.mouseX + 15, this.mouseY + 100);
    }
}

export default Player;