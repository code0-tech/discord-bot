const Constants = require('./../../data/constants');
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
            console.log(template)
            return template.replace(/{([^{}]*)}/g, (match, key) => {

                if (data == null) {
                    console.log(`[Lang Error] no inputs where given at all. Missing Placeholder replace for "${key}".`, Constants.CONSOLE.ERROR);
                    return '';
                }

                if (data[key.trim()] == undefined) {
                    console.log(`[Lang Error] a Placeholder "${key}" was not found as an input.`, Constants.CONSOLE.ERROR);
                    return '';
                }
                return data[key.trim()];
            });
        },
        getText(key, replaceOptions = null) {
            const text = commandText;

            if (text[key] == undefined) {
                console.log(`[Lang Error] language key "${key}" for the "${commandName}" command was not found in the user language.`, Constants.CONSOLE.ERROR);
                return '';
            }

            const finalText = this._replacePlaceholders(text[key], replaceOptions);
            return finalText;
        }
    };
}

/* 
Language Pack

"_" means that its not a command but maybe an button interaction.
"#"" means that its only for one language as its used global for everyone on the server and not for normal commands.
*/

module.exports = { language };