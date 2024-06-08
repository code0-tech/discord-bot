const { ButtonBuilder, ButtonStyle, ActionRowBuilder, StringSelectMenuBuilder, PermissionFlagsBits } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { convertUnixToTimestamp } = require("../utils/time");
const { Mongo, ENUMS } = require('../models/Mongo');
const { TableBuilder } = require('../models/table');
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

    if (!logFile) {
        return {};
    }

    const createdAt = convertUnixToTimestamp(logFile.created_at);

    const maxList = config.commands.logs.maxlist;
    const totalLength = logFile.logs.length;

    let rangeStart = 0;
    let rangeEnd = (totalLength > maxList) ? maxList : totalLength;

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


const sendLog = async (interaction, member, lang, componentData, runId = null, type) => {
    const sessionId = runId == null ? componentData.s : runId;
    const action = componentData == null ? 'init' : componentData.action;
    const currentStartingPosition = componentData == null ? 0 : componentData.currentstart;
    const currentEndPosition = componentData == null ? config.commands.logs.maxlist : componentData.currentendposition;

    const { createdAt, logString, totalLength, rangeStart, rangeEnd } = await getLogsWithRange(sessionId, action, currentStartingPosition, currentEndPosition);

    if (!createdAt) {
        new Embed()
            .setColor(config.embeds.colors.danger)
            .addInputs({ runid: sessionId })
            .addContext(lang, member, 'not-found')
            .interactionResponse(interaction);
        return;
    }

    const goBack = new ButtonBuilder()
        .setCustomId(`logs*type=${type}*action=back*currentstart=${rangeStart}*currentendposition=${rangeEnd}*s=${sessionId}`)
        .setLabel(lang.text['btn-back'])
        .setStyle(ButtonStyle.Primary);

    const next = new ButtonBuilder()
        .setCustomId(`logs*type=${type}*action=next*currentstart=${rangeStart}*currentendposition=${rangeEnd}*s=${sessionId}`)
        .setLabel(lang.text['btn-next'])
        .setStyle(ButtonStyle.Primary);

    const skipToLast = new ButtonBuilder()
        .setCustomId(`logs*type=${type}*action=last*currentstart=${rangeStart}*currentendposition=${rangeEnd}*s=${sessionId}`)
        .setLabel(lang.text['btn-skip'])
        .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder()
        .addComponents(goBack, next, skipToLast);

    new Embed()
        .setColor(config.embeds.colors.info)
        .addInputs({
            logtype: ((sessionRunId() == sessionId) ? lang.text['text-current-logs'] : sessionId),
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

    sendLog(interaction, member, lang, componentData, sessionRunId(), 'show');
}


const viewDbLogs = (interaction, member, lang, componentData) => {

    const runId = componentData.selected == undefined ? null : componentData.selected;

    // console.log(componentData, runId, 'view')

    sendLog(interaction, member, lang, componentData, runId, 'view');
}


const listDbLogs = async (interaction, member, lang, componentData) => {
    const MongoDb = new Mongo();
    const results = await MongoDb.aggregate(ENUMS.DCB.LOGS, [
        {
            $project: {
                _id: 0,
                run_id: 1,
                logs_length: { $size: "$logs" },
                created_at: 1
            }
        },
        {
            $sort: { created_at: -1 }
        },
        {
            $limit: 20
        }
    ])

    const data = results.map(doc => {
        return {
            run_id: doc.run_id,
            created_at: convertUnixToTimestamp(doc.created_at),
            logs_length: doc.logs_length
        };
    });


    const selectMenuOptions = data.map((doc, index) => {
        return {
            label: `${index + 1}, RunId: ${doc.run_id.toString()}`,
            description: `Created at: ${doc.created_at}, Logs length: ${doc.logs_length}`,
            value: doc.run_id.toString()
        };
    });

    const longestrun_id = Math.max(...data.map(entry => entry.run_id.toString().length)) + 3;
    const longestTimestamp = Math.max(...data.map(entry => entry.created_at.toString().length)) + 3;
    const longestlogs_length = Math.max(...data.map(entry => entry.logs_length.toString().length)) + 3;

    const columns = [
        { label: 'run_id', field: 'run_id', width: longestrun_id },
        { label: lang.text['text-createdat'], field: 'created_at', width: longestTimestamp },
        { label: lang.text['text-count'], field: 'logs_length', width: longestlogs_length }
    ];

    const tableBuilder = new TableBuilder(columns);

    tableBuilder.addRows(...data);

    const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('logs*type=view')
        .setPlaceholder('Select an log')
        .addOptions(selectMenuOptions);

    const row = new ActionRowBuilder()
        .addComponents(selectMenu);

    new Embed()
        .setColor(config.embeds.colors.info)
        .addInputs({
            list: tableBuilder.build()
        })
        .addContext(lang, member, 'list-logs')
        .interactionResponse(interaction,);

    // add [row] when !wip
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


// add an error info like the log has 10 errors

module.exports = { execute, data, componentIds, executeComponent };