const { Mongo, ENUMS } = require('../models/Mongo');
const config = require('./../../config.json');

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

    async _getLvlAndXpByRawXp(rawXp) { // Edit this the current xp calc is shit
        const xpPerLevel = 400;

        const currentLevel = Math.floor(rawXp / xpPerLevel) + 1;

        const currentXP = rawXp % xpPerLevel;

        const nextLevelXP = (currentLevel * xpPerLevel);

        return {
            level: currentLevel,
            xp: currentXP,
            neededXp: nextLevelXP
        };

        /* const baseXP = 200;

        // Define the factor by which the XP requirement increases for each level
        const increaseFactor = 5;

        // Initialize variables for level, required XP, and previous level XP
        let level = 0;
        let requiredXP = 0;
        let previousLevelXP = 0;

        // Calculate level and required XP based on the raw XP
        while (rawXp >= requiredXP) {
            level++;
            previousLevelXP = requiredXP;
            requiredXP = baseXP * increaseFactor * (level - 1) + baseXP;
        }

        // Calculate progress percentage within the current level
        const progress = Math.min(100, ((rawXp - previousLevelXP) / (requiredXP - previousLevelXP)) * 100);

        // Calculate XP needed for next level
        const neededXPForNextLevel = requiredXP - previousLevelXP;

        // Calculate current XP within the current level
        const currentXP = rawXp - previousLevelXP;

        return { rawXp, level: level - 1, progress, neededXp: neededXPForNextLevel, xp: currentXP };
    */
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