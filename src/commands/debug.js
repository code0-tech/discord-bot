const { ChannelType, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, PermissionFlagsBits, PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder, DiscordjsError, AttachmentBuilder } = require("discord.js");
const { waitMs, snowflakeToDate, msToHumanReadableTime } = require('./../utils/time');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Embed, progressBar } = require('./../models/Embed');
const config = require('./../../config.json');
const Chart = require('./../models/Chart');
const DC = require('./../singleton/DC');


const data = new SlashCommandBuilder()
    .setName('debug')
    .setDescription('Code0 Debug commands.')
    .addStringOption(option =>
        option.setName('type')
            .setDescription('Select a Debug command')
            .setRequired(true)
            .addChoices(
                { name: 'Mongo => Check left Users', value: 'mongo_left_users' },
            ))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

// show bar of server user / left user in procentage

const execute = async (interaction, client, guild, member, lang) => {
    await DC.defer(interaction);

    const subCommand = interaction.options.getSubcommand();

}


const executeComponent = async (interaction, client, guild, buttonData, member, lang) => {
    await DC.defer(interaction);


}

const componentIds = [];

module.exports = { execute, executeComponent, data };