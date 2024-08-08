const { getNextDayByDateString } = require('../utils/time');
const { getColorByString } = require('../utils/color');
const { Mongo, ENUMS } = require('../models/Mongo');
const Constants = require('../../data/constants');
const Chart = require('../models/Chart');

const MongoDb = new Mongo();

class GITCOMMITSTOTAL {
    static getCommitsMongo = async () => {
        const startFromXXdaysAgo = new Date();
        startFromXXdaysAgo.setDate(startFromXXdaysAgo.getDate() - Constants.GIT.START_DAYS_BACK_FROM_TODAY);

        const pipeline = [
            {
                $match: {
                    time: { $gte: startFromXXdaysAgo.getTime() }
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
                $sort: { "_id.date": 1 }
            }
        ];

        const dbData = await MongoDb.aggregate(ENUMS.DCB.GITHUB_COMMITS, pipeline);

        return dbData;
    }

    static formatGitData = async (dbData) => {
        const firstDate = dbData[0]._id.date;
        const lastDate = new Date().toISOString().slice(0, 10);

        const cumulativeCommits = {};

        dbData.forEach(entry => {
            const { name, date } = entry._id;
            const dailyCommits = entry.dailyCommits;

            if (!cumulativeCommits[name]) {
                cumulativeCommits[name] = [];
            }

            cumulativeCommits[name].push({ date, commits: dailyCommits });
        });

        for (const name in cumulativeCommits) {
            const userData = cumulativeCommits[name];
            const allDates = userData.map(entry => entry.date);

            const filledData = [];
            let currentDate = firstDate;
            let currentIndex = 0;
            let currentCumulative = 0;

            while (currentDate <= lastDate) {
                if (currentIndex < userData.length && allDates[currentIndex] === currentDate) {
                    currentCumulative += userData[currentIndex].commits;
                    filledData.push({ date: currentDate, commits: currentCumulative });
                    currentIndex++;
                } else {
                    filledData.push({ date: currentDate, commits: currentCumulative });
                }

                currentDate = getNextDayByDateString(currentDate);
            }

            cumulativeCommits[name] = filledData;
        }

        const labels = Object.values(cumulativeCommits).flatMap(user => user.map(entry => entry.date)).filter((value, index, self) => self.indexOf(value) === index);
        const datasets = [];

        for (const [name, data] of Object.entries(cumulativeCommits)) {
            datasets.push({
                label: name,
                data: data.map(entry => entry.commits),
                borderColor: getColorByString(name, Constants.SEEDS.GITCHART),
                fill: false
            });
        }

        return { datasets, labels };
    }

    static makeChartByDataset = (datasets, labels) => {
        const chart = new Chart(Constants.GIT.GRAPH.SIZEX, Constants.GIT.GRAPH.SIZEY)
            .setType('line')
            .setLabels(labels);

        datasets.forEach(dataset => {
            chart.addDataset(dataset.label, dataset.data, dataset.borderColor);
        });

        return chart;
    }

    static getAttachment = async () => {
        const dbData = await this.getCommitsMongo();
        const { datasets, labels } = await this.formatGitData(dbData);
        const chart = this.makeChartByDataset(datasets, labels);

        return await chart.getAttachment();
    }
}


module.exports = GITCOMMITSTOTAL;