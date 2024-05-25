const { ChannelType, PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const { channelFromInteraction, removeAllChannelUserPerms, channelsFromParent } = require('../discord/channel');
const { waitMs, snowflakeToDate, msToHumanReadableTime } = require('./../utils/time');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Channel } = require('./../models/Channel');
const { Embed } = require('./../models/Embed');
const config = require('./../../config.json');

const data = new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Opens a new support ticket.')

const USER_OVERRIDE = 1;

const getSmallestTicketNumber = async (guild) => {
    const channelsInCategory = await channelsFromParent(config.parents.support, guild);

    const existingNumbers = channelsInCategory.map(channel => {
        const match = channel.name.match(/(\d+)/);
        return match ? parseInt(match[0]) : null;
    });

    const sortedNumbers = existingNumbers.filter(num => num !== null).sort((a, b) => a - b);

    let nextAvailableNumber = 1;
    for (const num of sortedNumbers) {
        if (num > nextAvailableNumber) {
            break;
        }
        nextAvailableNumber++;
    }
    const formattedNumber = nextAvailableNumber.toString().padStart(6, '0');

    return formattedNumber;
}

const checkLastCreatedTicket = async (guild, member) => {
    const channelsInCategory = await channelsFromParent(config.parents.support, guild);

    let lastChannelTimestamp = null;

    channelsInCategory.forEach(channel => {
        const userOverwrite = channel.permissionOverwrites.cache.find(
            overwrite => overwrite.type === USER_OVERRIDE && overwrite.id === member.id
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
    await interaction.deferReply({ ephemeral: true });

    const lastTicketinMs = await checkLastCreatedTicket(guild, member);

    if (lastTicketinMs !== null && lastTicketinMs < config.commands.ticket.timeout) {
        const { m, s } = msToHumanReadableTime(lastTicketinMs);

        await new Embed()
            .setColor(config.embeds.colors.danger)
            .addInputs({ m, s })
            .addContext(lang, member, 'timeout')
            .addCode0Footer()
            .interactionResponse(interaction);

        return;
    }

    await new Embed()
        .setColor(config.embeds.colors.info)
        .addContext(lang, member, 'create')
        .addCode0Footer()
        .interactionResponse(interaction);


    const ticketNumber = await getSmallestTicketNumber(guild);

    const ticketChannel = await new Channel()
        .setName(`${config.emojis.support}${config.emojis['default-combine-symbol']}${ticketNumber}`)
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
        .addCode0Footer()
        .interactionResponse(interaction);


    const closeTicket = new ButtonBuilder()
        .setCustomId('close-ticket')
        .setLabel(lang.text['btn-close'])
        .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder()
        .addComponents(closeTicket);

    await new Embed()
        .setColor(config.embeds.colors.info)
        .addInputs({ ticketnumber: ticketNumber })
        .addContext(lang, member, 'info-message')
        .addCode0Footer()
        .responseToChannel(ticketChannel.id, client, [row], true);

}


const executeComponent = async (interaction, client, guild, componentData, member, lang) => {
    await interaction.deferReply({ ephemeral: true });

    if (!member.roles.cache.has(config.roles.team)) {
        await new Embed()
            .setColor(config.embeds.colors.danger)
            .addInputs({ ticketnumber: ticketNumber })
            .addContext(lang, member, 'no-team-member')
            .addCode0Footer()
            .interactionResponse(interaction);
        return;
    }

    if (componentData.id == 'close-ticket') {

        interaction.message.delete();

        const ticketChannel = await channelFromInteraction(interaction, guild);

        await new Embed()
            .setColor(config.embeds.colors.danger)
            .addContext(lang, member, 'close-info')
            .addCode0Footer()
            .interactionResponse(interaction);


        await waitMs(5000);
        removeAllChannelUserPerms(ticketChannel);


        const confirmDelete = new ButtonBuilder()
            .setCustomId('delete-ticket')
            .setLabel('Remove Ticket')
            .setStyle(ButtonStyle.Danger);

        const row = new ActionRowBuilder()
            .addComponents(confirmDelete);

        await new Embed()
            .setColor(config.embeds.colors.danger)
            .addInputs({ closeduserid: interaction.user.id })
            .addContext(lang, member, 'closed')
            .addCode0Footer()
            .responseToChannel(ticketChannel.id, client, [row]);


        ticketChannel.setName(`${ticketChannel.name}-closed`);

    } else if (componentData.id == 'delete-ticket') {
        const ticketChannel = await channelFromInteraction(interaction, guild);
        ticketChannel.delete({ reason: "Ticket was closed and marked as fin" });
    }
}

const componentIds = [
    'close-ticket',
    'delete-ticket'
];

module.exports = { execute, executeComponent, componentIds, data };