class EntityMovementEffect {
    constructor(entity = 'default', squaresAmount = 20, zone = 40, offsetDist = 10) {
        this.color = this.getColorForEntity(entity);
        this.squaresAmount = squaresAmount;
        this.zone = zone;
        this.offsetDist = offsetDist;
        this.squares = [];
    }

    getColorForEntity(entityName) {
        const colors = {
            'player': 'rgba(255, 255, 255)',
            'enemy': 'rgba(225, 225, 225)',
            'default': 'rgba(225, 225, 225)',
        };
        return colors[entityName] || colors['default'];
    }

    createSquare(x, y) {
        const appearTime = Date.now();
        const lifeSpan = Math.random() * 1000;
        const rotation = Math.random() * 360;
        const size = 12;
        this.squares.push({ x, y, size, rotation, appearTime, lifeSpan });
    }

    drawSquares(ctx) {
        const now = Date.now();
        for (let i = this.squares.length - 1; i >= 0; i--) {
            const square = this.squares[i];
            const elapsed = now - square.appearTime;
            const progress = elapsed / square.lifeSpan;

            if (progress >= 1) {
                this.squares.splice(i, 1);
                continue;
            }

            const alpha = 1 - progress;
            const initialSize = square.size;
            const finalSize = square.size / 2;
            const currentSize = initialSize - (initialSize - finalSize) * progress;

            ctx.save();
            ctx.translate(square.x, square.y);
            ctx.rotate(square.rotation * Math.PI / 180);
            ctx.shadowBlur = 0;
            ctx.fillStyle = this.color.replace('ALPHA', alpha);

            const radius = 1;
            const halfSize = currentSize / 2.5;

            ctx.beginPath();
            ctx.moveTo(-halfSize + radius, -halfSize);
            ctx.lineTo(halfSize - radius, -halfSize);
            ctx.quadraticCurveTo(halfSize, -halfSize, halfSize, -halfSize + radius);
            ctx.lineTo(halfSize, halfSize - radius);
            ctx.quadraticCurveTo(halfSize, halfSize, halfSize - radius, halfSize);
            ctx.lineTo(-halfSize + radius, halfSize);
            ctx.quadraticCurveTo(-halfSize, halfSize, -halfSize, halfSize - radius);
            ctx.lineTo(-halfSize, -halfSize + radius);
            ctx.quadraticCurveTo(-halfSize, -halfSize, -halfSize + radius, -halfSize);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }
    }

    update(unit, ctx) {
        this.drawSquares(ctx);
        if (unit.isMoving()) {
            while (this.squares.length < this.squaresAmount) {
                const unitPosition = unit.getPosition();
                const unitRotation = unit.getAngle();
                const offsetDistance = this.offsetDist;
                const baseOffsetX = Math.cos(unitRotation + Math.PI / 2) * offsetDistance;
                const baseOffsetY = Math.sin(unitRotation + Math.PI / 2) * offsetDistance;
                const variationRange = this.zone;
                const randomOffsetX = baseOffsetX + (Math.random() - 0.5) * variationRange;
                const randomOffsetY = baseOffsetY + (Math.random() - 0.5) * variationRange;
                this.createSquare(unitPosition.x + randomOffsetX, unitPosition.y + randomOffsetY);
            }
        }
    }
}

export default EntityMovementEffect;