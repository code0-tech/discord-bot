const { ButtonBuilder, ButtonStyle, ActionRowBuilder, StringSelectMenuBuilder, PermissionFlagsBits } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { convertUnixToTimestamp } = require('../utils/time');
const { Mongo, ENUMS } = require('../models/Mongo');
const DiscordSimpleTable = require('discord-simpletable');
const { Embed } = require('./../models/Embed');
const config = require('./../../config.json');
const DC = require('./../singleton/DC');

const data = new SlashCommandBuilder()
    .setName('git')
    .setDescription('Display Git activity.')
    .setDescriptionLocalizations({
        de: 'Git aktivität für Code0.',
    })


const execute = async (interaction, client, guild, member, lang) => {
    await DC.defer(interaction);

}

module.exports = { execute, data };