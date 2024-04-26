const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Card } = require('../models/card/Card');
const config = require('./../../config.json');

const data = new SlashCommandBuilder()
    .setName('links')
    .setDescription('Shows all our Code0 links.')

const execute = async (interaction, client, guild) => {
    const defer = await interaction.deferReply({ ephemeral: true });

    const row = new ActionRowBuilder();

    const attachment = await new Card()
        .header({}, card => {
            card.headerIcon({ value: 'X' }, card => { });
            card.headerTitle({ value: 'These links might interest you' }, card => { });
            card.label({ value: 'links' }, card => { });
        })
        .body({}, async card => {
            const linkButtons = await Promise.all(config.commands.links.map(async linkArray => {
                card.description({ value: linkArray[0] }, card => { });
                card.divider({}, card => { });

                return new ButtonBuilder()
                    .setLabel(linkArray[1])
                    .setURL(linkArray[2])
                    .setStyle(ButtonStyle.Link);
            }));

            linkButtons.flat().forEach(linkButton => {
                row.addComponents(linkButton);
            });

            card.description({ value: 'For more information click on the links and find out more about our trip to Code0' }, card => { });
        })
        .footer({}, card => {
            card.footerIcon({ value: 'X' }, card => { });
            card.footerTitle({ value: 'Code0 • Go and click, dont skip' }, card => { });
        })
        .getAttachment();

    await interaction.editReply({
        content: null,
        files: [attachment],
        components: [row],
        ephemeral: true
    });
}


module.exports = { execute, data };