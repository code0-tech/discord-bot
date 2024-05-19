const getGuild = async (guildId, client) => {
    return await client.guilds.cache.get(guildId);
}

module.exports = { getGuild };