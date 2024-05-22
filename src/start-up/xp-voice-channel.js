































const start = (client) => {


    client.on('voiceStateUpdate', info => {
        delete info.guild;
        console.log(info)
    });
}

module.exports = { start };