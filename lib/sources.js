const os = require('os')
const path = require('path')
const fs = require('fs')

const SRC_FILE = path.join(os.homedir(), '.gitignores.json')

/**
 * Load list of sources from json file
 */
function load() {
  return new Promise(r => {
    fs.readFile(SRC_FILE, (err, data) => {
      let srcList = err ? {} : JSON.parse(data)
      srcList.github = {
        list: 'https://api.github.com/repos/github/gitignore/contents',
        file: 'https://raw.githubusercontent.com/github/gitignore/master'
      }
      return r(srcList)
    })
  })
}

/**
 * Write source list to json file
 * 
 * @param {Object} data list of sources
 */
function write(data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(SRC_FILE, JSON.stringify(data), err => {
      if (err) return reject(err)
      return resolve(SRC_FILE)
    })
  })
}

/**
 * Get source
 * 
 * @param {String} key source name
 */
async function get(key='github') {
  const srcList = await load()
  return srcList[key]
}

/**
 * Add/Update source
 * 
 * @param {String} key source name
 * @param {Object} src source { list, file }
 */
async function add(key, src) {
  if (!src.file) src.file = src.list
  
  const srcList = await load()
  srcList[key] = src
  return write(srcList)
}

/**
 * Remove source
 * @param {String} key source name
 */
async function del(key) {
  const srcList = await load()
  delete srcList[key]
  return write(srcList)
}

module.exports = {
  load,
  get,
  add,
  del
}