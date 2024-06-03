const { PermissionFlagsBits } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Embed } = require('./../models/Embed');
const config = require('../../config.json');
const ytdl = require('ytdl-core');
const { userVoiceState } = require('./../discord/voice');


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