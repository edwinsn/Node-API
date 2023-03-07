//Enviroment variables container

const enviroments = {}

//Default enviroment

enviroments.staging = {
    httpPort: "3000",
    httpsPort: "3001",
    name: "staging",
    hashingSecret: 'mySecretReallySecret',
    maxChecks: 5,
    twilio: {
        accountSid: 'AC4a93f03753a1c507b3f4ebea7feb4998',
        authToken: 'db4bbf1b98d85cb0e3ecaf21998ea8af',
        fromPhone: '+1 270 679 1185'
    },
    templateGlobals: {
        appName: 'UptimeChecker',
        companyName: 'Company, Inc.',
        yearCreated: '2021',
        baseURL: 'http://localhost:3000/',
        siteName: 'UptimeChecker',
    }
}

//Production enviroment

enviroments.production = {
    httpPort: "8080",
    httpsPort: "4343",
    name: "production",
    hashingSecret: 'mySecretReallySecret',
    maxChecks: 5,
    twilio: {
        accountSid: 'AC4a93f03753a1c507b3f4ebea7feb4998',
        authToken: 'db4bbf1b98d85cb0e3ecaf21998ea8af',
        fromPhone: '+1 270 679 1185'
    },
    templateGlobals: {
        appName: 'UptimeChecker',
        companyName: 'Company, Inc.',
        yearCreated: '2021',
        baseURL: 'http://localhost:3001/',
        siteName: 'UptimeChecker',
    }
}

enviroments.testing = {
    httpPort: "4000",
    httpsPort: "4001",
    name: "testing",
    hashingSecret: 'mySecretReallySecret',
    maxChecks: 5,
    twilio: {
        accountSid: 'AC4a93f03753a1c507b3f4ebea7feb4998',
        authToken: 'db4bbf1b98d85cb0e3ecaf21998ea8af',
        fromPhone: '+1 270 679 1185'
    },
    templateGlobals: {
        appName: 'UptimeChecker',
        companyName: 'Company, Inc.',
        yearCreated: '2021',
        baseURL: 'http://localhost:3001/',
        siteName: 'UptimeChecker',
    }
}

//Export enviroment

const currentEnviroment = process.env.NODE_ENV?.toLowerCase()

const enviromentToExport = enviroments[currentEnviroment] ? enviroments[currentEnviroment] : enviroments.staging

//Export the module

module.exports = enviromentToExport