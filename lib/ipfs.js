const IPFS = require('ipfs')
const walk = require('fs-walk')
const when = require('when')
const fs = require('fs')

class IpfsInterface {
    constructor () {
        this.node = null
    }

    init (callback) {
        this.node = new IPFS()

        this.node.on('ready', function () {
            callback(null)
        })

        this.node.on('error', function (error) {
            callback(error, null)
        })
    }

    async create (path) {
        try {
            let response = await this.node.files.add({ path })
            return response[0].hash
        } catch (error) {
            throw new Error(`IPFS Push Error: ${error}`)
        }
    }

    getPath (directoryHash, relative, absolute) {
        let path = absolute.split(relative)
        return `${directoryHash}${path.pop()}`
    }

    async walkDirectory (directoryHash, path) {
        let promise = when.defer()
        let files = []
        walk.files(path, (basedir, filename, stat, next) => {
            let filePath = `${basedir}/${filename}`
            let pathName = this.getPath(directoryHash, path, filePath)
            let content = fs.readFileSync(filePath)
            files.push({ path: pathName, content })
            next()
        }, function (error) {
            if (error) {
                return promise.reject(err)
            } else {
                return promise.resolve(files)
            }
        })
        return promise.promise
    }

    getNewDirectoryHash (directory, files) {
        let data = files.filter((file) => { return file.path === directory })
        let newDirectory = data.pop()
        return newDirectory.hash
    }

    async push (directoryHash, path) {
        try {
            let files = await this.walkDirectory(directoryHash, path)
            let response = await this.node.files.add(files)
            return this.getNewDirectoryHash(directoryHash, response)
        } catch (error) {
            throw new Error(`IPFS Push Error: ${error}`)
        }
    }

    async get (directory) {
        try {
            return this.node.files.get(directory)
        } catch (error) {
            throw new Error(`IPFS Get Error: ${error}`)
        }
    }
}

module.exports = IpfsInterface
