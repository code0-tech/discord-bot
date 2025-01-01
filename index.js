const start = async (args) => {

    require('./src/start-up/update-console-log');
    require('./src/start-up/process-exit');

    const Constants = require('./data/constants');

    const { Client, Events, GatewayIntentBits, Partials } = require('discord.js');
    const dotenv = require('dotenv');
    const os = require('os');

    global.isDevelopment = os.platform() === 'win32';

    dotenv.config({ path: global.isDevelopment ? '.env' : 'server.env' });

    // global.isDevelopment = false;

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
            GatewayIntentBits.GuildMessageTyping
        ], partials: [
            Partials.Message,
            Partials.Channel,
            Partials.Reaction
        ]
    });

    client.awaitaction = {};
    client.startDate = Date.now();

    require('./src/dc-client/load-languages').load(client);
    require('./src/dc-client/language-file-check');
    await require('./src/start-up/mongo-setup').connect();

    require('./src/start-up/start-puppeteer');
    require('./src/web-server/http-server').setup(client);

    client.once(Events.ClientReady, readyClient => {

        require('./src/dc-guild/discord-fetch').fetch(client);

        require('./src/interactions/load-interactions').load(client);

        require('./src/start-up/mongodb-check');

        require('./src/dc-guild/audit-log').setup(client);
        require('./src/dc-client/client-status').start(client);

        console.log(`\nCode0 Discord Client ready => ${readyClient.user.tag}`, Constants.CONSOLE.GOOD);

        require('./src/dc-guild/stats-message').start(client);
        require('./src/dc-guild/stats-voice-channel').start(client);

        require('./src/dc-guild/webhook-commit-filter').start(client);

        require('./src/dc-guild/user-stats').start(client);

        require('./src/dc-guild/git-rank').setup(client);

    });

    require('./src/dc-client/debug-log').setup(client);

    client.login(process.env.TOKEN);
}


start();

/* TODO

-> Discord Audit log Embeds [Todo since: 28.04.2024]

-> command to display overall commits, with carry over for all days

-> pie chart for repos (WIP) [since 11.08.2024]

-> update modules like DiscordSimpleTable, etc [11.08.2024]

-> debug remove double users [15.08.2024]

*/