'use strict'

const mongoose = require('mongoose')

const Schema = mongoose.Schema

let user = new Schema({
    email: String,
    password: String,
    name: String,
    avatar_url: String,
    create_at: {type: Date, default: Date.now},
    update_at: {type: Date, default: Date.now}
})

module.exports = mongoose.model('user', user)