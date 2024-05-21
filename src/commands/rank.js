const { SlashCommandBuilder } = require('@discordjs/builders');
const { Embed, progressBar } = require('./../models/Embed');
const { MongoUser } = require('./../mongo/MongoUser');
const config = require('./../../config.json');

const data = new SlashCommandBuilder()
    .setName('rank')
    .setDescription('Check you current Rank')
    .addUserOption(option =>
        option
            .setName('user')
            .setDescription('Check user stats')
            .setRequired(false)
    )
    .addBooleanOption(option =>
        option.setName('show-all')
            .setDescription('Show all stats, including typed messages.'));


const execute = async (interaction, client, guild, member, lang) => {
    await interaction.deferReply({ ephemeral: true });

    console.log(interaction.options._hoistedOptions)

    const userIdToCheck = interaction.options._hoistedOptions.length !== 0 ? interaction.options._hoistedOptions[0].user.id : member.user.id;
    const rankMember = await guild.members.fetch(userIdToCheck);

    const user = await new MongoUser(userIdToCheck).init();

    const { level, neededXp, xp } = await user.getRank();

    const position = await user.getXpGlobalPosition();

    let embedMessage = interaction.options._hoistedOptions.length == 0 ? 'own-rank-response' : 'other-rank-response';

    if (client.user.id == userIdToCheck) {
        embedMessage = 'this-bot-rank';
    }

    const embed = new Embed()
        .setColor(config.embeds.colors.info)
        .setPbThumbnail(rankMember)
        .addInputs({ rankuserid: userIdToCheck, level, neededXp, xp, progressbar: progressBar(xp, neededXp), position })
        .addContext(lang, member, embedMessage);

    embed.interactionResponse(interaction);
};


const componentIds = [];

module.exports = { execute, componentIds, data };