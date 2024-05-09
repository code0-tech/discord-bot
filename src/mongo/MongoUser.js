const { Mongo, ENUMS } = require('../models/Mongo');
const MongoDb = new Mongo();

class MongoUser {

    constructor(id, load = true) {
        this._userid = id;

        if (load == true) {
            this._loadUser();
        }
    }

    async _loadUser() {
        const userData = await MongoDb.find(ENUMS.DCB.USERS, { id: this._userid });

        if (userData[0] == undefined) {
            this._createNewUser();
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
        const baseXP = 400; // Base XP required for level 0
        const xpToLevelRatio = 2; // XP required multiplier for each level

        if (rawXp <= 0) {
            return { level: 0, progress: 0, neededXp: baseXP, xp: 0 };
        }

        let level = 1; // Start from level 1
        let requiredXP = baseXP;

        while (rawXp >= requiredXP) {
            level++;
            requiredXP = Math.floor(baseXP * (Math.pow(xpToLevelRatio, level)));
        }

        const previousLevelXP = Math.floor(baseXP * (Math.pow(xpToLevelRatio, level - 2)));
        const xpNeededForLevel = requiredXP - previousLevelXP;
        const progress = (rawXp - previousLevelXP) / xpNeededForLevel;
        const xp = rawXp - previousLevelXP;

        return { level: level - 1, progress, neededXp: xpNeededForLevel, xp };
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


/* 


// const { level, progress, neededXp, xp } = await this._getLvlAndXpByRawXp(rawXp);
// console.log(`RawXp: ${rawXp} => xp: ${xp} lvl: ${level}, progress ${(progress * 100).toFixed(2)}%, neededXp: ${neededXp}`);


function getLevel(xp) {
    const baseXP = 400; // Base XP required for level 1
    const xpToLevelRatio = 1.5; // XP required multiplier for each level

    let level = 0;
    let requiredXP = 0;

    while (xp >= requiredXP) {
        level++;
        requiredXP = Math.floor(baseXP * (Math.pow(xpToLevelRatio, level - 1)));
    }

    const previousLevelXP = Math.floor(baseXP * (Math.pow(xpToLevelRatio, level - 2)));
    const xpNeededForLevel = requiredXP - previousLevelXP;
    const progress = (xp - previousLevelXP) / xpNeededForLevel;

    return { level, progress };
}

// Example usage:
const rawXP = 1029;
const { level, progress } = getLevel(rawXP);
console.log(`Level ${level}, Progress: ${progress * 100}%`);
 */