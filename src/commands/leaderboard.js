const { SlashCommandBuilder } = require('@discordjs/builders');
const { MongoUser } = require('./../mongo/MongoUser');
const { Mongo, ENUMS } = require('../models/Mongo');
const { TableBuilder } = require('../models/table');
const { getUser } = require('./../discord/user');

const { Embed } = require('../models/Embed');

const config = require('../../config.json');

const MongoDb = new Mongo();

const data = new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Show the leaderboard with the best 10 users.')
    .addIntegerOption(option =>
        option
            .setName('limit')
            .setDescription('How many users should be displayed.')
            .setMinValue(1)
            .setMaxValue(20)
            .setRequired(false)
    )


const listUser = async (limit = 10) => {

    const list = await MongoDb.aggregate(ENUMS.DCB.USERS, [
        { $sort: { rawxp: -1 } },
        { $limit: limit }
    ])

    return list;
}


const sendMessage = (interaction, member, lang, data) => {

    const longestNameLength = Math.max(...data.map(entry => entry.name.length)) + 3;
    const longestLevelLength = Math.max(...data.map(entry => entry.lvl.toString().length)) + 4;
    const longestXPLength = Math.max(...data.map(entry => entry.xp.toString().length)) + 2;

    const columns = [
        { label: 'Name', field: 'name', width: longestNameLength },
        { label: 'Lvl.', field: 'lvl', width: longestLevelLength },
        { label: 'Xp', field: 'xp', width: longestXPLength }
    ];

    const tableBuilder = new TableBuilder(columns);

    tableBuilder.addRows(...data);


    new Embed()
        .setColor(config.embeds.colors.info)
        .addInputs({ stringlist: tableBuilder.build() })
        .addContext(lang, member, 'board')
        .interactionResponse(interaction);
}


const execute = async (interaction, client, guild, member, lang) => {
    await interaction.deferReply({ ephemeral: true });

    const limit = interaction.options._hoistedOptions.length !== 0 ? interaction.options._hoistedOptions[0].value : 10;

    const userList = await listUser(limit);

    let data = [];

    const mongoUser = new MongoUser();

    for (let i = 0; i < userList.length; i++) {
        const user = userList[i];

        let leadboardMember = await getUser(user.id, guild);

        if (leadboardMember == null) {
            leadboardMember = { user: { username: '[Left the server]' } };
        }

        if (user.rawxp == 0) return;

        const { level, neededXp, xp } = await mongoUser._getLvlAndXpByRawXp(user.rawxp);

        let username = leadboardMember.nickname == null ? leadboardMember.user.username : leadboardMember.nickname;

        if (username.length > 20) {
            username = username.substring(0, 17) + "...";
        }

        data.push({ name: username, lvl: level, xp: `[${xp}|${neededXp}]` });

        if ((i + 1) % 5 == 0) {
            sendMessage(interaction, member, lang, data);
        }
    }

    sendMessage(interaction, member, lang, data);

};


const componentIds = [];

module.exports = { execute, componentIds, data };