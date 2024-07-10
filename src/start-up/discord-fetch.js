const Constants = require('../../data/constants');
const config = require('./../../config.json');

const fetch = async (client) => {
    const guild = await client.guilds.fetch(config.serverid);

    const channels = await guild.channels.fetch();
    console.log(`[Pre-Fetch] Fetched ${channels.size} channels in guild ${guild.name}.`, Constants.CONSOLE.FOUND);

    // console.dir(guild.members.cache)
    // const members = await guild.members.fetch();
    // console.log(`Fetched ${members.size} members in guild ${guild.name}.`);
}


module.exports = { fetch };