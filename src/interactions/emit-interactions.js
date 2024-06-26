const { language } = require('./language-check');
const { Embed } = require('./../models/Embed');
const config = require('./../../config.json');
const { Events } = require('discord.js');

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
            .setDescription(`An error occurred while\nprocessing your request\n\nMsg:\n\`${info}\``)
            .interactionResponse(interaction);
    }
};

const getGuildAndMember = async (client, userId) => {
    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    const member = await guild.members.fetch(userId);
    return { guild, member };
};

const command = async (interaction, client) => {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        const { guild, member } = await getGuildAndMember(client, interaction.user.id);
        const lang = await language(interaction.commandName, interaction, guild, client);
        await command.execute(interaction, client, guild, member, lang);
    } catch (error) {
        console.log(error);
        executionError(interaction, `${interaction.commandName} failed`);
    }
};

const button = async (interaction, client) => {
    const buttonData = extractIdData(interaction.customId);
    const buttonCommand = client.components.get(buttonData.id);
    if (!buttonCommand) return;

    try {
        const { guild, member } = await getGuildAndMember(client, interaction.user.id);
        const commandName = interaction.message.interaction
            ? interaction.message.interaction.commandName
            : buttonCommand.data.name;
        const lang = await language(commandName, interaction, guild, client);
        await buttonCommand.executeComponent(interaction, client, guild, member, lang, buttonData);
    } catch (error) {
        console.log(error);
        executionError(interaction, `Button Interaction failed, ${buttonData.id}`);
    }
};

const selectMenu = async (interaction, client) => {
    const selectMenuData = extractIdData(interaction.customId);
    selectMenuData.selected = interaction.values[0];
    const selectMenuCommand = client.components.get(selectMenuData.id);

    if (!selectMenuCommand) return;

    try {
        const { guild, member } = await getGuildAndMember(client, interaction.user.id);
        const commandName = interaction.message.interaction
            ? interaction.message.interaction.commandName
            : selectMenuCommand.data.name;
        const lang = await language(commandName, interaction, guild, client);
        await selectMenuCommand.executeComponent(interaction, client, guild, member, lang, selectMenuData);
    } catch (error) {
        console.log(error);
        executionError(interaction, `Select Menu Interaction failed, ${selectMenuData.id}`);
    }
};

const autoComplete = async (interaction, client) => {
    const command = interaction.client.commands.get(interaction.commandName);
    if (!command || !command.autoComplete) return;

    try {
        const { guild, member } = await getGuildAndMember(client, interaction.user.id);
        const lang = await language(interaction.commandName, interaction, guild, client);
        await command.autoComplete(interaction, client, guild, member, lang);
    } catch (error) {
        console.log(error);
    }
};

const setup = (client) => {
    client.on(Events.InteractionCreate, async (interaction) => {
        if (interaction.isChatInputCommand()) {
            await command(interaction, client);
        } else if (interaction.isButton()) {
            await button(interaction, client);
        } else if (interaction.isAutocomplete()) {
            await autoComplete(interaction, client);
        } else if (interaction.isStringSelectMenu()) {
            await selectMenu(interaction, client);
        }
    });
};


module.exports = { setup };