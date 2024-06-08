const { ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionFlagsBits } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { convertUnixToTimestamp } = require("../utils/time");
const { Mongo, ENUMS } = require('../models/Mongo');
const { Embed } = require('./../models/Embed');
const config = require('./../../config.json');

const data = new SlashCommandBuilder()
    .setName('logs')
    .setDescription('Show Code0 Bot logs.')
    .addSubcommand(subcommand =>
        subcommand
            .setName('show')
            .setDescription('Show current session logs.')
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('view')
            .setDescription('View older logs.')
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('list')
            .setDescription('Get a list of Logs.')
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)


const getLogs = async (runid) => {
    const MongoDb = new Mongo();
    const results = await MongoDb.find(ENUMS.DCB.LOGS, { run_id: runid });

    return results[0];
}


const sessionRunId = () => {
    return process['dclogger'].runid;
}


const getLogsWithRange = async (runid, start, end) => {
    const logFile = await getLogs(runid);
    const createdAt = convertUnixToTimestamp(logFile.created_at);

    // check slice length

    const totalLength = logFile.logs.length;
    const smallLogs = logFile.logs.slice(start - 1, end);


    console.log(logFile)

    let logString = ``;

    for (let i = 0; i < smallLogs.length; i++) {
        console.log(i);
        const partMessage = smallLogs[i];
        logString += `t: ${convertUnixToTimestamp(partMessage.time)}\n${partMessage.msg}\n`
    }

    console.log(smallLogs);



    return { createdAt, logString, totalLength };
}


const showCurrentSessionLogs = async (interaction, member, lang, componentData) => {
    if (global.isDevelopment == true) {
        new Embed()
            .setColor(config.embeds.colors.danger)
            .addContext(lang, member, 'development')
            .interactionResponse(interaction);
        return;
    }

    const startRange = componentData == null ? 0 : componentData.rStart;
    const endRange = componentData == null ? config.commands.logs.maxlist : componentData.eStart;

    const { createdAt, logString, totalLength } = await getLogsWithRange(sessionRunId(), startRange, endRange);
    // console.log(sessionRunId())

    // console.log(await getLogs(sessionRunId()))


    new Embed()
        .setColor(config.embeds.colors.danger)
        .addInputs({ createdat: createdAt, logstring: logString, totallogscount: totalLength })
        .addContext(lang, member, 'session-logs')
        .interactionResponse(interaction);
}


const viewDbLogs = (interaction, member, lang, componentData) => {

}


const listDbLogs = (interaction, member, lang, componentData) => {

}


const findAndExecuteSubCommand = (subCommand, interaction, member, lang, componentData) => {
    switch (subCommand) {
        case 'show':
            showCurrentSessionLogs(interaction, member, lang, componentData);
            break;
        case 'view':
            viewDbLogs(interaction, member, lang, componentData);
            break;
        case 'list':
            listDbLogs(interaction, member, lang, componentData);
            break;
        default:
            break;
    }
}

const execute = async (interaction, client, guild, member, lang) => {
    await interaction.deferReply({ ephemeral: true });

    const subCommand = interaction.options.getSubcommand();

    const componentData = null;

    findAndExecuteSubCommand(subCommand, interaction, member, lang, componentData);

};

const executeComponent = async (interaction, client, guild, member, lang, componentData) => {
    findAndExecuteSubCommand(componentData.id.split("-")[1], interaction, client, guild, member, lang, componentData);

}

const componentIds = [
    'logs-show',
];

module.exports = { execute, data, componentIds, executeComponent };