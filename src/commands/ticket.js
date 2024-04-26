const { SlashCommandBuilder } = require('@discordjs/builders');
const { ChannelType, PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const { channelFromInteraction, removeAllChannelUserPerms } = require('./../utils/channel');
const { waitMs } = require('./../utils/time');
const { Embed } = require('./../models/Embed');
const { Channel } = require('./../models/Channel');
const config = require('./../../config.json');

const data = new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Opens a new support ticket for assistance.')


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
        const formattedNumber = nextAvailableNumber.toString().padStart(4, '0');

        resolve(formattedNumber);
    })
}

const execute = async (interaction, client, guild, member, lang) => {
    const defer = await interaction.deferReply({ ephemeral: true });

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
    const defer = await interaction.deferReply({ ephemeral: true });

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