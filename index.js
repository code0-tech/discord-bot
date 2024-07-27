const startCode0 = async () => {

    require('./src/start-up/update-console-log');
    require('./src/start-up/process-exit');

    const Constants = require('./data/constants');

    const { Client, Events, GatewayIntentBits, Partials } = require('discord.js');
    const dotenv = require('dotenv');
    const os = require('os');

    global.isDevelopment = os.platform() === 'win32';

    dotenv.config({ path: global.isDevelopment ? '.env' : 'server.env' });

    // global.isDevelopment = false; // Manuel override

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


startCode0();

/* TODO

-> Discord Audit log Embeds [Todo since: 28.04.2024]

-> maybe add same end message from ticket to _application [20.07.2024]

-> Remove ticket when user left the server

-> overall activit of a project

-> update from simpeltable to discord-simpletable npm

-> Emojis can now be added at the bot developer state, implement this usecase

*/