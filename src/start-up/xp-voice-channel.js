const { checkState } = require('./../discord/voice');
const { Events } = require('discord.js');
const { msToHumanReadableTime } = require('./../utils/time');

let voiceChatUser = {};


const joinVoice = (client, userid) => {
    voiceChatUser[userid] = {
        since: Date.now()
    }
}

const switchVoice = (client, userid) => {
    if (!voiceChatUser[userid]) {
        voiceChatUser[userid] = {
            since: client.startDate
        }
    }


}


const leaveVoice = (client, userid) => {
    if (!voiceChatUser[userid]) {
        voiceChatUser[userid] = {
            since: client.startDate
        }
    }


    const timeInVoice = Date.now() - voiceChatUser[userid].since;

    console.log(msToHumanReadableTime(timeInVoice))


    console.log("save db ")
}




const start = (client) => {

    client.on(Events.VoiceStateUpdate, async (oldState, newState) => {

        const { state, userid } = await checkState(oldState, newState);

        console.log(state)

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