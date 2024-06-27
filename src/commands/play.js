const { ChannelType, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, PermissionFlagsBits, PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder, DiscordjsError, AttachmentBuilder } = require("discord.js");
const { joinVoiceChannel, createAudioPlayer, createAudioResource, VoiceConnectionStatus, AudioPlayerStatus } = require('@discordjs/voice');
const { channelFromInteraction, removeAllChannelUserPerms, channelFromId } = require('../discord/channel');
const { waitMs, snowflakeToDate, msToHumanReadableTime } = require('./../utils/time');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Embed, progressBar } = require('./../models/Embed');
const { TableBuilder } = require('../models/table');
const { Card } = require('./../models/card/Card');
const config = require('./../../config.json');
const { Readable } = require('stream');
const { join } = require('path');
const ytdl = require('ytdl-core');


const data = new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play music stream from yt videos.')
    .addStringOption(option =>
        option.setName('url')
            .setDescription('Use Youtube or Youtube Music urls.')
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)


// This is just for fun so no entries in english.json


const execute = async (interaction, client, guild, member, lang) => {
    await interaction.deferReply({ ephemeral: true });

    return;

    if (global.musicPlayer.inuse == true) {
        await new Embed()
            .setColor(config.embeds.colors.info)
            .setTitle('Already Playing Music')
            .interactionResponse(interaction);
        return;
    }

    const { channelId } = await userVoiceState(member.id, guild);

    if (channelId == null) {
        await new Embed()
            .setColor(config.embeds.colors.info)
            .setTitle('You are not in a Voice Channel')
            .interactionResponse(interaction);
        return;
    }



};


module.exports = { execute, data };

/* 

// const audioPath = join(global.mainDir, 'track.mp3');

const channel = await channelFromId("1173728357658132580", guild);

const connection = joinVoiceChannel({
  channelId: channel.id,
  guildId: channel.guild.id,
  adapterCreator: channel.guild.voiceAdapterCreator,
});

const url = "https://music.youtube.com/watch?v=SZ_I0KZvezw&feature=shared";
 */

/* connection.on(VoiceConnectionStatus.Ready, () => {
  console.log('The bot has connected to the channel!');

  const player = createAudioPlayer();

  const stream = ytdl(url, { filter: 'audioonly' });
  const resource = createAudioResource(stream);
  // const resource = createAudioResource(audioPath); // Ensure the path is correct

  console.log(resource)

  player.play(resource);
  connection.subscribe(player);

  player.on(AudioPlayerStatus.Playing, () => {
    console.log('The audio resource is now playing!');
  });

  player.on('error', error => {
    console.error('Error:', error.message, 'with track', error.resource.metadata);
  });
}); */
/* 
connection.on(VoiceConnectionStatus.Ready, async () => {
  console.log('The bot has connected to the channel!');

  // Download the entire audio and store it in memory
  const stream = ytdl(url, { filter: 'audioonly' });
  const chunks = [];
  stream.on('data', chunk => chunks.push(chunk));
  stream.on('end', () => {
    const audioBuffer = Buffer.concat(chunks);
    const readable = new Readable();
    readable.push(audioBuffer);
    readable.push(null);
    const resource = createAudioResource(readable);
    const player = createAudioPlayer();

    player.play(resource);
    connection.subscribe(player);

    player.on(AudioPlayerStatus.Playing, () => {
      console.log('The audio resource is now playing!');
    });

    player.on('error', error => {
      console.error('Error:', error.message);
    });

    player.on(AudioPlayerStatus.Idle, () => {
      connection.destroy();
      console.log('The bot has left the channel!');
    });
  });
});

connection.on(VoiceConnectionStatus.Disconnected, async () => {
  try {
    await Promise.race([
      entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
      entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
    ]);

    console.log("hi")
    // Seems to be reconnecting to a new channel - ignore disconnect
  } catch (error) {
    console.log("Disconnect")
    connection.destroy();
  }
});

 */



/* new Embed()
  .setColor(config.embeds.colors.info)
  .addContext(lang, member, 'lol')
  .interactionResponse(interaction);

/* await new Card()
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
  .interactionResponse(interaction); */
