const vm = require('vm')
const fs = require('fs')
const path = require('path')

/**
 * Update callback
 * @callback NoCacheCallback
 * @param {Boolean} isOk Ok
 * @param {String} module Module Name
 */

/**
 * Uncache if there is file change
 * @param {NodeModule} moduleName Module name or path
 * @param {NoCacheCallback} cb <optional> 
 */
function nocache(moduleName, cb = () => { }) {
    parent = path.dirname(module.parent.filename)
    console.log('Module', `'${moduleName}'`, 'is now being watched for changes')
    fs.watchFile(require.resolve(moduleName, {
        paths: [parent]
    }), async () => {
        try {
            isOk = await uncache(require.resolve(moduleName, {
                paths: [parent]
            }))
            cb(isOk, moduleName)
        } catch (e) {
            cb(false, e)
        }
    })
}

/**
 * Uncache a module
 * @param {NodeModule} module Module name or path
 */
function uncache(module = '.') {
    return new Promise((resolve, reject) => {
        try {
            const e = new vm.Script(fs.readFileSync(require.resolve(module)));
            if (e instanceof Error) throw e
            resolve(delete require.cache[require.resolve(module)])
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    nocache,
    uncache
}
