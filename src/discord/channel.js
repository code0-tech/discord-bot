const channelsFromParent = async (parentid, guild) => {
    const allChannels = guild.channels.cache;
    const channelsInCategory = allChannels.filter(channel => channel.parentId === parentid);

    return channelsInCategory;
}

const channelFromId = (channelId, guild) => {
    const channel = guild.channels.cache.get(channelId);
    return channel;
}

const channelFromInteraction = (interaction, guild) => {
    const channel = guild.channels.cache.get(interaction.message.channelId);
    return channel;
}

const USER_OVERRIDE = 1;

const removeAllChannelUserPerms = (channel) => {
    const permissionOverwrites = channel.permissionOverwrites.cache;
    const type1Overwrites = permissionOverwrites.filter(overwrite => overwrite.type === USER_OVERRIDE);

    [...type1Overwrites.keys()].forEach(userId => {
        channel.permissionOverwrites.delete(userId);
    });
}

module.exports = { channelsFromParent, channelFromId, channelFromInteraction, removeAllChannelUserPerms };