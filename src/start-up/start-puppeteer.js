const puppeteer = require('puppeteer');

const startPuppeteer = async () => {
    try {
        console.log('[Puppeteer] Starting Puppeteer...');

        global.renderPuppeteer = await puppeteer.launch({ headless: "new" });

        console.log('[Puppeteer] Puppeteer is online.');
    } catch (error) {
        console.error('[Puppeteer] Error starting Puppeteer:', error.message);
        throw new Error('[Puppeteer] Failed to start Puppeteer. Exiting...');
    }
};

startPuppeteer();