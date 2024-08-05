import GameContext from './GameContext.js';

class Map {
    constructor() {
        this.gameContext = new GameContext('background');
        this.ctx = this.gameContext.getContext();
        this.canvasWidth = this.gameContext.getWidth();
        this.canvasHeight = this.gameContext.getHeight();
    }

    grid() {
        const spacing = 34;
        this.ctx.shadowBlur = 0;
        this.ctx.shadowColor = "transparent";
        this.ctx.strokeStyle = `rgba(255, 255, 255, 0.4)`;
        this.ctx.lineWidth = 1;
        for (let x = 0; x <= this.canvasWidth; x += spacing) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvasHeight);
            this.ctx.stroke();
        }
        for (let y = 0; y <= this.canvasHeight; y += spacing) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvasWidth, y);
            this.ctx.stroke();
        }
    }

    innerShadow() {
        const shadowWidth = 30;
        const innerColor = 'rgba(0, 0, 0, 0.6)';
        const outerColor = 'rgba(0, 0, 0, 0)';
        this.ctx.shadowBlur = 4;
        this.ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
        // Top
        let gradient = this.ctx.createLinearGradient(0, 0, 0, shadowWidth);
        gradient.addColorStop(0, innerColor);
        gradient.addColorStop(1, outerColor);
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvasWidth, shadowWidth);
        // Bottom
        gradient = this.ctx.createLinearGradient(0, this.canvasHeight - shadowWidth, 0, this.canvasHeight);
        gradient.addColorStop(0, outerColor);
        gradient.addColorStop(1, innerColor);
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, this.canvasHeight - shadowWidth, this.canvasWidth, shadowWidth);
        // Left
        gradient = this.ctx.createLinearGradient(0, 0, shadowWidth, 0);
        gradient.addColorStop(0, innerColor);
        gradient.addColorStop(1, outerColor);
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, shadowWidth, this.canvasHeight);
        // Right
        gradient = this.ctx.createLinearGradient(this.canvasWidth - shadowWidth, 0, this.canvasWidth, 0);
        gradient.addColorStop(0, outerColor);
        gradient.addColorStop(1, innerColor);
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(this.canvasWidth - shadowWidth, 0, shadowWidth, this.canvasHeight);
    }

    draw() {
        this.grid();
        this.innerShadow();
    }
}

export default Map;