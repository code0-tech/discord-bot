const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Embed } = require('./../models/Embed');
const config = require('./../../config.json');

const data = new SlashCommandBuilder()
    .setName('links')
    .setDescription('Shows all our Code0 links.')

const execute = async (interaction, client, guild, member, lang) => {
    await interaction.deferReply({ ephemeral: true });

    new Embed()
        .setColor(config.embeds.colors.info)
        .addInputs({ rank: rankName, level, neededXp, xp, progressbar: progressBar(xp, neededXp) })
        .addContext(lang, member, 'list')
        .addCode0Footer()
        .interactionResponse(interaction)
};



const componentIds = [];

module.exports = { execute, componentIds, data };