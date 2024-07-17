const { Embed, progressBar } = require('../models/Embed');
const GITCOMMITS = require('./../singleton/GITCOMMITS');
const { Mongo, ENUMS } = require('../models/Mongo');
const Constants = require('../../data/constants');
const config = require('./../../config.json');
const schedule = require('node-schedule');


const MongoDb = new Mongo();

const placeMedals = [
    Constants.DISCORD.EMOJIS.FIRSTPLACE,
    Constants.DISCORD.EMOJIS.SECONDPLACE,
    Constants.DISCORD.EMOJIS.THIRDPLACE
];

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

    let description = `
### ${Constants.DISCORD.EMOJIS.TROPHY} Winner: ${Constants.DISCORD.EMOJIS.TROPHY}

Commits: \`${formattedUserStats[0].total}\` in the last 24 hours.
### Leaderboard\n`;

    formattedUserStats.forEach((user, index) => {
        const placeMedal = placeMedals[index] || `${index + 1}.`;
        description += `${placeMedal} ${user.name}: \`${user.total} commits\`\n`;
    });

    new Embed()
        .setColor(config.embeds.colors.info)
        .setDescription(description)
        .setAttachment(await GITCOMMITS.getAttachment())
        .setImage(`attachment://chart.png`)
        .responseToChannel(config.channels.gitranks, client);

    console.log(`[Git-ranks] sent message to channel.`, Constants.CONSOLE.WORKING);
}


const setup = (client) => {
    const job = schedule.scheduleJob('0 16 * * *', function () {
        sendGitRankMessage(client);
    });
}


module.exports = { setup };