'use strict'

const Koa = require('koa')
const render = require('koa-art-template')
const bodyParser = require('koa-bodyparser')
const session  = require('koa-generic-session')
const convert = require('koa-convert')
const serve = require('koa-static')
const onError = require('koa-onerror')
const logger = require('koa-logger')
const CSRF = require('koa-csrf')
const path = require('path');

//const csrf = require('./middlewares/csrf')
const router = require('./router')
const env = require('./env')

const app = new Koa()

app.keys = ['awesome-key']
onError(app)

app.use(serve(path.join(__dirname, 'public')))
app.use(logger())
app.use(convert(session()))
app.use(bodyParser())
app.use(new CSRF({
    invalidSessionSecretMessage: 'Invalid session secret',
    invalidSessionSecretStatusCode: 403,
    invalidTokenMessage: 'Invalid CSRF token',
    invalidTokenStatusCode: 403,
    excludedMethods: ['GET', 'HEAD', 'OPTIONS'],
    disableQuery: false
}))
render(app, {
    root: path.join(__dirname, 'views'),
    extname: '.art',
    debug: env.debug,
    cache: !env.debug,
    escape: true
});
app.use(router.routes()).use(router.allowedMethods())
app.use(async function (ctx, next) {
    const start = new Date()
    await next()
    const ms = new Date() - start
    ctx.set('X-Response-Time', `${ms}ms`)
})

app.listen(env.port, ()=>{
    console.log(`Koa2 started on port: ${env.port}`)
})
