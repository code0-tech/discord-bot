const { ChannelType, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, PermissionFlagsBits, PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder, DiscordjsError, AttachmentBuilder } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Embed, progressBar } = require('./../models/Embed');
const { TableBuilder } = require('../models/table');
const { Card } = require('./../models/card/Card');
const { waitMs } = require('./../utils/time');
const config = require('./../../config.json');
const { channelFromInteraction, removeAllChannelUserPerms, channelFromId } = require('../discord/channel');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, VoiceConnectionStatus, AudioPlayerStatus } = require('@discordjs/voice');


const data = new SlashCommandBuilder()
  .setName('embed-design')
  .setDescription('Testing...')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)


const execute = async (interaction, client, guild, member, lang) => {
  await interaction.deferReply({ ephemeral: true });

  // const channel = await channelFromId("1173728043223765132", guild);

  // channel.send('<@329279009298841600> Ich komme auch gleich zu euch');

  const channel2 = await channelFromId("1173728357658132580", guild);

  const connection = joinVoiceChannel({
    channelId: channel2.id,
    guildId: channel2.guild.id,
    adapterCreator: channel2.guild.voiceAdapterCreator,
  });


  /*  const channel = await channelFromId("1173728357658132580", guild)
 
   const connection = joinVoiceChannel({
     channelId: channel.id,
     guildId: channel.guild.id,
     adapterCreator: channel.guild.voiceAdapterCreator,
   });
 
   connection.on(VoiceConnectionStatus.Ready, () => {
     console.log('The bot has connected to the channel!');
 
     const player = createAudioPlayer();
     const resource = createAudioResource('track.mp3'); // Ensure the path is correct
 
     console.log(resource)
 
     player.play(resource);
     connection.subscribe(player);
 
     player.on(AudioPlayerStatus.Playing, () => {
       console.log('The audio resource is now playing!');
     });
 
     player.on('error', error => {
       console.error('Error:', error.message, 'with track', error.resource.metadata);
     });
   });
 
   connection.on(VoiceConnectionStatus.Disconnected, async () => {
     try {
       await Promise.race([
         entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
         entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
       ]);
       // Seems to be reconnecting to a new channel - ignore disconnect
     } catch (error) {
       // Seems to be a real disconnect which SHOULDN'T be recovered from
       connection.destroy();
     }
   });
 
  */



  /* new Embed()
    .setColor(config.embeds.colors.info)
    .addContext(lang, member, 'lol')
    .addCode0Footer()
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

}


const executeComponent = async (interaction, client, guild, buttonData, member, lang) => {
  const defer = await interaction.deferReply({ ephemeral: true });

}

const componentIds = [
  'test-id1'
];

module.exports = { execute, executeComponent, componentIds, data };