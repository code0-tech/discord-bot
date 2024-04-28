// Store the original console.log method
const originalConsoleLog = console.log;

const customLog = (...args) => {
    const date = new Date()
    const timestamp = date.toLocaleTimeString() + ' ' + date.toLocaleDateString();

    originalConsoleLog(`${timestamp} =>`, ...args);
}

// Replace the default console.log with my own customLog
console.log = customLog;