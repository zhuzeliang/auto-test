'use strict'

const Router = require('koa-router')

const {
  util
} = require('./controllers')

const apiRouter = new Router({
  prefix: '/api'
})

exports.api = apiRouter
  .get('/wallpaper', util.wallpaper)
  .post('/upload', util.upload)
