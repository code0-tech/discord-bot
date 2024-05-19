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

module.exports = { getUser };