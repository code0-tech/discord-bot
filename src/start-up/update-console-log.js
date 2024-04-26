// Store the original console.log method
const originalConsoleLog = console.log;

// Create a custom logging function
const customLog = (...args) => {
    const timestamp = new Date().toLocaleTimeString() + ' ' + new Date().toLocaleDateString();
    // Use the stored originalConsoleLog method instead of console.log
    originalConsoleLog(`${timestamp} =>`, ...args);
}

// Replace the default console.log with my own customLog
console.log = customLog;