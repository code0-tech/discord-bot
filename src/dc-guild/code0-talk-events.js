const Constants = require("../../data/constants");
const { guildById } = require("../singleton/DC");
const config = require('./../../config.json');
const { Embed } = require("../models/Embed");

const fetchUpcomingEvents = async (guild) => {
    return await guild.scheduledEvents.fetch();
}

const setupTimer = (channelId, title, time, client) => {
    Constants.DISCORD.EVENT_PRE_REMINDER.MINUTES_BEFORE_EVENT_REMINDER_ARRAY.forEach(timeInMinutes => {
        const timeNew = time - (timeInMinutes * 1000 * 60);

        if (timeNew > 0) {
            setTimeout(() => {
                console.log(`[PREREMINDER-EVENTS] time remaining ${timeInMinutes} min, for "${title}"`, Constants.CONSOLE.INFO);
                new Embed()
                    .setTitle(title + " noch " + timeInMinutes + " min bis es beginnt.")
                    .setContent(`<@&${config.roles.team}>`)
                    .setColor(config.embeds.colors.info)
                    .responseToChannel(channelId, client);
            }, timeNew);
        } else {
            console.log(`[PREREMINDER-EVENTS] "${title}" invalid timeout: ${timeNew}, on call ${timeInMinutes} min before event`, Constants.CONSOLE.ERROR);
        }
    });
}

const setupEventMessages = async (client) => {
    const guild = await guildById(config.serverid, client);
    const events = await fetchUpcomingEvents(guild);

    events.forEach(async (event) => {
        const nextDateUnix = event.scheduledStartTimestamp;
        const readableDate = new Date(nextDateUnix).toLocaleString();

        console.log(`[PREREMINDER-EVENTS] "${event.name}" next occurrence (Readable): ${readableDate}`, Constants.CONSOLE.INFO);

        const timeRemaining = nextDateUnix - Date.now();

        const channelId = config.channels.internalcommunicationchat;

        setupTimer(channelId, event.name, timeRemaining, client);
    });
}

// push this later into config like this
const configForPreEvent = [{
    title: "title",
    mention: "user or role", // maybe do something to prevent double ids in config
    embed: {
        title: "Its time for {title} in {minutesRemaining}",
        description: "Guys lets go this time"
    }
}]


module.exports = { setupEventMessages };