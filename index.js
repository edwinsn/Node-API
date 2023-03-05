/**
 * Primary api file
 */

//Dependencies
const server = require('./lib/server')
const workers = require('./lib/workers')
const cli = require('./lib/cli')

//Declare the app
const app = {}

//Init function
app.init = function () {
	//Start the server
	server.init()

	//Start the workers
	workers.init()

	//Start the cli
	setTimeout(() => {

		cli.init()

	}, 50)

}

//Execute
app.init()

//Export the app
module.exports = app