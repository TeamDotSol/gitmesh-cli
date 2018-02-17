const IPFS = require('ipfs')

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

    async create () {
        try {
            let response = await this.node.object.new()
            return response.toJSON().multihash
        } catch (error) {
            throw new Error(`IPFS Create Error: ${error}`)
        }
    }

    async push (data) {
        try {
            let options = {
                Data: data,
                Links: []
            }
            let response = await this.node.object.put(options)
            return response.toJSON().multihash
        } catch (error) {
            throw new Error(`IPFS Create Error: ${error}`)
        }
    }

    async get (hash) {
        try {
            let response = await this.node.object.get(hash)
            return response.data.toString()
        } catch (error) {
            throw new Error(`IPFS Create Error: ${error}`)
        }
    }
}

module.exports = IpfsInterface
