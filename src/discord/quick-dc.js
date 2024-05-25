const { getMessagesFromChannel } = require('./message');
const { channelFromId } = require('./channel');
const { getGuild } = require('./guild');

const messagesFromChannel = async (client, serverid, channelid) => {
    const guild = await getGuild(serverid, client);
    const channel = await channelFromId(channelid, guild);
    const messages = await getMessagesFromChannel(channel);

    return messages;
}

module.exports = { messagesFromChannel };