'use strict'

const mongoose = require('mongoose')

const Schema = mongoose.Schema

let user = new Schema({
    email: String,
    password: String,
    name: String,
    avatar: String,
    create_at: {type: Date, default: Date.now}
})

module.exports = mongoose.model('user', user)