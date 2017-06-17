'use strict'

const nodemailer = require('nodemailer')
const env = require('../env')

let transporter = nodemailer.createTransport(env.mailer)

const sendMail = (mailOptions)=>{
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error)
        }
        console.log('Message %s sent: %s', info.messageId, info.response)
    })
}

module.exports = {sendMail}