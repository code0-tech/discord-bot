const { SlashCommandBuilder } = require('@discordjs/builders');
const { Embed, progressBar } = require('./../models/Embed');
const { MongoUser } = require('./../mongo/MongoUser');
const config = require('./../../config.json');

const data = new SlashCommandBuilder()
    .setName('rank')
    .setDescription('Check you current Rank')


const execute = async (interaction, client, guild, member, lang) => {
    await interaction.deferReply({ ephemeral: true });

    const user = await new MongoUser(member.user.id).init();

    const { level, neededXp, xp } = await user.getRank();
    const position = await user.getXpGlobalPosition();

    new Embed()
        .setColor(config.embeds.colors.info)
        .setPbThumbnail(member)
        .addInputs({ level, neededXp, xp, progressbar: progressBar(xp, neededXp), position })
        .addContext(lang, member, 'rank-response')
        // .addCode0Footer()
        .interactionResponse(interaction)
};



const componentIds = [];

module.exports = { execute, componentIds, data };