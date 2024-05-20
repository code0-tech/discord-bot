const { ChannelType, PermissionFlagsBits, PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder, DiscordjsError, AttachmentBuilder } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Embed, progressBar } = require('./../models/Embed');
const { Card } = require('./../models/card/Card');
const { waitMs } = require('./../utils/time');
const config = require('./../../config.json');

const { TableBuilder } = require('../models/table');

const data = new SlashCommandBuilder()
  .setName('embed-design')
  .setDescription('Check Design and Code Stuff')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)


const execute = async (interaction, client, guild, member, lang) => {
  await interaction.deferReply({ ephemeral: true });
  /* 
    new Embed()
      .setColor('#0099ff')
      .setTitle('Leaderboard Test')
      .setDescription(``)
      .interactionResponse(interaction); */

  /*  await new Card()
     .header({}, card => {
       card.headerIcon({ value: 'X' }, card => { });
       card.headerTitle({ value: `The reason was simple` }, card => { });
       card.label({ value: 'info' }, card => { });
     })
     .body({}, card => {
       card.subTitle({ value: `TTS...` }, card => { })
       card.description({ value: `... didn't work with this and would cause problems` }, card => { });
       card.description({ value: `for a small number of people,` }, card => { });
       card.divider({}, card => { });
       card.progressBar({ value: 50, label: true }, card => { });
       card.description({ value: `especially because for some users the texts would be smaller than in their Dc settings.` }, card => { });
       card.divider({}, card => { });
       card.progressBar({ value: 10, label: false }, card => { });
     })
     .footer({}, card => {
       card.footerIcon({ value: 'X' }, card => { });
       card.footerTitle({ value: 'Code0 • But the code still exists' }, card => { });
     })
     .interactionResponse(interaction);
  */


  /* 
especially because the texts for make would be smaller than in their dc settings */
}


const executeComponent = async (interaction, client, guild, buttonData, member, lang) => {
  const defer = await interaction.deferReply({ ephemeral: true });

}

const componentIds = [
  'test-id1'
];

module.exports = { execute, executeComponent, componentIds, data };