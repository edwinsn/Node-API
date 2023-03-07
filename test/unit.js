/**
 * Unit Tests
 */

//Dependencies
const helpers = require('../lib/helpers');
const assert = require('assert');
const logs = require('../lib/logs');
const exampleDebuggingProblem = require('../lib/exampleDebugginProblem');

//Holder for the tests
const unitTests = {}

//Assert that the getANumber function is returning a number
unitTests['helpers.getANumber should return a number'] = (done) => {

    const val = helpers.getANumber();
    assert.equal(typeof (val), 'number');
    done();

}

//Assert that the getANumber function is returning 1
unitTests['helpers.getANumber should return 1'] = (done) => {

    const val = helpers.getANumber();
    assert.equal(val, 1);
    done();

}

//Assert that the getANumber function is returning 2
unitTests['helpers.getANumber should return 2'] = (done) => {

    const val = helpers.getANumber();
    assert.equal(val, 2);
    done();

}

//Logs.list should callback an array and a false error
unitTests['logs.list should callback a false error and an array of log names'] = (done) => {

    logs.list(true, (err, logFileNames) => {

        assert.equal(err, false);
        assert.ok(logFileNames instanceof Array);
        assert.ok(logFileNames.length > 1);
        done();

    });

}

//Logs.truncate should not throw if the logId does not exist
unitTests['logs.truncate should not throw if the logId does not exist. It should callback an error instead'] = (done) => {

    assert.doesNotThrow(() => {
        logs.truncate('I do not exist', (err) => {
            assert.ok(err);
            done();
        });
    }, TypeError);

}

//Example Debugging Problem
unitTests['exampleDebuggingProblem.init should not throw when called'] = (done) => {

    assert.doesNotThrow(() => {
        exampleDebuggingProblem.init();
        done();
    }, TypeError);

}


//Export the object
module.exports = unitTests;