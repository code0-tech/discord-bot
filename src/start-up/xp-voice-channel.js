































const start = (client) => {


    client.on('voiceStateUpdate', info => {
        console.log(info)
    });
}

module.exports = { start };