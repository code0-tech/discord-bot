class AsyncManager {
    constructor() {
        this.actions = {};
    }

    generateId() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1_000_000);
        return `${timestamp}-${random}`;
    }

    // add the rest of the functions
}


module.exports = AsyncManager;