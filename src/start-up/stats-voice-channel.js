const { Events, ChannelType } = require('discord.js');
const { MongoUser } = require('../mongo/MongoUser');
const { checkState } = require('../discord/voice');
const { keyArray } = require('./../utils/helper');
const DC = require('./../singleton/DC');

let voiceChatUser = {};

const updateDb = async (client, userid, packet) => {
    const user = await new MongoUser(userid).init();

    const timeInVoice = Date.now() - voiceChatUser[userid].since;

    if (timeInVoice < 1000) return;

    user.updateVoiceStats(Math.floor(timeInVoice / 1000), (packet.join == true ? 1 : 0), packet.switchs);

    return;
}

const updateAllUsers = async (client) => {
    const userids = Object.keys(voiceChatUser);
    for (const userid of userids) {
        await updateDb(client, userid, voiceChatUser[userid]);
        voiceChatUser[userid].since = Date.now();
    }
}

setInterval(() => updateAllUsers(), 5000);


const joinVoice = (client, userid) => {
    voiceChatUser[userid] = {
        since: Date.now(),
        switchs: 0
    }
}


const switchVoice = (client, userid) => {
    if (!voiceChatUser[userid]) {
        voiceChatUser[userid] = {
            since: client.startDate,
            switchs: 0
        }
    }

    voiceChatUser[userid].switchs++;
}


const leaveVoice = async (client, userid) => {
    if (!voiceChatUser[userid]) {
        voiceChatUser[userid] = {
            since: client.startDate,
            switchs: 0
        }
    }

    voiceChatUser[userid].join = true

    await updateDb(client, userid, voiceChatUser[userid]);

    delete voiceChatUser[userid];
}


const start = async (client) => {
    const guild = await DC.guildById(process.env.GUILD_ID, client);
    const channels = await DC.channelsByGuild(guild);

    channels.forEach(channel => {
        if (channel.type == ChannelType.GuildVoice) {
            channel.members.forEach(member => {
                console.log(`[Voice Stats] found User ${member.user.username} in ${channel.name}`, '#6');
                joinVoice(client, member.user.id);
            });
        }
    });


    client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
        const { state, userid } = await checkState(oldState, newState);

        switch (state) {
            case 'JOIN':
                joinVoice(client, userid);
                break;
            case 'LEAVE':
                leaveVoice(client, userid);
                break;
            case 'SWITCH':
                switchVoice(client, userid);
                break;

            default:
                break;
        }
    });
}


module.exports = { start };