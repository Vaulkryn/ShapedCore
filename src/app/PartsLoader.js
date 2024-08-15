class PartsLoader {
    constructor(coordsLoader, config, entityName, entityObject) {
        this.coordsLoader = coordsLoader;
        this.entityName = entityName;
        this.entityObject = entityObject;
        this.config = config;
        this.parts = {};
    }

    async loadParts() {
        const partsToLoad = this.coordsLoader.getAvailableCoords(this.entityName);
        for (const part of partsToLoad) {
            this.parts[part] = this.coordsLoader.getCoords(this.entityName, part);
        }
    }

    addParts(part) {
        this.parts[part] = this.coordsLoader.getCoords(this.entityName, part);
    }

    deleteParts(part) {
        delete this.parts[part];
    }

    calculateCentroid(vertex) {
        const x = vertex.reduce((sum, dot) => sum + dot.x, 0) / vertex.length;
        const y = vertex.reduce((sum, dot) => sum + dot.y, 0) / vertex.length;
        return { x, y };
    }

    entityAssembler(ctx) {
        const centroid = this.calculateCentroid(this.parts.core);

        //this.entityObject.polygons = [];

        for (const part in this.parts) {
            if (this.parts.hasOwnProperty(part)) {
                this.partsFactory(ctx, this.parts[part], this.config[part], centroid);
                // ici envoyer le tableau de coordonnées à une fonction qui transposera sous une forme que SAT.js accepte,
                // puis envoyer le résultat à this.entityObject.polygons.
            }
        }
    }

    shapeParameters(config = {}, centroid) {
        const origin = config.origin || { x: 0, y: 0 };
        const rotation = config.rotation || 0;
        const offsetX = config.offset?.x || 0;
        const offsetY = config.offset?.y || 0;
        const scaleY = config.scaleY || 1;
        const scaleFactor = config.scaleFactor || 1;

        const correctedOffsetX = origin.x - this.config.core.origin.x + offsetX - centroid.x;
        const correctedOffsetY = origin.y - this.config.core.origin.y + offsetY - centroid.y;

        return {
            correctedOffsetX,
            correctedOffsetY,
            rotation,
            scaleY,
            scaleFactor
        };
    }

    transformVertices(dot, params) {
        let x = (dot.x + params.correctedOffsetX) / params.scaleFactor;
        let y = (dot.y + params.correctedOffsetY) / params.scaleFactor;
        y *= params.scaleY;

        const cosTheta = Math.cos(params.rotation);
        const sinTheta = Math.sin(params.rotation);

        const rotatedX = x * cosTheta - y * sinTheta;
        const rotatedY = x * sinTheta + y * cosTheta;

        return { x: rotatedX, y: rotatedY };
    }

    partsFactory(ctx, vertex, config = {}, centroid) {
        const params = this.shapeParameters(config, centroid);
        ctx.save();
        ctx.beginPath();
        const newVertex = this.transformVertices(vertex[0], params);
        ctx.moveTo(newVertex.x, newVertex.y);
        vertex.forEach(dot => {
            const transformedDot = this.transformVertices(dot, params);
            ctx.lineTo(transformedDot.x, transformedDot.y);
        });

        ctx.closePath();
        ctx.fillStyle = config.fillStyle || 'rgba(0, 0, 0, 1)';
        ctx.fill();
        ctx.restore();
    }

    verticesFactory(vertex, config = {}, centroid) {
        const params = this.shapeParameters(config, centroid);
        const newVertex = vertex.map(dot => this.transformVertices(dot, params));
        newVertex.push(newVertex[0]);
        return newVertex;
    }
}

export default PartsLoader;