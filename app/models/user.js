'use strict'

const mongoose = require('mongoose')

const Schema = mongoose.Schema

let user = new Schema({
    email: {type: String, unique: true},
    password: String,
    name: String,
    avatar_url: String,
    status: Number,
    create_at: {type: Date, default: Date.now},
    update_at: {type: Date, default: Date.now}
})

module.exports = mongoose.model('user', user)