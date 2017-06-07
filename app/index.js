'use strict'

const Koa = require('koa')
const render = require('koa-art-template');
const onError = require('koa-onerror')
const bodyParser = require('koa-bodyparser')
const logger = require('koa-logger')
const path = require('path');

const router = require('./routers/index')
// const models = require('./config/mongo')
const config = require('./config')

const app = new Koa()

render(app, {
    root: path.join(__dirname, 'views'),
    extname: '.art',
    debug: config.debug,
    cache: !config.debug,
    escape: true
});

app.use(logger())
app.use(bodyParser())
app.use(router.routes()).use(router.allowedMethods())

app.use(async function (ctx, next) {
    const start = new Date()
    await next()
    const ms = new Date() - start
    ctx.set('X-Response-Time', `${ms}ms`)
})

onError(app)

app.listen(config.port, ()=>{
    console.log(`Koa2 started on port: ${config.port}`)
})
