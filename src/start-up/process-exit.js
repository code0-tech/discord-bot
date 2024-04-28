// used for Nicusch local windows machine, for the simple reason: My console is fu**ed
process.on('SIGINT', function () {
    console.log("\nShutting down from SIGINT (Ctrl-C)");
    process.exit(0);
});