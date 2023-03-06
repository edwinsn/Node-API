/**
 * Primary api file
 */

//Dependencies
const server = require('./lib/server')
const workers = require('./lib/workers')
const cli = require('./lib/cli')
const exampleDebugginProblem = require('./lib/exampleDebugginProblem')

//Declare the app
const app = {}

//Init function
app.init = function () {
	//Start the server
	server.init()

	//Start the workers
	workers.init()

	debugger;

	//Start the cli
	setTimeout(() => {

		cli.init()

	}, 50)

	debugger;
	//Call the init script that will throw an error
	exampleDebugginProblem.init()

	debugger;

}

//Execute
app.init()

//Export the app
module.exports = app