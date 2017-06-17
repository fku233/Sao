'use strict'

const mongoose = require('mongoose')
const promise = require('bluebird')
const env = require('../env')

mongoose.connect(`${env.mongodb.host}:${env.mongodb.port}/${env.mongodb.database}`)
// mongoose 内置的 promise 库已经移除啦，这里用 bluebird
mongoose.Promise = promise
let db = mongoose.connection

db.on('error', (err) => {
    console.error('MongoDB connection error:', err)
})

db.once('open', () => {
    console.info('MongoDB connected!')
})

// models
const user = require('../models/user')
const activation = require('../models/activation')

module.exports = {user,activation}