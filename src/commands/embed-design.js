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

  new Embed()
    .setColor('#0099ff')
    .setTitle('Leaderboard Test')
    .setDescription(``)
    .interactionResponse(interaction);
}


const executeComponent = async (interaction, client, guild, buttonData, member, lang) => {
  const defer = await interaction.deferReply({ ephemeral: true });

}

const componentIds = [
  'test-id1'
];

module.exports = { execute, executeComponent, componentIds, data };