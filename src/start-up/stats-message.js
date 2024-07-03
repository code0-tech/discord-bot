const { levenshteinDistance } = require('../utils/helper');
const { Embed, progressBar } = require('../models/Embed');
const { MongoUser } = require('../mongo/MongoUser');
const { waitMs } = require('../utils/time');
const config = require('../../config.json');
const { Events } = require('discord.js');
const DC = require('./../singleton/DC');

let userList = {};

const newpacket = (msg) => {
    return {
        last: {
            content: msg.content,
            length: msg.content.length,
            time: Date.now(),
            minMessageWriteTime: (msg.content.length / 10),
            messagePartsCount: msg.content.split(" ").length
        }
    }
}

const checkIfValid = async (msg) => {
    let cannotPass = false;
    let info = [];
    const userid = msg.author.id;

    if (!userList[userid]) {
        userList[userid] = newpacket(msg);
        return { notValid: cannotPass, info: info };
    }

    const repeatedChars = /(.)\1{3,}/;
    if (repeatedChars.test(msg.content)) {
        info.push('Unusual character repetition');
        cannotPass = true;
    }

    if (msg.content == userList[userid].last.content) {
        info.push('Repeated message');
        cannotPass = true;
    }

    const contentToLastDistance = levenshteinDistance(msg.content, userList[userid].last.content);
    info.push(`Levenshtein Distance: ${contentToLastDistance}`);
    if (contentToLastDistance < 3) {
        info.push('Repeated message [similar]');
        cannotPass = true;
    }

    const timeSpan = (Date.now() - userList[userid].last.time);
    info.push(`Ms between this/last msg: ${timeSpan}`);
    if (timeSpan <= 900) {
        info.push('Quick messages v1');
        cannotPass = true;
    }

    userList[userid] = newpacket(msg);

    return { notValid: cannotPass, info: info };
}


// Put this into the user mongo class later
const channelRankUpdateMessage = async (client, user) => {
    const guild = await DC.guildById(config.serverid, client);
    const rankMember = await guild.members.fetch(await user.getId());

    const { level, neededXp, xp } = await user.getRank();
    const position = await user.getXpGlobalPosition();

    new Embed()
        .setColor(config.embeds.colors.info)
        .setPbThumbnail(rankMember)
        .addInputs({
            rankuserid: await user.getId(),
            level,
            neededXp,
            xp,
            progressbar: progressBar(xp, neededXp),
            position
        })
        .addContext({ text: client.languages.english['#_rankupdate'] }, null, '#update-msg')
        .responseToChannel(config.channels.rankupdates, client)
}


const start = (client) => {
    const maxLength = config.commands.rank.maxlength;
    const maxXP = config.commands.rank.maxxp;
    const xpPerChar = config.commands.rank.xpperchar;

    client.on(Events.MessageCreate, async msg => {

        if (msg.webhookId == '1187288818840240128') { // testing something for later

            // console.dir(msg, { depth: null });

            const embedData = msg.embeds[0].data;

            const regex = /\d+(?= new commit| new commits)/;

            const matches = embedData.title.match(regex);
            if (matches) {

                const { title, description, color, url, author } = embedData;

                new Embed()
                    .setColor(config.embeds.colors.info)
                    .setTitle(title)
                    .setDescription(description + `\n\n\`\`\`filtered: ${parseInt(matches[0])} commits for ${msg.embeds[0].data.author.name}\`\`\``)
                    .setColor(color)
                    .setURL(url)
                    .setAuthor(author)
                    .responseToChannel(config.channels.spam, client)

            }
        }

        if (msg.author.bot == true) return;
        if (msg.author.system == true) return;

        const check = await checkIfValid(msg);

        console.log("")
        console.log(msg.content)
        console.log(check)

        if (check.notValid) return;

        const user = await new MongoUser(msg.author.id).init();

        const previousLevel = (await user.getRank()).level;

        const adjustedLength = Math.min(msg.content.length, maxLength);

        let xp = Math.floor(adjustedLength * xpPerChar);

        xp = Math.min(xp, maxXP);

        if (xp == 0 && msg.content.length > 1) {
            xp = 1;
        }

        await user.updateXpBy(xp);

        const lastLevel = (await user.getRank()).level;

        if (lastLevel !== previousLevel) {
            channelRankUpdateMessage(client, user);
        }

    })
}


module.exports = { start };