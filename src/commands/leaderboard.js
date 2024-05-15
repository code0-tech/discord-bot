const { SlashCommandBuilder } = require('@discordjs/builders');
const { MongoUser } = require('./../mongo/MongoUser');
const { Mongo, ENUMS } = require('../models/Mongo');
const { getUser } = require('./../discord/user');
const { Embed } = require('../models/Embed');
const config = require('../../config.json');

const MongoDb = new Mongo();

const data = new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Check which user\'s are the top 10 best.')
    .addIntegerOption(option =>
        option
            .setName('limit')
            .setDescription('How many users should be display')
            .setMinValue(1)
            .setMaxValue(100)
            .setRequired(false)
    )

const listUser = async (limit = 10) => {

    const list = await MongoDb.aggregate(ENUMS.DCB.USERS, [
        { $sort: { rawxp: -1 } },
        { $limit: limit }
    ])

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

    const limit = interaction.options._hoistedOptions.length !== 0 ? interaction.options._hoistedOptions[0].value : 10;

    const userList = await listUser(limit);

    let stringList = ``;

    const mongoUser = new MongoUser();

    for (let i = 0; i < userList.length; i++) {
        const user = userList[i];

        let leadboardMember = await getUser(guild, user.id);

        if (leadboardMember == null) {
            leadboardMember = { user: { username: '[Left the server]' } };
        }

        const { level, neededXp, xp } = await mongoUser._getLvlAndXpByRawXp(user.rawxp);

        const username = leadboardMember.nickname == null ? leadboardMember.user.username : leadboardMember.nickname;

        // ${user.id == member.user.id ? '[' : ''}
        // ${user.id == member.user.id ? '](' + config.urls.code0 + ')' : ''}

        stringList += `\n${i + 1}. ${username} \`Level: ${level} [${xp}|${neededXp}]\``;

        if ((i + 1) % 5 == 0) {
            sendMessage(interaction, member, lang, stringList);
        }
    }

    sendMessage(interaction, member, lang, stringList);

};


const componentIds = [];

module.exports = { execute, componentIds, data };