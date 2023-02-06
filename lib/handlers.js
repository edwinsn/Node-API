/**
 * Request handlers
 */

const { deflateRawSync } = require("zlib")
const _data = require('./data')
const helpers = require('./helpers')
const config = require('../config')

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
        handlers._users[data.method]?.(data, callback)
    } else {
        callback(405)
    }

}

//Container for user submethods

handlers._users = {}

//Users get

handlers._users.get = (data, callBack) => {

}
//Users post

handlers._users.post = (data, callBack) => {

    //Check the required fields were passed
    const firstName = typeof (data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false
    const lastName = typeof (data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false
    const phone = typeof (data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false
    const password = typeof (data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false
    const tosAgreement = typeof (data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false

    if (firstName && lastName && phone && password && tosAgreement) {
        //Make sure that the user doesn't already exist
        _data.read('users', phone, (err, data) => {
            if (err) {

                //Hash the password
                const hashedPassword = helpers.hash(password)

                //Create the user object
                const userObject = {
                    'firstName': firstName,
                    'lastName': lastName,
                    'phone': phone,
                    'hashedPassword': hashedPassword,
                    'tosAgreement': true
                }

                if (hashedPassword) {
                    //Store the user
                    _data.create('users', phone, userObject, (err) => {

                        if (!err) {
                            callBack(200)
                        }
                        else {
                            console.log(err)
                            callBack(500, { 'Error': 'Could not create the new user' })
                        }
                    })
                } else {
                    callBack(500, { 'Error': 'Could not hash the user\'s password' })
                }



            } else {
                //user already exists
                callBack(400, { 'Error': 'A user with that phone number already exists' })
            }
        })
    } else {
        callBack(400, { 'Error': 'Missing required fields' })
    }

}
//Users put

handlers._users.put = (data, callBack) => {

}
//Users delete

handlers._users.delete = (data, callBack) => {

}
module.exports = handlers