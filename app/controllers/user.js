'use strict'

const getLogin = (ctx, next) => {
    ctx.render('login.art',{
        title: '登录'
    })
}

module.exports = {getLogin}