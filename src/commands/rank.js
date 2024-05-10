const { SlashCommandBuilder } = require('@discordjs/builders');
const { Embed, progressBar } = require('./../models/Embed');
const { MongoUser } = require('./../mongo/MongoUser');
const config = require('./../../config.json');


const data = new SlashCommandBuilder()
    .setName('rank')
    .setDescription('Look at your rank c:')


const execute = async (interaction, client, guild, member, lang) => {
    await interaction.deferReply({ ephemeral: true });

    const user = new MongoUser(member.user.id);

    const { level, neededXp, xp } = await user.getRank();

    let rankName = config.commands.rank.ranks[level];

    if (rankName == undefined) {
        rankName = 'I-have-no-names-anymore';
    }

    new Embed()
        .setColor(config.embeds.colors.info)
        .addInputs({ rank: rankName, level, neededXp, xp, progressbar: progressBar(xp, neededXp) })
        .addContext(lang, member, 'rank-response')
        .addCode0Footer()
        .interactionResponse(interaction)
};



const componentIds = [];

module.exports = { execute, componentIds, data };