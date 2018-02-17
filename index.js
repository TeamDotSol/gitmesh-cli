const IPFS = require('./lib/ipfs')
const ipfs = new IPFS()
const fs = require('fs')
const path = require('path')

// Example data
let folder = path.join(__dirname, 'examples')
console.log(folder)
let content = fs.readFileSync(folder)

async function main () {
    ipfs.init(async function (err, response) {
        console.log('done init')

        let create = await ipfs.create()
        console.log('create hash', create)

        let push = await ipfs.push(content)
        console.log('push hash', push)

        let get = await ipfs.get(push)
        console.log(get)
    })
}

main()
