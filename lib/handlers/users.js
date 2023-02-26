
const { deflateRawSync } = require("zlib")
const _data = require('../data')
const helpers = require('../helpers')
const tokens = require('./tokens')

//Users get

module.exports.get = (data, callBack) => {

    //Check that the phone number is valid
    const phone = typeof (data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false

    if (phone) {

        //Get the token from the headers
        const token = typeof (data.headers.token) == 'string' ? data.headers.token : false

        //verify that the given token is valid for the phone number
        tokens.verifyToken(token, phone, (tokenIsValid) => {
            if (tokenIsValid) {
                //Lookup the user
                _data.read('users', phone, (err, data) => {
                    if (!err && data) {
                        //Remove the hashed password from the user object before returning it to the requester
                        delete data.hashedPassword
                        callBack(200, data)
                    }
                    else {
                        callBack(404)
                    }
                })
            }
            else {
                callBack(403, { 'Error': 'Missing required token in header, or token is invalid' })
            }
        })

    } else {
        callBack(400, { 'Error': 'Missing required field' })
    }

}
//Users post

module.exports.post = (data, callBack) => {

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

module.exports.put = (data, callBack) => {

    //Check the required fields were passed
    const phone = typeof (data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false

    //Check for the optional fields
    const firstName = typeof (data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false
    const lastName = typeof (data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false
    const password = typeof (data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false

    //Error if the phone is invalid
    if (phone) {

        if (firstName || lastName || password) {

            const token = typeof (data.headers.token) == 'string' ? data.headers.token : false

            //verify that the given token is valid for the phone number
            tokens.verifyToken(token, phone, (tokenIsValid) => {
                if (tokenIsValid) {

                    //Lookup the user
                    _data.read('users', phone, (err, userData) => {
                        if (!err && userData) {

                            //Update the fields necessary
                            if (firstName) {
                                userData.firstName = firstName
                            }
                            if (lastName) {
                                userData.lastName = lastName
                            }
                            if (password) {
                                userData.hashedPassword = helpers.hash(password)
                            }

                            //Store the new updates
                            _data.update('users', phone, userData, (err) => {
                                if (!err) {
                                    callBack(200)
                                }
                                else {
                                    console.log(err)
                                    callBack(500, { 'Error': 'Could not update the user' })
                                }
                            })

                        } else {
                            callBack(400, { 'Error': 'The specified user does not exist' })
                        }
                    });

                }
                else {
                    callBack(403, { 'Error': 'Missing required token in header, or token is invalid' })
                }
            })

        } else {
            callBack(400, { 'Error': 'Missing fields to update' })
        }

    } else {
        callBack(400, { 'Error': 'Missing required field' })
    }

}
//Users delete

module.exports.delete = (data, callBack) => {

    //Check that the phone number is valid
    const phone = typeof (data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false

    if (phone) {

        //Lookup the user
        _data.read('users', phone, (err, data) => {
            if (!err && data) {

                _data.delete('users', phone, (err) => {
                    if (!err) {
                        //Delete each of the checks associated with the user
                        const userChecks = typeof (data.checks) == 'object' && data.checks instanceof Array ? data.checks : []
                        const checksToDelete = userChecks.length

                        if (checksToDelete > 0) {
                            let checksDeleted = 0
                            let deletionErrors = false

                            //Loop through the checks
                            userChecks.forEach(checkId => {
                                //Delete the check
                                _data.delete('checks', checkId, (err) => {
                                    if (err) {
                                        deletionErrors = true
                                    }
                                    checksDeleted++
                                    if (checksDeleted == checksToDelete) {
                                        if (!deletionErrors) {
                                            callBack(200)
                                        }
                                        else {
                                            callBack(500, { 'Error': 'Errors encountered while attempting to delete all of the user\'s checks. All checks may not have been deleted from the system successfully' })
                                        }
                                    }
                                })
                            })
                        }

                        callBack(200)
                    }
                    else {
                        callBack(500, { 'Error': 'Could not delete the specified user' })
                    }
                })

            }
            else {
                callBack(400, { 'Error': 'Could not find the specified user' })
            }
        })

    } else {
        callBack(400, { 'Error': 'Missing required field' })
    }


}