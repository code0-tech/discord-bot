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


const getLogsWithRange = async (runid, action, currentStartingPosition, currentEndPosition) => {
    const logFile = await getLogs(runid);
    const createdAt = convertUnixToTimestamp(logFile.created_at);

    const maxList = config.commands.logs.maxlist;
    const totalLength = logFile.logs.length;

    let rangeStart = 0;
    let rangeEnd = maxList;

    if (action == 'init') {
        rangeStart = 0;
        rangeEnd = (totalLength > maxList) ? maxList : totalLength;
    }

    if (action == 'next') {
        rangeStart = currentEndPosition;
        rangeEnd = (rangeStart + maxList) > totalLength ? totalLength : (rangeStart + maxList);

        if ((rangeEnd - rangeStart) !== maxList) {
            rangeStart = (rangeEnd - maxList) < 0 ? 0 : (rangeEnd - maxList);
        }
    }

    if (action == 'back') {
        rangeStart = (currentStartingPosition - maxList) < 0 ? 0 : (currentStartingPosition - maxList);
        rangeEnd = (rangeStart + maxList) > totalLength ? totalLength : (rangeStart + maxList);

        if ((rangeEnd - rangeStart) !== maxList) {
            rangeEnd = (rangeEnd + maxList) > totalLength ? totalLength : (rangeEnd + maxList);
        }
    }

    if (action == 'last') {
        rangeStart = (totalLength - maxList) < 0 ? 0 : (totalLength - maxList);
        rangeEnd = (totalLength);
    }


    const smallLogs = logFile.logs.slice(rangeStart, rangeEnd);

    let logString = ``;

    for (let i = 0; i < smallLogs.length; i++) {
        const partMessage = smallLogs[i];
        logString += `${convertUnixToTimestamp(partMessage.time)}\n\`\`\`${partMessage.msg}\`\`\`\n`
    }

    return { createdAt, logString, totalLength, rangeStart, rangeEnd };
}


const sendLog = (interaction, member, lang, createdAt, logString, totalLength, rangeStart, rangeEnd) => {
    const goBack = new ButtonBuilder()
        .setCustomId(`logs*type=show*action=back*currentstart=${rangeStart}*currentendposition=${rangeEnd}`)
        .setLabel(lang.text['btn-back'])
        .setStyle(ButtonStyle.Primary);

    const next = new ButtonBuilder()
        .setCustomId(`logs*type=show*action=next*currentstart=${rangeStart}*currentendposition=${rangeEnd}`)
        .setLabel(lang.text['btn-next'])
        .setStyle(ButtonStyle.Primary);

    const skipToLast = new ButtonBuilder()
        .setCustomId(`logs*type=show*action=last*currentstart=${rangeStart}*currentendposition=${rangeEnd}`)
        .setLabel(lang.text['btn-skip'])
        .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder()
        .addComponents(goBack, next, skipToLast);

    new Embed()
        .setColor(config.embeds.colors.info)
        .addInputs({
            createdat: createdAt,
            logstring: logString,
            totallogscount: totalLength,

            currentstart: rangeStart,
            currentend: rangeEnd,
        })
        .addContext(lang, member, 'session-logs')
        .interactionResponse(interaction, [row]);
}

const showCurrentSessionLogs = async (interaction, member, lang, componentData) => {
    if (global.isDevelopment == true) {
        new Embed()
            .setColor(config.embeds.colors.danger)
            .addContext(lang, member, 'development')
            .interactionResponse(interaction);
        return;
    }

    const action = componentData == null ? 'init' : componentData.action;
    const currentStartingPosition = componentData == null ? 0 : componentData.currentstart;
    const currentEndPosition = componentData == null ? config.commands.logs.maxlist : componentData.currentendposition;

    const { createdAt, logString, totalLength, rangeStart, rangeEnd } = await getLogsWithRange(sessionRunId(), action, currentStartingPosition, currentEndPosition);

    sendLog(interaction, member, lang, createdAt, logString, totalLength, rangeStart, rangeEnd);
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