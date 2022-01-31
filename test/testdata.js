const _data = require('../lib/data')

_data.create('../test', 'newFile', { name: "me", lastName: "alsome" }, (err) => {
    console.log('Error creating file:', err)
})
setTimeout(() => {
    _data.read('../test', 'newFile', (err, data) => {
        console.log("Reading file:", JSON.stringify({ err, data }))
    })
}, 1000)
setTimeout(() => {
    _data.update('../test', 'newFile', { update: "data1" }, (err, data) => {
        console.log("Updating file", JSON.stringify({ err, data }))
    })
}, 2000)

setTimeout(() => {
    _data.delete('../test', 'newFile', (err) => {
        console.log(`Error deleting file: ${err}`)
    })
}, 3000)