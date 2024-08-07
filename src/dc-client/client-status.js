const config = require('../../config.json');

const start = (client) => {
    const messages = config.status.messages;
    let index = 0;

    setInterval(() => {
        const { name, status = 'online' } = messages[index++ % messages.length];

        client.user.setPresence({ activities: [{ name }], status });
    }, config.status.interval);
}


module.exports = { start };