const fileWriter = require('./lib/fileWriter')
const IPFS = require('./lib/ipfs')
const ipfs = new IPFS()
const fs = require('fs')
const path = require('path')

// Example data
let examplePath = 'examples'
let folder = path.join(__dirname, examplePath)


async function main () {
    ipfs.init(async function (err, response) {
        let directory = await ipfs.create(examplePath)

        let newDirectory = await ipfs.push(directory, folder)

        let files = await ipfs.get(newDirectory)

        fileWriter.write(files)

        process.exit()
    })
}

main()
