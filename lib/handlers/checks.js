const _data = require('../data')
const config = require('../../config')
const helpers = require('../helpers')
const tokens = require('./tokens')

module.exports.post = (data, callBack) => {

    //validate inputs
    const protocol = typeof (data.payload.protocol) == 'string' && ['http', 'https'].includes(data.payload.protocol) ? data.payload.protocol : false
    const url = typeof (data.payload.url) == 'string' && data.payload.url.trim().length > 0 ? data.payload.url.trim() : false
    const method = typeof (data.payload.method) == 'string' && ['post', 'get', 'put', 'delete'].includes(data.payload.method) ? data.payload.method : false
    const successCodes = typeof (data.payload.successCodes) == 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 ? data.payload.successCodes : false
    const timeoutSeconds = typeof (data.payload.timeoutSeconds) == 'number' && data.payload.timeoutSeconds % 1 === 0 && data.payload.timeoutSeconds >= 1 && data.payload.timeoutSeconds <= 5 ? data.payload.timeoutSeconds : false

    if (protocol && url && method && successCodes) {

        //Get the token from the headers
        const token = typeof (data.headers.token) == 'string' ? data.headers.token : false

        //Lookup the user by reading the token
        _data.read('tokens', token, (err, tokenData) => {
            if (!err && tokenData) {

                //Lookup the user data
                _data.read('users', tokenData.phone, (err, userData) => {
                    if (!err && userData) {

                        const userChecks = typeof (userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : []
                        //Verify that the user has less than the number of max-checks-per-user
                        if (userChecks.length < config.maxChecks) {

                            //Create a random id for the check
                            const checkId = helpers.createRandomString(20)
                            //Create the check object, and include the user's phone
                            const checkObject = {
                                id: checkId,
                                userPhone: tokenData.phone,
                                protocol,
                                url,
                                method,
                                successCodes,
                                timeoutSeconds
                            }

                            //Save the object
                            _data.create('checks', checkId, checkObject, (err) => {
                                if (!err) {

                                    //Add the check id to the user's object
                                    userData.checks = userChecks
                                    userData.checks.push(checkId)

                                    //Save the new user data
                                    _data.update('users', tokenData.phone, userData, (err) => {
                                        if (!err) {
                                            //Return the data about the new check
                                            callBack(200, checkObject)
                                        } else {
                                            callBack(500, { 'Error': 'Could not update the user with the new check' })
                                        }
                                    })

                                } else {
                                    callBack(500, { 'Error': 'Could not create the new check' })
                                }
                            })
                        } else {
                            callBack(400, { 'Error': `The user already has the maximum number of checks (${config.maxChecks})` })
                        }

                    } else {
                        callBack(403, { 'Error': 'Missing required token in header, or token is invalid' })
                    }
                })

            } else {
                callBack(403, { 'Error': 'Missing required token in header, or token is invalid' })
            }

        })

    } else {
        callBack(400, { 'Error': 'Missing required inputs, or inputs are invalid' })
    }

}

module.exports.get = (data, callBack) => {

    //Check that the id is valid
    const id = typeof (data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false

    if (id) {
        //Lookup the check
        _data.read('checks', id, (err, checkData) => {
            if (!err && checkData) {

                //Get the token from the headers
                const token = typeof (data.headers.token) == 'string' ? data.headers.token : false

                //Verify that the given token is valid and belongs to the user who created the check
                tokens.verifyToken(token, checkData.userPhone, (tokenIsValid) => {
                    if (tokenIsValid) {
                        //Return the check data
                        callBack(200, checkData)
                    } else {
                        callBack(403, { 'Error': 'Missing required token in header, or token is invalid' })
                    }
                })

            } else {
                callBack(404)
            }
        })
    } else {
        callBack(400, { 'Error': 'Missing required field' })
    }

}

module.exports.put = (data, callBack) => {

    //Check for the required field
    const id = typeof (data.payload.id) == 'string' && data.payload.id.trim().length == 20 ? data.payload.id.trim() : false

    //Check for the optional fields
    const protocol = typeof (data.payload.protocol) == 'string' && ['http', 'https'].includes(data.payload.protocol) ? data.payload.protocol : false
    const url = typeof (data.payload.url) == 'string' && data.payload.url.trim().length > 0 ? data.payload.url.trim() : false
    const method = typeof (data.payload.method) == 'string' && ['post', 'get', 'put', 'delete'].includes(data.payload.method) ? data.payload.method : false
    const successCodes = typeof (data.payload.successCodes) == 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 ? data.payload.successCodes : false
    const timeoutSeconds = typeof (data.payload.timeoutSeconds) == 'number' && data.payload.timeoutSeconds % 1 === 0 && data.payload.timeoutSeconds >= 1 && data.payload.timeoutSeconds <= 5 ? data.payload.timeoutSeconds : false

    //Error if the id is invalid
    if (id) {
        //Error if nothing is sent to update
        if (protocol || url || method || successCodes || timeoutSeconds) {

            //Lookup the check
            _data.read('checks', id, (err, checkData) => {
                if (!err && checkData) {

                    //Get the token from the headers
                    const token = typeof (data.headers.token) == 'string' ? data.headers.token : false

                    //Verify that the given token is valid and belongs to the user who created the check
                    tokens.verifyToken(token, checkData.userPhone, (tokenIsValid) => {
                        if (tokenIsValid) {

                            //Update the check where necessary
                            if (protocol) {
                                checkData.protocol = protocol
                            }
                            if (url) {
                                checkData.url = url
                            }
                            if (method) {
                                checkData.method = method
                            }
                            if (successCodes) {
                                checkData.successCodes = successCodes
                            }
                            if (timeoutSeconds) {
                                checkData.timeoutSeconds = timeoutSeconds
                            }

                            //Store the new updates
                            _data.update('checks', id, checkData, (err) => {
                                if (!err) {
                                    callBack(200)
                                } else {
                                    callBack(500, { 'Error': 'Could not update the check' })
                                }
                            }
                            )

                        } else {
                            callBack(403, { 'Error': 'Missing required token in header, or token is invalid' })
                        }
                    })

                } else {
                    callBack(400, { 'Error': 'Check ID did not exist' })
                }
            })

        } else {
            callBack(400, { 'Error': 'Missing fields to update' })
        }

    } else {
        callBack(400, { 'Error': 'Missing required field' })
    }


}

module.exports.delete = (data, callBack) => {

    //Check that the id is valid
    const id = typeof (data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false

    if (id) {
        //Lookup the check
        _data.read('checks', id, (err, checkData) => {
            if (!err && checkData) {

                //Get the token from the headers
                const token = typeof (data.headers.token) == 'string' ? data.headers.token : false

                //Verify that the given token is valid for the phone number
                tokens.verifyToken(token, checkData.userPhone, (tokenIsValid) => {
                    if (tokenIsValid) {

                        //Delete the check data
                        _data.delete('checks', id, (err) => {
                            if (!err) {

                                //Lookup the user
                                _data.read('users', checkData.userPhone, (err, userData) => {
                                    if (!err && userData) {

                                        const userChecks = typeof (userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : []

                                        //Remove the deleted check from their list of checks
                                        const checkPosition = userChecks.indexOf(id)
                                        if (checkPosition > -1) {
                                            userChecks.splice(checkPosition, 1)
                                            //Re-save the user's data
                                            _data.update('users', checkData.userPhone, userData, (err) => {
                                                if (!err) {
                                                    callBack(200)
                                                } else {
                                                    callBack(500, { 'Error': 'Could not update the user' })
                                                }
                                            })
                                        } else {
                                            callBack(500, { 'Error': 'Could not find the check on the user object, so could not remove it' })
                                        }

                                    } else {
                                        callBack(500, { 'Error': 'Could not find the user who created the check, so could not remove the check from the list of checks on the user object' })
                                    }
                                })

                            } else {
                                callBack(500, { 'Error': 'Could not delete the check data' })
                            }
                        })

                    } else {
                        callBack(403, { 'Error': 'Missing required token in header, or token is invalid' })
                    }
                })

            } else {
                callBack(400, {
                    'Error': 'The specified check ID'

                }
                )
            }
        })

    } else {
        callBack(400, { 'Error': 'Missing required field' })
    }

}