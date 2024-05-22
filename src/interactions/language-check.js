const config = require('./../../config.json');

const language = async (commandName, interaction, guild, client) => {
    const { languages } = client;

    const member = await guild.members.fetch(interaction.user.id);

    let baseLanguage = 'english';

    for (const languageRoleId of Object.keys(config.languageroles)) {
        if (member.roles.cache.has(languageRoleId)) {
            baseLanguage = config.languageroles[languageRoleId];
            break;
        }
    }

    if (!languages[baseLanguage]?.[commandName]) {
        baseLanguage = 'english';
    }

    return {
        userlang: baseLanguage,
        text: languages[baseLanguage][commandName]
    };
}

module.exports = { language };