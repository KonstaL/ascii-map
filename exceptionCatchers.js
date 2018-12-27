function setupExceptionCatchers() {

    process.on('uncaughtException', function (exception) {
        console.log('Uncaught exception' ,exception); 
    });
    
    process.on('unhandledRejection', (reason, p) => {
        console.log("Unhandled Rejection at: Promise ", p, " reason: ", reason);
    });
    
    process.on('SIGINT', function() {
        console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
        process.exit(1);
    })
}

module.exports = setupExceptionCatchers;