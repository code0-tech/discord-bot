// unused and is not working
const channelsFromParent = (parentId, guild) => {
    const allChannels = guild.channels.cache;
    const channelsInCategory = allChannels.filter(channel => channel.parentId === config.parents.support);

    return channelsInCategory;
}
// end

const channelFromId = (channelId, guild) => {
    const channel = guild.channels.cache.get(channelId);
    return channel;
}

const channelFromInteraction = (interaction, guild) => {
    const channel = guild.channels.cache.get(interaction.message.channelId);
    return channel;
}

const removeAllChannelUserPerms = (channel) => {
    const permissionOverwrites = channel.permissionOverwrites.cache;
    const type1Overwrites = permissionOverwrites.filter(overwrite => overwrite.type === 1);

    [...type1Overwrites.keys()].forEach(userId => {
        channel.permissionOverwrites.delete(userId);
    });
}

module.exports = { channelsFromParent, channelFromId, channelFromInteraction, removeAllChannelUserPerms };