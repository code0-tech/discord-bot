const { SlashCommandBuilder } = require('@discordjs/builders');
const { ChannelType, PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder, DiscordjsError, AttachmentBuilder } = require("discord.js");
const { waitMs } = require('./../utils/time');
const { Embed, progressBar } = require('./../models/Embed');
const config = require('./../../config.json');
const { Card } = require('./../models/card/Card');

const data = new SlashCommandBuilder()
  .setName('embed-design')
  .setDescription('Check Design and Code Stuff')


const execute = async (interaction, client, guild, member, lang) => {
  interaction.deferReply({ ephemeral: true });


  const closeTicket = new ButtonBuilder()
    .setCustomId('test-id1')
    .setLabel('Test other Style')
    .setStyle(ButtonStyle.Danger);

  const row = new ActionRowBuilder()
    .addComponents(closeTicket);

  /* 
  
    ${progressBar(20, 60, true)}
  ${progressBar(20, 70, true)}
  ${progressBar(20, 80, true)}
  ${progressBar(20, 90, true)}
  ${progressBar(20, 100, true)}
  ${progressBar(2, 60, true)}
  ${progressBar(5, 10, true)}
  

  */

  new Embed()
    .setColor(config.embeds.colors.info)
    .setDescription(``)


    // .addInputs({ user: "nicusch", age: 21 })
    // .addContext(lang, member, '1')
    .addCode0Footer()
    .interactionResponse(interaction, [row])


  /* 
    const fetchedLogs = await guild.fetchAuditLogs({
      limit: 2,
    });
  
    console.dir(fetchedLogs, { depth: null });
   */

  // console.log(fetchedLogs.entries)

  // await waitMs(2000);

}


const executeComponent = async (interaction, client, guild, buttonData, member, lang) => {
  const defer = await interaction.deferReply({ ephemeral: true });

  new Embed()
    .setColor(config.embeds.colors.danger)
    .addInputs({ user: "nicusch", age: 21 })
    .addContext(lang, member, '1')
    .addCode0Footer()
    .interactionResponse(interaction)

}

const componentIds = [
  'test-id1',
  'test-id2',
  'test-id3',
  'test-id4'
];

module.exports = { execute, executeComponent, componentIds, data };