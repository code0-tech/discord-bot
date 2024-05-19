const { ChannelType, PermissionFlagsBits, PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder, DiscordjsError, AttachmentBuilder } = require("discord.js");
const { Embed, progressBar } = require('./../models/Embed');
const { getGuild } = require('./../discord/guild');
const { channelFromId } = require('./../discord/channel');

const config = require('./../../config.json');

const data = null;

const autoRun = async (client) => {
    const guild = await getGuild(config.serverid, client);
    const applicationChannel = channelFromId(config.channels.application, guild);

    console.log(applicationChannel);


}

const executeComponent = async (interaction, client, guild, buttonData, member, lang) => {
    const defer = await interaction.deferReply({ ephemeral: true });

}

const componentIds = [
    'test-id1'
];

module.exports = { executeComponent, componentIds, data, autoRun };