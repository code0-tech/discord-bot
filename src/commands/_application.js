const { ChannelType, PermissionFlagsBits, PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder, DiscordjsError, AttachmentBuilder } = require("discord.js");
const { Embed, progressBar } = require('./../models/Embed');
const { getGuild } = require('./../discord/guild');
const { channelFromId } = require('./../discord/channel');
const { getMessagesFromChannel } = require('./../discord/message');
const { keyArray } = require('./../utils/helper');

const config = require('./../../config.json');

const data = null;

const autoRun = async (client) => {
    const guild = await getGuild(config.serverid, client);
    const applicationChannel = await channelFromId(config.channels.application, guild);
    const messages = await getMessagesFromChannel(applicationChannel);

    const messagesIds = keyArray(messages);

    messagesIds.forEach(messageId => {
        const message = messages.get(messageId);
        if (message.author.id !== client.application.id) {
            message.delete();
        }

        console.log(messages.get(messageId))

    });

}

const executeComponent = async (interaction, client, guild, buttonData, member, lang) => {
    const defer = await interaction.deferReply({ ephemeral: true });

}

const componentIds = [
    'test-id1'
];

module.exports = { executeComponent, componentIds, data, autoRun };