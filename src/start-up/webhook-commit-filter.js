const { Mongo, ENUMS } = require('../models/Mongo');
const { Embed } = require('../models/Embed');
const config = require('../../config.json');
const { Events } = require('discord.js');
const DC = require('../singleton/DC');

const MongoDb = new Mongo();

const handleGitHubCommitMessage = async (client, msg) => {
    try {
        if (msg.webhookId !== config.github.dcwebhookid) return;

        const embedData = msg.embeds[0]?.data;
        if (!embedData) return;

        const regexCommitCount = /\d+(?= new commit| new commits)/;
        const matches = embedData.title.match(regexCommitCount);
        if (!matches) return;

        const regexRepoInfo = /\[(.*?):(.*?)\]/;
        const githubInfo = regexRepoInfo.exec(embedData.title);
        if (!githubInfo || githubInfo.length < 3) return;

        const repo = githubInfo[1];
        const branchName = githubInfo[2];

        const commitCount = parseInt(matches[0]);

        const doc = {
            name: embedData.author.name,
            id: null,
            repo,
            branchname: branchName,
            commitscount: commitCount,
            time: Date.now()
        };

        await MongoDb.insertOne(ENUMS.DCB.GITHUB_COMMITS, doc);

        const { title, description, color, url, author } = embedData;

        const embed = new Embed()
            .setColor(config.embeds.colors.info)
            .setTitle(title)
            .setDescription(`${description}\n\n\`\`\`filtered: ${commitCount} commits for ${embedData.author.name}\`\`\``)
            .setColor(color)
            .setURL(url)
            .setAuthor(author);

        embed.responseToChannel(config.channels.spam, client);
    } catch (error) {
        console.error('Error handling GitHub commit message:', error);
    }
};

const start = (client) => {
    client.on(Events.MessageCreate, async (msg) => {
        await handleGitHubCommitMessage(client, msg);
    });
};


module.exports = { start };