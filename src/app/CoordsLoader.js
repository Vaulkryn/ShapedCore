class CoordsLoader {
    constructor(filePath) {
        this.coords = null;
        this.filePath = filePath;
    }

    async loadCoords() {
        try {
            const response = await fetch(this.filePath);
            const text = await response.text();
            //console.log('Fichier brut JSON:\n', text);

            this.coords = JSON.parse(text);
            //console.log('Données de rendu entité:\n', this.coords);
        } catch (error) {
            console.error(error);
        }
    }

    getCoords(entity, part) {
        if (this.coords) {
            return this.coords[entity] ? this.coords[entity][part] || [] : [];
        }
        console.error('Données non trouvée:\n', entity, part);
        return [];
    }

    getAvailableCoords(entity) {
        if (this.coords && this.coords[entity]) {
            return Object.keys(this.coords[entity]);
        }
        console.error('Entité non trouvée:\n', entity);
        return [];
    }
}

export default CoordsLoader;