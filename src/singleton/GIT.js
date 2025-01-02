/* const { Mongo, ENUMS } = require('../models/Mongo');
const Constants = require('../../data/constants');
const Chart = require('../models/Chart');

const MongoDb = new Mongo();

const getData = async (pipeline = []) => {
    return await MongoDb.aggregate(ENUMS.DCB.GITHUB_COMMITS, pipeline);
};

const test = async () => {
    const currentDate = new Date();
    const currentTimestamp = currentDate.getTime();
    const adjustedTimestamp = currentTimestamp - (Constants.GIT.START_DAYS_BACK_FROM_TODAY * Constants.TIME_MULTIPLIER_MS.DAY);
    const adjustedDate = new Date(adjustedTimestamp);

    const pipeline = [
        {
            $match: {
                time: { $gte: adjustedDate.getTime() }
            }
        },
        {
            $sort: { time: 1 }
        },
        {
            $group: {
                _id: {
                    name: "$name",
                    date: {
                        $dateToString: { format: "%Y-%m-%d", date: { $toDate: "$time" } }
                    }
                },
                dailyCommits: { $sum: "$commitscount" }
            }
        },
        {
            $project: {
                _id: 0,
                name: "$_id.name",
                date: "$_id.date",
                dailyCommits: 1
            }
        }
    ];

    console.dir(await getData(pipeline), { depth: null });
};


module.exports = { test }; */