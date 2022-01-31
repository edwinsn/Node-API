/**
 * Library for storing and editing data
 */

//Dependencies
const fs = require('fs')
const path = require('path')

//Container to be exported

const lib = {}

//Base directory

lib.baseDir = path.join(__dirname, '../.data/')

//write data to a file

lib.create = (dir, file, data, callback) => {
    //open the file
    fs.open(`${lib.baseDir}${dir}/${file}.json`, `wx`, (err, fileDescriptor) => {

        if (!err && fileDescriptor) {

            //Convert data to string    
            let stringData = JSON.stringify(data)

            //Write to file
            fs.writeFile(fileDescriptor, stringData, (err) => {

                if (!err) {

                    fs.close(fileDescriptor, (err) => {
                        if (!err) callback(false)
                        else callback('Error closing the file')
                    })

                } else {
                    callback('Error writing to new file')
                }
            })
        } else {
            callback(`Could not create a new file, it may already exist`)
        }
    })
}

// Read data from a file

lib.read = (dir, file, callback) => {
    fs.readFile(`${lib.baseDir}${dir}/${file}.json`, 'utf8', (err, data) => {
        callback(err, data)
    })
}

lib.update = (dir, file, data, callBack) => {
    //Open the file
    fs.open(`${lib.baseDir}${dir}/${file}.json`, 'r+', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {

            //String the data

            const stringData = JSON.stringify(data)

            fs.ftruncate(fileDescriptor, (err) => {
                if (!err) {
                    //Write to the file
                    fs.writeFile(fileDescriptor, stringData, () => {
                        if (!err) {
                            fs.close(fileDescriptor, (err) => {
                                if (!err) {
                                    callBack(false)
                                } else {
                                    callBack(`Error closing the file: ${err}`)
                                }
                            })
                        } else {
                            callBack(`Error writing: ${err}`)
                        }
                    })

                } else {
                    callBack(`Error trinctating file: ${err}`)
                }
            })
        } else {
            callBack("Err: could not open the file for update, it may not exist")
        }
    })
}

//Delete a file

lib.delete = (dir, file, callback) => {
    //Unlink the file
    fs.unlink(`${lib.baseDir}${dir}/${file}.json`, (err) => {
        if (!err) {
            callback(false)
        } else {
            callback(`Err deleting the file: ${err}`)
        }
    })
}

module.exports = lib