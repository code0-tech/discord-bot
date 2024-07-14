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
        text: commandText,
        _replacePlaceholders(template, data) {
            return template.replace(/{([^{}]*)}/g, (match, key) => {
                if (data[key.trim()] == undefined) {
                    console.log(`[Lang Error] a Placeholder "${key}" was not found as an input.`, Constants.CONSOLE.ERROR)
                    return '';
                }
                return data[key.trim()];
            });
        },
        getText(key, replaceOptions) {
            const text = commandText;
            const finalText = this._replacePlaceholders(text[key], replaceOptions);
            return finalText;
        }
    };
}


module.exports = { language };