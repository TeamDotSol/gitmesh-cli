const fs = require('fs')
const pathUtil = require('path')

// file identifiers
const REPOSITORIES = 'repositories'
const DIRECTORY = 'dir'
const FILE = 'file'

function makeMainDir () {
    path = pathUtil.join(__dirname, '..', REPOSITORIES)
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path)
    }
}

function makeDir (path) {
    path = pathUtil.join(__dirname, '..', REPOSITORIES, path)
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path)
    }
}

function makeFile (path, data) {
    path = pathUtil.join(__dirname, '..', REPOSITORIES, path)
    fs.writeFileSync(path, data.toString())
}

function write (files) {
    // Write repository directory if it doesn't exist
    makeMainDir()

    for (let data of files) {
        if (data.type === DIRECTORY) {
            makeDir(data.path)
        } else if (data.type === FILE) {
            makeFile(data.path, data.content)
        }
    }
}

module.exports = {
    write
}
