'use strict'

const Router = require('koa-router')
const router = new Router()

// controllers
const user = require('./controllers/user')

// routers
router.get('/login', user.getSingIn)
router.get('/join', user.getSingUp)

router.get('/', (ctx, next)=>{
    ctx.body = 'Hello World!';
})

module.exports = router