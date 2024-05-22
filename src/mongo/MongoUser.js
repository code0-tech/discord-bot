const { Mongo, ENUMS } = require('../models/Mongo');
const config = require('./../../config.json');

const MongoDb = new Mongo();

class MongoUser {

    constructor(id = null) {
        this._userid = id;
    }

    /**
     * Create new User in Db if not present.
     */
    async init() {
        await this._loadUser();

        return this;
    }

    /**
     * Create new User in Db if not present.
     */
    async _loadUser() {
        const userData = await MongoDb.find(ENUMS.DCB.USERS, { id: this._userid });

        if (userData[0] == undefined) {
            await this._createNewUser();
        }
    }

    /**
     * get User Packet
     */
    async _getUser() {
        const userData = await MongoDb.find(ENUMS.DCB.USERS, { id: this._userid });

        return userData[0];
    }

    /**
     * setup new User
     */
    async _createNewUser() {
        const userDocument = {
            id: this._userid,
            rawxp: 0,
            stats: {
                messages: {
                    words: 0,
                    chars: 0,
                    count: 0
                },
                voice: {
                    time: 0, // in seconds
                    joins: 0,
                    switchs: 0
                }
            },
            commandstats: {}
        };

        const mongoRes = await MongoDb.insertOne(ENUMS.DCB.USERS, userDocument);

        return mongoRes;
    }

    /**
     * get Global Xp position
     */
    async getXpGlobalPosition() {
        const user = await this._getUser();

        const input = [
            { $match: { rawxp: { $gt: user.rawxp } } }, // Match documents with rawxp greater than yours
            { $group: { _id: null, count: { $sum: 1 } } } // Count the matching documents
        ]

        const result = await MongoDb.aggregate(ENUMS.DCB.USERS, input);

        const position = result.length > 0 ? result[0].count + 1 : 1;

        return position;
    }

    /**
     * get Level and Xp by raw Xp
     */
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
            level: level - 1, neededXp: requiredXP - previousLevelXP, xp: rawXp - previousLevelXP
        };
    }

    /**
     * update xp
     */
    async _updateXp(rawXp) {
        return await MongoDb.update(ENUMS.DCB.USERS, { id: this._userid }, { $set: { rawxp: rawXp } });
    }

    /**
     * update xp by number like i++ or i+= 1
     */
    async updateXpBy(incrementXp) {
        return await MongoDb.update(ENUMS.DCB.USERS, { id: this._userid }, { $inc: { ['rawxp']: incrementXp } });
    }

    /**
     * get Rank
     */
    async getRank() {
        const user = await this._getUser();
        return await this._getLvlAndXpByRawXp(user.rawxp);
    }

    /**
     * update message stats
     */
    async updateMessageStats(count = 0, word = 0, chars = 0) {
        return await MongoDb.update(
            ENUMS.DCB.USERS,
            { id: this._userid },
            {
                $inc: {
                    'stats.messages.count': count,
                    'stats.messages.words': word,
                    'stats.messages.chars': chars
                }
            }
        );
    }

    /**
     * update voice stats
     */
    async updateVoiceStats(time = 0, joins = 0, switchs = 0) {
        return await MongoDb.update(
            ENUMS.DCB.USERS,
            { id: this._userid },
            {
                $inc: {
                    'stats.voice.time': time,
                    'stats.voice.joins': joins,
                    'stats.voice.switchs': switchs
                }
            }
        );
    }


}


module.exports = { MongoUser };