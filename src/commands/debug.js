const { msToHumanReadableTime, convertUnixToTimestamp, waitMs } = require('./../utils/time');
const { debug_sendGitRankMessage } = require('../dc-guild/git-rank');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Embed, progressBar } = require('./../models/Embed');
const { PermissionFlagsBits } = require("discord.js");
const { Mongo, ENUMS } = require('../models/Mongo');
const config = require('./../../config.json');
const DC = require('./../singleton/DC');

const MongoDb = new Mongo();

const data = new SlashCommandBuilder()
    .setName('debug')
    .setDescription('Code0 Debug commands.')
    .setDescriptionLocalizations({
        de: 'Code0 Debug Befehle.',
    })
    .addStringOption(option =>
        option.setName('action')
            .setDescription('Select a Debug command.')
            .setDescriptionLocalizations({
                de: 'Wähl ein Debug Befehl aus.',
            })
            .setRequired(true)
            .addChoices(
                { name: '[Client] => This session time', value: 'clientSessionTime' },
                { name: '[Mongo] => Check left users', value: 'mongoLeftUsers' },
                { name: '[Mongo] => githubcommits -> new Chart', value: 'chartFromGithubTotalCommits' }
            ))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)


const debugs = {
    async mongoLeftUsers(interaction, client, guild, member, lang) {
        const updateSearchingEmbed = (totaluser = 0, checked = 0, found = 0) => {
            new Embed()
                .setColor(config.embeds.colors.info)
                .addInputs({ totaluser, checked, found })
                .addContext(lang, member, 'mongo-left-users-loading')
                .interactionResponse(interaction);
        }

        updateSearchingEmbed();

        const pipeline = [
            {
                $project: {
                    id: 1,
                    _id: 1
                }
            }
        ]

        const userIds = await MongoDb.aggregate(ENUMS.DCB.USERS, pipeline);

        let checked = 0;
        let found = 0;

        updateSearchingEmbed(userIds.length, checked, found);

        const interval = setInterval(() => updateSearchingEmbed(userIds.length, checked, found), 2000);

        let usersLeft = [];

        for (let i = 0; i < userIds.length; i++) {
            const userPacket = userIds[i];
            const result = await DC.memberById(userPacket.id, guild);
            if (!result) {
                usersLeft.push(userPacket.id);
                found++;
            }

            checked++;
        }

        clearInterval(interval);

        new Embed()
            .setColor(config.embeds.colors.info)
            .addInputs({
                userstring: (usersLeft.length == 0 ? `${lang.getText("found-none")}` : usersLeft.join("\n")),
                progressbar: progressBar(usersLeft.length, userIds.length) + ` [${usersLeft.length}|${userIds.length}]`
            })
            .addContext(lang, member, 'mongo-left-users')
            .interactionResponse(interaction);
    },

    async clientSessionTime(interaction, client, guild, member, lang) {
        const { d, h, m, s } = msToHumanReadableTime(Date.now() - client.startDate);

        const embed = new Embed()
            .setColor(config.embeds.colors.info)
            .addInputs({
                upsince: convertUnixToTimestamp(client.startDate),
                days: d,
                hours: h,
                minutes: m,
                seconds: s
            })
            .addContext(lang, member, 'client-session-time');

        const response = await embed.interactionResponse(interaction);
        if (response == null) return;

        await waitMs(5000);

        this.clientSessionTime(interaction, client, guild, member, lang);
    },

    async chartFromGithubTotalCommits(interaction, client, guild, member, lang) {
        const embed = await debug_sendGitRankMessage();
        embed.interactionResponse(interaction);
    }
}


const execute = async (interaction, client, guild, member, lang) => {
    await DC.defer(interaction);

    const type = interaction.options.getString('action');

    debugs[type](interaction, client, guild, member, lang);
}


const executeComponent = async (interaction, client, guild, buttonData, member, lang) => {
    await DC.defer(interaction);
}

const componentIds = [];

module.exports = { execute, executeComponent, data };