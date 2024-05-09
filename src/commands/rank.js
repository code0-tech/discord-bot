const { SlashCommandBuilder } = require('@discordjs/builders');
const { Embed, progressBar } = require('./../models/Embed');
const config = require('./../../config.json');


const data = new SlashCommandBuilder()
    .setName('rank')
    .setDescription('Look at your rank c:')



const execute = async (interaction, client, guild, member, lang) => {
    await interaction.deferReply({ ephemeral: true });



    new Embed()
        .setColor(config.embeds.colors.danger)
        .addInputs({ user: "nicusch", age: 21 })
        .addContext(lang, member, 'rank-response')
        .addCode0Footer()
        .interactionResponse(interaction)
};



const componentIds = [];

module.exports = { execute, componentIds, data };