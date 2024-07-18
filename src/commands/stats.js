const { msToHumanReadableTime, waitMs } = require('./../utils/time');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MongoUser } = require('./../mongo/MongoUser');
const { humanizeNumber } = require('../utils/helper');
const { Embed } = require('./../models/Embed');
const config = require('./../../config.json');
const DC = require('./../singleton/DC');

const data = new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Check your stats.')
    .setDescriptionLocalizations({
        de: 'Zeigt deine eigenen Statistiken.',
    })
    .addUserOption(option =>
        option
            .setName('user')
            .setDescription('View stats for another user.')
            .setDescriptionLocalizations({
                de: 'Zeigt die Statistiken eines anderen Nutzers.',
            })
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


const loop = async (client, interaction, member, lang, embedMessage, rankMember, user, previousStats = null) => {
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
                count: humanizeNumber(normalizedStats.messages.count),
                words: humanizeNumber(normalizedStats.messages.words),
                chars: humanizeNumber(normalizedStats.messages.chars),
                joins: humanizeNumber(normalizedStats.voice.joins),
                switchs: humanizeNumber(normalizedStats.voice.switchs),
                voicedays: d,
                voicehours: h,
                voiceminutes: m,
                voiceseconds: s
            })
            .addContext(lang, member, embedMessage);

        const response = await embed.interactionResponse(interaction);
        if (response == null) return;
    }

    if (embedMessage !== 'this-bot-stats' && config.commands.stats.uptodate15m) {
        await waitMs(config.commands.stats.updatemessage);
        loop(client, interaction, member, lang, embedMessage, rankMember, user, normalizedStats);
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

    loop(client, interaction, member, lang, embedMessage, rankMember, user);
};


module.exports = { execute, data };