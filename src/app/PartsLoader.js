class PartsLoader {
    constructor(coordsLoader, config, entity) {
        this.coordsLoader = coordsLoader;
        this.entity = entity;
        this.config = config;
        this.parts = {};
    }

    async loadParts() {
        const partsToLoad = this.coordsLoader.getAvailableCoords(this.entity);
        for (const part of partsToLoad) {
            this.parts[part] = this.coordsLoader.getCoords(this.entity, part);
        }
    }

    addParts(part) {
        this.parts[part] = this.coordsLoader.getCoords(this.entity, part);
        //console.log(`Ajouté ${part}:`, this.parts[part]);
    }

    deleteParts(part) {
        delete this.parts[part];
        //console.log(`Supprimé ${part}`);
    }

    calculateCentroid(vertex) {
        const x = vertex.reduce((sum, dot) => sum + dot.x, 0) / vertex.length;
        const y = vertex.reduce((sum, dot) => sum + dot.y, 0) / vertex.length;
        return { x, y };
    }

    entityAssembler(ctx) {
        const centroid = this.calculateCentroid(this.parts.core);

        for (const part in this.parts) {
            if (this.parts.hasOwnProperty(part)) {
                this.partsFactory(ctx, this.parts[part], this.config[part], centroid);
            }
        }
    }

    partsFactory(ctx, vertex, config = {}, centroid) {
        const origin = config.origin || { x: 0, y: 0 };
        const rotation = config.rotation || 0;
        const offsetX = config.offset?.x || 0;
        const offsetY = config.offset?.y || 0;
        const scaleY = config.scaleY || 1;
        const scaleFactor = config.scaleFactor || 1;

        const correctedOffsetX = origin.x - this.config.core.origin.x + offsetX - centroid.x;
        const correctedOffsetY = origin.y - this.config.core.origin.y + offsetY - centroid.y;

        ctx.save();
        ctx.translate(0, 0);
        ctx.rotate(rotation);
        ctx.scale(1, scaleY);
        ctx.beginPath();
        ctx.moveTo((vertex[0].x + correctedOffsetX) / scaleFactor, (vertex[0].y + correctedOffsetY) / scaleFactor);
        vertex.forEach(dot => {
            ctx.lineTo((dot.x + correctedOffsetX) / scaleFactor, (dot.y + correctedOffsetY) / scaleFactor);
        });
        ctx.closePath();
        ctx.fillStyle = config.fillStyle || 'rgba(0, 0, 0, 1)';
        ctx.fill();
        ctx.restore();
    }
}

export default PartsLoader;