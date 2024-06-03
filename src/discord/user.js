const config = require('./../../config.json');

const getUser = async (userid, guild) => {
    let member;

    try {
        // create an check if user is in cache

        member = await guild.members.fetch(userid);
    } catch (err) {
        member = null;
    }

    return member;
}

const isTeamMember = async (member) => {
    return await member.roles.cache.has(config.roles.team);
}


module.exports = { getUser, isTeamMember };