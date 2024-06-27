const { Mongo, ENUMS } = require('../models/Mongo');

let logDocument = null;
let logBuffer = [];

const generateRunId = () => {
    return Date.now();
};


const processNextLog = async () => {
    if (!logDocument && logBuffer.length > 0) {
        const MongoDb = new Mongo();
        const runId = generateRunId();
        logDocument = runId;

        process['dclogger'] = {
            runid: runId
        };

        const initialLogDocument = {
            "run_id": runId,
            "logs": [],
            "created_at": Date.now()
        };
        const result = await MongoDb.insertOne(ENUMS.DCB.LOGS, initialLogDocument);
    }

    if (logDocument && logBuffer.length > 0) {
        const log = logBuffer.shift();
        const MongoDb = new Mongo();
        await MongoDb.update(
            ENUMS.DCB.LOGS,
            { "run_id": logDocument },
            { $push: { "logs": log } }
        );
    }
};

setInterval(processNextLog, 500);

const logToMongoDb = async (log) => {
    if (global.mongoClient == null) return;

    const logData = {
        "msg": log instanceof Error ? log.message : log,
        "error": log instanceof Error ? log.stack : null,
        "time": Date.now()
    };

    logBuffer.push(logData);
};

const originalConsoleLog = console.log;

const customLog = (...args) => {
    const log = args.length === 1 ? args[0] : args.join(' '); // Convert multiple arguments to a single string

    if (!global.isDevelopment) {
        logToMongoDb(log);
    } else {
        process['dclogger'] = {
            runid: 999999999
        };
    }
    originalConsoleLog(...args);
};

// Replace the default console.log with my own customLog
console.log = customLog;