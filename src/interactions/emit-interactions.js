const Constants = require('./../../data/constants');
const { language } = require('./language-check');
const { Embed } = require('./../models/Embed');
const config = require('./../../config.json');
const { Events } = require('discord.js');
const DC = require('./../singleton/DC');


const extractIdData = (inputString) => {
    const parts = inputString.split('*');
    const id = parts[0];
    const result = { id };

    for (let i = 1; i < parts.length; i++) {
        const [key, value] = parts[i].split('=');
        result[key] = isNaN(value) ? value : Number(value);
    }

    return result;
};

const executionError = (interaction, info) => {
    if (interaction.deferred || interaction.replied) {
        new Embed()
            .setTitle('Error at Command Execution')
            .setColor(config.embeds.colors.danger)
            .setDescription(`An error occurred while processing your request\n\nMsg:\n\`${info}\``)
            .interactionResponse(interaction);
    }
};

const getGuildAndMember = async (client, userId) => {
    const guild = await DC.guildById(process.env.GUILD_ID, client);
    const member = await DC.memberById(userId, guild);
    return { guild, member };
};

const handleInteraction = async (interaction, client, handler) => {
    try {
        const { guild, member } = await getGuildAndMember(client, interaction.user.id);

        let commandName;
        if (interaction.isCommand() || interaction.isAutocomplete()) {
            commandName = interaction.commandName;
        } else if (interaction.isMessageComponent()) {
            commandName = interaction.message.interaction
                ? interaction.message.interaction.commandName
                : client.components.get(interaction.customId.split('*')[0]).data.name;
        }

        if (!commandName) {
            console.log(`[Emit] Command name is undefined`, Constants.CONSOLE.ERROR);
            return;
        }

        console.log(`[Emit] Handling interaction for command: ${commandName}`, Constants.CONSOLE.WORKING);

        const lang = await language(commandName, interaction, guild, client);

        if (!lang) {
            console.log(`[Emit] Specified language context was not given`, Constants.CONSOLE.ERROR);
            return;
        }

        await handler(interaction, client, guild, member, lang);
    } catch (error) {
        console.error('Error in handleInteraction:', error);
        const id = interaction.commandName || interaction.customId.split('*')[0];
        executionError(interaction, `${id} failed`);
    }
};

const commandHandler = async (interaction, client, guild, member, lang) => {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    await command.execute(interaction, client, guild, member, lang);
};

const buttonHandler = async (interaction, client, guild, member, lang) => {
    const buttonData = extractIdData(interaction.customId);
    const buttonCommand = client.components.get(buttonData.id);
    if (!buttonCommand) return;

    await buttonCommand.executeComponent(interaction, client, guild, member, lang, buttonData);
};

const selectMenuHandler = async (interaction, client, guild, member, lang) => {
    const selectMenuData = extractIdData(interaction.customId);
    selectMenuData.selected = interaction.values[0];
    const selectMenuCommand = client.components.get(selectMenuData.id);
    if (!selectMenuCommand) return;
    await selectMenuCommand.executeComponent(interaction, client, guild, member, lang, selectMenuData);
};

const autoCompleteHandler = async (interaction, client, guild, member, lang) => {
    const command = interaction.client.commands.get(interaction.commandName);
    if (!command || !command.autoComplete) return;
    await command.autoComplete(interaction, client, guild, member, lang);
};

const setup = (client) => {
    client.on(Events.InteractionCreate, async (interaction) => {
        if (interaction.isChatInputCommand()) {
            await handleInteraction(interaction, client, commandHandler);
        } else if (interaction.isButton()) {
            await handleInteraction(interaction, client, buttonHandler);
        } else if (interaction.isAutocomplete()) {
            await handleInteraction(interaction, client, autoCompleteHandler);
        } else if (interaction.isStringSelectMenu()) {
            await handleInteraction(interaction, client, selectMenuHandler);
        }
    });
};


module.exports = { setup };