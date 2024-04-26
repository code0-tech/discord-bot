const config = require('./../../config.json');

const language = (commandName, interaction, guild, client) => {
    return new Promise(async (resolve) => {
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

        
        const resolveInfo =
        {
            userlang: baseLanguage,
            text: languages[baseLanguage][commandName]
        }

        resolve(resolveInfo);
    })


}

module.exports = { language };