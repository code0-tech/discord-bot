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

    // add check for the length before processing like the length

    const totalLength = logFile.logs.length;
    const smallLogs = logFile.logs.slice(start, end);


    let logString = ``;

    for (let i = 0; i < smallLogs.length; i++) {
        console.log(i);
        const partMessage = smallLogs[i];
        logString += `t: ${convertUnixToTimestamp(partMessage.time)}\n${partMessage.msg}\n`
    }


    // need to rework this code here because sometimes it does 10-10...

    const nextEnd = (start + config.commands.logs.maxlist) > totalLength ? totalLength : (start + config.commands.logs.maxlist);
    const nextStart = end;

    const previousStart = (start - config.commands.logs.maxlist) <= 0 ? 0 : (start - config.commands.logs.maxlist);
    const previousEnd = (previousStart + config.commands.logs.maxlist) > totalLength ? totalLength : (previousStart + config.commands.logs.maxlist);


    return { createdAt, logString, totalLength, nextStart, nextEnd, previousStart, previousEnd };
}


const showCurrentSessionLogs = async (interaction, member, lang, componentData) => {
    if (global.isDevelopment == true) {
        new Embed()
            .setColor(config.embeds.colors.danger)
            .addContext(lang, member, 'development')
            .interactionResponse(interaction);
        return;
    }

    const startRange = componentData == null ? 0 : componentData.start;
    const endRange = componentData == null ? config.commands.logs.maxlist : componentData.end;

    const { createdAt, logString, totalLength, nextStart, nextEnd, previousStart, previousEnd } = await getLogsWithRange(sessionRunId(), startRange, endRange);


    const goBack = new ButtonBuilder()
        .setCustomId(`logs*type=show*start=${previousStart}*end=${previousEnd}`)
        .setLabel(lang.text['btn-back'])
        .setStyle(ButtonStyle.Primary);

    const next = new ButtonBuilder()
        .setCustomId(`logs*type=show*start=${nextStart}*end=${nextEnd}`)
        .setLabel(lang.text['btn-next'])
        .setStyle(ButtonStyle.Primary);

    // add button skip to last button
    /* 
    const skipToLast = new ButtonBuilder()
        .setCustomId(`logs*type=show*start=${nextStart}*end=${nextEnd}`)
        .setLabel(lang.text['btn-next'])
        .setStyle(ButtonStyle.Primary); */

    const row = new ActionRowBuilder()
        .addComponents(goBack, next);

    new Embed()
        .setColor(config.embeds.colors.danger)
        .addInputs({
            createdat: createdAt,
            logstring: logString,
            totallogscount: totalLength,

            currentstart: startRange,
            currentend: endRange,

            range: endRange - startRange
        })
        .addContext(lang, member, 'session-logs')
        .interactionResponse(interaction, [row]);
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
    await interaction.deferReply({ ephemeral: true });

    findAndExecuteSubCommand(componentData.type, interaction, member, lang, componentData);
}

const componentIds = [
    'logs',
];


module.exports = { execute, data, componentIds, executeComponent };