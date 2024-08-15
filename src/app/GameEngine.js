import GameContext from './GameContext.js';

class GameEngine {
    constructor() {
        this.gameContext = new GameContext('entities');
        this.ctx = this.gameContext.getContext();
        this.projectiles = [];
        this.players = [];
        this.enemies = [];
    }

    addProjectile(projectile) {
        this.projectiles.push(projectile);
    }

    addPlayer(player) {
        this.players.push(player);
    }

    addEnemy(enemy) {
        this.enemies.push(enemy);
    }

    updateProjectiles() {
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

    updatePlayers() {
        this.players.forEach((player) => {

            player.position.x += player.velocity.x;
            player.position.y += player.velocity.y;

            const windowLimit = 32;
            if (player.position.x - windowLimit < 0) player.position.x = windowLimit;
            if (player.position.x + windowLimit > player.canvasWidth) player.position.x = player.canvasWidth - windowLimit;
            if (player.position.y - windowLimit < 0) player.position.y = windowLimit;
            if (player.position.y + windowLimit > player.canvasHeight) player.position.y = player.canvasHeight - windowLimit;

            player.movementEffect.update(player, this.ctx);

            player.getCollision();
            player.update(this.ctx);
        });
    }

    updateEnemies() {
        this.enemies.forEach((enemy) => {

            enemy.position.x += enemy.velocity.x;
            enemy.position.y += enemy.velocity.y;

            const windowLimit = 32;
            if (enemy.position.x - windowLimit < 0) enemy.position.x = windowLimit;
            if (enemy.position.x + windowLimit > enemy.canvasWidth) enemy.position.x = enemy.canvasWidth - windowLimit;
            if (enemy.position.y - windowLimit < 0) enemy.position.y = windowLimit;
            if (enemy.position.y + windowLimit > enemy.canvasHeight) enemy.position.y = enemy.canvasHeight - windowLimit;

            enemy.movementEffect.update(enemy, this.ctx);

            enemy.getCollision();
            enemy.update(this.ctx);
        });
    }

    checkCollisions() {
        // Collision joueur-enemy
        this.players.forEach((player) => {
            this.enemies.forEach((enemy) => {
                if (this.checkEntityCollision(player, enemy)) {
                    console.log('Player collided with Enemy!');
                    //
                }
            });
        });

        // Collision projectile-enemy
        this.projectiles.forEach((projectile) => {
            this.enemies.forEach((enemy) => {
                if (this.checkEntityCollision(projectile, enemy)) {
                    console.log('Projectile collided with Enemy!');
                    //
                }
            });
        });

        // Collision projectile-joueur (si applicable)
        this.projectiles.forEach((projectile) => {
            this.players.forEach((player) => {
                if (this.checkEntityCollision(projectile, player)) {
                    console.log('Projectile collided with Player!');
                    //
                }
            });
        });
    }

    checkEntityCollision(entityA, entityB) {
        let response = new SAT.Response();
        for (let polyA of entityA.getCollision()) {
            for (let polyB of entityB.getCollision()) {
                if (SAT.testPolygonPolygon(polyA, polyB, response)) {
                    return true;
                }
            }
        }
        return false;
    }

    update() {
        this.updateProjectiles();
        this.updatePlayers();
        this.updateEnemies();
        this.checkCollisions();
    }
}

export default GameEngine;