const config = require('./../../config.json');
const { Embed } = require('./../models/Embed');
const { language } = require('./language-check');

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
        new Embed() // Send user a Quick Error Note on their query
            .setTitle('Error at Command Execution')
            .setColor(config.embeds.colors.danger)
            .addCode0Footer()
            .setDescription(`An error occurred while\nprocessing your request\n\nMsg:\n\`${info}\`\n\n[EACE]`)
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

        const commandName = interaction.message.interaction ? interaction.message.interaction.commandName : buttonCommand.data.name;

        const lang = await language(commandName, interaction, guild, client)

        const member = await guild.members.fetch(interaction.user.id);
        await buttonCommand.executeComponent(interaction, client, guild, buttonData, member, lang);
    } catch (error) {
        console.log(error);
        executionError(interaction, `Button Interaction failed, ${buttonData.id}`);
    }
}

const setup = (client) => {
    client.on('interactionCreate', async (interaction) => {
        if (interaction.isChatInputCommand()) { // Slash-Command Support
            command(interaction, client);
        } else if (interaction.isButton()) { // Button Support
            button(interaction, client);
        }
    });
}

module.exports = { setup };