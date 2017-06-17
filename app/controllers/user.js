'use strict'

const utils = require('utility')
const uuid = require('uuid/v1')
const models = require('../config/mongo')
const mailer = require('../config/mailer')
const User = models.user
const Activation = models.activation

const getSingIn = (ctx, next) => {
    ctx.state.hello = 'world'
    ctx.render('sign_in.html', {
        title: '登录'
    })
}
const getSingUp = (ctx, next) => {
    ctx.render('sign_up.html', {
        title: '注册'
    })
}

const postSignUp = async (ctx, next) => {

    ctx.checkBody('name').optional().len(2, 30, "昵称的长度为2-30位")
    ctx.checkBody('email').isEmail('邮箱格式错误，请检查')
    ctx.checkBody('password').optional().len(6, 18, '密码长度应为6-18位').md5()

    if (ctx.errors) {
        ctx.response.body = {
            error: true,
            message: ctx.errors.map((error) => {
                return error[Object.keys(error)[0]]
            })
        }
        return
    }

    let name = ctx.request.body.name,
        email = ctx.request.body.email,
        password = ctx.request.body.password

    // 检查用户是否存在
    // `.exec()` 才会返回一个完整的 promise
    let user = await User.findOne({email: email}).exec()
    if (user) {
        ctx.response.body = {
            error: true,
            message: '注册失败，用户已存在'
        }
        return
    }

    // 插入新用户
    let newUser = new User({
        email: email,
        password: password,
        name: name,
        avatar_url: '',
        status: 0
    })
    try {
        await newUser.save()
    } catch (err) {
        return console.log(err)
    }
    ctx.response.body = {
        error: false,
        message: `注册成功，激活邮件已发送至:${email}`
    }
    sendActivationMail(name, email)
}

// 发送账号激活邮件
const sendActivationMail = async (name, email) => {
    const ticket = utils.hmac(uuid())
    console.log(`email:${email},ticket:${ticket}`)

    let act = new Activation({
        email: email,
        ticket: ticket
    })

    try {
        await act.save()
    } catch (err) {
        console.log(err)
        return
    }

    let mailOptions = {
        from: '"️SAO 账号激活" <710843409@qq.com>', // sender address
        to: email, // list of receivers
        subject: 'SAO激活邮件', // Subject line
        //text: '', // plain text body
        html: `<h2>${name}:</h2>\n您好，这是一封来SAO系统发送的邮件。\n
                <b>请复制或点击下方链接完成验证</b>：http://192.168.99.249/activation?ticket=${ticket}&email=${email}` // html body
    }
    mailer.sendMail(mailOptions)
}

const postSignIn = async (ctx, next) => {

    ctx.checkBody('email').isEmail('邮箱格式错误，请检查')
    ctx.checkBody('password').optional().len(6, 18, '密码长度应为6-18位').md5()

    if (ctx.errors) {
        ctx.response.body = {
            error: true,
            message: ctx.errors.map((error) => {
                return error[Object.keys(error)[0]]
            })
        }
        return
    }
    let email = ctx.request.body.email,
        password = ctx.request.body.password

    let user = await User.findOne({email: email}).exec()

    if (user == null || user.password !== password) {
        ctx.response.body = {
            error: true,
            message: '用户名或密码错误'
        }
        return
    }

    if (user.status === 0) {
        ctx.response.body = {
            error: true,
            message: '登录失败，该账号未激活'
        }
        return
    }

    ctx.state.user = user
    ctx.response.body = {
        error: false,
        message: '验证通过'
    }

}

const activation = async (ctx, next) => {
    console.log(ctx)
    ctx.checkQuery('email').notEmpty()
    ctx.checkQuery('ticket').notEmpty()
    if (ctx.errors) {
        ctx.response.body = '参数不正确'
    }

    let ticket = ctx.request.query.ticket,
        email = ctx.request.query.email

    let user = await User.findOne({email: email}).exec()
    if (user && user.status === 1) {
        ctx.response.body = '账户已经激活'
        return
    }

    let act = await Activation.findOne({email: email, ticket: ticket}).exec()
    if (act==null || act.status == 1) {
        ctx.response.body = 'ticket无效'
        return
    }
    try {
        await User.update({email: email}, {$set: {status: 1}}).exec()
    } catch (err) {
        console.log(err)
        return
    }
    try {
        await Activation.update({ticket: ticket}, {$set: {status: 1}}).exec()
    } catch (err) {
        console.log(err)
        return
    }

    ctx.status = 301
    ctx.redirect('/login')

}

module.exports = {getSingIn, getSingUp, postSignUp, postSignIn, activation}