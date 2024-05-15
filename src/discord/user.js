const getUser = async (userid, guild) => {
    let member;

    try {
        member = await guild.members.fetch(userid);
    } catch (err) {
        member = null;
    }

    return member;
}

module.exports = { getUser };