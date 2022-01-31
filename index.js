const http = require('http')
const https = require('https')
const url = require('url')
const StringDecoder = require('string_decoder').StringDecoder
const config = require('./config')
const fs = require('fs')
const handlers = require('./lib/handlers')

//HTTP server instance

const httpServer = http.createServer((req, res) => {
	unifiedServer(req, res)
})

//Start the HTTP server

httpServer.listen(config.httpPort, () => {
	console.log(`Listening in ${config.httpPort}`)
})

//HTTPS server instance

const httpsServerOptions = {
	key: fs.readFileSync('./https/key.pem'),
	cert: fs.readFileSync('./https/cert-pem')
}

const httpsServer = https.createServer(httpsServerOptions, (req, res) => {
	unifiedServer(req, res)
})

//Start the HTTPS server

httpsServer.listen(config.httpsPort, () => {
	console.log(`Listening in ${config.httpsPort}`)
})

//Http and https logic

var unifiedServer = (req, res) => {

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
			bufferForPayload
		}

		const choosenHandler = typeof (router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound

		console.log({ trimmedPath })

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

//Router

const router = {
	ping: handlers.ping,
	users: handlers.users
}

