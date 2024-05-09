const config = require('./../../config.json');

/* const setNextStatus = (name, status = 'online') => {
    client.user.setPresence({ activities: [{ name }], status: status });
}


const start = () => {
    const messages = config.status.messages;

    const length = messages.length;
    let index = 0;

    setInterval(() => {
        const message = messages[index];

        setNextStatus(message.name, message.status);

        if (index > length - 1) {
            index = 0;
        } else {
            index = 0;
        }
    }, config.status.interval);

} */


const start = (client) => {
    const messages = config.status.messages;
    let index = 0;

    setInterval(() => {
        const { name, status = 'online' } = messages[index++ % messages.length];

        client.user.setPresence({ activities: [{ name }], status });
    }, config.status.interval);
}

module.exports = { start };