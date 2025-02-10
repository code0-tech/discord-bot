const { Mongo, ENUMS } = require('../models/Mongo');
const Constants = require('../../data/constants');
const Chart = require('../models/Chart');

const MongoDb = new Mongo();

class GIT_SETTINGS {
    static USERS(userArray) {
        return { filterUsers: userArray };
    }
    static REPONAMES(reponameArray) {
        return { reponameArray };
    }
    static DAILY_PACKETS(value = true) {
        return { dailyPackets: value };
    }
    static SET_START(unix) {
        return { startUnix: unix };
    }
    static SET_END(unix) {
        return { endUnix: unix };
    }
    static BRANCHNAMES(branchnameArray) {
        return { branchnameArray }
    }
}

class GIT {
    static _transformArrayToObject(arr) {
        if (!Array.isArray(arr)) {
            return {};
        }

        const result = {};

        arr.forEach(item => {
            Object.keys(item).forEach(key => {
                result[key] = item[key];
            });
        });

        return result;
    }

    static get DEFAULT_TIMES() {
        return {
            get start() {
                return 0;
            },
            get end() {
                return 99999999999999999999;
            }
        }
    }

    static async _requestMongoDb(pipeline) {
        return await MongoDb.aggregate(ENUMS.DCB.GITHUB_COMMITS, pipeline);
    }

    static async timeStartAndEnd(settings = []) {
        const options = this._transformArrayToObject(settings);

        const matchConditions = {
            time: {
                $gte: options.startUnix ?? this.DEFAULT_TIMES.start,
                $lt: options.endUnix ?? this.DEFAULT_TIMES.end
            }
        };

        const pipeline = [
            { $match: matchConditions },
            {
                $group: {
                    _id: null,
                    minTime: { $min: "$time" },
                    maxTime: { $max: "$time" }
                }
            },
            {
                $project: {
                    _id: 0,
                    startDate: {
                        $dateToString: { format: "%d-%m-%Y", date: { $toDate: "$minTime" } }
                    },
                    endDate: {
                        $dateToString: { format: "%d-%m-%Y", date: { $toDate: "$maxTime" } }
                    }
                }
            }
        ];

        const result = await this._requestMongoDb(pipeline);

        return result.length > 0 ? result[0] : { startDate: null, endDate: null };
    }

    static async getAllUniqueNames(settings = []) {
        const options = this._transformArrayToObject(settings);

        const matchConditions = {
            time: {
                $gte: options.startUnix ?? this.DEFAULT_TIMES.start,
                $lt: options.endUnix ?? this.DEFAULT_TIMES.end
            }
        };

        if (options.filterUsers && options.filterUsers.length > 0) {
            matchConditions.name = { $in: options.filterUsers };
        }

        const pipeline = [
            { $match: matchConditions },
            { $group: { _id: "$name" } },
            { $project: { _id: 0, name: "$_id" } }
        ];

        const result = await this._requestMongoDb(pipeline);

        return result.map(item => item.name);
    }

    static async getAllRepos(settings = []) {
        const options = this._transformArrayToObject(settings);

        const matchConditions = {
            time: {
                $gte: options.startUnix ?? this.DEFAULT_TIMES.start,
                $lt: options.endUnix ?? this.DEFAULT_TIMES.end
            }
        };

        if (options.filterUsers && options.filterUsers.length > 0) {
            matchConditions.name = { $in: options.filterUsers };
        }

        const pipeline = [
            { $match: matchConditions },
            { $group: { _id: "$repo" } },
            { $project: { _id: 0, repo: "$_id" } }
        ];

        const result = await this._requestMongoDb(pipeline);

        return result.map(item => item.repo);
    }

    static async simpleSort(settings = []) {
        const options = this._transformArrayToObject(settings);

        const matchConditions = {
            time: {
                $gte: options.startUnix ?? this.DEFAULT_TIMES.start,
                $lt: options.endUnix ?? this.DEFAULT_TIMES.end
            }
        };

        if (options.filterUsers && options.filterUsers.length > 0) {
            matchConditions.name = { $in: options.filterUsers };
        }

        if (options.reponameArray && options.reponameArray.length > 0) {
            matchConditions.repo = { $in: options.reponameArray };
        }

        if (options.branchnameArray && options.branchnameArray.length > 0) {
            matchConditions.branchname = { $in: options.branchnameArray };
        }

        const pipeline = [
            { $match: matchConditions },
            { $sort: { time: 1 } }
        ];

        if (options.dailyPackets) {
            pipeline.push(
                {
                    $group: {
                        _id: {
                            name: "$name",
                            date: {
                                $dateToString: { format: "%Y-%m-%d", date: { $toDate: "$time" } }
                            }
                        },
                        dailyCommits: { $sum: "$commitscount" },
                        branchnames: { $addToSet: "$branchname" }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        name: "$_id.name",
                        date: "$_id.date",
                        branchnames: 1,
                        dailyCommits: 1
                    }
                }
            );
        }

        return await this._requestMongoDb(pipeline);
    }
}

const run = async () => {
    const res = await GIT.simpleSort([
        GIT_SETTINGS.USERS(['Taucher2003']),
        GIT_SETTINGS.DAILY_PACKETS(true),
        // GIT_SETTINGS.BRANCHNAMES(['259-remove-screenshot-testing'])
    ]);

    const res2 = await GIT.getAllUniqueNames([]);

    const res3 = await GIT.getAllRepos([]);

    console.dir(res);
    console.dir(res2);
    console.dir(res3);

}

// run();


module.exports = { GIT, GIT_SETTINGS };