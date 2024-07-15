const { ChannelType, PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const { waitMs, snowflakeToDate, msToHumanReadableTime } = require('./../utils/time');
const { SlashCommandBuilder } = require('@discordjs/builders');
const Constants = require('./../../data/constants');
const { Channel } = require('./../models/Channel');
const { Embed } = require('./../models/Embed');
const config = require('./../../config.json');
const DC = require('./../singleton/DC');

const data = new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Open a new support ticket.')

const checkLastCreatedTicket = async (guild, member) => {
    const channelsInCategory = await DC.channelsByParentId(config.parents.support, guild);

    let lastChannelTimestamp = null;

    channelsInCategory.forEach(channel => {
        const userOverwrite = channel.permissionOverwrites.cache.find(
            overwrite => overwrite.type === Constants.DISCORD.PERMS.USER_OVERRIDE && overwrite.id === member.id
        );

        if (!userOverwrite || !channel.id) return;

        const timeStamp = snowflakeToDate(channel.id);

        if (!lastChannelTimestamp || timeStamp > lastChannelTimestamp) {
            lastChannelTimestamp = timeStamp;
        }
    });

    if (!lastChannelTimestamp) return null;

    const timeDifference = Date.now() - new Date(lastChannelTimestamp).getTime();

    return timeDifference;
};

const execute = async (interaction, client, guild, member, lang) => {
    await DC.defer(interaction);

    const lastTicketinMs = await checkLastCreatedTicket(guild, member);

    if (lastTicketinMs !== null && lastTicketinMs < config.commands.ticket.timeout) {
        const { m, s } = msToHumanReadableTime(lastTicketinMs);

        await new Embed()
            .setColor(config.embeds.colors.danger)
            .addInputs({ m, s })
            .addContext(lang, member, 'timeout')
            .interactionResponse(interaction);

        return;
    }

    await new Embed()
        .setColor(config.embeds.colors.info)
        .addContext(lang, member, 'create')
        .interactionResponse(interaction);

    const ticketChannel = await new Channel()
        .setName(`${config.emojis.support}${config.emojis['default-combine-symbol']}${member.user.username}`)
        .setParent(config.parents.support)
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

    await new Embed()
        .setColor(config.embeds.colors.info)
        .addInputs({ channelid: ticketChannel.id })
        .addContext(lang, member, 'created')
        .interactionResponse(interaction);

    const closeTicket = new ButtonBuilder()
        .setCustomId('close-ticket')
        .setLabel(lang.text['btn-close'])
        .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder()
        .addComponents(closeTicket);

    await new Embed()
        .setColor(config.embeds.colors.info)
        .addContext(lang, member, 'info-message')
        .setPin(true)
        .setComponents([row])
        .responseToChannel(ticketChannel.id, client);
}


const executeComponent = async (interaction, client, guild, member, lang, componentData) => {
    await DC.defer(interaction);

    if (!await DC.isTeamMember(member)) {
        await new Embed()
            .setColor(config.embeds.colors.danger)
            .addContext(lang, member, 'no-team-member')
            .interactionResponse(interaction);
        return;
    }

    if (componentData.id == 'close-ticket') {

        interaction.message.delete();

        const ticketChannel = await DC.channelByInteraction(interaction, guild);

        await new Embed()
            .setColor(config.embeds.colors.danger)
            .addContext(lang, member, 'close-info')
            .interactionResponse(interaction);

        DC.removeChannelUserOverrides(ticketChannel);

        const confirmDelete = new ButtonBuilder()
            .setCustomId('delete-ticket')
            .setLabel(lang.getText('btn-delete-ticket'))
            .setStyle(ButtonStyle.Danger);

        const row = new ActionRowBuilder()
            .addComponents(confirmDelete);

        await new Embed()
            .setColor(config.embeds.colors.danger)
            .addInputs({ closeduserid: interaction.user.id })
            .addContext(lang, member, 'closed')
            .setComponents([row])
            .responseToChannel(ticketChannel.id, client);


        ticketChannel.setName(`${ticketChannel.name}-closed`);

    } else if (componentData.id == 'delete-ticket') {
        const ticketChannel = await DC.channelByInteraction(interaction, guild);
        ticketChannel.delete({ reason: "Ticket was closed and marked as ~fin" });
    }
}

const componentIds = [
    'close-ticket',
    'delete-ticket'
];


module.exports = { execute, executeComponent, componentIds, data };