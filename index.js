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
        GatewayIntentBits.GuildModeration
    ], partials: [
        Partials.Message,
        Partials.Channel,
        Partials.Reaction
    ]
});

client.isDevelopment = os.platform() === 'win32';
client.awaitaction = {};


require('./src/start-up/language-check');

require('./src/start-up/start-puppeteer');
require('./src/interactions/load-interactions').load(client);
require('./src/web-server/http-server').setup(client);
require('./src/start-up/load-languages').load(client);


client.once(Events.ClientReady, readyClient => {

    require('./src/start-up/audit-log').setup(client); // Audit to Chat

    console.log(`Code0 Discord Client ready => ${readyClient.user.tag}`);
    client.user.setPresence({ activities: [{ name: 'with Code0.js' }], status: 'online' });
});


client.login(process.env.TOKEN);

/* TODO

- Create Application thing in Channel 1192597105550835782

- Discord Audit log Embeds

- Go over Code and oursource / make more readable

-> Application message with buttons for gobo wheel to choose option from what you want

-> Something fancy like a quizz

*/


/*
console.dir(card.build(), { depth: null, breakLength: 0 });

NODE_OPTIONS=--no-warnings node your_script.js

When using /open-...
you can share the link with someone who has already made all 20 things and get the role for everyone who he wants to help

const keysIterator = fetchedLogs.entries.keys(); // Access the 'entries' property first

const keysArray = Array.from(keysIterator);

keysArray.forEach(entryKey => {
    console.log(entryKey);
    console.log(snowflakeToDate(entryKey));
});

*/