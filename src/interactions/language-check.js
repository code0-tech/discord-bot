const config = require('./../../config.json');

const language = async (commandNameLong, interaction, guild, client) => {
    const { languages } = client;
    const member = await guild.members.fetch(interaction.user.id);
    let baseLanguage = 'english';

    for (const languageRoleId of Object.keys(config.languageroles)) {
        if (member.roles.cache.has(languageRoleId)) {
            baseLanguage = config.languageroles[languageRoleId];
        }
    }

    const commandName = commandNameLong.split(" ")[0];

    let commandText = languages[baseLanguage]?.[commandName] || '';

    if (!commandText) {
        commandText = languages['english']?.[commandName] || '';
    }

    return {
        userlang: baseLanguage,
        text: commandText
    };
}


module.exports = { language };