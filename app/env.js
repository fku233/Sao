'use strict'

const env = {
    debug: true,
    port: 3000,
    mongodb: {
        host: '127.0.0.1',
        port: '27017',
        database: 'sao'
    },
    mailer: {
        host: 'smtp.qq.com',
        secureConnection: true,
        port: 465,
        auth: {
            user: '',
            pass: ''
        }
    }
}

module.exports = env;