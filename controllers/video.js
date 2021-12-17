'use strict'

// const lineReader = require('line-reader')
const Ffmpeg = require('fluent-ffmpeg')

// const EventProxy = require('eventproxy')
const path = require('path')
const mkdirp = require('mkdirp')
const util = require('util')
const mime = require('mime')

const fs = require('fs')

// function getQueryString(url, name) {
//   const reg = new RegExp(`${name}=([^&|#]*)`, 'i')
//   const r = url.match(reg)
//   return r ? r[1] : null
// }

// function lineReaderEachLine(filename) {
//   let json = []

//   return new Promise(function(resolve, reject) {
//     lineReader.eachLine(filename, (line) => {
//       let lineJson = JSON.parse(line)
//       let messageJson = lineJson._source.message
//         ? JSON.parse(lineJson._source.message)
//         : {}

//       const { url, itemsId } = messageJson
//       const { currrentTime, src, errorCode } = messageJson.data
//       const itemObj = {
//         itemsId,
//         url,
//         currrentTime,
//         src,
//         errorCode
//       }
//       // if (!src) {
//       //   json.push(itemObj)
//       // }

//       if (src.includes('/upgcxcode')) {
//         itemObj.itemsId = getQueryString(itemObj.url, 'itemsId')
//         const hasItemsId = json.some(item => {
//           return item.itemsId === itemObj.itemsId
//         })
//         // if (!hasItemsId) {
//         //   json.push(itemObj)
//         // }
//         json.push(itemObj)

//         // if (!json.includes(itemObj.itemsId)) {
//         //   json.push(itemObj)
//         // }
//       }
//       // if (src.includes('/upgcxcode')) {
//       //   json.push(itemObj)
//       // }
//       // json.push(itemObj)
//     }, (err) => {
//       if (err) throw err
//       resolve(json)
//       console.log("I'm done!!")
//     }
//     )
//   })
// }

// function getVideoInfo(item, index) {
//   return new Promise((resolve, reject) => {
//     Ffmpeg.ffprobe(item.src, (err, video) => {
//       if (err) {
//         console.log('err', err)
//         resolve({...item})
//       }
//       const videoInfo = video ? video.format : {}
//       resolve({...item, ...videoInfo})
//     })
//   })
// }

// function getVideoInfoAll(items) {
//   return new Promise((resolve, reject) => {
//     let num = 0
//     const length = items.length
//     var ep = new EventProxy()
//     ep.after('getVideoInfo', length, (list) => {
//       console.log(`all done`)
//       resolve(list)
//     })
//     loopGet()
//     function loopGet() {
//       if (num < length) {
//         getVideoInfo(items[num]).then((res) => {
//           console.log(num)
//           ep.emit('getVideoInfo', res)
//           num++
//           loopGet()
//         })
//       }
//     }
//   })
// }

// function getVideosInfo(data) {
//   return new Promise((resolve, reject) => {
//     let proArrs = []
//     data.forEach((item, index) => {
//       proArrs[index] = new Promise((resolve, reject) => {
//         Ffmpeg.ffprobe(item.src, (err, video) => {
//           if (err) {
//             console.log('err', err)
//             resolve({...item})
//           }
//           const videoInfo = video ? video.format : {}
//           console.log(index)
//           resolve({...item, ...videoInfo})
//         })
//       })
//     })
//     Promise.all(proArrs).then((res) => {
//       console.log(`${proArrs.length} is all done`)
//       resolve(res)
//     })
//   })
// }

function generateStringVideoFrames(tempDirName) {
  return fs.readdirSync(tempDirName).sort().map(function(elem, index) {
    return base64Img(path.resolve(tempDirName, elem))
  })
}

function base64Img(src) {
  var data = fs.readFileSync(src).toString('base64')
  return util.format('data:%s;base64,%s', mime.lookup(src), data)
}

function saveVideoFrame(_path, data) {
  fs.writeFileSync(_path, data)
}

module.exports = class VideoController {
  static async list(ctx) {
    // var file = './public/videoerror.log'
    // const data = await lineReaderEachLine(file)
    // // var file = './public/json/video.json'
    // // var result = JSON.parse(fs.readFileSync(file))
    // // var file1 = './public/json/video1.json'
    // // var result1 = JSON.parse(fs.readFileSync(file1))
    // // const data = [...result.data, ...result1.data]

    // // const dataNew = data.filter(item => {
    // //   return item.bit_rate > 1024 * 1024 * 0.65
    // // })
    // // console.log(dataNew.length)
    // console.log(data.length)

    ctx.body = ctx.util.resuccess({})
  }

  static async toImg(ctx) {
    // const folder = './public/frame'
    let command = Ffmpeg('https://upos-sz-staticks3.bilivideo.com/mallboss/m210725a21a1otif4qft6r2o3hlz2phi.mp4')
      .fps(16)
      // .output(`${folder}/%d.png`)
      .on('progress', function(progress) {
        console.log('... frames: ' + progress.frames)
      })
      .on('end', function() {
        console.log('Finished processing')
        const json = {}
        json.frames = generateStringVideoFrames(tempDirName)
        saveVideoFrame('./public/frame.json', JSON.stringify(json))
      })
      .on('error', function(err, stdout, stderr) {
        console.log('Cannot process video: ' + err.message)
      })
      // .run()
    const startTime = 10
    const endTime = 300

    if (startTime) {
      command = command.seekInput(startTime)
    }
    if (endTime) {
      if (startTime > endTime) {
        console.log('Start time must be lower than end time')
      }
      command = command.duration(endTime - startTime)
    }

    const tempDirName = path.resolve('./public', 'frame')
    if (!fs.existsSync(tempDirName)) mkdirp.sync(tempDirName)

    // console.log(tempDirName)
    command.save(path.resolve(tempDirName, 'image-%0d.jpg'))

    ctx.body = ctx.util.resuccess({})
  }
}
