const { ChannelType, PermissionFlagsBits, PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder, DiscordjsError, AttachmentBuilder } = require("discord.js");
const { channelFromInteraction, removeAllChannelUserPerms, channelsFromParent } = require('../discord/channel');
const { messagesFromChannel } = require('./../discord/quick-dc');
const { Channel } = require('./../models/Channel');
const { keyArray } = require('./../utils/helper');
const { Embed } = require('./../models/Embed');
const config = require('./../../config.json');

const data = null;

const autoRun = async (client) => {
    const messages = await messagesFromChannel(client, config.serverid, config.channels.application);

    const messagesIds = keyArray(messages);

    messagesIds.forEach(async (messageId) => {
        const message = messages.get(messageId);
        if (message.author.id !== client.application.id) {
            await message.delete();
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

    if (buttonData.id == 'application-apply-closed-team' || buttonData.id == 'application-apply-open-contributor') {

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

        const closeApplication = new ButtonBuilder()
            .setCustomId('application-close')
            .setLabel(lang.text['btn-close'])
            .setStyle(ButtonStyle.Danger);

        const row = new ActionRowBuilder()
            .addComponents(closeApplication);

        new Embed()
            .setColor(config.embeds.colors.info)
            .addContext(lang, member, 'application-message')
            .responseToChannel(applicationChannel.id, client, [row]);

        new Embed()
            .setColor(config.embeds.colors.info)
            .addInputs({ channelid: applicationChannel.id })
            .addContext(lang, member, 'new-application')
            .interactionResponse(interaction)

    } else if (buttonData.id == 'application-close') {

        if (!member.roles.cache.has(config.roles.team)) {
            await new Embed()
                .setColor(config.embeds.colors.danger)
                .addContext(lang, member, 'no-team-member')
                .interactionResponse(interaction);
            return;
        }

        interaction.message.delete();

        await new Embed()
            .setColor(config.embeds.colors.danger)
            .addContext(lang, member, 'close-info')
            .interactionResponse(interaction);

        const applicationChannel = await channelFromInteraction(interaction, guild);

        removeAllChannelUserPerms(applicationChannel);

        const confirmDelete = new ButtonBuilder()
            .setCustomId('delete-ticket')
            .setLabel(lang.text['btn-remove'])
            .setStyle(ButtonStyle.Danger);

        const row = new ActionRowBuilder()
            .addComponents(confirmDelete);

        await new Embed()
            .setColor(config.embeds.colors.danger)
            .addInputs({ closeduserid: interaction.user.id })
            .addContext(lang, member, 'confirm-remove-application')
            .responseToChannel(applicationChannel.id, client, [row]);

        applicationChannel.setName(`${applicationChannel.name}-closed`);

    } else {
        const applicationChannel = await channelFromInteraction(interaction, guild);
        applicationChannel.delete({ reason: "Apply was closed and marked as ~fin" });
    }
}


const componentIds = [
    'application-apply-closed-team',
    'application-apply-open-contributor',
    'application-close',
    'application-remove'
];

module.exports = { executeComponent, componentIds, data, autoRun };