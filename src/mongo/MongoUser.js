const { Mongo, ENUMS } = require('../models/Mongo');
const MongoDb = new Mongo();

class MongoUser {
    constructor(id) {
        this._userid = id;
    }

    async _createNewUser() {
        const userDocument = {
            id: ""

        };

        const mongoRes = await MongoDb.insertOne(ENUMS.DCB.USERS, userDocument);

        return mongoRes;
    }

}


module.exports = { MongoUser };