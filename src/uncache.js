const fs = require('fs')

/**
 * Uncache if there is file change
 * @param {string} module Module name or path
 * @param {function} cb <optional> 
 */
function nocache(module, cb = () => { }) {
    console.log('Module', `'${module}'`, 'is now being watched for changes')
    fs.watchFile(require.resolve(module), async () => {
        isOk = await uncache(require.resolve(module))
        cb(isOk, module)
    })
}

/**
 * Uncache a module
 * @param {string} module Module name or path
 */
function uncache(module = '.') {
    return new Promise((resolve, reject) => {
        try {
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