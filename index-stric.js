/**
 * Primary api file
 */
"use strict";


//Dependencies
const server = require('./lib/server')
const workers = require('./lib/workers')
const cli = require('./lib/cli')

//Declare the app
const app = {}

//Declare a global variable (stric mode should catch this)
foo = 'bar'

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