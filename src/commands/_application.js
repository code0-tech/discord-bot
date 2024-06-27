const { ChannelType, PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const { channelFromInteraction, removeAllChannelUserPerms, channelsFromParent } = require('../discord/channel');
const { messagesFromChannel } = require('./../discord/quick-dc');
const { isTeamMember } = require('./../discord/user');
const { Channel } = require('./../models/Channel');
const { keyArray } = require('./../utils/helper');
const { Embed } = require('./../models/Embed');
const config = require('./../../config.json');

const data = null;

const autoRun = async (client, lang) => {
    const messages = await messagesFromChannel(client, config.serverid, config.channels.application);
    const messagesIds = keyArray(messages);

    messagesIds.forEach(async (messageId) => {
        const message = messages.get(messageId);
        if (message.author.id !== client.application.id) {
            await message.delete();
        }
    });

    if (messagesIds.length !== 0) return;

    const applyButtonClosedTeam = new ButtonBuilder()
        .setCustomId('application-apply-closed-team')
        .setLabel(lang.english['_application']['#btn-closed-team'])
        .setStyle(ButtonStyle.Primary);

    const applyButtonOpenContributor = new ButtonBuilder()
        .setCustomId('application-apply-open-contributor')
        .setLabel(lang.english['_application']['#btn-open-contributer'])
        .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder()
        .addComponents(applyButtonClosedTeam, applyButtonOpenContributor);

    new Embed()
        .setColor(config.embeds.colors.info)
        .addInputs({ teamid: config.roles.team })
        .addContext({ text: lang.english['_application'] }, null, '#init-message')
        .responseToChannel(config.channels.application, client, [row])
}


const USER_OVERRIDE = 1;

const checkLastCreatedTicket = async (guild, member) => {
    const channelsInCategory = await channelsFromParent(config.parents.applications, guild);

    let hasChannel = channelsInCategory.some(channel => {
        const userOverWrite = channel.permissionOverwrites.cache.find(overwrite => overwrite.type === USER_OVERRIDE && overwrite.id === member.id);
        return userOverWrite !== undefined && channel.id !== null;
    });

    return hasChannel;
}


const executeComponent = async (interaction, client, guild, member, lang, buttonData) => {
    await interaction.deferReply({ ephemeral: true });

    const isTeam = await isTeamMember(member);
    const sendEmbedResponse = async (color, contextKey) => {
        await new Embed()
            .setColor(color)
            .addContext(lang, member, contextKey)
            .interactionResponse(interaction);
    };

    if (buttonData.id === 'application-apply-closed-team' || buttonData.id === 'application-apply-open-contributor') {

        if (await checkLastCreatedTicket(guild, member)) {
            await sendEmbedResponse(config.embeds.colors.danger, 'has-application');
            return;
        }

        const applicationChannel = await new Channel()
            .setName(`${config.emojis.application}${config.emojis["default-combine-symbol"]}${member.user.username}`)
            .setParent(config.parents.applications)
            .setType(ChannelType.GuildText)
            .setPermissionOverwrite(interaction.user.id, [
                PermissionsBitField.Flags.ViewChannel,
                PermissionsBitField.Flags.AttachFiles,
                PermissionsBitField.Flags.SendMessages,
                PermissionsBitField.Flags.EmbedLinks,
                PermissionsBitField.Flags.AddReactions
            ])
            .setPermissionOverwrite(interaction.guild.id, [], [PermissionsBitField.Flags.ViewChannel])
            .createChannel(guild);

        const closeApplicationButton = new ButtonBuilder()
            .setCustomId('application-close')
            .setLabel(lang.text['btn-close'])
            .setStyle(ButtonStyle.Danger);

        const row = new ActionRowBuilder().addComponents(closeApplicationButton);

        await new Embed()
            .setColor(config.embeds.colors.info)
            .addContext(lang, member, 'application-message')
            .responseToChannel(applicationChannel.id, client, [row], true);

        await new Embed()
            .setColor(config.embeds.colors.info)
            .addInputs({ channelid: applicationChannel.id })
            .addContext(lang, member, 'new-application')
            .interactionResponse(interaction);

    } else if (buttonData.id === 'application-close') {

        if (!isTeam) {
            await sendEmbedResponse(config.embeds.colors.danger, 'no-team-member');
            return;
        }

        await interaction.message.delete();
        await sendEmbedResponse(config.embeds.colors.danger, 'close-info');

        const applicationChannel = await channelFromInteraction(interaction, guild);

        removeAllChannelUserPerms(applicationChannel);

        const confirmDeleteButton = new ButtonBuilder()
            .setCustomId('delete-ticket')
            .setLabel(lang.text['btn-remove'])
            .setStyle(ButtonStyle.Danger);

        const row = new ActionRowBuilder().addComponents(confirmDeleteButton);

        await new Embed()
            .setColor(config.embeds.colors.danger)
            .addInputs({ closeduserid: interaction.user.id })
            .addContext(lang, member, 'confirm-remove-application')
            .responseToChannel(applicationChannel.id, client, [row]);

        applicationChannel.setName(`${applicationChannel.name}-closed`);

    } else {
        if (!isTeam) {
            await sendEmbedResponse(config.embeds.colors.danger, 'no-team-member');
            return;
        }

        const applicationChannel = await channelFromInteraction(interaction, guild);
        await applicationChannel.delete({ reason: "Apply was closed and marked as ~fin" });
    }
};


const componentIds = [
    'application-apply-closed-team',
    'application-apply-open-contributor',
    'application-close',
    'application-remove'
];

module.exports = { executeComponent, componentIds, data, autoRun };