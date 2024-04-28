const { SlashCommandBuilder } = require('@discordjs/builders');
const { ChannelType, PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const { channelFromInteraction, removeAllChannelUserPerms } = require('./../utils/channel');
const { waitMs, snowflakeToDate, msToHumanReadableTime } = require('./../utils/time');
const { Channel } = require('./../models/Channel');
const { keyArray } = require('./../utils/helper');
const { Embed } = require('./../models/Embed');
const config = require('./../../config.json');

const data = new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Opens a new support ticket for assistance.')

const USER_OVERRIDE = 1;

const getSmallestTicketNumber = (guild) => {
    return new Promise((resolve) => {
        const allChannels = guild.channels.cache;
        const channelsInCategory = allChannels.filter(channel => channel.parentId === config.parents.support);

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

        resolve(formattedNumber);
    })
}

const checkLastCreatedTicket = (guild, member) => {
    const allChannels = guild.channels.cache;
    const channelsInCategory = allChannels.filter(channel => channel.parentId === config.parents.support);

    const keys = keyArray(channelsInCategory);

    let lastChannelTimestamp = null;

    keys.forEach(channelId => {
        const channel = channelsInCategory.get(channelId);

        const permissionOverwrites = channel.permissionOverwrites.cache;
        const type1Overwrites = permissionOverwrites.filter(overwrite => overwrite.type === USER_OVERRIDE);

        const userOverWrite = type1Overwrites.get(member.id);

        if (userOverWrite == undefined) return;
        if (channel.id == null) return;

        const timeStamp = snowflakeToDate(channel.id);

        if (timeStamp > lastChannelTimestamp) {
            lastChannelTimestamp = timeStamp
        }

    });

    if (lastChannelTimestamp == null) return null;

    const timeStamp = new Date(lastChannelTimestamp).getTime();
    const currentTime = Date.now();

    const timeDifference = currentTime - timeStamp;

    return timeDifference;
}

const execute = async (interaction, client, guild, member, lang) => {
    await interaction.deferReply({ ephemeral: true });

    const lastTicketinMs = checkLastCreatedTicket(guild, member);

    if (lastTicketinMs !== null && lastTicketinMs < config.commands.ticket.timeout) {
        const { m, s } = msToHumanReadableTime(lastTicketinMs);

        await new Embed()
            .setColor(config.embeds.colors.danger)
            .addInputs({ m, s })
            .addContext(lang, member, 'timeout')
            .addCode0Footer()
            .interactionResponse(interaction)

        return;
    }

    await new Embed()
        .setColor(config.embeds.colors.info)
        .addContext(lang, member, 'create')
        .addCode0Footer()
        .interactionResponse(interaction)


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
        .interactionResponse(interaction)


    const closeTicket = new ButtonBuilder()
        .setCustomId('close-ticket')
        .setLabel('Close Ticket')
        .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder()
        .addComponents(closeTicket);

    await new Embed()
        .setColor(config.embeds.colors.info)
        .addInputs({ ticketnumber: ticketNumber })
        .addContext(lang, member, 'info-message')
        .addCode0Footer()
        .responseToChannel(ticketChannel.id, client, [row], true)

}


const executeComponent = async (interaction, client, guild, componentData, member, lang) => {
    await interaction.deferReply({ ephemeral: true });

    if (componentData.id == 'close-ticket') {

        interaction.message.delete();

        const ticketChannel = channelFromInteraction(interaction, guild);
        // const createdTimestamp = ticketChannel.createdTimestamp;

        await new Embed()
            .setColor(config.embeds.colors.danger)
            // .addInputs()
            .addContext(lang, member, 'close-info')
            .addCode0Footer()
            .interactionResponse(interaction)


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
            .responseToChannel(ticketChannel.id, client, [row])


        ticketChannel.setName(`${ticketChannel.name}-closed`)

    } else if (componentData.id == 'delete-ticket') {
        const ticketChannel = channelFromInteraction(interaction, guild);
        ticketChannel.delete({ reason: "lol" });
    }
}

const componentIds = [
    'close-ticket',
    'delete-ticket'
];

module.exports = { execute, executeComponent, componentIds, data };