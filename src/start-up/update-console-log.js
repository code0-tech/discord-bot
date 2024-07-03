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

const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
};

const customLog = (...args) => {
    let color = colors.reset;

    if (args.length > 1) {
        const colorCode = args.pop();
        switch (colorCode) {
            case '#1':
                color = colors.green;
                break;
            case '#2':
                color = colors.yellow;
                break;
            case '#3':
                color = colors.red;
                break;
            case '#4':
                color = colors.blue;
                break;
            case '#5':
                color = colors.cyan;
                break;
            case '#6':
                color = colors.magenta;
                break;
            default:
                break;
        }
    }

    const log = args.length === 1 ? args[0] : args.join(' ');

    if (!global.isDevelopment) {
        logToMongoDb(log);
    } else {
        process['dclogger'] = {
            runid: 999999999
        };
    }

    const coloredLog = `${color}${log}${colors.reset}`;

    originalConsoleLog(coloredLog);
};


console.log = customLog;