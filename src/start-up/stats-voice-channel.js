const { Events, ChannelType } = require('discord.js');
const Constants = require('./../../data/constants');
const { MongoUser } = require('../mongo/MongoUser');
const { checkState } = require('../discord/voice');
const { keyArray } = require('./../utils/helper');
const DC = require('./../singleton/DC');

let voiceChatUser = {};

const updateDb = async (client, userId, packet) => {
    const user = await new MongoUser(userId).init();

    const timeInVoice = Date.now() - voiceChatUser[userId].since;

    if (timeInVoice < 1000) return;

    user.updateVoiceStats(Math.floor(timeInVoice / 1000), (packet.join == true ? 1 : 0), packet.switchs);

    return;
}

const updateAllUsers = async (client) => {
    const userIds = Object.keys(voiceChatUser);
    for (const userId of userIds) {
        await updateDb(client, userId, voiceChatUser[userId]);
        voiceChatUser[userId].since = Date.now();
        voiceChatUser[userId].switchs = 0;
    }
}

setInterval(() => updateAllUsers(), 5000);

const joinVoice = (client, userId) => {
    voiceChatUser[userId] = {
        since: Date.now(),
        switchs: 0
    }
}

const switchVoice = (client, userId) => {
    if (!voiceChatUser[userId]) {
        voiceChatUser[userId] = {
            since: client.startDate,
            switchs: 0
        }
    }

    voiceChatUser[userId].switchs++;
}

const leaveVoice = async (client, userId) => {
    if (!voiceChatUser[userId]) {
        voiceChatUser[userId] = {
            since: client.startDate,
            switchs: 0
        }
    }

    voiceChatUser[userId].join = true

    await updateDb(client, userId, voiceChatUser[userId]);

    delete voiceChatUser[userId];
}

const start = async (client) => {
    const guild = await DC.guildById(process.env.GUILD_ID, client);
    const channels = await DC.channelsByGuild(guild);

    channels.forEach(channel => {
        if (channel.type == ChannelType.GuildVoice) {
            channel.members.forEach(member => {
                console.log(`[Voice Stats] found User ${member.user.username} in ${channel.name}`, Constants.CONSOLE.FOUND);
                joinVoice(client, member.user.id);
            });
        }
    });

    client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
        const { state, userId } = await checkState(oldState, newState);

        switch (state) {
            case 'JOIN':
                joinVoice(client, userId);
                break;
            case 'LEAVE':
                leaveVoice(client, userId);
                break;
            case 'SWITCH':
                switchVoice(client, userId);
                break;

            default:
                break;
        }
    });
}


module.exports = { start };