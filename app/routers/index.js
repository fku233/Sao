'use strict'

const Router = require('koa-router')
const router = new Router()

// controllers
const user = require('../controllers/user')

// routers
router.get('/', (ctx, next)=>{
    ctx.body = 'Hello World!';
})
router.get('/login', user.getLogin)

module.exports = router