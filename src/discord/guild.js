const getGuild = async (guildId, client) => {
    return await client.guilds.fetch(guildId);
}


module.exports = { getGuild };