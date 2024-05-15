const { MongoUser } = require('./../mongo/MongoUser');
const config = require('./../../config.json');

let userList = {};

const newpacket = (msg) => {
    return {
        last: {
            content: msg.content,
            length: msg.content.length,
            time: Date.now(),
            // typetime: Date.now(),
            minMessageWriteTime: (msg.content.length / 10),
            messagePartsCount: msg.content.split(" ").length
        }
    }
}

const levenshteinDistance = (a, b) => {
    const matrix = [];

    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // Substitution
                    matrix[i][j - 1] + 1,     // Insertion
                    matrix[i - 1][j] + 1      // Deletion
                );
            }
        }
    }

    return matrix[b.length][a.length];
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

    // const messageWriteTime = Date.now() - userList[userid].last.typetime;
    // console.log(messageWriteTime)

    userList[userid] = newpacket(msg);

    // console.log(userList[userid]);
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