const { ChannelType, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, PermissionFlagsBits, PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder, DiscordjsError, AttachmentBuilder } = require("discord.js");
const { joinVoiceChannel, createAudioPlayer, createAudioResource, VoiceConnectionStatus, AudioPlayerStatus } = require('@discordjs/voice');
const { waitMs, snowflakeToDate, msToHumanReadableTime } = require('./../utils/time');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Embed, progressBar } = require('./../models/Embed');
const { TableBuilder } = require('../models/table');
const { Card } = require('./../models/card/Card');
const config = require('./../../config.json');
const Chart = require('./../models/Chart');
const DC = require('./../singleton/DC');
const { Readable } = require('stream');
const { join } = require('path');
const ytdl = require('ytdl-core');


const { Mongo, ENUMS } = require('../models/Mongo');

const MongoDb = new Mongo();

const data = new SlashCommandBuilder()
  .setName('embed-design')
  .setDescription('Command for tests.')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

const getRandomColor = () => {
  const r = Math.floor(Math.random() * 255);
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);
  return `rgb(${r},${g},${b})`;
}


const execute = async (interaction, client, guild, member, lang) => {
  await DC.defer(interaction);

  const uniqIds = await MongoDb.distinct(ENUMS.DCB.GITHUB_COMMITS, "name");

  console.log(uniqIds);

  const pipeline = [
    {
      $sort: { time: 1 } // Sort documents by time in ascending order
    },
    {
      $group: {
        _id: {
          name: "$name",
          date: {
            $dateToString: { format: "%Y-%m-%d", date: { $toDate: "$time" } }
          }
        },
        dailyCommits: { $sum: "$commitscount" }
      }
    },
    {
      $sort: { "_id.date": 1 } // Sort results by date in ascending order
    }
  ];

  const cursor = await MongoDb.aggregate(ENUMS.DCB.GITHUB_COMMITS, pipeline);
  // const dbEntries = await cursor.toArray();
  console.dir(cursor);
  console.dir(cursor.length);


  const dbEntries = [];
  await cursor.forEach(doc => dbEntries.push(doc));

  console.dir(dbEntries);

  // Calculate cumulative commits for each user
  const cumulativeCommits = {};
  dbEntries.forEach(entry => {
    const { name, date } = entry._id;
    const dailyCommits = entry.dailyCommits;

    if (!cumulativeCommits[name]) {
      cumulativeCommits[name] = [];
    }

    const previousTotal = cumulativeCommits[name].length > 0 ? cumulativeCommits[name][cumulativeCommits[name].length - 1].commits : 0;
    cumulativeCommits[name].push({ date, commits: previousTotal + dailyCommits });
  });

  console.dir(cumulativeCommits);

  // Prepare data for the chart
  const labels = dbEntries.map(entry => entry._id.date).filter((value, index, self) => self.indexOf(value) === index);
  const datasets = [];

  for (const [name, data] of Object.entries(cumulativeCommits)) {
    datasets.push({
      label: name,
      data: data.map(entry => entry.commits),
      borderColor: getRandomColor(),
      fill: false
    });
  }

  // Create the chart
  const chart = new Chart(800, 600)
    .setType('line')
    .setLabels(labels);

  datasets.forEach(dataset => {
    chart.addDataset(dataset.label, dataset.data, dataset.borderColor);
  });

  chart.interactionResponse(interaction);

}


const executeComponent = async (interaction, client, guild, buttonData, member, lang) => {
  await DC.defer(interaction);


}

const componentIds = [];

module.exports = { execute, executeComponent, data };