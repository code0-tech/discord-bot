const { Collection } = require('discord.js');
const path = require('path');
const fs = require('fs');

const load = (client) => {
    const commandFiles = fs.readdirSync(path.join(global.mainDir, 'src', 'commands')).filter(file => file.endsWith('.js'));

    client.commands = new Collection();
    client.components = new Collection();

    commandFiles.forEach(commandFile => {
        const command = require(path.join(global.mainDir, 'src', 'commands', commandFile));

        command.fileName = commandFile.split(".")[0];

        // Load Slash-Command
        if (command.data !== null) {
            client.commands.set(command.data.name, command);
            console.log(`Loaded command: ${command.data.name}`);

        } else {
            command.data = {
                name: command.fileName
            };
        }

        // Load Components
        if (command.executeComponent && command.componentIds) {
            command.componentIds.forEach(buttonId => {
                client.components.set(buttonId, command);
            });
            console.log(`Loaded component: ${command.componentIds.length ? command.componentIds : '[]'} for: ${(command.data == null ? commandFile : command.data.name)}`);
        }

        // Start autoRun functions
        if (command.autoRun) {
            command.autoRun(client)
            console.log(`Run autoRun function for ${commandFile}`);
        }

    });

    require('./emit-interactions').setup(client);
}

module.exports = { load };