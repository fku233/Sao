'use strict'

const mongoose = require('mongoose')

const Schema = mongoose.Schema

let activation = new Schema({
    email: String,
    ticket: String,
    status: {type: Number, default: 0},
    create_at: {type: Date, default: Date.now},
    update_at: {type: Date, default: Date.now}
})

module.exports = mongoose.model('activation', activation)