const { language } = require('./language-check');
const { Embed } = require('./../models/Embed');
const config = require('./../../config.json');
const { Events } = require('discord.js');

const extractIdData = (inputString) => {
    const [id, data] = inputString.split('*');
    return { id, data };
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
        }
    });
};

module.exports = { setup };