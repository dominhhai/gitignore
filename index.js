const os = require('os')
const commander = require('commander')
const sources = require('./lib/sources')
const fetch = require('./lib/fetch')

commander
  .version('1.0.0')
  .description('Quick fetch .gitignore file template')

commander
  .command('fetch <tpl>')
  .description('Fetch `tpl` .gitignore template')
  .option('-s, --source [source]', 'source name', 'github')
  .option('-d, --dest [dest]', 'project root', '.gitignore')
  .action(async function(tpl, options) {
    try {
      let destFile = await fetch.get({
        tpl,
        src: options.source || 'github',
        dest: options.dest || '.gitignore'
      })
      console.log('Downloaded "%s" template from "%s" to "%s"', tpl, options.source, destFile)
    } catch (error) {
      console.error('Can NOT fetch "%s" template from "%s" to "%s"', tpl, options.source, options.dest)
    }
  })

commander
  .command('list [src]')
  .description('List all available .gitignore template from source `src` (default: github)')
  .action(async function(src) {
    src = src || 'github'
    try {
      let files = await fetch.list(src)
      console.log(files.join(os.EOL), os.EOL)
      console.log('Total files:', files.length)
    } catch (error) {
      console.error(error);
      
      console.error('Can NOT list templates from "%s"', src)
    }
  })

commander
  .command('src-list')
  .description('List all available sources')
  .action(async function() {
    let srcList = await sources.load()
    console.log(srcList)
  })

commander
  .command('src-show <key>')
  .description('Show `key` source info')
  .action(async function(key) {
    let src = await sources.get(key)
    console.log(src)
  })

commander
  .command('src-add <key> <list> [file]')
  .description('Add/Update `key` source info with `list` and `file`')
  .action(async function(key, list, file) {
    await sources.add(key, {list, file})
    console.log('Updated "%s"', key)
  })

commander
  .command('src-del <key>')
  .description('Remove `key` source from source list')
  .action(async function(key) {
    await sources.del(key)
    console.log('Removed "%s" from source list', key)
  })

commander.parse(process.argv)