const { ChannelType, PermissionFlagsBits, PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder, DiscordjsError, AttachmentBuilder } = require("discord.js");
const { Embed, progressBar } = require('./../models/Embed');
const config = require('./../../config.json');

const data = null;

const autoRun = (client) => {
    console.log("yyyyyeee")

}

const executeComponent = async (interaction, client, guild, buttonData, member, lang) => {
    const defer = await interaction.deferReply({ ephemeral: true });

}

const componentIds = [
    'test-id1'
];

module.exports = { executeComponent, componentIds, data, autoRun };