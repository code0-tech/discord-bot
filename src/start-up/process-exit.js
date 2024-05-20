process.on('SIGINT', function () {
    console.log("\nShutting down from SIGINT (Ctrl-C)");
    process.exit(0);
});