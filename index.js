const { Client, Events, GatewayIntentBits, Partials } = require('discord.js');
const dotenv = require('dotenv');
const os = require('os');

require('./src/start-up/update-console-log');
require('./src/start-up/process-exit');

dotenv.config({ path: os.platform() === 'win32' ? '.env' : 'server.env' });

global.mainDir = __dirname;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildMessages
    ], partials: [
        Partials.Message,
        Partials.Channel,
        Partials.Reaction
    ]
});

client.isDevelopment = os.platform() === 'win32';
client.awaitaction = {};


require('./src/start-up/language-check');
require('./src/start-up/mongo-setup');

require('./src/start-up/start-puppeteer');
require('./src/interactions/load-interactions').load(client);
require('./src/web-server/http-server').setup(client);
require('./src/start-up/load-languages').load(client);


client.once(Events.ClientReady, readyClient => {

    require('./src/start-up/audit-log').setup(client);
    require('./src/start-up/client-status').start(client);

    console.log(`Code0 Discord Client ready => ${readyClient.user.tag}`);
    client.user.setPresence({ activities: [{ name: 'with Code0.js' }], status: 'online' });

    require('./src/start-up/xp-update-listener').start(client);
    
});


client.login(process.env.TOKEN);

/* TODO

- Create Application thing in Channel 1192597105550835782

- Discord Audit log Embeds

-> Application message with buttons for gobo wheel to choose option from what you want

-> Something fancy like a quizz

*/

/* 
const { MongoUser } = require('./src/mongo/MongoUser');

const user = new MongoUser('380808844093292555')
// user._updateXp(19549)
user.updateXpBy(20)
// user._updateXp(2913)
// user._updateXp(1003)
// user._updateXp(503)
// user._updateXp(0) */