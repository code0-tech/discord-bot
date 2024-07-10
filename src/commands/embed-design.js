const { ChannelType, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, PermissionFlagsBits, PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder, DiscordjsError, AttachmentBuilder } = require("discord.js");
const { joinVoiceChannel, createAudioPlayer, createAudioResource, VoiceConnectionStatus, AudioPlayerStatus } = require('@discordjs/voice');
const { waitMs, snowflakeToDate, msToHumanReadableTime } = require('./../utils/time');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Embed, progressBar } = require('./../models/Embed');
const { TableBuilder } = require('../models/table');
const { Card } = require('./../models/card/Card');
const config = require('./../../config.json');
const DC = require('./../singleton/DC');
const { Readable } = require('stream');
const { join } = require('path');
const ytdl = require('ytdl-core');

const Chart = require('./../models/Chart');


const data = new SlashCommandBuilder()
  .setName('embed-design')
  .setDescription('Command for tests.')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)


const execute = async (interaction, client, guild, member, lang) => {
  await DC.defer(interaction);


  const chart = new Chart(800, 600)
    .setType('line')
    .setLabels(['January', 'February', 'March', 'April', 'May', 'June', 'July'])
    .addDataset('Sample Data', [65, 59, 80, 81, 56, 55, 40])
    .interactionResponse(interaction)

  // const attachment = await chart.getAttachment();
  // await interaction.channel.send({ files: [attachment] });

}


const executeComponent = async (interaction, client, guild, buttonData, member, lang) => {
  await DC.defer(interaction);


}

const componentIds = [];

module.exports = { execute, executeComponent, data };