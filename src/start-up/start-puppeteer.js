const puppeteer = require('puppeteer');

const startPuppeteer = async () => {
    try {
        console.log('Starting Puppeteer...');

        global.renderPuppeteer = await puppeteer.launch({ headless: "new" });

        console.log('Puppeteer is online.');
    } catch (error) {
        console.error('Error starting Puppeteer:', error.message);
        throw new Error('Failed to start Puppeteer. Exiting...');
    }
};

startPuppeteer();