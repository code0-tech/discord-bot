const { ChannelType, PermissionFlagsBits, PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder, DiscordjsError, AttachmentBuilder } = require("discord.js");
const { getMessagesFromChannel } = require('./../discord/message');
const { Embed, progressBar } = require('./../models/Embed');
const { channelFromId } = require('./../discord/channel');
const { getGuild } = require('./../discord/guild');
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

        // console.log(messages.get(messageId));

    });



    // Go and check if message is up to date



    if (messagesIds.length == 0) { // Testing purpose
        const applyButton = new ButtonBuilder()
            .setCustomId('application-apply-now')
            .setLabel('Apply Now')
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder()
            .addComponents(applyButton);


        new Embed()
            .setColor(config.embeds.colors.info)
            .setTitle('Test Apply Message')
            .setDescription(`Click here to apply, in order to become a Closed Team Member`)
            .responseToChannel(config.channels.application, client, [row])
    }

}

/* 
22:31:32 20.5.2024 => TypeError: Cannot read properties of null (reading 'name')
    at button (E:\code\code0-discord-bot\src\interactions\emit-interactions.js:58:128)
    at Client.<anonymous> (E:\code\code0-discord-bot\src\interactions\emit-interactions.js:75:13)   
    at Client.emit (node:events:518:28)
    at InteractionCreateAction.handle (E:\code\code0-discord-bot\node_modules\discord.js\src\client\actions\InteractionCreate.js:97:12)
    at module.exports [as INTERACTION_CREATE] (E:\code\code0-discord-bot\node_modules\discord.js\src\client\websocket\handlers\INTERACTION_CREATE.js:4:36)
    at WebSocketManager.handlePacket (E:\code\code0-discord-bot\node_modules\discord.js\src\client\websocket\WebSocketManager.js:355:31)
    at WebSocketManager.<anonymous> (E:\code\code0-discord-bot\node_modules\discord.js\src\client\websocket\WebSocketManager.js:239:12)
    at WebSocketManager.emit (E:\code\code0-discord-bot\node_modules\@vladfrangu\async_event_emitter\dist\index.cjs:282:31)
    at WebSocketShard.<anonymous> (E:\code\code0-discord-bot\node_modules\@discordjs\ws\dist\index.js:1173:51)
    at WebSocketShard.emit (E:\code\code0-discord-bot\node_modules\@vladfrangu\async_event_emitter\dist\index.cjs:282:31)

*/


const executeComponent = async (interaction, client, guild, buttonData, member, lang) => {
    const defer = await interaction.deferReply({ ephemeral: true });

    new Embed()
        .setColor(config.embeds.colors.black)
        .setTitle('Well, this function is still work in progress')
        .setDescription(`
        But we know to work on look here:

\`//Code0/Nicusch/Code0-Discord-Bot/src/command/_application.js\`

\`\`\`js
// This code is marked as work in progess

const defer = await interaction.deferReply({ ephemeral: true });

    new Embed()
     .setColor(config.embeds.colors.black)
     .setTitle('Well, this function is still work in progress')
     .setDescription(info)
     .interactionResponse(interaction)
\`\`\``)
        .interactionResponse(interaction)

}

const componentIds = [
    'application-apply-now'
];

module.exports = { executeComponent, componentIds, data, autoRun };