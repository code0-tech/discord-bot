const start = async (args) => {

    // debug
    // require('./src/debug/heapdump');
    // end

    require('./src/start-up/update-console-log');
    require('./src/start-up/process-exit');

    const Constants = require('./data/constants');

    const { Client, Events, GatewayIntentBits, Partials } = require('discord.js');
    const dotenv = require('dotenv');
    const os = require('os');

    const isServer = os.platform() !== 'win32';
    global.isDevelopment = !isServer;

    dotenv.config({ path: global.isDevelopment ? '.env' : 'server.env' });

    global.mainDir = __dirname;
    global.mongoClient = null;

    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildVoiceStates,
            GatewayIntentBits.GuildMessageReactions,
            GatewayIntentBits.GuildInvites,
            GatewayIntentBits.GuildModeration,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildMessageTyping,
            GatewayIntentBits.GuildScheduledEvents
        ], partials: [
            Partials.Message,
            Partials.Channel,
            Partials.Reaction
        ]
    });

    client.startDate = Date.now();

    require('./src/dc-client/load-languages').load(client);
    require('./src/dc-client/language-file-check');
    await require('./src/start-up/mongo-setup').connect();

    // require('./src/start-up/start-puppeteer');
    require('./src/web-server/http-server').setup(client);

    client.once(Events.ClientReady, readyClient => {

        require('./src/dc-guild/discord-fetch').fetch(client);

        require('./src/interactions/load-interactions').load(client);

        require('./src/start-up/mongodb-check');

        require('./src/dc-client/client-status').start(client);

        console.log(`\nCode0 Discord Client ready => ${readyClient.user.tag}`, Constants.CONSOLE.GOOD);

        require('./src/dc-guild/stats-message').start(client);
        require('./src/dc-guild/stats-voice-channel').start(client);

        require('./src/dc-guild/webhook-commit-filter').start(client);

        require('./src/dc-guild/user-stats').start(client);

        require('./src/dc-guild/git-rank').setup(client);

        // require('./src/dc-guild/event-prereminder').setupEventMessages(client);
        // Trying to run the bot without the event-prereminder that could be the cause of "JavaScript heap out of memory"

    });

    require('./src/dc-client/debug-log').setup(client);

    client.login(process.env.TOKEN);
}


start();

/* TODO

-> command to display overall commits, with carry over for all days

-> pie chart for repos (WIP) [since 11.08.2024]

-> event-prereminder refresh event timer after event fired, cause currently after the event fired there wont be any new timers setup for next time [08.02.2025]

Fix that needs to be done asap:

<--- Last few GCs --->

[2129182:0x6117fc0] 69385655 ms: Mark-sweep (reduce) 2047.1 (2079.8) -> 2046.1 (2080.0) MB, 2319.8 / 0.0 ms  (average mu = 0.074, current mu = 0.004) allocation failure; scavenge might not succeed

<--- JS stacktrace --->

FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory

Current cause is unkown.
*/