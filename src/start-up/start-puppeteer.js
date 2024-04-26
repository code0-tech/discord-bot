const puppeteer = require('puppeteer');

// Function to start Puppeteer and initialize global variable
const startPuppeteer = async () => {
    try {
        console.log('Starting Puppeteer...');

        // Launch Puppeteer in the new headless mode
        global.renderPuppeteer = await puppeteer.launch({ headless: "new" });

        console.log('Puppeteer is online.');
    } catch (error) {
        // Handle any errors that might occur during Puppeteer launch
        console.error('Error starting Puppeteer:', error.message);

        // Throw an error to stop the entire code
        throw new Error('Failed to start Puppeteer. Exiting...');
    }
};

// Call the function to start Puppeteer
startPuppeteer();