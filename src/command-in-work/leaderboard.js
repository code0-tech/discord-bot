const { SlashCommandBuilder } = require('@discordjs/builders');
const { Embed } = require('../models/Embed');
const config = require('../../config.json');

const data = new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Check which user\'s are the top 10 best.')

const execute = async (interaction, client, guild, member, lang) => {
    await interaction.deferReply({ ephemeral: true });

    new Embed()
        .setColor(config.embeds.colors.info)
        .addInputs({
            neededpr: config.commands.opencontributor.pr,
            neededcommits: config.commands.opencontributor.commits
        })
        .addContext(lang, member, 'info')
        .addCode0Footer()
        .interactionResponse(interaction)
};


const componentIds = [];

module.exports = { execute, componentIds, data };