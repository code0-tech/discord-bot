const quit = () => {
    console.log('Exiting gracefully...');
    process.exit(0);
}


process.on('SIGINT', quit);
process.on('SIGQUIT', quit);
process.on('SIGTERM', quit);