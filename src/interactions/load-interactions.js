const { Collection } = require('discord.js');
const path = require('path');
const fs = require('fs');

const load = (client) => {
    const commandPath = path.join(global.mainDir, 'src', 'commands');
    const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'));

    client.commands = new Collection();
    client.components = new Collection();

    for (const commandFile of commandFiles) {
        const command = require(path.join(commandPath, commandFile));
        const commandName = commandFile.split(".")[0];

        command.fileName = commandName;

        // Load Slash-Command
        if (command.data) {
            client.commands.set(command.data.name, command);
            console.log(`[Loader] Loaded command: ${command.data.name}`);
        } else {
            command.data = { name: commandName };
        }

        // Load Components
        if (command.executeComponent && command.componentIds) {
            for (const buttonId of command.componentIds) {
                client.components.set(buttonId, command);
            }
            console.log(`[Loader] Loaded component: ${command.componentIds.length ? command.componentIds : '[]'} for: ${command.data.name}`);
        }

        // Start autoRun functions
        if (command.autoRun) {
            command.autoRun(client);
            console.log(`[Loader] Run autoRun() function for ${commandFile}`);
        }
    }

    require('./emit-interactions').setup(client);
}

module.exports = { load };