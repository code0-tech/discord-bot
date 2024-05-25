const { searchAutoComplete } = require('./../../data/search/engine');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { searchData } = require('./../../data/search/search');
const { Embed } = require('./../models/Embed');
const config = require('./../../config.json');

const data = new SlashCommandBuilder()
    .setName('search')
    .setDescription('Use the search to answear basic questions.')
    .addStringOption(option =>
        option.setName('query')
            .setDescription('Here you can find most of our basic answears.')
            .setAutocomplete(true));


const execute = async (interaction, client, guild, member, lang) => {
    await interaction.deferReply({ ephemeral: true });

    const searchQuery = interaction.options.getString('query');

    console.log(searchQuery);

    searchData.forEach(searchObj => {
        if (searchObj.title == searchQuery) {
            new Embed()
                .setColor(config.embeds.colors.info)
                .setTitle(searchObj.title)
                .setDescription(searchObj.description)
                .interactionResponse(interaction);
        }
    });
};

const autoComplete = async (interaction, client, guild, member, lang) => {
    const focusedValue = interaction.options.getFocused();

    if (!focusedValue) {
        await interaction.respond([]);
        return;
    }

    await interaction.respond(await searchAutoComplete(focusedValue));
};


const componentIds = [];

module.exports = { execute, componentIds, autoComplete, data };