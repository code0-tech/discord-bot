const config = require('./../../config.json');

const language = async (commandName, interaction, guild, client) => {
    const { languages } = client;
    const member = await guild.members.fetch(interaction.user.id);
    let baseLanguage = 'english';

    // Determine the base language based on the user's roles
    for (const languageRoleId of Object.keys(config.languageroles)) {
        if (member.roles.cache.has(languageRoleId)) {
            baseLanguage = config.languageroles[languageRoleId];
        }
    }

    // Attempt to fetch the command text in the base language
    let commandText = languages[baseLanguage]?.[commandName] || '';

    // Fallback to English if the command is not found in the base language
    if (!commandText) {
        commandText = languages['english']?.[commandName] || '';
    }

    return {
        userlang: baseLanguage,
        text: commandText
    };
}

module.exports = { language };