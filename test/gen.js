'use strict'

const fs = require('fs')
const path = require('path')

const config = {

  upload: {
    dir: '../public/upload/test',
    expire: {
      types: ['.json'],
      day: 1
    }
  }
}

fs.writeFileSync(path.resolve(__dirname, '../config/test.json'), JSON.stringify(config))
