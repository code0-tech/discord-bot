const { Collection } = require('discord.js');
const path = require('path');
const fs = require('fs');

const load = (client) => {
    const commandFiles = fs.readdirSync(path.join(global.mainDir, 'src', 'commands')).filter(file => file.endsWith('.js'));

    client.commands = new Collection();
    client.components = new Collection();

    commandFiles.forEach(commandFile => {
        const command = require(path.join(global.mainDir, 'src', 'commands', commandFile));
        client.commands.set(command.data.name, command);

        console.log(`Loaded command: ${command.data.name}`);

        if (command.executeComponent && command.componentIds) {
            command.componentIds.forEach(buttonId => {
                client.components.set(buttonId, command);
            });

            console.log(`Loaded component: ${command.componentIds.length ? command.componentIds : '[]'} for: ${command.data.name}`);
        }
    });

    require('./emit-interactions').setup(client);
}

module.exports = { load };