const { SlashCommandBuilder } = require('@discordjs/builders');
const { MongoUser } = require('./../mongo/MongoUser');
const { Mongo, ENUMS } = require('../models/Mongo');
const { TableBuilder } = require('../models/table');
const { Embed } = require('../models/Embed');
const config = require('../../config.json');
const DC = require('./../singleton/DC');

const MongoDb = new Mongo();

const data = new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Display the leaderboard of top users.')
    .addIntegerOption(option =>
        option
            .setName('limit')
            .setDescription('Specify the number of users to display (1-20).')
            .setMinValue(1)
            .setMaxValue(20)
            .setRequired(false)
    );


const listUser = async (limit) => {
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
    await DC.defer(interaction);

    const limit = interaction.options.getInteger('limit') ?? config.commands.leaderboard.baselistlimit;

    const userList = await listUser(limit);

    let data = [];

    const mongoUser = new MongoUser();

    for (let i = 0; i < userList.length; i++) {
        const user = userList[i];

        let leadboardMember = await DC.memberById(user.id, guild);

        if (leadboardMember == undefined) {
            leadboardMember = { nickname: `[${lang.text['left-server']}]` };
        }

        if (user.rawxp == 0) return;

        const { level, neededXp, xp } = await mongoUser._getLvlAndXpByRawXp(user.rawxp);

        let username = leadboardMember.nickname == null ? leadboardMember.user.username : leadboardMember.nickname;

        if (username.length > config.commands.leaderboard.maxnamelength) {
            username = username.substring(0, (config.commands.leaderboard.maxnamelength - 3)) + "...";
        }

        data.push({ name: username, lvl: level, xp: `[${xp}|${neededXp}]` });

        if ((i + 1) % 5 == 0) {
            sendMessage(interaction, member, lang, data);
        }
    }

    sendMessage(interaction, member, lang, data);
};


module.exports = { execute, data };