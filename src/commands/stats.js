const { msToHumanReadableTime, waitMs } = require('./../utils/time');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MongoUser } = require('./../mongo/MongoUser');
const { Embed } = require('./../models/Embed');
const config = require('./../../config.json');
const DC = require('./../singleton/DC');

const data = new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Check your Stats.')
    .addUserOption(option =>
        option
            .setName('user')
            .setDescription('Check other @user stats.')
            .setRequired(false)
    );


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


const loop = async (interaction, member, lang, embedMessage, rankMember, user, previousStats = null, client) => {
    const stats = await user.getStats();
    const normalizedStats = normalizeData(stats);

    const statsChanged = !previousStats || JSON.stringify(normalizedStats) !== JSON.stringify(previousStats);

    if (statsChanged) {
        const { s, m, h, d } = msToHumanReadableTime(normalizedStats.voice.time * 1000);
        const userChannel = await DC.memberVoiceChannel(rankMember, client);

        const embed = new Embed()
            .setColor(config.embeds.colors.info)
            .setPbThumbnail(rankMember)
            .addInputs({
                channelmention: (userChannel == null ? '---' : `<#${userChannel.id}>`),
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

        await embed.interactionResponse(interaction);
    }

    if (embedMessage !== 'this-bot-stats' && config.commands.stats.uptodate15m) {
        await waitMs(2000);
        loop(interaction, member, lang, embedMessage, rankMember, user, normalizedStats, client);
    }
}


const execute = async (interaction, client, guild, member, lang) => {
    await DC.defer(interaction);

    const userIdToCheck = interaction.options.getMember('user')?.user?.id ?? member.user.id;
    let embedMessage = userIdToCheck == member.user.id ? 'own-stats-response' : 'other-stats-response';

    if (client.user.id === userIdToCheck) {
        embedMessage = 'this-bot-stats';
    }

    const rankMember = await DC.memberById(userIdToCheck, guild);
    const user = await new MongoUser(userIdToCheck).init();

    loop(interaction, member, lang, embedMessage, rankMember, user, null, client);
};


module.exports = { execute, data };