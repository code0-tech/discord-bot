const { SlashCommandBuilder } = require('@discordjs/builders');
const { Embed } = require('./../models/Embed');
const config = require('./../../config.json');
const DC = require('./../singleton/DC');

const data = new SlashCommandBuilder()
    .setName('contributor')
    .setDescription('Explore our Open-Contributor guidelines.')
    .setDescriptionLocalizations({
        de: 'Open-Contributor Guidelines',
    })

const execute = async (interaction, client, guild, member, lang) => {
    await DC.defer(interaction);

    new Embed()
        .setColor(config.embeds.colors.info)
        .addInputs({
            neededpr: config.commands.opencontributor.pr,
            neededcommits: config.commands.opencontributor.commits
        })
        .addContext(lang, member, 'info')
        .interactionResponse(interaction);
};


module.exports = { execute, data };