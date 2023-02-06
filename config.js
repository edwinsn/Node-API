//Enviroment variables container

const enviroments = {}

//Default enviroment

enviroments.staging = {
    httpPort:"3000",
    httpsPort:"3001",
    name:"staging",
    hashingSecret: 'mySecretReallySecret'
}

//Production enviroment

enviroments.production = {
    httpPort:"8080",
    httpsPort:"4343",
    name:"production",
    hashingSecret: 'mySecretReallySecret'
}

//Export enviroment

const currentEnviroment = process.env.NODE_ENV?.toLowerCase() 

const enviromentToExport = enviroments[currentEnviroment] ? enviroments[currentEnviroment] : enviroments.staging

//Export the module

module.exports = enviromentToExport