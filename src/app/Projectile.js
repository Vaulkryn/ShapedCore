class Projectile {
    static cooldownTime = 250;
    static lastShotTime = 0;
    static speed = 11;
    constructor({ position, velocity }) {
        this.frontWidth = 7;
        this.rearWidth = 4;
        this.length = 25;
        this.angle = 0;
        this.step = 3;
        this.shadowBlur = 30;
        this.targetShadowBlur = 35;
        this.isIncreasing = true;
        this.position = position;
        this.velocity = velocity;
        this.soundEffect();
    }

    static createProjectile(player, mouseX, mouseY) {
        const currentTime = Date.now();

        if (currentTime - Projectile.lastShotTime >= Projectile.cooldownTime) {
            Projectile.lastShotTime = currentTime;

            if (mouseX !== 0 && mouseY !== 0) {
                const directionX = mouseX - player.position.x;
                const directionY = mouseY - player.position.y;
                const magnitude = Math.sqrt(directionX * directionX + directionY * directionY);
                const velocityX = (directionX / magnitude) * Projectile.speed;
                const velocityY = (directionY / magnitude) * Projectile.speed;
                const startDistance = 55;
                const projectileStartPositionX = player.position.x + Math.cos(player.angle - Math.PI / 2) * startDistance;
                const projectileStartPositionY = player.position.y + Math.sin(player.angle - Math.PI / 2) * startDistance;

                return new Projectile({
                    position: {
                        x: projectileStartPositionX,
                        y: projectileStartPositionY
                    },
                    velocity: {
                        x: velocityX,
                        y: velocityY
                    }
                });
            }
        } else {
            return null;
        }
    }

    soundEffect() {
        const sound = document.getElementById('playerSFX_01');
        if (sound) {
            sound.currentTime = 0;
            sound.play();
        } else {
            console.error(`Element with id ${'playerSFX_01'} not found`);
        }
    }

    laserForm(ctx, x, y, frontWidth, rearWidth, length, radius) {
        ctx.beginPath();
        ctx.moveTo(x, y + rearWidth / 2);
        ctx.arcTo(x, y - rearWidth / 2, x + radius, y - rearWidth / 2, radius);
        ctx.lineTo(x + length - radius, y - frontWidth / 2);
        ctx.arcTo(x + length, y - frontWidth / 2, x + length, y - frontWidth / 2 + radius, radius);
        ctx.arcTo(x + length, y + frontWidth / 2, x + length - radius, y + frontWidth / 2, radius);
        ctx.lineTo(x + radius, y + rearWidth / 2);
        ctx.arcTo(x, y + rearWidth / 2, x, y - rearWidth / 2, radius);
        ctx.closePath();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'rgba(255, 165, 0)';
        ctx.stroke();
        ctx.fill();
    }

    laserEnergy(ctx, x, y, frontWidth, rearWidth, length, radius) {
        /*if (this.isIncreasing) {
            this.shadowBlur += this.step;
            if (this.shadowBlur >= this.targetShadowBlur) {
                this.isIncreasing = false;
            }
        } else {
            this.shadowBlur -= this.step;
            if (this.shadowBlur <= 1) {
                this.isIncreasing = true;
            }
        }*/
       
        ctx.shadowColor = 'rgba(255, 165, 0)';
        ctx.shadowBlur = 4;
        this.laserForm(ctx, x, y, frontWidth, rearWidth, length, radius);
    }

    draw(ctx) {
        ctx.save();
        this.angle = Math.atan2(this.velocity.y, this.velocity.x);
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.angle);
        this.laserEnergy(ctx, -this.length / 2, 0, this.frontWidth, this.rearWidth, this.length, 5);
        ctx.restore();
    }

    update(ctx) {
        this.draw(ctx);
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

export default Projectile;