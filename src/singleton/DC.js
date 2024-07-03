

class DC {
    static async defer(interaction, ephemeral = true) {
        await interaction.deferReply({ ephemeral });
    }

    static async memberById(userId, guild) {
        await guild.members.fetch(userId);
    }
}


module.exports = DC; 