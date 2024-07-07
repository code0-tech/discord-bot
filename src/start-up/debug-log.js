const Constants = require('./../../data/constants');

const setup = (client) => {

    if (!global.isDevelopment) return;

    client.on('debug', (message) => {
        if (message.includes('Remaining')) {
            const regex = /^\[WS => Manager\] Session Limit Information\s+Total: (\d+)\s+Remaining: (\d+)$/;

            const match = message.match(regex);

            if (match) {
                const total = match[1];
                const remaining = match[2];

                console.log(`[Connection Limit] ${remaining}/${total}`, Constants.CONSOLE.INFO);
            }
        }

        if (message.includes('Heartbeat acknowledged')) {
            const regex = /latency of (\d+)ms/;

            const match = message.match(regex);

            if (match) {
                const latency = match[1];
                console.log(`[API] Latency: ${latency}ms`, Constants.CONSOLE.INFO);
            }
        }
    });
}


module.exports = { setup };