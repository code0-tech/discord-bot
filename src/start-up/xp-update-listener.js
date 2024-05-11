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
    const userid = msg.author.id;

    if (!userList[userid]) {
        userList[userid] = newpacket(msg);
        // return cannotPass;
    }

    const repeatedChars = /(.)\1{3,}/; // Matches a character repeated 4 or more times
    if (repeatedChars.test(msg.content)) {
        // console.log("repeated 4 or more times")
        cannotPass = true;
    }

    const consecutiveRandomChars = /[a-zA-Z]{5,}/; // Matches 5 or more consecutive letters
    if (consecutiveRandomChars.test(msg.content)) {
        // console.log("5 or more consecutive letters")
        cannotPass = true;
    }

    if (msg.content == userList[userid].last.content) { // Check if the last message was repeated
        // console.log("Repeated Message")
        cannotPass = true;
    }

    if (levenshteinDistance(msg.content, userList[userid].last.content) < 3) { // Check levenshteinDistance
        // console.log("Message is very simil")
        cannotPass = true;
    }


    // Check time etc

    userList[userid] = newpacket(msg);

    // console.log(userList)
    // console.log(cannotPass)

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
}

module.exports = { start };