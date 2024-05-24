const { SlashCommandBuilder } = require('@discordjs/builders');
const { msToHumanReadableTime } = require('./../utils/time');
const { MongoUser } = require('./../mongo/MongoUser');
const { Embed } = require('./../models/Embed');
const config = require('./../../config.json');

const data = new SlashCommandBuilder()
    .setName('search')
    .setDescription('Use the search to answear basic questions')
    .addStringOption(option =>
        option.setName('query')
            .setDescription('Search...')
            .setAutocomplete(true));


/* 
 
async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused();
    const choices = ['Popular Topics: Threads', 'Sharding: Getting started', 'Library: Voice Connections', 'Interactions: Replying to slash commands', 'Popular Topics: Embed preview'];
    const filtered = choices.filter(choice => choice.startsWith(focusedValue));
    await interaction.respond(
        filtered.map(choice => ({ name: choice, value: choice })),
    );
},
 
*/

const execute = async (interaction, client, guild, member, lang) => {
    await interaction.deferReply({ ephemeral: true });

    /* const embed = new Embed()
        .setColor(config.embeds.colors.info)
        .setPbThumbnail(rankMember)
        .addInputs({
            count: normalizedStats.messages.count,
            words: normalizedStats.messages.words,
            chars: normalizedStats.messages.chars,

            joins: normalizedStats.voice.joins,
            switchs: normalizedStats.voice.switchs,
            voicedays: d,
            voicehours: h,
            voiceminutes: m,
            voiceseconds: s
        })
        .addContext(lang, member, embedMessage);

    embed.interactionResponse(interaction); */
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

const selectSimilarFunctions = (inputString, functionNames) => {
    return functionNames
        .map(func => ({
            name: func,
            distance: levenshteinDistance(inputString.toLowerCase(), func.toLowerCase())
        }))
        .sort((a, b) => a.distance - b.distance)
        .filter((_, index) => index < 5); // Get top 5 matches
};

const functionNames = [
    "What is code0",
    "What is this Discord Bot",
    "What is Discord",
    "Why do people use Discord",
    "How to use commands",
    "Help with commands",
    "User guide",
    "Ban user",
    "Chat with support",
    "Join voice channel"
];

const autoComplete = async (interaction, client, guild, member, lang) => {
    const focusedValue = interaction.options.getFocused();

    if (!focusedValue) {
        await interaction.respond([]);
        return;
    }

    const selectedFunctions = selectSimilarFunctions(focusedValue, functionNames);

    await interaction.respond(
        selectedFunctions.map(choice => ({ name: choice.name, value: choice.name }))
    );
};


const componentIds = [];

module.exports = { execute, componentIds, autoComplete, data };