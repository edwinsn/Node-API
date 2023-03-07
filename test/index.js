/**
 * Test runner
 */

//Dependencies
const unitTests = require('./unit');
const apiTests = require('./api');

//Override the NODE_ENV variable
process.env.NODE_ENV = 'testing';

//Application logic for the test runner
const _app = {}

//Container for the tests
_app.tests = {
    'unit': unitTests,
    'api': apiTests,
}


//Count all the tests
_app.countTests = () => {

    let counter = 0;
    for (let key in _app.tests) {
        if (_app.tests.hasOwnProperty(key)) {
            const subTests = _app.tests[key];
            for (let testName in subTests) {
                if (subTests.hasOwnProperty(testName)) {
                    counter++;
                }
            }
        }
    }

    return counter;


}

//Run all the tests, collecting the errors and successes
_app.runTests = () => {

    const errors = [];
    let successes = 0;
    const limit = _app.countTests();
    let counter = 0;

    for (let key in _app.tests) {

        if (_app.tests.hasOwnProperty(key)) {
            const subTests = _app.tests[key];
            for (let testName in subTests) {
                if (subTests.hasOwnProperty(testName)) {

                    (() => {
                        const tmpTestName = testName;
                        const testValue = subTests[testName];
                        //Call the test
                        try {

                            testValue(() => {
                                //If it calls back without throwing, then it succeeded, so log it in green
                                console.log('\x1b[32m%s\x1b[0m', tmpTestName);
                                counter++;
                                successes++;

                                if (counter == limit) {
                                    _app.produceTestReport(limit, successes, errors);
                                }
                            })
                        }
                        catch (e) {
                            //If it throws, then it failed, so capture the error thrown and log it in red
                            errors.push({
                                'name': testName,
                                'error': e
                            });
                            console.log('\x1b[31m%s\x1b[0m', tmpTestName);
                            counter++;

                            if (counter == limit) {
                                _app.produceTestReport(limit, successes, errors);
                            }
                        }
                    })();

                }
            }
        }

    }


}

//PRODUCT A TEST REPORT
_app.produceTestReport = (limit, successes, errors) => {

    console.log("");
    console.log("--------BEGIN TEST REPORT--------");
    console.log("");
    console.log("Total Tests: ", limit);
    console.log("Pass: ", successes);
    console.log("Fail: ", errors.length);
    console.log("");

    //If there are errors, print them in detail
    if (errors.length > 0) {
        console.log("--------BEGIN ERROR DETAILS--------");
        console.log("");
        errors.forEach((testError) => {
            console.log('\x1b[31m%s\x1b[0m', testError.name);
            console.log(testError.error);
            console.log("");
        });
        console.log("");
        console.log("--------END ERROR DETAILS--------");
    }

    //Kill the process started by the api test
    process.exit(0);

}

//Run the tests
_app.runTests()