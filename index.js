const { create, Client } = require('@open-wa/wa-automate')
const { nocache } = require('./src/uncache')
require('./handler.js')
const headless = false

function start(client = new Client()) {
  nocache('../handler.js', (_, module) => {
    console.log(`'${module}' Updated on ${new Date()}`)
  })
  
  client.onStateChanged((state) => {
    console.log('[Client State]', state)
    if (state === 'CONFLICT') client.forceRefocus()
  })

  client.onAnyMessage(message => {
    require('./handler.js')(client, message)
  })

  client.darkMode(true)

  // client.onAddedToGroup(({ groupMetadata: { id }, contact: { name } }) => {})
}

let options = {
  sessionId: process.argv[2],
  headless: headless,
  qrRefreshS: 20,
  qrTimeout: 0,
  authTimeout: 0,
  autoRefresh: true,
  restartOnCrash: start,
  cacheEnabled: false,
  // executablePath: execPath,
  useChrome: true,
  killProcessOnBrowserClose: true,
  throwErrorOnTosBlock: false,
  chromiumArgs: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--aggressive-cache-discard',
    '--disable-cache',
    '--disable-application-cache',
    '--disable-offline-load-stale-cache',
    '--disk-cache-size=0'
  ]
}
if (!headless) options['defaultViewport'] = null

create(options).then(start).catch(console.log)