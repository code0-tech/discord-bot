const { Events } = require('discord.js');
































const start = (client) => {


    client.on(Events.VoiceServerUpdate, info => {
        // delete info.guild;
        console.log(info)
    });

    client.on(Events.VoiceStateUpdate, info => {
        // delete info.guild;
        console.log(info)
    });
}

module.exports = { start };