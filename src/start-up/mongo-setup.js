const { MongoClient } = require('mongodb');

const mongoClient = new MongoClient(process.env.MONGO_URL);

mongoClient.connect()
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1);
    });

global.mongoClient = mongoClient;