


class DC {
    static async defer(interaction, ephemeral = true) {
        await interaction.deferReply({ ephemeral });
    }
}


module.exports = DC; 