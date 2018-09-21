const http = require('http')
const https = require('https')
const path = require('path')
const fs = require('fs')
const { URL } = require('url')
const sources = require('./sources')

/**
 * List all gitignore template files from a source
 * 
 * @param {String} src source name
 */
async function list(src='github') {
  let url = await sources.get(src)
  if (!url) return null

  url = url.list
  // src is url or dir
  let isUrl = url.startsWith('http://') || url.startsWith('https://')

  return new Promise((resolve, reject) => {
    if (!isUrl) {
      // from dir
      return fs.readdir(url, (err, files) => {
        if (err) return reject(err)
        return resolve(files)
      })
    }

    // from url
    const rq = url.startsWith('http://') ? http : https
    url = new URL(url)
    rq.get({
      host: url.host,
      path: url.pathname,
      headers: {'User-Agent': 'git-i'}
    }, res => {
      if (res.statusCode !== 200) return reject(res)
      let files = ''
      res.on('data', chunk => files += chunk)
      res.on('end', () => {
        try {
          files = JSON.parse(files)
            .map(val => val.name || '')
            .filter(val => val.endsWith('.gitignore'))
          return resolve(files)
        } catch (err) {
          return reject(err)
        }
      })
    }).on('error', reject)
  })
}

/**
 * Fetch a template
 * 
 * @param {String} src source name
 * @param {String} tpl template name
 * @param {String} dest Dest to save template
 */
async function get({src='github', tpl='Node', dest='.gitignore'}) {
  let url = await sources.get(src)
  if (!url) return null
  url = url.file

  let srcFile = tpl
  if (!srcFile.endsWith('.gitignore')) {
    srcFile = srcFile + '.gitignore'
  }
  let destFile = dest
  if (!destFile.endsWith('.gitignore')) {
    destFile = path.join(destFile, '.gitignore')
  }

  // src is url or dir
  let isUrl = url.startsWith('http://') || url.startsWith('https://')

  return new Promise((resolve, reject) => {
    if (!isUrl) {
      // from dir
      return fs.copyFile(path.join(url, srcFile), destFile, err => {
        if (err) return reject(err)
        return resolve(destFile)
      })
    }
  
    // from url
    const rq = url.startsWith('http://') ? http : https
    rq.get(url +'/'+ srcFile, res => {
      if (res.statusCode !== 200) return reject(res)
      res.pipe(fs.createWriteStream(destFile))
      return resolve(destFile)
    }).on('error', reject)
  })
}

module.exports = {
  list,
  get
}