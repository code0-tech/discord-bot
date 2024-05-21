const { levenshteinDistance } = require('./../utils/helper');
const { MongoUser } = require('./../mongo/MongoUser');
const config = require('./../../config.json');

let userList = {};

const newpacket = (msg) => {
    return {
        last: {
            content: msg.content,
            length: msg.content.length,
            time: Date.now(),
            minMessageWriteTime: (msg.content.length / 10),
            messagePartsCount: msg.content.split(" ").length
        }
    }
}


const checkIfValid = async (msg) => {
    let cannotPass = false;
    let reasons = [];
    const userid = msg.author.id;

    if (!userList[userid]) {
        userList[userid] = newpacket(msg);
        return cannotPass;
    }

    const repeatedChars = /(.)\1{3,}/;
    if (repeatedChars.test(msg.content)) {
        reasons.push('Unusual character repetition');
        cannotPass = true;
    }

    if (msg.content == userList[userid].last.content) {
        reasons.push('Repeated message');
        cannotPass = true;
    }

    if (levenshteinDistance(msg.content, userList[userid].last.content) < 3) {
        reasons.push('Repeated message [similar]');
        cannotPass = true;
    }

    if ((Date.now() - userList[userid].last.time) <= 800) {
        reasons.push('Quick messages v1');
        cannotPass = true;
    }


    userList[userid] = newpacket(msg);

    // console.log(reasons);

    return cannotPass;
}


const start = (client) => {
    const maxLength = config.commands.rank.maxlength;
    const maxXP = config.commands.rank.maxxp;
    const xpPerChar = config.commands.rank.xpperchar;

    client.on('messageCreate', async msg => {

        if (msg.author.bot == true) return;
        if (msg.author.system == true) return;

        if (await checkIfValid(msg)) return;

        const user = await new MongoUser(msg.author.id).init();

        const adjustedLength = Math.min(msg.content.length, maxLength);

        let xp = Math.floor(adjustedLength * xpPerChar);

        xp = Math.min(xp, maxXP);

        if (xp == 0 && msg.content.length > 1) {
            xp = 1;
        }

        user.updateXpBy(xp);
    })

    // client.on('typingStart', info => {
    // if (userList[info.user.id]) {
    // console.log("save")
    // userList[info.user.id].last.typetime = Date.now()
    // }
    // });

    // client.on('raw', info => {
    // console.log(info)
    // });
}

module.exports = { start };