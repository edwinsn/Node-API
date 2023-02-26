const helpers = require('../helpers')
const _data = require('../data')

module.exports.post = (data, callBack) => {

    const phone = typeof (data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false
    const password = typeof (data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false

    if (phone && password) {
        //Search the user who matches the phone
        _data.read('users', phone, (err, userData) => {

            if (!err, userData) {

                //Compara passwords
                const hashedPassword = helpers.hash(password)
                if (hashedPassword === userData.hashedPassword) {

                    //create token
                    const tokenId = helpers.createRandomString(20)
                    const expires = Date.now() + 1000 * 60 * 60

                    const tokenObject = {
                        phone,
                        id: tokenId,
                        expires
                    }

                    //Store the token
                    _data.create('tokens', tokenId, tokenObject, (err) => {
                        if (!err) {
                            callBack(200, tokenObject)
                        }
                        else {
                            callBack(500, { 'Error': 'Could not create the new token' })
                        }
                    })

                } else {
                    callBack(400, { 'Error': 'Password did not match the specified user\'s stored password' })
                }

            } else {
                callBack(400, { 'Error': 'Could not find the specified user' })
            }

        })

    }
    else {
        callBack(400, { 'Error': 'Missing required fields' })
    }

}

module.exports.get = (data, callBack) => {

    //Check that the id is valid
    const id = typeof (data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false

    if (id) {
        //Lookup the token
        _data.read('tokens', id, (err, tokenData) => {
            if (!err && tokenData) {
                callBack(200, tokenData)
            }
            else {
                callBack(404)
            }
        })
    } else {
        callBack(400, { 'Error': 'Missing required field' })
    }

}

module.exports.put = (data, callBack) => {

    const id = typeof (data.payload.id) == 'string' && data.payload.id.trim().length == 20 ? data.payload.id.trim() : false
    const extend = typeof (data.payload.extend) == 'boolean' && data.payload.extend == true

    if (id && extend) {
        //Lookup the token
        _data.read('tokens', id, (err, tokenData) => {
            if (!err && tokenData) {
                //Check to make sure the token isn't already expired
                if (tokenData.expires > Date.now()) {
                    //Set the expiration an hour from now
                    tokenData.expires = Date.now() + 1000 * 60 * 60

                    //Store the new updates
                    _data.update('tokens', id, tokenData, (err) => {
                        if (!err) {
                            callBack(200)
                        }
                        else {
                            callBack(500, { 'Error': 'Could not update the token\'s expiration' })
                        }
                    })
                }
                else {
                    callBack(400, { 'Error': 'The token has already expired and cannot be extended' })
                }
            }
            else {
                callBack(400, { 'Error': 'Specified token does not exist' })
            }
        })
    } else {
        callBack(400, { 'Error': 'Missing required field(s) or field(s) are invalid' })
    }

}

module.exports.delete = (data, callBack) => {

    //Check that the id is valid
    const id = typeof (data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false

    if (id) {
        //Lookup the token
        _data.read('tokens', id, (err, data) => {
            if (!err && data) {
                _data.delete('tokens', id, (err) => {
                    if (!err) {
                        callBack(200)
                    }
                    else {
                        callBack(500, { 'Error': 'Could not delete the specified token' })
                    }
                })
            }
            else {
                callBack(400, { 'Error': 'Could not find the specified token' })
            }
        })
    } else {
        callBack(400, { 'Error': 'Missing required field' })
    }


}

module.exports.verifyToken = (id, phone, callBack) => {

    //Lookup the token
    _data.read('tokens', id, (err, tokenData) => {
        if (!err && tokenData) {
            //Check that the token is for the given user and has not expired
            if (tokenData.phone == phone && tokenData.expires > Date.now()) {
                callBack(true)
            }
            else {
                callBack(false)
            }
        }
        else {
            callBack(false)
        }
    })

}