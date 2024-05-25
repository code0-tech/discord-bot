const setup = async () => {

    const { Client, Events, GatewayIntentBits, Partials } = require('discord.js');
    const dotenv = require('dotenv');
    const os = require('os');

    require('./src/start-up/update-console-log');
    require('./src/start-up/process-exit');

    dotenv.config({ path: os.platform() === 'win32' ? '.env' : 'server.env' });

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

    global.isDevelopment = os.platform() === 'win32';
    client.awaitaction = {};
    client.startDate = Date.now();

    require('./src/start-up/language-file-check');
    await require('./src/start-up/mongo-setup').connect();

    require('./src/start-up/start-puppeteer');
    require('./src/web-server/http-server').setup(client);


    client.once(Events.ClientReady, readyClient => {

        require('./src/interactions/load-interactions').load(client);
        require('./src/start-up/load-languages').load(client);

        require('./src/start-up/audit-log').setup(client);
        require('./src/start-up/client-status').start(client);

        console.log(`\nCode0 Discord Client ready => ${readyClient.user.tag}`);

        require('./src/start-up/stats-message').start(client);
        require('./src/start-up/stats-voice-channel').start(client);

        require('./src/start-up/user-stats').start(client);

    });

    client.login(process.env.TOKEN);
}

setup();


/* TODO

- Discord Audit log Embeds

-> MongoDb when user interaction check if his entries are up to date

-> Fix .addInputs giving error when lang pack does not conatin and placholder and vice versa

-> Fix bot beeing added to the DB, reason unknown, maybe some command or xp stuff that adds him

-> Double id's are saved sometimes in MongoDb user

-> Application channel two buttons => apply now, apply as open-contributor

apply as an close team ping role
apply as an open contributor

-> make the application commad / interaction to work as nico intended

-> Change the search function to also only need to write some letter to get entire things suggested
maybe us lvh distance to fill them out based on the searchData and feed this into the flow
*/