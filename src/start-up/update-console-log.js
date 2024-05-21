const { Mongo, ENUMS } = require('../models/Mongo');

let logDocument = null;
let logBuffer = [];

const generateRunId = () => {
    return Date.now(); // Generate a timestamp for run ID
};

const processNextLog = async () => {
    if (!logDocument && logBuffer.length > 0) {
        const MongoDb = new Mongo();
        const runId = generateRunId();
        logDocument = runId;

        const initialLogDocument = {
            "run_id": runId,
            "logs": [],
            "created_at": Date.now()
        };
        const result = await MongoDb.insertOne(ENUMS.DCB.LOGS, initialLogDocument);
    }

    if (logDocument && logBuffer.length > 0) {
        const log = logBuffer.shift(); // Take the next log from the buffer
        const MongoDb = new Mongo();
        await MongoDb.update(
            ENUMS.DCB.LOGS,
            { "run_id": logDocument },
            { $push: { "logs": log } }
        );
    }
};

// Set interval to process logs every 5 seconds
setInterval(processNextLog, 500);

// Function to handle incoming logs
const messageToMongoDb = async (msg) => {
    if (global.mongoClient == null) return;

    const log = {
        "msg": msg,
        "time": Date.now()
    };

    logBuffer.push(log);
};



// Store the original console.log method
const originalConsoleLog = console.log;

const customLog = (...args) => {
    const date = new Date()
    const timestamp = date.toLocaleTimeString() + ' ' + date.toLocaleDateString();

    messageToMongoDb(...args);

    originalConsoleLog(`${timestamp} =>`, ...args);
}

// Replace the default console.log with my own customLog
console.log = customLog;