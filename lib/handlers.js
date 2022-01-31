/**
 * Request handlers
 */

const { deflateRawSync } = require("zlib")

//Dependencies

//Handlers

const handlers = {}

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
        handlers._users[deflateRawSync.method]
    } else {
        callback(405)
    }

    callback(406, { 'name': 'users' })
}

//Container for user submethods

handlers._users = {}

//Users get

handlers._users.get = (data, callBack) => {

}
//Users post

handlers._users.post = (data, callBack) => {

}
//Users put

handlers._users.put = (data, callBack) => {

}
//Users delete

handlers._users.delete = (data, callBack) => {

}
module.exports = handlers