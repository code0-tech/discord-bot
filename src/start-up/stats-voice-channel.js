const { MongoUser } = require('../mongo/MongoUser');
const { checkState } = require('../discord/voice');
const { Events } = require('discord.js');

global.voiceChatUser = {};

const updateDb = async (client, userid, packet) => {
    const user = await new MongoUser(userid).init();

    const timeInVoice = Date.now() - global.voiceChatUser[userid].since;

    if (timeInVoice < 1000) return;

    user.updateVoiceStats(Math.floor(timeInVoice / 1000), (packet.join == true ? 1 : 0), packet.switchs);

    return;
}

const updateAllUsers = async (client) => {
    const userids = Object.keys(global.voiceChatUser);
    for (const userid of userids) {
        await updateDb(client, userid, global.voiceChatUser[userid]);
        global.voiceChatUser[userid].since = Date.now();
    }
}

setInterval(() => updateAllUsers(), 5000);


const joinVoice = (client, userid) => {
    global.voiceChatUser[userid] = {
        since: Date.now(),
        switchs: 0
    }
}


const switchVoice = (client, userid) => {
    if (!global.voiceChatUser[userid]) {
        global.voiceChatUser[userid] = {
            since: client.startDate,
            switchs: 0
        }
    }

    global.voiceChatUser[userid].switchs++;
}


const leaveVoice = async (client, userid) => {
    if (!global.voiceChatUser[userid]) {
        global.voiceChatUser[userid] = {
            since: client.startDate,
            switchs: 0
        }
    }

    global.voiceChatUser[userid].join = true

    await updateDb(client, userid, global.voiceChatUser[userid]);

    delete global.voiceChatUser[userid];
}


const start = (client) => {
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
