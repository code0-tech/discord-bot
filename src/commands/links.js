const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Embed } = require('./../models/Embed');
const config = require('./../../config.json');

const data = new SlashCommandBuilder()
    .setName('links')
    .setDescription('Shows our Code0 links.')

const execute = async (interaction, client, guild, member, lang) => {
    await interaction.deferReply({ ephemeral: true });

    new Embed()
        .setColor(config.embeds.colors.info)
        .addContext(lang, member, 'list')
        .addCode0Footer()
        .interactionResponse(interaction);
};


const componentIds = [];

module.exports = { execute, componentIds, data };