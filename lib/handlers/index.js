/**
 * Request handlers
 * @todo - replace callbacks for async/await
 */

//Dependencies
const usersHandlers = require('./users')
const tokensHandlers = require('./tokens')
const checksHandlers = require('./checks')
const frontendHandlers = require('./frontend')

//Handlers

const handlers = {
    ...frontendHandlers
}

console.log({ handlers})

/**
 * JSON API handlers
 */

//Ping handler

handlers.ping = (data, callback) => {
    callback(200)
}

//Not found handler

handlers.notFound = (data, callback) => {
    callback(404, { 'message': 'no found handler' })
}

//Users handlers

handlers.users = (data, callback) => {

    const aceptableMethods = ['post', 'get', 'put', 'delete']

    if (aceptableMethods.includes(data.method)) {
        usersHandlers[data.method]?.(data, callback)
    } else {
        callback(405)
    }

}

//Tokens handlers

handlers.tokens = (data, callback) => {

    const aceptableMethods = ['post', 'get', 'put', 'delete']

    if (aceptableMethods.includes(data.method)) {
        tokensHandlers[data.method]?.(data, callback)
    } else {
        callback(405)
    }

}

//Checks handlers
handlers.checks = (data, callback) => {

    const aceptableMethods = ['post', 'get', 'put', 'delete']

    if (aceptableMethods.includes(data.method)) {
        checksHandlers[data.method]?.(data, callback)
    } else {
        callback(405)
    }

}


module.exports = handlers