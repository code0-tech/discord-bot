const config = require('./../../config.json');

class DC {
    static async defer(interaction, ephemeral = true) {
        await interaction.deferReply({ ephemeral });
    }

    static async memberById(userId, guild) {
        await guild.members.fetch(userId);
    }

    static async isTeamMember(member) {
        return await member.roles.cache.has(config.roles.team);
    }
}


module.exports = DC; 