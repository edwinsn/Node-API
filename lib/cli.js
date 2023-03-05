/**
 * CLI tasks
 */

//Dependencies
const readline = require('readline');
const events = require('events');
const responders = require('./cliResponders')

class _events extends events { }
const e = new _events();

//Instantiate the cli module object
const cli = {};

// Input handlers
e.on('man', function (str) {
    responders.help();
});

e.on('help', function (str) {
    responders.help();
});

e.on('exit', function (str) {
    responders.exit();
});

e.on('stats', function (str) {
    responders.stats();
});

e.on('list users', function (str) {
    responders.listUsers();
});

e.on('more user info', function (str) {
    responders.moreUserInfo(str);
});

e.on('list checks', function (str) {
    responders.listChecks(str);
});

e.on('more check info', function (str) {
    responders.moreCheckInfo(str);
});

e.on('list logs', function (str) {
    responders.listLogs();
});

e.on('more log info', function (str) {
    responders.moreLogInfo(str);
});



//Input processor
cli.processInput = function (str) {

    str = typeof (str) == 'string' && str.trim().length > 0 ? str.trim() : false;

    if (str) {
        //Codify the unique strings that identify the unique questions allowed to be asked
        const uniqueInputs = [
            'man',
            'help',
            'exit',
            'stats',
            'list users',
            'more user info',
            'list checks',
            'more check info',
            'list logs',
            'more log info'
        ];

        //Go through the possible inputs, emit an event when a match is found
        let matchFound = false;
        let counter = 0;

        uniqueInputs.some(function (input) {

            if (str.toLowerCase().indexOf(input) > -1) {
                matchFound = true;

                //Emit an event matching the unique input, and include the full string given
                e.emit(input, str);

                return true;
            }

        });

        //if not mathced comand print in yellow an error message
        if (!matchFound) {
            console.log(' \x1b[33m%s\x1b[0m', 'Sorry, command not fount, use man or help to see the list of commands');
        }

    }

}

cli.init = function () {

    //Send the start message to the console in dark blue
    console.log('\x1b[34m%s\x1b[0m', 'The CLI is running');

    //Start the interface
    const _interface = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: '>'
    });


    //Create an initial prompt
    _interface.prompt();

    //Handle each line of input separately
    _interface.on('line', function (str) {

        //Send to the input processor
        cli.processInput(str);

        //Reinitialize the prompt afterwards
        _interface.prompt();
    });

    //If the user stops the CLI, kill the associated process
    _interface.on('close', function () {
        process.exit(0);
    });

}


//Export the module
module.exports = cli;