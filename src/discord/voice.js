const checkState = async (oldState, newState) => {
    let userId = newState.member ? newState.member.id : oldState.member.id;
    let newUserChannel = newState.channel;
    let oldUserChannel = oldState.channel;

    if (oldUserChannel === null && newUserChannel !== null) {
        return {
            state: 'JOIN',
            userid: userId,
            newChannel: newUserChannel,
            oldChannel: oldUserChannel
        };
    } else if (oldUserChannel !== null && newUserChannel === null) {
        return {
            state: 'LEAVE',
            userid: userId,
            newChannel: newUserChannel,
            oldChannel: oldUserChannel
        };
    } else if (
        oldUserChannel !== null &&
        newUserChannel !== null &&
        oldUserChannel.id != newUserChannel.id
    ) {
        return {
            state: 'SWITCH',
            userid: userId,
            newChannel: newUserChannel,
            oldChannel: oldUserChannel
        };
    } else {
        return {
            state: 'NO_CHANGE',
            userid: userId,
            newChannel: newUserChannel,
            oldChannel: oldUserChannel

        };
    }
}

module.exports = { checkState };
