const config = require('../../config.json');

const start = (client) => {
    const messages = config.status.messages;
    const developmentMessages = config.status.indevelopment;
    let index = 0;

    setInterval(() => {
        const { name, status = 'online' } = global.isDevelopment ? developmentMessages[index++ % developmentMessages.length] : messages[index++ % messages.length];

        client.user.setPresence({ activities: [{ name }], status });
    }, config.status.interval);
}


module.exports = { start };