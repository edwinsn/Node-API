const handlers = require('./handlers')

//Router

const router = {
    ping: handlers.ping,
    users: handlers.users,
    notFound: handlers.notFound,
    tokens: handlers.tokens,
    checks: handlers.checks,
}

module.exports = router