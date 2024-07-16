const { Embed, progressBar } = require('../models/Embed');
const { Mongo, ENUMS } = require('../models/Mongo');
const config = require('./../../config.json');
const Chart = require('./../models/Chart');
const schedule = require('node-schedule');

const MongoDb = new Mongo();

const getGraphAttachment = async () => {
    const getRandomColor = () => {
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 255);
        const b = Math.floor(Math.random() * 255);
        return `rgb(${r},${g},${b})`;
    }

    const getNextDate = (dateString) => {
        const date = new Date(dateString);
        date.setDate(date.getDate() + 1);
        return date.toISOString().slice(0, 10);
    }

    const pipeline = [
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

    const cursor = await MongoDb.aggregate(ENUMS.DCB.GITHUB_COMMITS, pipeline);
    const dbEntries = await cursor;

    const firstDate = dbEntries[0]._id.date;
    const lastDate = new Date().toISOString().slice(0, 10);

    const cumulativeCommits = {};

    dbEntries.forEach(entry => {
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

            currentDate = getNextDate(currentDate);
        }

        cumulativeCommits[name] = filledData;
    }

    const labels = Object.values(cumulativeCommits).flatMap(user => user.map(entry => entry.date)).filter((value, index, self) => self.indexOf(value) === index);
    const datasets = [];

    for (const [name, data] of Object.entries(cumulativeCommits)) {
        datasets.push({
            label: name,
            data: data.map(entry => entry.commits),
            borderColor: getRandomColor(),
            fill: false
        });
    }

    const chart = new Chart(1000, 600)
        .setType('line')
        .setLabels(labels);

    datasets.forEach(dataset => {
        chart.addDataset(dataset.label, dataset.data, dataset.borderColor);
    });

    return await chart.getAttachment();
}


const sendGitRankMessage = async (client) => {
    const spanEndDate = Date.now();
    const spanStartDate = spanEndDate - 24 * 60 * 60 * 1000;

    const query = {
        time: {
            $gte: spanStartDate,
            $lte: spanEndDate
        }
    };

    const documents = await MongoDb.find(ENUMS.DCB.GITHUB_COMMITS, query);

    const userStats = documents.reduce((acc, doc) => {
        const { name, repo, branchname, commitscount } = doc;
        if (!acc[name]) {
            acc[name] = { total: 0, repos: {} };
        }
        acc[name].total += commitscount;
        if (!acc[name].repos[repo]) {
            acc[name].repos[repo] = new Set();
        }
        acc[name].repos[repo].add(branchname);
        return acc;
    }, {});

    const formattedUserStats = Object.entries(userStats).map(([name, { total, repos }]) => ({
        name,
        total,
        repos: Object.entries(repos).map(([repo, branches]) => ({
            repo,
            branches: Array.from(branches)
        }))
    }));

    formattedUserStats.sort((a, b) => b.total - a.total);

    // console.dir(formattedUserStats, { depth: null });

    const place1 = "🥇";
    const place2 = "🥈";
    const place3 = "🥉";


    let description = `
### 🏆 Winner: ${formattedUserStats[0].name} 🏆

Commits: \`${formattedUserStats[0].total}\` in the last 24 hours.
### Leaderboard\n`;

    formattedUserStats.forEach((user, index) => {
        let placeMedal = "";
        if (index === 0) {
            placeMedal = place1;
        } else if (index === 1) {
            placeMedal = place2;
        } else if (index === 2) {
            placeMedal = place3;
        } else {
            placeMedal = index + 1 + ".";
        }
        description += `${placeMedal} ${user.name}: \`${user.total} commits\`\n`;
    });

    new Embed()
        .setColor(config.embeds.colors.info)
        .setDescription(description)
        .setAttachment(await getGraphAttachment())
        .setImage(`attachment://chart.png`)
        .responseToChannel(config.channels.gitranks, client)
}


const setup = (client) => {
    const job = schedule.scheduleJob('0 16 * * *', function () {
        sendGitRankMessage(client);
    });
}


module.exports = { setup };