/**
 * Request handlers
 * @todo - replace callbacks for async/await
 */

//Dependencies
const helpers = require('../helpers')


/**
 * HTML handlers
 */

const handlers = {}

//Index handler
handlers.index = (data, callback) => {

    if (data.method === 'get') {
        //Prepare data for interpolation
        const templateData = {
            'head.title': 'Uptime Monitoring - Made Simple',
            'head.description': 'We offer free, simple uptime monitoring for HTTP/HTTPS sites of all kinds. When your site goes down, we\'ll send you a text to let you know',
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

handlers.accountCreate = (data, callback) => {

    if (data.method === 'get') {
        //Prepare data for interpolation
        const templateData = {
            'head.title': 'Create an Account',
            'head.description': 'Signup is easy and only takes a few seconds',
            'body.class': 'accountCreate'
        }
        //Read in a template as a string
        helpers.getTemplate('accountCreate', templateData, (err, str) => {
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

handlers.sessionCreate = (data, callback) => {

    if (data.method === 'get') {
        //Prepare data for interpolation
        const templateData = {
            'head.title': 'Login to your Account',
            'head.description': 'Please enter your phone number and password to access your account',
            'body.class': 'sessionCreate'
        }
        //Read in a template as a string
        helpers.getTemplate('sessionCreate', templateData, (err, str) => {
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

//Edit your account
handlers.accountEdit = (data, callback) => {

    if (data.method === 'get') {
        //Prepare data for interpolation
        const templateData = {
            'head.title': 'Account Settings',
            'body.class': 'accountEdit'
        }
        //Read in a template as a string
        helpers.getTemplate('accountEdit', templateData, (err, str) => {
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

handlers.accountDeleted = (data, callback) => {

    if (data.method === 'get') {
        //Prepare data for interpolation
        const templateData = {
            'head.title': 'Account Deleted',
            'head.description': 'Your account has been deleted',
            'body.class': 'accountDeleted'
        }
        //Read in a template as a string
        helpers.getTemplate('accountDeleted', templateData, (err, str) => {
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

handlers.checksCreate = (data, callback) => {

    if (data.method === 'get') {
        //Prepare data for interpolation
        const templateData = {
            'head.title': 'Create a new check',
            'body.class': 'checksCreate'
        }
        //Read in a template as a string
        helpers.getTemplate('checksCreate', templateData, (err, str) => {
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

handlers.checksList = (data, callback) => {

    if (data.method === 'get') {
        //Prepare data for interpolation
        const templateData = {
            'head.title': 'Dashboard',
            'body.class': 'checksList'
        }
        //Read in a template as a string
        helpers.getTemplate('checksList', templateData, (err, str) => {
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

handlers.checksEdit = (data, callback) => {

    if (data.method === 'get') {
        //Prepare data for interpolation
        const templateData = {
            'head.title': 'Check Details',
            'body.class': 'checksEdit'
        }
        //Read in a template as a string
        helpers.getTemplate('checksEdit', templateData, (err, str) => {
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

handlers.sessionDeleted = (data, callback) => {

    if (data.method === 'get') {
        //Prepare data for interpolation
        const templateData = {
            'head.title': 'Logged out',
            'head.description': 'You have been logged out of your account',
            'body.class': 'sessionDeleted'
        }
        //Read in a template as a string
        helpers.getTemplate('sessionDeleted', templateData, (err, str) => {
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

module.exports = handlers