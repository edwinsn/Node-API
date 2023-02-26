/**
 * Server related tasks
 */

const http = require('http')
const https = require('https')
const url = require('url')
const StringDecoder = require('string_decoder').StringDecoder
const config = require('../config')
const fs = require('fs')
const router = require('./router')
const helpers = require('./helpers')
const path = require('path')

//Instantiate the server module object
const server = {}

//HTTP server instance

server.httpServer = http.createServer((req, res) => {
	server.unifiedServer(req, res)
})


//HTTPS server instance

server.httpsServerOptions = {
	key: fs.readFileSync(path.join(__dirname, '/../https/key.pem')),
	cert: fs.readFileSync(path.join(__dirname, '/../https/cert.pem'))
}

server.httpsServer = https.createServer(
	server.httpsServerOptions,
	(req, res) => {
		server.unifiedServer(req, res)
	})


//Http and https logic

server.unifiedServer = (req, res) => {

	//Get the url

	let parseUrl = url.parse(req.url, true)

	//Get the path

	let requestedPath = parseUrl.pathname
	let trimmedPath = requestedPath.replace(/^\/+|\/+$/g, '')

	//Get the query

	let queryStringObject = parseUrl.query

	//Get the method

	let method = req.method.toLowerCase()

	//Get the headers

	const headers = req.headers

	//Get the payload

	let decoder = new StringDecoder('utf-8')
	let bufferForPayload = ''

	req.on('data', (data) => {
		bufferForPayload += decoder.write(data)
	})

	req.on('end', () => {

		bufferForPayload += decoder.end()

		//Collect the data

		const data = {
			trimmedPath,
			queryStringObject,
			method,
			headers,
			payload: helpers.parseJsonToObject(bufferForPayload)
		}

		const choosenHandler = typeof (router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : router['notFound']

		//Route the path to the handler

		choosenHandler(data, (status, payloadToSend) => {

			//Default status code

			status = typeof (status) === 'number' ? status : 200

			//Default payload

			payloadToSend = typeof (payloadToSend) === 'object' ? payloadToSend : {}


			const payloadToSendString = JSON.stringify(payloadToSend)

			//Response

			res.setHeader('Content-Type', 'application/json')
			res.writeHead(status)
			res.end(payloadToSendString)

			//Logs

			console.log(`You just request: ${trimmedPath}\n Method: ${method},\n Payload:${bufferForPayload}`)

		})

	})

}

//init server
server.init = () => {
	//Start the HTTP server
	server.httpServer.listen(config.httpPort, () => {
		console.log(`Listening in ${config.httpsPort}`)
	})

	//Start the HTTPS server
	server.httpsServer.listen(config.httpsPort, () => {
		console.log(`Listening in ${config.httpPort}`)
	})
}

//Export the module
module.exports = server