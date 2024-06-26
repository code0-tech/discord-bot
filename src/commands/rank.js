const { SlashCommandBuilder } = require('@discordjs/builders');
const { Embed, progressBar } = require('./../models/Embed');
const { MongoUser } = require('./../mongo/MongoUser');
const { waitMs } = require('./../utils/time');
const config = require('./../../config.json');

const data = new SlashCommandBuilder()
    .setName('rank')
    .setDescription('Check your current Rank.')
    .addUserOption(option =>
        option
            .setName('user')
            .setDescription('Check other @user ranks.')
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

        await embed.interactionResponse(interaction);
    }

    if (embedMessage !== 'this-bot-rank' && config.commands.rank.uptodate15m) {
        await waitMs(2000);
        loop(interaction, member, lang, embedMessage, rankMember, user, xp);
    }
};


const execute = async (interaction, client, guild, member, lang) => {
    await interaction.deferReply({ ephemeral: true });

    const userIdToCheck = interaction.options._hoistedOptions.length !== 0 ? interaction.options._hoistedOptions[0].user.id : member.user.id;
    let embedMessage = interaction.options._hoistedOptions.length !== 0 && userIdToCheck !== member.user.id ? 'other-rank-response' : 'own-rank-response';

    if (client.user.id === userIdToCheck) {
        embedMessage = 'this-bot-rank';
    }

    const rankMember = await guild.members.fetch(userIdToCheck);
    const user = await new MongoUser(userIdToCheck).init();

    loop(interaction, member, lang, embedMessage, rankMember, user);
};


module.exports = { execute, data };