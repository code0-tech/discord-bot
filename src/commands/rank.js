const { SlashCommandBuilder } = require('@discordjs/builders');
const { Embed, progressBar } = require('./../models/Embed');
const { MongoUser } = require('./../mongo/MongoUser');
const config = require('./../../config.json');

const { waitMs } = require('./../utils/time'); // Temp bug fix

const data = new SlashCommandBuilder()
    .setName('rank')
    .setDescription('Check you current Rank')


const execute = async (interaction, client, guild, member, lang) => {
    await interaction.deferReply({ ephemeral: true });

    const user = new MongoUser(member.user.id);

    await waitMs(400); // Temp bug fix

    // await user._loadUser(); // Temp for small bug fix

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