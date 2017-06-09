'use strict'

const mongoose = require('mongoose')
const config = require('../env')

mongoose.connect(`${config.mongodb.host}:${config.mongodb.port}/${config.mongodb.database}`)

let db = mongoose.connection

db.on('error', (err) => {
    console.error('MongoDB connection error:', err)
})

db.once('open', () => {
    console.info('MongoDB connected!')
})

// models
const user = require('../models/user')

module.exports = {user}