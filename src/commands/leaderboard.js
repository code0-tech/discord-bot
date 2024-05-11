const { SlashCommandBuilder } = require('@discordjs/builders');
const { MongoUser } = require('./../mongo/MongoUser');
const { Mongo, ENUMS } = require('../models/Mongo');
const { Embed } = require('../models/Embed');
const config = require('../../config.json');

const MongoDb = new Mongo();

const data = new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Check which user\'s are the top 10 best.')

const listUser = async (guild, limit = 10) => {

    const list = await MongoDb.aggregate(ENUMS.DCB.USERS, [
        { $sort: { rawxp: -1 } },
        { $limit: limit }
    ])

    // const newList = await list.map(async (item) => ({ ...item, username: await guild.members.fetch(item.id) }));

    return list;
}

const sendMessage = (interaction, member, lang, stringList) => {
    new Embed()
        .setColor(config.embeds.colors.info)
        .addInputs({ stringlist: stringList })
        .addContext(lang, member, 'board')
        .interactionResponse(interaction);
}


const execute = async (interaction, client, guild, member, lang) => {
    await interaction.deferReply({ ephemeral: true });

    const userList = await listUser(guild);

    let stringList = ``;

    const mongoUser = new MongoUser('none');

    for (let i = 0; i < userList.length; i++) {
        const user = userList[i];

        const leadboardMember = await guild.members.fetch(user.id);

        const { level, neededXp, xp } = await mongoUser._getLvlAndXpByRawXp(user.rawxp);

        const username = leadboardMember.nickname == null ? leadboardMember.user.username : leadboardMember.nickname;

        stringList += `\n${user.id == member.user.id ? '[' : ''}${i + 1}.${user.id == member.user.id ? '](' + config.urls.code0 + ')' : ''} ${username} Level: ${level} [${xp}|${neededXp}] `;

        if (i == 0 || i == 5) {
            sendMessage(interaction, member, lang, stringList);
        }
    }

    sendMessage(interaction, member, lang, stringList);

};


const componentIds = [];

module.exports = { execute, componentIds, data };