const handlers = require('./handlers')

//Router

const router = {
    ping: handlers.ping,
    users: handlers.users,
    notFound: handlers.notFound
}

module.exports = router