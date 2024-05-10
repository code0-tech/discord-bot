const { Mongo, ENUMS } = require('../models/Mongo');
const config = require('./../../config.json');

const MongoDb = new Mongo();

class MongoUser {

    constructor(id) {
        this._userid = id;
    }

    async init() {
        await this._loadUser();

        return this;
    }

    async _loadUser() {
        const userData = await MongoDb.find(ENUMS.DCB.USERS, { id: this._userid });

        if (userData[0] == undefined) {
            await this._createNewUser();
        }
    }

    async _getUser() {
        const userData = await MongoDb.find(ENUMS.DCB.USERS, { id: this._userid });

        return userData[0];
    }

    async _createNewUser() {
        const userDocument = {
            id: this._userid,
            rawxp: 0,
            commandstats: {}
        };

        const mongoRes = await MongoDb.insertOne(ENUMS.DCB.USERS, userDocument);

        return mongoRes;
    }

    async _getLvlAndXpByRawXp(rawXp) {

        const levelToXp = (x) => {
            return 100 * Math.pow(x, 2);
        }

        let level = -1;
        let requiredXP = 0;
        let previousLevelXP = 0;

        while (rawXp >= requiredXP) {
            level++;
            previousLevelXP = requiredXP;
            requiredXP = levelToXp(level);
        }

        return {
            rawXp, level: level - 1, neededXp: requiredXP - previousLevelXP, xp: rawXp - previousLevelXP
        };
    }

    async _updateXp(rawXp) {
        return await MongoDb.update(ENUMS.DCB.USERS, { id: this._userid }, { $set: { rawxp: rawXp } });
    }

    async updateXpBy(incrementXp) {
        return await MongoDb.update(ENUMS.DCB.USERS, { id: this._userid }, { $inc: { ['rawxp']: incrementXp } });
    }

    async getRank() {
        const user = await this._getUser();
        return await this._getLvlAndXpByRawXp(user.rawxp);
    }

}


module.exports = { MongoUser };