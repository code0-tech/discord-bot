const config = require('./../../config.json');

const language = async (commandName, interaction, guild, client) => {
    const languages = client.languages;

    const member = await guild.members.fetch(interaction.user.id);

    let baseLanguage = 'english';


    Object.keys(config.languageroles).forEach(languageRoleId => {
        if (member.roles.cache.has(languageRoleId)) {
            baseLanguage = config.languageroles[languageRoleId];
        }
    });


    if (!languages[baseLanguage] || !languages[baseLanguage][commandName]) {
        baseLanguage = 'english';
    }


    return {
        userlang: baseLanguage,
        text: languages[baseLanguage][commandName]
    }
}

module.exports = { language };