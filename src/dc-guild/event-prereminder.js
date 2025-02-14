const { Embed, COLOR, replacePlaceHolders } = require("../models/Embed");
const Constants = require("../../data/constants");
const { guildById } = require("../singleton/DC");
const config = require('../../config.json');
const { Events } = require('discord.js');

const fetchUpcomingEvents = async (guild) => {
    return await guild.scheduledEvents.fetch();
}

let eventTimers = [];

const setupTimer = (channelId, title, time, client, eventConfig) => {
    eventConfig.reminderbeforeinminutes.forEach(timeInMinutes => {
        const timeNew = time - (timeInMinutes * 1000 * 60);

        if (timeNew > 0) {
            const timer = setTimeout(() => {
                console.log(`[PREREMINDER-EVENTS] Time remaining ${timeInMinutes} min for "${title}"`, Constants.CONSOLE.INFO);

                const placeholders = { title, minutesRemaining: timeInMinutes };

                const embedMessage = new Embed()
                    .setTitle(replacePlaceHolders(eventConfig.embed.title, placeholders))
                    .setContent(`<@&${config.roles[eventConfig.embed.mention]}>`)
                    .setDescription(replacePlaceHolders(eventConfig.embed.description, placeholders))
                    .setColor(COLOR.INFO);

                embedMessage.responseToChannel(channelId, client);
            }, timeNew);

            eventTimers.push({ timer: timer, title });

        } else {
            console.log(`[PREREMINDER-EVENTS] "${title}" invalid timeout: ${timeNew}, on call ${timeInMinutes} min before event`, Constants.CONSOLE.ERROR);
        }
    })
}

const deleteAllRunningTimers = () => {
    for (const { timer } of eventTimers) {
        clearTimeout(timer);
    }

    eventTimers = [];
}

const buildTimer = async (client, guild) => {
    deleteAllRunningTimers();

    const events = await fetchUpcomingEvents(guild);

    events.forEach(async (event) => {
        const nextDateUnix = event.scheduledStartTimestamp;
        const readableDate = new Date(nextDateUnix).toLocaleString();

        console.log(`[PREREMINDER-EVENTS] "${event.name}" next occurrence (Readable): ${readableDate}`, Constants.CONSOLE.INFO);

        const timeRemaining = nextDateUnix - Date.now();
        const channelId = config.channels.internalcommunicationchat;

        const eventConfig = config.commands.eventprereminder.find(cfg => cfg.title == event.name);

        if (eventConfig) {
            console.log(`[PREREMINDER-EVENTS] config found for "${event.name}"`, Constants.CONSOLE.GOOD);

            setupTimer(channelId, event.name, timeRemaining, client, eventConfig);
        } else {
            console.log(`[PREREMINDER-EVENTS] No config found for "${event.name}", skipping...`, Constants.CONSOLE.INFO);
        }
    })
}

const timerUpdate = (client, guild) => {
    console.log(`[PREREMINDER-EVENTS] timer update, rebuilding all timers...`, Constants.CONSOLE.INFO);
    buildTimer(client, guild)
}

const setupChangeEventListener = (client, guild) => {
    client.on(Events.GuildScheduledEventUpdate, async () => {
        timerUpdate(client, guild);
    })
    client.on(Events.GuildScheduledEventDelete, async () => {
        timerUpdate(client, guild);

    })
    client.on(Events.GuildScheduledEventCreate, async () => {
        timerUpdate(client), guild;
    })
}

const setupEventMessages = async (client) => {
    const guild = await guildById(config.serverid, client);

    buildTimer(client, guild);
    setupChangeEventListener(client, guild);
}


module.exports = { setupEventMessages };