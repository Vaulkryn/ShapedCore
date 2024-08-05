import GameContext from './GameContext.js';

class Physics {
    constructor() {
        this.gameContext = new GameContext('entities');
        this.ctx = this.gameContext.getContext();
        this.projectiles = [];
    }

    addProjectile(projectile) {
        //console.log('Ajout du projectile:', projectile);
        this.projectiles.push(projectile);
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

    update() {
        this.updateProjectiles();
    }
}

export default Physics;