/**
 * Primary api file
 */

//Dependencies
const server = require('./lib/server')
const workers = require('./lib/workers')
const cli = require('./lib/cli')
const cluster = require('cluster')
const os = require('os')

//Declare the app
const app = {}

//Init function
app.init = function (callback) {


	//If we are on the master thread, start the background workers and the cli
	if (cluster.isMaster) {

		//Start the workers
		workers.init()

		//Start the cli
		setTimeout(() => {

			cli.init(callback)

		}, 50)

		//Fork the process
		for (let i = 0; i < os.cpus().length; i++) {
			cluster.fork()
		}

		return

	}

	//Start the server
	server.init()

}

//Self invoke only if required directly (node index.js)
if (require.main === module) {
	app.init(() => { })
}

//Export the app
module.exports = app