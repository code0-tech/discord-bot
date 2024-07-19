const { SimpleTable } = require('../models/SimpleTable');
const GITCOMMITS = require('./../singleton/GITCOMMITS');
const { Mongo, ENUMS } = require('../models/Mongo');
const Constants = require('../../data/constants');
const config = require('./../../config.json');
const { Embed } = require('../models/Embed');
const schedule = require('node-schedule');

const MongoDb = new Mongo();

const placeMedals = [
    Constants.DISCORD.EMOJIS.FIRSTPLACE,
    Constants.DISCORD.EMOJIS.SECONDPLACE,
    Constants.DISCORD.EMOJIS.THIRDPLACE
];

const totalDays = async () => {
    const result = await MongoDb.aggregate(ENUMS.DCB.GITHUB_COMMITS, [
        { $group: { _id: null, minTime: { $min: '$time' } } }
    ])

    const time = result.length > 0 ? result[0].minTime : null;

    const now = Date.now();
    const differenceInMillis = now - time;
    const days = Math.floor(differenceInMillis / (1000 * 60 * 60 * 24));
    return `${days}`;
}

const fetchGitCommits = async (spanStartDate, spanEndDate) => {
    const query = {
        time: {
            $gte: spanStartDate,
            $lte: spanEndDate
        }
    };
    return await MongoDb.find(ENUMS.DCB.GITHUB_COMMITS, query);
}

const calculateUserStats = (documents) => {
    return documents.reduce((acc, doc) => {
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
}

const formatUserStats = (userStats) => {
    return Object.entries(userStats).map(([name, { total, repos }]) => ({
        name,
        total,
        repos: Object.entries(repos).map(([repo, branches]) => ({
            repo,
            branches: Array.from(branches)
        }))
    })).sort((a, b) => b.total - a.total);
}

const fetchAllCommitsCounts = async (names) => {
    const results = await MongoDb.aggregate(ENUMS.DCB.GITHUB_COMMITS, [
        { $match: { name: { $in: names } } },
        { $group: { _id: '$name', totalCommits: { $sum: '$commitscount' } } }
    ]);

    return results.reduce((acc, { _id, totalCommits }) => {
        acc[_id] = totalCommits;
        return acc;
    }, {});
}

const updatePackets = (formattedUserStats, commitsCounts) => {
    return formattedUserStats.map(packet => ({
        name: packet.name,
        total: packet.total,
        alldaystotal: commitsCounts[packet.name]
    }));
}

const buildLeaderboardDescription = async (formattedUserStats, updatedPackets) => {
    let description = `
### ${Constants.DISCORD.EMOJIS.TROPHY} Winner: ${formattedUserStats[0].name} ${Constants.DISCORD.EMOJIS.TROPHY}

The winner made \`${formattedUserStats[0].total}\` commits in the last 24 hours.
### Commits Leaderboard\n`;

    formattedUserStats.forEach((user, index) => {
        const placeMedal = placeMedals[index] || `${index + 1}.`;
        description += `${placeMedal} ${user.name}: \`${user.total} commits\`\n`;
    });

    return description;
}

const createEmbedMessage = async (description) => {
    return new Embed()
        .setColor(config.embeds.colors.info)
        .setDescription(description)
        .setAttachment(await GITCOMMITS.getAttachment())
        .setFooter(`Stats over the last ${await totalDays()} days.`)
        .setImage(`attachment://chart.png`);
}

const sendGitRankMessage = async (client) => {
    const spanEndDate = Date.now();
    const spanStartDate = spanEndDate - 24 * 60 * 60 * 1000;

    const documents = await fetchGitCommits(spanStartDate, spanEndDate);
    const userStats = calculateUserStats(documents);
    const formattedUserStats = formatUserStats(userStats);
    const names = formattedUserStats.map(packet => packet.name);
    const commitsCounts = await fetchAllCommitsCounts(names);
    const updatedPackets = updatePackets(formattedUserStats, commitsCounts);
    const description = await buildLeaderboardDescription(formattedUserStats, updatedPackets);
    const embed = await createEmbedMessage(description);

    if (client == null) {
        return embed; // for debug only
    }

    embed.responseToChannel(config.channels.gitranks, client);

    console.log(`[Git-ranks] sent message to channel.`, Constants.CONSOLE.WORKING);
}

const setup = (client) => {
    const job = schedule.scheduleJob('0 16 * * *', function () {
        sendGitRankMessage(client);
    });
}

const debug_sendGitRankMessage = async () => {
    return await sendGitRankMessage(null);
}


module.exports = { setup, debug_sendGitRankMessage };