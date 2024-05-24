const { SlashCommandBuilder } = require('@discordjs/builders');
const { msToHumanReadableTime } = require('./../utils/time');
const { MongoUser } = require('./../mongo/MongoUser');
const { Embed } = require('./../models/Embed');
const config = require('./../../config.json');

const data = new SlashCommandBuilder()
    .setName('search')
    .setDescription('Use the search to answear basic questions')
    .addUserOption(option =>
        option
            .setName('user')
            .setDescription('Check other user stats.')
            .setRequired(false)
    )


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


const componentIds = [];

module.exports = { execute, componentIds, autocomplete, data };