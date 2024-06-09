const { SlashCommandBuilder } = require('@discordjs/builders');
const { msToHumanReadableTime } = require('./../utils/time');
const { MongoUser } = require('./../mongo/MongoUser');
const { Embed } = require('./../models/Embed');
const config = require('./../../config.json');

const data = new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Check your Stats.')
    .addUserOption(option =>
        option
            .setName('user')
            .setDescription('Check other user stats.')
            .setRequired(false)
    )

const normalizeData = (data) => {
    data.messages = data.messages || { words: 0, chars: 0, count: 0 };
    data.messages.words = data.messages.words || 0;
    data.messages.chars = data.messages.chars || 0;
    data.messages.count = data.messages.count || 0;

    data.voice = data.voice || { joins: 0, switchs: 0, time: 0 };
    data.voice.joins = data.voice.joins || 0;
    data.voice.switchs = data.voice.switchs || 0;
    data.voice.time = data.voice.time || 0;

    return data;
}

const execute = async (interaction, client, guild, member, lang) => {
    await interaction.deferReply({ ephemeral: true });

    const userIdToCheck = interaction.options._hoistedOptions.length !== 0 ? interaction.options._hoistedOptions[0].user.id : member.user.id;
    let embedMessage = interaction.options._hoistedOptions.length !== 0 && userIdToCheck !== member.user.id ? 'other-stats-response' : 'own-stats-response';

    const rankMember = await guild.members.fetch(userIdToCheck);

    const user = await new MongoUser(userIdToCheck).init();

    const stats = await user.getStats();

    const normalizedStats = normalizeData(stats);

    if (client.user.id == userIdToCheck) {
        embedMessage = 'this-bot-stats';
    }

    const { s, m, h, d } = msToHumanReadableTime(normalizedStats.voice.time * 1000);

    const embed = new Embed()
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

    embed.interactionResponse(interaction);
};


module.exports = { execute, data };