const puppeteer = require('puppeteer');

// Start Puppeteer and initialize global variable
const startPuppeteer = async () => {
    try {
        console.log('Starting Puppeteer...');

        // Launch Puppeteer in the new headless mode => { headless: "new" }
        global.renderPuppeteer = await puppeteer.launch({ headless: "new" });

        console.log('Puppeteer is online.');
    } catch (error) {
        console.error('Error starting Puppeteer:', error.message);
        throw new Error('Failed to start Puppeteer. Exiting...');
    }
};

startPuppeteer();