const { ChannelType, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, PermissionFlagsBits, PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder, DiscordjsError, AttachmentBuilder } = require("discord.js");
const { joinVoiceChannel, createAudioPlayer, createAudioResource, VoiceConnectionStatus, AudioPlayerStatus } = require('@discordjs/voice');
const { channelFromInteraction, removeAllChannelUserPerms, channelFromId } = require('../discord/channel');
const { waitMs, snowflakeToDate, msToHumanReadableTime } = require('./../utils/time');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Embed, progressBar } = require('./../models/Embed');
const { TableBuilder } = require('../models/table');
const { Card } = require('./../models/card/Card');
const { waitMs } = require('./../utils/time');
const config = require('./../../config.json');
const { Readable } = require('stream');
const { join } = require('path');
const ytdl = require('ytdl-core');


const data = new SlashCommandBuilder()
  .setName('embed-design')
  .setDescription('Testing...')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)


const execute = async (interaction, client, guild, member, lang) => {
  await interaction.deferReply({ ephemeral: true });

  const startTime = Date.now();

  index = 0;

  setInterval(() => {
    index++;

    const { m, s } = msToHumanReadableTime(Date.now() - startTime);


    new Embed()
      .setDescription(`I: ${index}\n\n${m} minutes, ${s} seconds.`)
      .interactionResponse(interaction)
  }, 2000);


  // const channel = await channelFromId("1173728043223765132", guild);

  // channel.send('<@329279009298841600> Ich komme auch gleich zu euch');

  return;

}


const executeComponent = async (interaction, client, guild, buttonData, member, lang) => {
  const defer = await interaction.deferReply({ ephemeral: true });

}

// const componentIds = [];

module.exports = { execute, executeComponent, data };