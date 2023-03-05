//Dependencies
const os = require('os');
const v8 = require('v8');
const _data = require('./data')
const _logs = require('./logs')
const helpers = require('./helpers')

//Responders object
const responders = {};

//Help responders
responders.help = function () {
    const commands = {
        'exit': 'Kill the CLI (and the rest of the application)',
        'man': 'Show this help page',
        'help': 'Show this help page',
        'stats': 'Get statistics on the underlying operating system and resource utilization',
        'list users': 'Show a list of all the registered (undeleted) users in the system',
        'more user info --{userId}': 'Show details of a specific user',
        'list checks --up --down': 'Show a list of all the active checks in the system, including their state. The "--up" and the "--down flags are both optional."',
        'more check info --{checkId}': 'Show details of a specified check',
        'list logs': 'Show a list of all the log files available to be read (compressed only)',
        'more log info --{fileName}': 'Show details of a specified log file'
    };

    //Show a header for the help page that is as wide as the screen
    _horizontalLine();
    _centered('CLI MANUAL');
    _horizontalLine();
    _verticalSpace(2);

    //Show each command, followed by its explanation, in white and yellow respectively
    for (let key in commands) {
        if (commands.hasOwnProperty(key)) {
            const value = commands[key];
            let line = '\x1b[33m' + key + '\x1b[0m';
            const padding = 60 - line.length;
            for (let i = 0; i < padding; i++) {
                line += ' ';
            }
            line += value;
            console.log(line);
            _verticalSpace();
        }
    }

    _verticalSpace(1);

    //End with another horizontal line
    _horizontalLine();

};

const _verticalSpace = function (lines) {
    lines = typeof (lines) == 'number' && lines > 0 ? lines : 1;
    for (let i = 0; i < lines; i++) {
        console.log('');
    }
};

const _horizontalLine = function () {
    //Get the available screen size
    const width = process.stdout.columns;

    let line = '';

    for (let i = 0; i < width; i++) {
        line += '-';
    }

    console.log(line);

};

const _centered = function (str) {

    //Get the available screen size
    const width = process.stdout.columns;

    //Calculate the left padding there should be
    const leftPadding = Math.floor((width - str.length) / 2);

    //Put in left padded spaces before the string itself
    let line = '';

    for (let i = 0; i < leftPadding; i++) {
        line += ' ';
    }

    line += str;

    console.log(line);

}

//Exit responders
responders.exit = function () {
    process.exit(0);
};

//Stats responders
responders.stats = function () {

    //Compile stats
    const stats = {
        'Load Average': os.loadavg().join(' '),
        'CPU Count': os.cpus().length,
        'Free Memory': os.freemem(),
        'Current Malloced Memory': v8.getHeapStatistics().malloced_memory,
        'Peak Malloced Memory': v8.getHeapStatistics().peak_malloced_memory,
        'Allocated Heap Used (%)': Math.round((v8.getHeapStatistics().used_heap_size / v8.getHeapStatistics().total_heap_size) * 100),
        'Available Heap Allocated (%)': Math.round((v8.getHeapStatistics().total_heap_size / v8.getHeapStatistics().heap_size_limit) * 100),
        'Uptime': os.uptime() + ' Seconds'
    }

    //Create a header for the stats
    _horizontalLine();
    _centered('SYSTEM STATISTICS');
    _horizontalLine();
    _verticalSpace(2);

    //Log out each stat
    for (let key in stats) {
        if (stats.hasOwnProperty(key)) {
            const value = stats[key];
            let line = '\x1b[33m' + key + '\x1b[0m';
            const padding = 60 - line.length;
            for (let i = 0; i < padding; i++) {
                line += ' ';
            }
            line += value;
            console.log(line);
            _verticalSpace();
        }
    }

    _verticalSpace(1);

    //End with another horizontal line
    _horizontalLine();

};

