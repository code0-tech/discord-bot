const startCode0 = async () => {

    require('./src/start-up/update-console-log');
    require('./src/start-up/process-exit');

    const { Client, Events, GatewayIntentBits, Partials } = require('discord.js');
    const dotenv = require('dotenv');
    const os = require('os');

    global.isDevelopment = os.platform() === 'win32';

    dotenv.config({ path: global.isDevelopment ? '.env' : 'server.env' });

    global.isDevelopment = false; // Manuel override

    global.mainDir = __dirname;
    global.mongoClient = null;
    global.musicPlayer = {
        inuse: false
    };

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

    require('./src/start-up/load-languages').load(client);
    require('./src/start-up/language-file-check');
    await require('./src/start-up/mongo-setup').connect();

    require('./src/start-up/start-puppeteer');
    require('./src/web-server/http-server').setup(client);


    client.once(Events.ClientReady, readyClient => {

        require('./src/interactions/load-interactions').load(client);

        require('./src/start-up/audit-log').setup(client);
        require('./src/start-up/client-status').start(client);

        console.log(`\nCode0 Discord Client ready => ${readyClient.user.tag}`);

        require('./src/start-up/stats-message').start(client);
        require('./src/start-up/stats-voice-channel').start(client);

        require('./src/start-up/user-stats').start(client);

    });

    client.login(process.env.TOKEN);
}

startCode0();

/* TODO

- Discord Audit log Embeds

-> MongoDb when user interaction check if his entries are up to date

-> Double id's are saved sometimes in MongoDb user

-> add language for /search

-> add /logs command

- features
Create a channel with a message to close it later
Create a method of click a button to insert new messages
Create a method to import the last messages (count 1-100) pre save the next ones before putting them in

Create a sub command for this

/logs channel
/logs

*/