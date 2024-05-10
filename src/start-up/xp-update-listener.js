const { MongoUser } = require('./../mongo/MongoUser');

const start = (client) => {
    client.on('messageCreate', msg => {

        console.log(msg)
        // const user = new MongoUser(msg.author.id);



        // user.updateXpBy();

    })
}

module.exports = { start };