const { SlashCommandBuilder } = require('@discordjs/builders');
const { searchData } = require('./../../data/search/search');
const { Embed } = require('./../models/Embed');
const config = require('./../../config.json');

const data = new SlashCommandBuilder()
    .setName('search')
    .setDescription('Use the search to answear basic questions.')
    .addStringOption(option =>
        option.setName('query')
            .setDescription('Search...')
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


const levenshteinDistance = (s1, s2) => {
    const m = s1.length, n = s2.length;
    if (m < n) return levenshteinDistance(s2, s1);

    let previous = new Array(n + 1).fill(0).map((_, i) => i);
    let current = new Array(n + 1).fill(0);

    for (let i = 1; i <= m; i++) {
        current[0] = i;
        for (let j = 1; j <= n; j++) {
            const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
            current[j] = Math.min(
                previous[j] + 1,      // deletion
                current[j - 1] + 1,   // insertion
                previous[j - 1] + cost // substitution
            );
        }
        [previous, current] = [current, previous];
    }

    return previous[n];
};

const averageLevenshteinDistance = (inputString, title) => {
    const inputWords = inputString.split(' ');
    const titleWords = title.split(' ');

    const distances = inputWords.flatMap(inputWord =>
        titleWords.map(titleWord =>
            levenshteinDistance(inputWord.toLowerCase(), titleWord.toLowerCase())
        )
    );

    const totalDistance = distances.reduce((sum, distance) => sum + distance, 0);
    return totalDistance / distances.length;
};

const selectSimilarFunctions = (inputString, searchData) => {
    return searchData
        .map(data => ({
            data,
            distance: averageLevenshteinDistance(inputString, data.title)
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 5) // Get top 5 matches
        .map(item => item.data); // Extract the original data
};

const autoComplete = async (interaction, client, guild, member, lang) => {
    const focusedValue = interaction.options.getFocused();

    if (!focusedValue) {
        await interaction.respond([{ name: 'Search our small simple guides...', value: 'default' }]);
        return;
    }

    const selectedFunctions = selectSimilarFunctions(focusedValue, searchData);

    await interaction.respond(
        selectedFunctions.map(choice => {
            const debugInfo = choice.distance ? `(debug: ${choice.distance.toFixed(2)})` : '';
            return {
                name: `${choice.title} ${debugInfo}`,
                value: choice.title
            };
        })
    );
};


const componentIds = [];

module.exports = { execute, componentIds, autoComplete, data };