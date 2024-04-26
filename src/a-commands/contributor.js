const { SlashCommandBuilder } = require('@discordjs/builders');
const config = require('./../../config.json');
const { Card } = require('../models/card/Card');

const data = new SlashCommandBuilder()
    .setName('contributor')
    .setDescription('Explore our Open Contributor guidelines and decide to submit your application.')

const execute = async (interaction, client, guild) => {
    const defer = await interaction.deferReply({ ephemeral: true });

    const attachment = await new Card()
        .header({}, card => {
            card.headerIcon({ value: 'X' }, card => { })
            card.headerTitle({ value: 'How to become an Open Contributor' }, card => { })
            card.label({ value: 'Contributor' }, card => { })
        })
        .body({}, card => {
            card.title({ value: 'Guidelines' }, card => { })
            card.description({ value: 'For becoming an Open Contributor and its roles you must fulfill the following things:' }, card => { })
            card.divider({}, card => { })
            card.description({ value: `1. Have ${config.commands.opencontributor.commits} or more commits` }, card => { })
            card.description({ value: `2. Have ${config.commands.opencontributor.pr} or more pull requests` }, card => { })
            card.divider({}, card => { })
            card.description({ value: `You can check or get the role by using /open-contributer` }, card => { })
        })
        .footer({}, card => {
            card.footerIcon({ value: 'X' }, card => { })
            card.footerTitle({ value: 'Code0 • Open Contributor' }, card => { })
        })
        .getAttachment();

    const responseOptions = {
        content: null,
        files: [attachment],
        ephemeral: true
    }

    interaction.editReply(responseOptions);
}


const componentIds = [];

module.exports = { execute, componentIds, data };