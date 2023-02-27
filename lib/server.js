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
const util = require('util')
const debug = util.debuglog('server')

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

		choosenHandler(data, (status, payloadToSend, contentType) => {

			//Determine the type of response (fallback to JSON)
			contentType = typeof (contentType) === 'string' ? contentType : 'json'

			//Default status code

			status = typeof (status) === 'number' ? status : 200

			//Response

			res.setHeader('Content-Type', 'application/json')


			//Return the response-parts that are content-specific

			let payloadToSendString = ''
			if (contentType === 'json') {
				res.setHeader('Content-Type', 'application/json')
				payloadToSend = typeof (payloadToSend) === 'object' ? payloadToSend : {}
				payloadToSendString = JSON.stringify(payloadToSend)
			}

			if (contentType === 'html') {
				res.setHeader('Content-Type', 'text/html')
				payloadToSendString = typeof (payloadToSend) === 'string' ? payloadToSend : ''
			}

			//Return the response-parts that are content-specific
			res.writeHead(status)
			res.end(payloadToSendString)

			//If the response is 200, print green, otherwise print red
			if (status === 200) {
				debug('\x1b[32m%s\x1b[0m', `${method.toUpperCase()} /${trimmedPath} ${status}`)
			} else {
				debug('\x1b[31m%s\x1b[0m', `${method.toUpperCase()} /${trimmedPath} ${status}`)
			}

		})

	})

}

//init server
server.init = () => {
	//Start the HTTP server
	server.httpServer.listen(config.httpPort, () => {
		console.log('\x1b[32m%s\x1b[0m', `Listening https in ${config.httpsPort}`)
	})

	//Start the HTTPS server
	server.httpsServer.listen(config.httpsPort, () => {
		console.log('\x1b[36m%s\x1b[0m', `Listening http in ${config.httpPort}`)
	})
}

//Export the module
module.exports = server