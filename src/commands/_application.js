const { ChannelType, PermissionFlagsBits, PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder, DiscordjsError, AttachmentBuilder } = require("discord.js");
const { channelFromInteraction, removeAllChannelUserPerms, channelsFromParent } = require('../discord/channel');
const { getMessagesFromChannel } = require('./../discord/message');
const { channelFromId } = require('./../discord/channel');
const { Channel } = require('./../models/Channel');
const { getGuild } = require('./../discord/guild');
const { keyArray } = require('./../utils/helper');
const { Embed } = require('./../models/Embed');
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
    });

    // Go and check if message is up to date


    if (messagesIds.length == 0) { // Testing purpose
        const applyButtonClosedTeam = new ButtonBuilder()
            .setCustomId('application-apply-closed-team')
            .setLabel('Apply as Closed Team')
            .setStyle(ButtonStyle.Primary);

        const applyButtonOpenContributor = new ButtonBuilder()
            .setCustomId('application-apply-open-contributor')
            .setLabel('Apply as Open Contributor')
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder()
            .addComponents(applyButtonClosedTeam, applyButtonOpenContributor);

        // add message to english.json

        new Embed()
            .setColor(config.embeds.colors.info)
            .setTitle('Welcome to the Application Channel')
            .setDescription(`Welcome! This is where you can start your application process. As an open contributor, you now have the opportunity to become a part of our <@&${config.roles.team}>. Click the button below to create a new application channel and get in touch with our staff. We're excited to have you join Code0. If you already have an active application channel, please use that to continue your application.`)
            .responseToChannel(config.channels.application, client, [row])
    }
}

const USER_OVERRIDE = 1;

const checkLastCreatedTicket = async (guild, member) => {
    const channelsInCategory = await channelsFromParent(config.parents.application, guild);

    let hasChannel = channelsInCategory.some(channel => {
        const userOverWrite = channel.permissionOverwrites.cache.find(overwrite => overwrite.type === USER_OVERRIDE && overwrite.id === member.id);
        return userOverWrite !== undefined && channel.id !== null;
    });

    return hasChannel;
}


const executeComponent = async (interaction, client, guild, buttonData, member, lang) => {
    const defer = await interaction.deferReply({ ephemeral: true });

    // add different message to apply buttons in channel

    if (await checkLastCreatedTicket(guild, member)) {
        new Embed()
            .setColor(config.embeds.colors.danger)
            .addContext(lang, member, 'has-application')
            .interactionResponse(interaction)
        return;
    }

    const applicationChannel = await new Channel()
        .setName(`${config.emojis.application}${config.emojis["default-combine-symbol"]}${member.user.username}`)
        .setParent(config.parents.application)
        .setType(ChannelType.GuildText)
        .setPermissionOverwrite(interaction.guild.id, [], [
            PermissionsBitField.Flags.ViewChannel
        ])
        .setPermissionOverwrite(interaction.user.id, [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.AttachFiles,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.EmbedLinks,
            PermissionsBitField.Flags.AddReactions
        ])
        .createChannel(guild);

    new Embed()
        .setColor(config.embeds.colors.info)
        .addContext(lang, member, 'application-message')
        .responseToChannel(applicationChannel.id, client);

    new Embed()
        .setColor(config.embeds.colors.info)
        .addInputs({ channelid: applicationChannel.id })
        .addContext(lang, member, 'new-application')
        .interactionResponse(interaction)

}


const componentIds = [
    'application-apply-closed-team',
    'application-apply-open-contributor',
    'application-close'
];

module.exports = { executeComponent, componentIds, data, autoRun };