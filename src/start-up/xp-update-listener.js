const { MongoUser } = require('./../mongo/MongoUser');
const config = require('./../../config.json');

const start = (client) => {
    const maxLength = config.commands.rank.maxlength;
    const maxXP = config.commands.rank.maxxp;
    const xpPerChar = config.commands.rank.xpperchar;

    client.on('messageCreate', async msg => {

        if (msg.author.bot == true) return;

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