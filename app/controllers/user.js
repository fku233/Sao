'use strict'

const models = require('../config/mongo')

const getSingIn = (ctx, next) => {
    ctx.render('sign_in.art', {
        title: '登录'
    })
}
const getSingUp = (ctx, next) => {
    ctx.render('sign_up.art', {
        title: '注册'
    })
}

const postSignUp = (ctx, next) => {
    ctx.body = '注册成功'
}

module.exports = {getSingIn, getSingUp}