class GameContext {
    constructor(canvasId) {
        this.canvasId = canvasId;
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error(`Canvas element with id ${canvasId} not found`);
            return;
        }
        const { width, height } = GameContext.contextConfig[canvasId] || {};
        this.canvas.width = width === 'full' ? window.innerWidth : (width || window.innerWidth);
        this.canvas.height = height === 'full' ? window.innerHeight : (height || window.innerHeight);

        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) {
            console.error('Failed to get 2D context');
            return;
        }
        this.initEvents();
    }

    static getInstance(canvasId) {
        if (!GameContext.instances[canvasId]) {
            GameContext.instances[canvasId] = new GameContext(canvasId);
        }
        return GameContext.instances[canvasId];
    }

    static contextConfig = {
        'background': { width: 'full', height: 'full' },
        'entities': { width: 'full', height: 'full' },
        'gameloopError': { width: 'full', height: 'full' },
    };

    static instances = {};

    getContext() {
        return this.ctx;
    }

    getWidth() {
        return this.canvas.width;
    }

    getHeight() {
        return this.canvas.height;
    }

    fillCanvas() {
        switch (this.canvasId) {
            case 'background':
                this.ctx.fillStyle = '#B5AD8F';
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                break;
            case 'entities':
                this.ctx.fillStyle = 'rgba(0, 0, 0, 0)';
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                break;
            case 'gameloopError':
                this.ctx.fillStyle = 'black';
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                break;
        }
    }

    initEvents() {
        this.canvas.addEventListener('mouseover', () => {
            this.canvas.classList.add('reticule');
        });

        this.canvas.addEventListener('mouseout', () => {
            this.canvas.classList.remove('reticule');
        });
    }
}

export default GameContext;