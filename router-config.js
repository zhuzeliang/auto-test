'use strict'

const Router = require('koa-router')

const {
  util,
  video
} = require('./controllers')

const apiRouter = new Router({
  prefix: '/api'
})

exports.api = apiRouter
  .get('/wallpaper', util.wallpaper)
  .post('/upload', util.upload)
  .get('/video/list', video.list)
  .get('/video/toImg', video.toImg)
