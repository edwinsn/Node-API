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
app.init = function (callback) {
	//Start the server
	server.init()

	//Start the workers
	workers.init()

	//Start the cli
	setTimeout(() => {

		cli.init(callback)

	}, 50)

}

//Self invoke only if required directly (node index.js)
if (require.main === module) {
	app.init(() => { })
}

//Export the app
module.exports = app