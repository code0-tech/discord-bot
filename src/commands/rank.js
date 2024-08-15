const { SlashCommandBuilder } = require('@discordjs/builders');
const { Embed, progressBar } = require('./../models/Embed');
const { MongoUser } = require('./../mongo/MongoUser');
const { waitMs } = require('./../utils/time');
const config = require('./../../config.json');
const DC = require('./../singleton/DC');


const data = new SlashCommandBuilder()
    .setName('rank')
    .setDescription('Check your current rank.')
    .setDescriptionLocalizations({
        de: 'Zeig deinen aktuellen Rang.',
    })
    .addUserOption(option =>
        option
            .setName('user')
            .setDescription('View another user\'s rank.')
            .setDescriptionLocalizations({
                de: 'Zeigt den Rang eines anderen Benutzers an.',
            })
            .setRequired(false)
    );


const loop = async (interaction, member, lang, embedMessage, rankMember, user, previousXp = null) => {
    const { level, neededXp, xp } = await user.getRank();
    const position = await user.getXpGlobalPosition();

    if (previousXp === null || xp !== previousXp) {
        const embed = new Embed()
            .setColor(config.embeds.colors.info)
            .setPbThumbnail(rankMember)
            .addInputs({
                rankuserid: rankMember.id,
                level,
                neededXp,
                xp,
                progressbar: progressBar(xp, neededXp),
                position
            })
            .addContext(lang, member, embedMessage);

        const response = await embed.interactionResponse(interaction);
        if (response == null) return;
    }

    if (embedMessage !== 'this-bot-rank' && config.commands.rank.uptodate15m) {
        await waitMs(config.commands.rank.updatemessage);
        loop(interaction, member, lang, embedMessage, rankMember, user, xp);
    }
};

const execute = async (interaction, client, guild, member, lang) => {
    await DC.defer(interaction);

    const userIdToCheck = interaction.options.getMember('user')?.user?.id ?? member.user.id;
    let embedMessage = userIdToCheck == member.user.id ? 'own-rank-response' : 'other-rank-response';

    if (client.user.id === userIdToCheck) {
        embedMessage = 'this-bot-rank';
    }

    const rankMember = await DC.memberById(userIdToCheck, guild);
    const user = await new MongoUser(userIdToCheck).init();

    loop(interaction, member, lang, embedMessage, rankMember, user);
};


module.exports = { execute, data };