const { language } = require('./language-check');
const { Embed } = require('./../models/Embed');
const config = require('./../../config.json');

const extractIdData = (inputString) => {
    const parts = inputString.split('*');

    if (parts.length > 1) {
        const [frontPart, backPart] = parts;

        return {
            id: frontPart,
            data: backPart,
        };
    } else {
        return {
            id: inputString,
        };
    }
}

const executionError = (interaction, info) => {
    if (interaction.deferred || interaction.replied) {
        new Embed()
            .setTitle('Error at Command Execution')
            .setColor(config.embeds.colors.danger)
            .addCode0Footer()
            .setDescription(`An error occurred while\nprocessing your request\n\nMsg:\n\`${info}\``)
            .interactionResponse(interaction);
    }
}

const command = async (interaction, client) => {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        const guild = client.guilds.cache.get(process.env.GUILD_ID);

        const member = await guild.members.fetch(interaction.user.id);
        const lang = await language(interaction.commandName, interaction, guild, client)

        await command.execute(interaction, client, guild, member, lang);
    } catch (error) {
        console.log(error);
        executionError(interaction, `${interaction.commandName} failed`);
    }
}

const button = async (interaction, client) => {
    const buttonData = extractIdData(interaction.customId)
    const buttonCommand = client.components.get(buttonData.id);

    if (!buttonCommand) return;
    try {
        const guild = client.guilds.cache.get(process.env.GUILD_ID);

        console.log(buttonCommand)

        const commandName = interaction.message.interaction ? interaction.message.interaction.commandName : buttonCommand.data.name;

        const lang = await language(commandName, interaction, guild, client)

        const member = await guild.members.fetch(interaction.user.id);
        await buttonCommand.executeComponent(interaction, client, guild, buttonData, member, lang);
    } catch (error) {
        console.log(error);
        executionError(interaction, `Button Interaction failed, ${buttonData.id}`);
    }
}

const setup = async (client) => {
    client.on('interactionCreate', async (interaction) => {
        if (interaction.isChatInputCommand()) { // Slash-Command
            command(interaction, client);
        } else if (interaction.isButton()) { // Button
            button(interaction, client);
        } else if (interaction.isAutocomplete()) {
            // For the future
        }
    });
}

module.exports = { setup };

/* This is for isAutocomplete later
function levenshteinDistance(s1, s2) {
    if (s1 === s2) {
        return 0;
    }
    if (s1.length === 0) {
        return s2.length;
    }
    if (s2.length === 0) {
        return s1.length;
    }

    const m = s1.length;
    const n = s2.length;
    const cost = s1[m - 1] === s2[n - 1] ? 0 : 1;
    return Math.min(
        levenshteinDistance(s1.slice(0, -1), s2) + 1,
        levenshteinDistance(s1, s2.slice(0, -1)) + 1,
        levenshteinDistance(s1.slice(0, -1), s2.slice(0, -1)) + cost
    );
}
function selectSimilarFunction(inputString, functionNames) {
    let minDistance = Number.POSITIVE_INFINITY;
    let similarFunction = null;
    for (const func of functionNames) {
        const distance = levenshteinDistance(inputString, func);
        if (distance < minDistance) {
            minDistance = distance;
            similarFunction = func;
        }
    }

    return similarFunction;
}
const functionNames = ["help", "chat", "ban"];
const inputString = "chahelp";
const selectedFunction = selectSimilarFunction(inputString, functionNames); */