//List users responders
responders.listUsers = function () {

    _data.list('users', function (err, userIds) {
        if (!err && userIds && userIds.length > 0) {
            _verticalSpace();
            userIds.forEach(function (userId) {
                _data.read('users', userId, function (err, userData) {
                    if (!err && userData) {
                        let line = 'Name: ' + userData.firstName + ' ' + userData.lastName + ' Phone: ' + userData.phone + ' Checks: ';
                        const numberOfChecks = typeof (userData.checks) == 'object' && userData.checks instanceof Array && userData.checks.length > 0 ? userData.checks.length : 0;
                        line += numberOfChecks;
                        console.log(line);
                        _verticalSpace();
                    }
                });
            });
        }
    });

};

//More user info responders
responders.moreUserInfo = function (str) {

    //get the user id
    const arr = str.split('--');
    const userId = typeof (arr[1]) == 'string' && arr[1].trim().length > 0 ? arr[1].trim() : false;

    if (userId) {

        //Lookup the user
        _data.read('users', userId, function (err, userData) {

            if (!err && userData) {
                //Remove the hashed password
                delete userData.hashedPassword;

                //Print the JSON with text highlighting
                _verticalSpace();
                console.dir(userData, { 'colors': true });
                _verticalSpace();

            }

        });

    }

};

//List checks responders
responders.listChecks = function (str) {

    _data.list('checks', function (err, checkIds) {

        if (!err && checkIds && checkIds.length > 0) {
            _verticalSpace();
            checkIds.forEach(function (checkId) {
                _data.read('checks', checkId, function (err, checkData) {
                    if (!err && checkData) {
                        const includeCheck = false;
                        const lowerString = str.toLowerCase();

                        //Get the state, default to down
                        const state = typeof (checkData.state) == 'string' ? checkData.state : 'down';

                        //Get the state, default to unknown
                        const stateOrUnknown = typeof (checkData.state) == 'string' ? checkData.state : 'unknown';

                        //If the user has specified the state, or hasn't specified any state, include the current check accordingly
                        if (lowerString.indexOf('--' + state) > -1 || (lowerString.indexOf('--down') == -1 && lowerString.indexOf('--up') == -1)) {
                            const line = 'ID: ' + checkData.id + ' ' + checkData.method.toUpperCase() + ' ' + checkData.protocol + '://' + checkData.url + ' State: ' + stateOrUnknown;
                            console.log(line);
                            _verticalSpace();
                        }
                    }
                });
            });
        }

    });

};

//More check info responders
responders.moreCheckInfo = function (str) {
    //get the check id
    const arr = str.split('--');
    const checkId = typeof (arr[1]) == 'string' && arr[1].trim().length > 0 ? arr[1].trim() : false;

    if (checkId) {

        //Lookup the check
        _data.read('checks', checkId, function (err, checkData) {

            if (!err && checkData) {

                //Print the JSON with text highlighting
                _verticalSpace();
                console.dir(checkData, { 'colors': true });
                _verticalSpace();

            }

        });

    }

};

//List logs responders
responders.listLogs = function () {
    _logs.list(true, function (err, logFileNames) {

        if (!err && logFileNames && logFileNames.length > 0) {
            _verticalSpace();
            logFileNames.forEach(function (logFileName) {
                if (logFileName.indexOf('-') > -1) {
                    console.log(logFileName);
                    _verticalSpace();
                }
            });
        }

    });
};

//More log info responders
responders.moreLogInfo = function (str) {

    //get the log id
    const arr = str.split('--');
    const logFileName = typeof (arr[1]) == 'string' && arr[1].trim().length > 0 ? arr[1].trim() : false;

    if (logFileName) {

        _verticalSpace();

        //Decompress the log file
        _logs.decompress(logFileName, function (err, strData) {
            if (!err && strData) {
                //Split into lines
                const arr = strData.split('\n');
                arr.forEach(function (jsonString) {
                    const logObject = helpers.parseJsonToObject(jsonString);
                    if (logObject && JSON.stringify(logObject) !== '{}') {
                        console.dir(logObject, { 'colors': true });
                        _verticalSpace();
                    }
                });
            }
        });


    }

};




//Export the module
module.exports = responders;