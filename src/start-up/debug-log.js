

const setup = (client) => {
    client.on('debug', (message) => {
        // console.log(message)

        if (message.includes('Remaining')) {
            const regex = /^\[WS => Manager\] Session Limit Information\s+Total: (\d+)\s+Remaining: (\d+)$/;

            const match = message.match(regex);

            if (match) {
                const total = match[1];
                const remaining = match[2];

                console.log(`[Connection Limit] ${remaining}/${total}`);
            }
        }

        if (message.includes('Heartbeat acknowledged')) {
            const regex = /latency of (\d+)ms/;

            if (match) {
                const latency = match[1];
                console.log("[API] Latency:", latency);
            }
        }
    });
}


module.exports = { setup };