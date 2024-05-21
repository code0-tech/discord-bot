const config = require('./../../config.json');

class Mongo {
    constructor() {
        this.client = global.mongoClient;
    }

    async _getWhere(where) {
        const db = this.client.db(where.db);
        const col = db.collection(where.t);
        return col;
    }

    async find(where, query = {}) {
        try {
            const col = await this._getWhere(where);
            const result = await col.find(query).toArray();
            return result;
        } catch (error) {
            console.error('Error finding documents:', error);
            throw error;
        }
    }

    async aggregate(where, input) {
        const col = await this._getWhere(where);
        const result = await col.aggregate(input).toArray();
        return result;
    }

    async insertOne(where, document) {
        try {
            const col = await this._getWhere(where);
            const result = await col.insertOne(document);
            return result.insertedId;
        } catch (error) {
            console.error('Error inserting document:', error);
            throw error;
        }
    }

    async update(where, query = {}, update = {}) {
        try {
            const col = await this._getWhere(where);
            const result = await col.updateOne(query, update);
            return result;
        } catch (error) {
            console.error('Error updating document:', error);
            throw error;
        }
    }
}

const ENUMS = { // maybe put in config
    DCB: {
        USERS: { "db": "Code0", "t": "users" },
        LOGS: { "db": "Code0", "t": "logs" },
    }
};

module.exports = { Mongo, ENUMS };