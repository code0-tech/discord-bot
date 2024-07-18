const { ChannelType, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, PermissionFlagsBits, PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder, DiscordjsError, AttachmentBuilder } = require("discord.js");
const { joinVoiceChannel, createAudioPlayer, createAudioResource, VoiceConnectionStatus, AudioPlayerStatus } = require('@discordjs/voice');
const { waitMs, snowflakeToDate, msToHumanReadableTime } = require('./../utils/time');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Embed, progressBar } = require('./../models/Embed');
const { Card } = require('./../models/card/Card');
const config = require('./../../config.json');
const Chart = require('./../models/Chart');
const DC = require('./../singleton/DC');
const { Readable } = require('stream');
const { join } = require('path');
const ytdl = require('ytdl-core');

const { SimpleTable } = require('../models/SimpleTable');


const { Mongo, ENUMS } = require('../models/Mongo');
const MongoDb = new Mongo();

const data = new SlashCommandBuilder()
  .setName('embed-design')
  .setDescription('Command for tests.')
  .setDescriptionLocalizations({
    de: 'Befehl zum testen.',
  })
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)


const execute = async (interaction, client, guild, member, lang) => {
  await DC.defer(interaction);

  const data = [
    { name: "Nicusch", sizetype: "Big", count: 20 },
    { name: "Noner", sizetype: "Medium", count: 13 },
    { name: "Don", sizetype: "Extralarge", count: 55 },
    { name: "Han", sizetype: "ExtraMediumLarge", count: 33 },
  ]

  const columns = [
    { label: 'Username', key: 'name' },
    { label: 'Bucket Size', key: 'sizetype' },
    { label: 'Count', key: 'count' }
  ];

  const tableString = await new SimpleTable(columns)
    .setJsonArrayInputs(data)
    .setStringOffset(2)
    .addVerticalBar()
    .addIndex(1)
    .build();


  new Embed()
    .setColor(config.embeds.colors.info)
    .setDescription(tableString)
    .interactionResponse(interaction);

}


const executeComponent = async (interaction, client, guild, buttonData, member, lang) => {
  await DC.defer(interaction);


}

const componentIds = [];

module.exports = { execute, executeComponent, data };