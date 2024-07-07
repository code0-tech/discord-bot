const { levenshteinDistance } = require('../utils/helper');
const { Embed, progressBar } = require('../models/Embed');
const { Mongo, ENUMS } = require('../models/Mongo');
const { MongoUser } = require('../mongo/MongoUser');
const { waitMs } = require('../utils/time');
const config = require('../../config.json');
const { Events } = require('discord.js');
const DC = require('./../singleton/DC');

const MongoDb = new Mongo();

const start = (client) => {
    client.on(Events.MessageCreate, async msg => {

        if (msg.webhookId !== config.github.dcwebhookid) return;

        const embedData = msg.embeds[0].data;

        const regex = /\d+(?= new commit| new commits)/;

        const matches = embedData.title.match(regex);
        if (!matches) return;

        const regex2 = /\[(.*?):(.*?)\]/;

        const github = regex2.exec(embedData.title);
        const repo = github[1];
        const branchName = github[2];

        const doc = {
            name: msg.embeds[0].data.author.name,
            id: null,
            repo,
            branchname: branchName,
            commitscount: parseInt(matches[0]),
            time: Date.now()
        }

        MongoDb.insertOne(ENUMS.DCB.GITHUB_COMMITS, doc);

        const { title, description, color, url, author } = embedData;

        new Embed()
            .setColor(config.embeds.colors.info)
            .setTitle(title)
            .setDescription(description + `\n\n\`\`\`filtered: ${parseInt(matches[0])} commits for ${msg.embeds[0].data.author.name}\`\`\``)
            .setColor(color)
            .setURL(url)
            .setAuthor(author)
            .responseToChannel(config.channels.spam, client)



    })
}


module.exports = { start };