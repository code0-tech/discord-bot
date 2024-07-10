const { ButtonBuilder, ButtonStyle, ActionRowBuilder, StringSelectMenuBuilder, PermissionFlagsBits } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { convertUnixToTimestamp } = require("../utils/time");
const { Mongo, ENUMS } = require('../models/Mongo');
const { TableBuilder } = require('../models/table');
const { Embed } = require('./../models/Embed');
const config = require('./../../config.json');
const DC = require('./../singleton/DC');


const data = new SlashCommandBuilder()
    .setName('logs')
    .setDescription('Code0 Bot logs.')
    .addSubcommand(subcommand => subcommand
        .setName('show')
        .setDescription('Show current session.')
    )
    .addSubcommand(subcommand => subcommand
        .setName('list')
        .setDescription('Get a list of Logs.')
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

const MongoDb = new Mongo();

const getLogs = async (runId) => {
    const MongoDb = new Mongo();
    const results = await MongoDb.find(ENUMS.DCB.LOGS, { run_id: runId });
    return results[0];
}


const getCurrentSessionRunId = () => process['dclogger'].runid;


const formatLog = (log) => {
    const timestamp = convertUnixToTimestamp(log.time);
    const message = log.msg;
    const error = log.error !== null ? `\`\`\`\nError:\n\`\`\`${log.error}` : '';

    return `${timestamp}\n\`\`\`${message}${error}\`\`\`\n`;
};


const getLogsWithRange = async (runId, action, currentStart, currentEnd) => {
    const logFile = await getLogs(runId);
    if (!logFile) return {};

    const createdAt = convertUnixToTimestamp(logFile.created_at);
    const maxList = config.commands.logs.maxlist;
    const totalLength = logFile.logs.length;

    let rangeStart = 0;
    let rangeEnd = totalLength > maxList ? maxList : totalLength;

    if (action === 'next') {
        rangeStart = currentEnd;
        rangeEnd = Math.min(rangeStart + maxList, totalLength);
    } else if (action === 'back') {
        rangeStart = Math.max(currentStart - maxList, 0);
        rangeEnd = Math.min(rangeStart + maxList, totalLength);
    } else if (action === 'last') {
        rangeStart = Math.max(totalLength - maxList, 0);
        rangeEnd = totalLength;
    }

    const logsInRange = logFile.logs.slice(rangeStart, rangeEnd);
    const logString = logsInRange.map(formatLog).join('');

    return { createdAt, logString, totalLength, rangeStart, rangeEnd };
}


const sendLog = async (interaction, member, lang, componentData, runId = null, type) => {
    const sessionId = runId || componentData.s;
    const action = componentData?.action || 'init';
    const currentStart = componentData?.currentstart || 0;
    const currentEnd = componentData?.currentendposition || config.commands.logs.maxlist;

    if (parseInt(sessionId) == getCurrentSessionRunId()) {
        type = 'show';
    }

    const { createdAt, logString, totalLength, rangeStart, rangeEnd } = await getLogsWithRange(parseInt(sessionId), action, currentStart, currentEnd);
    if (!createdAt) {
        return new Embed()
            .setColor(config.embeds.colors.danger)
            .addInputs({ runid: sessionId })
            .addContext(lang, member, 'not-found')
            .interactionResponse(interaction);
    }

    const buttons = [
        new ButtonBuilder()
            .setCustomId(`logs*type=${type}*action=back*currentstart=${rangeStart}*currentendposition=${rangeEnd}*s=${sessionId}`)
            .setLabel(lang.text['btn-back'])
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId(`logs*type=${type}*action=next*currentstart=${rangeStart}*currentendposition=${rangeEnd}*s=${sessionId}`)
            .setLabel(lang.text['btn-next'])
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId(`logs*type=${type}*action=last*currentstart=${rangeStart}*currentendposition=${rangeEnd}*s=${sessionId}`)
            .setLabel(lang.text['btn-skip'])
            .setStyle(ButtonStyle.Danger),
    ];

    const row = new ActionRowBuilder().addComponents(buttons);

    new Embed()
        .setColor(type === 'show' ? config.embeds.colors.info : config.embeds.colors.inprogress)
        .addInputs({
            runid: sessionId,
            createdat: createdAt,
            logstring: logString,
            totallogscount: totalLength,
            currentstart: rangeStart,
            currentend: rangeEnd
        })
        .addContext(lang, member, type === 'show' ? 'session-logs' : 'old-session-logs')
        .setComponents([row])
        .interactionResponse(interaction);
}


const showCurrentSessionLogs = async (interaction, member, lang, componentData) => {
    if (global.isDevelopment) {
        return new Embed()
            .setColor(config.embeds.colors.danger)
            .addContext(lang, member, 'development')
            .interactionResponse(interaction);
    }
    sendLog(interaction, member, lang, componentData, getCurrentSessionRunId(), 'show');
}


const viewDbLogs = (interaction, member, lang, componentData) => {
    const runId = componentData.selected || null;
    sendLog(interaction, member, lang, componentData, runId, 'view');
}


const listDbLogs = async (interaction, member, lang, componentData) => {
    const results = await MongoDb.aggregate(ENUMS.DCB.LOGS, [
        { $project: { _id: 0, run_id: 1, logs_length: { $size: "$logs" }, created_at: 1 } },
        { $sort: { created_at: -1 } },
        { $limit: 20 }
    ]);

    const data = results.map(doc => ({
        run_id: doc.run_id,
        created_at: convertUnixToTimestamp(doc.created_at),
        logs_length: doc.logs_length
    }));

    const selectMenuOptions = data.map((doc, index) => ({
        label: `${index + 1}, RunId: ${doc.run_id}`,
        description: `${doc.created_at}, ${doc.logs_length}`,
        value: doc.run_id.toString()
    }));

    const columnWidths = {
        run_id: Math.max(...data.map(entry => entry.run_id.toString().length)) + 3,
        created_at: Math.max(...data.map(entry => entry.created_at.length)) + 3,
        logs_length: Math.max(...data.map(entry => entry.logs_length.toString().length)) + 3,
    };

    const columns = [
        { label: 'run_id', field: 'run_id', width: columnWidths.run_id },
        { label: lang.text['text-createdat'], field: 'created_at', width: columnWidths.created_at },
        { label: lang.text['text-count'], field: 'logs_length', width: columnWidths.logs_length }
    ];

    const tableBuilder = new TableBuilder(columns);
    tableBuilder.addRows(...data);

    const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('logs*type=view')
        .setPlaceholder('Log')
        .addOptions(selectMenuOptions);

    const row = new ActionRowBuilder().addComponents(selectMenu);

    new Embed()
        .setColor(config.embeds.colors.info)
        .addInputs({ list: tableBuilder.build() })
        .addContext(lang, member, 'list-logs')
        .setComponents([row])
        .interactionResponse(interaction);
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
    await DC.defer(interaction);

    const results = await MongoDb.aggregate(ENUMS.DCB.LOGS, [
        {
            $group: {
                _id: null,
                count: { $sum: 1 }
            }
        }
    ]);

    const totalCount = results.length > 0 ? results[0].count : 0;

    if (totalCount == 0) {
        new Embed()
            .setColor(config.embeds.colors.info)
            .addContext(lang, member, 'list-logs-empty')
            .interactionResponse(interaction);
        return;
    }

    const subCommand = interaction.options.getSubcommand();
    const componentData = null;
    findAndExecuteSubCommand(subCommand, interaction, member, lang, componentData);
}


const executeComponent = async (interaction, client, guild, member, lang, componentData) => {
    await DC.defer(interaction);

    findAndExecuteSubCommand(componentData.type, interaction, member, lang, componentData);
}

const componentIds = ['logs'];


module.exports = { execute, data, componentIds, executeComponent };