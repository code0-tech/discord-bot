const { SlashCommandBuilder } = require('@discordjs/builders');
const { Embed } = require('./../models/Embed');
const config = require('./../../config.json');

const data = new SlashCommandBuilder()
    .setName('contributor')
    .setDescription('Explore our Open-Contributor guidelines and decide to submit your application.')

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

module.exports = { execute, data };