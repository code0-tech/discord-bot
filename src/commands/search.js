const { searchAutoComplete } = require('./../utils/search-engine');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { searchData } = require('./../../data/search/search');
const { Embed } = require('./../models/Embed');
const config = require('./../../config.json');
const DC = require('./../singleton/DC');

const data = new SlashCommandBuilder()
    .setName('search')
    .setDescription('Use the search to answear basic questions.')
    .addStringOption(option =>
        option.setName('query')
            .setDescription('Here you can find most of our basic answear. Simply "all" to get a full list.')
            .setAutocomplete(true));


const execute = async (interaction, client, guild, member, lang) => {
    await DC.defer(interaction);

    const searchQuery = interaction.options.getString('query');

    let matchFound = false;

    searchData.forEach(searchObj => {
        if (searchObj.title === searchQuery) {
            new Embed()
                .setColor(config.embeds.colors.info)
                .setTitle(searchObj.title)
                .setDescription(searchObj.description)
                .interactionResponse(interaction);
            matchFound = true;
        }
    });

    if (!matchFound) {
        new Embed()
            .setColor(config.embeds.colors.danger)
            .setTitle(`Use the autocomplete feature in order to get some results.`)
            .interactionResponse(interaction);
    }
};


const autoComplete = async (interaction, client, guild, member, lang) => {
    const focusedValue = interaction.options.getFocused();

    if (!focusedValue) {
        await interaction.respond([]);
        return;
    }

    await interaction.respond(await searchAutoComplete(focusedValue));
};


module.exports = { execute, autoComplete, data };