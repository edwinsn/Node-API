/**
 * Request handlers
 * @todo - replace callbacks for async/await
 */

//Dependencies
const usersHandlers = require('./users')
const tokensHandlers = require('./tokens')
const checksHandlers = require('./checks')
const helpers = require('../helpers')

//Handlers

const handlers = {}

/**
 * HTML handlers
 */

//Index handler
handlers.index = (data, callback) => {

    if (data.method === 'get') {
        //Prepare data for interpolation
        const templateData = {
            'head.title': 'Uptime Monitoring - Made Simple',
            'head.description': 'We offer free, simple uptime monitoring for HTTP/HTTPS sites of all kinds. When your site goes down, we\'ll send you a text to let you know',
            'body.title': 'Hello templated world!',
            'body.class': 'index'
        }
        //Read in a template as a string
        helpers.getTemplate('index', templateData, (err, str) => {
            if (!err && str) {

                //Add the universal header and footer
                helpers.addUniversalTemplates(str, templateData, (err, str) => {

                    if (!err && str) {
                        //Return that page as HTML

                        callback(200, str, 'html')
                    } else {
                        callback(500, 'No found', 'html')
                    }

                });

            } else {
                callback(500, undefined, 'html')
            }
        })
    } else {
        callback(405, undefined, 'html')
    }
}

handlers.favicon = (data, callback) => {

    if (data.method === 'get') {
        //Read in the favicon's data
        helpers.getStaticAsset('favicon.ico', (err, data) => {
            if (!err && data) {
                //Callback the data
                callback(200, data, 'favicon')
            } else {
                callback(500)
            }
        })
    } else {
        callback(405)
    }

}

//Public assets
handlers.public = (data, callback) => {

    if (data.method === 'get') {
        //Get the filename being requested
        const trimmedAssetName = data.trimmedPath.replace('public/', '').trim()
        if (trimmedAssetName.length > 0) {
            //Read in the asset's data
            helpers.getStaticAsset(trimmedAssetName, (err, data) => {
                if (!err && data) {
                    //Determine the content type (default to plain text)
                    let contentType = 'plain'

                    if (trimmedAssetName.includes('.css')) {
                        contentType = 'css'
                    }

                    if (trimmedAssetName.includes('.png')) {
                        contentType = 'png'
                    }

                    if (trimmedAssetName.includes('.jpg')) {
                        contentType = 'jpg'
                    }

                    if (trimmedAssetName.includes('.ico')) {
                        contentType = 'favicon'
                    }

                    //Callback the data
                    callback(200, data, contentType)
                } else {
                    callback(404)
                }
            })
        } else {
            callback(404)
        }
    } else {
        callback(405)
    }


}


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