const { PermissionFlagsBits } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Embed } = require('./../models/Embed');
const config = require('../../config.json');
const ytdl = require('ytdl-core');

const data = new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play music stream from yt videos.')
    .addStringOption(option =>
        option.setName('url')
            .setDescription('Use Youtube or Youtube Music urls.')
        // .setAutocomplete(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)


const execute = async (interaction, client, guild, member, lang) => {
    await interaction.deferReply({ ephemeral: true });

};

const autoComplete = async (interaction, client, guild, member, lang) => {
    const focusedValue = interaction.options.getFocused();

    if (!focusedValue) {
        await interaction.respond([]);
        return;
    }

    const searchResults = await ytdl.search(focusedValue);



    console.log(searchResults)

    // await interaction.respond(await (focusedValue));
};


const componentIds = [];

module.exports = { execute, componentIds, autoComplete, data };