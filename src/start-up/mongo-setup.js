const { MongoClient } = require('mongodb');

const mongoClient = new MongoClient(process.env.MONGO_URL);

const connect = () => {
    mongoClient.connect()
        .then(() => {
            console.log('Connected to MongoDB');
            return true;
        })
        .catch((err) => {
            console.error('Error connecting to MongoDB:', err);
            process.exit(1);
        });
}

global.mongoClient = mongoClient;

module.exports = { connect };