const chalk = require('chalk')
function color(text, color) {
    return !color ? chalk.green(text) : color.startsWith('#') ? chalk.hex(color)(text) : chalk.keyword(color)(text)
}

class CMDEvent {
    constructor(prefix) {
        this._events = {}
        this._prefix = /^!/
        this.middleware = next => next()
        this.prefix = prefix
    }

    on(eventName, match = /./, callback = () => { }, noPrefix) {
        console.log(color('[CMD]'), `Re${this._events[eventName] ? ' - re' : ''}gister command ${color(eventName, 'green')}`)
        if (!this._events[eventName]) this._events[eventName] = {
            match,
            callback,
            enabled: true,
            externalDisable: true,
            noPrefix,
        }
        else this._events[eventName] = {
            ...this._events[eventName],
            match,
            callback,
            noPrefix,
        }
    }

    enable(name = '', bool = true, isExternal) {
        if (!this._events[name]) return false
        if (isExternal) this._events[name].externalDisable = bool
        else this._events[name].enabled = bool
        return true
    }

    check(string = '', lower = true, ...args) {
        return new Promise(async (resolve, reject) => {
            let parsed = this._parseCmd(string)
            this.args = parsed.args
            let body = this.command = lower ? parsed.command.toLowerCase() : parsed.command
            this.text = parsed.text
            this.url = parsed.url
            this.usedPrefix = parsed.usedPrefix
            for (let eventName in this._events) {
                let { match, callback, enabled, externalDisable, noPrefix } = this._events[eventName]
                if (noPrefix) body = lower ? string.toLowerCase() : string
                let test = (match instanceof RegExp) ? match.test(body) : (Array.isArray(match)) ? match.includes(body) : match === body
                if (test && enabled) {
                    try {
                        if (externalDisable) {
                            this.middleware(async () => {
                                await resolve({ pass: true, known: true, name: eventName, data: this._events[eventName] })
                                try {
                                    callback.call(this, ...args)
                                } catch (e) {
                                    e.usedPrefix = this.usedPrefix
                                    reject(e)
                                }
                            }, eventName, this._events[eventName])
                        } else {
                            await resolve({ pass: true, known: true, name: eventName, data: this._events[eventName] })
                            callback.call(this, ...args)
                        }
                        return
                    } catch (e) {
                        e.usedPrefix = cmd.usedPrefix
                        reject(e)
                    }
                }
            }
            if (this.usedPrefix) resolve({ pass: true, known: false })
            else resolve({ pass: false, known: false })
        })
    }

    set prefix(input = '') {
        if (input instanceof RegExp) return this._prefix = input
        else return this._prefix = new RegExp('^' + input)
    }

    get prefix() {
        return this._prefix
    }

    _parseCmd(string = '') {
        let usedPrefix = '' + this._prefix.exec(string)
        let args = string.replace(this._prefix, '').split(' ')
        if (args[0] === '') args.shift()
        let command = args.shift() || ''

        return {
            usedPrefix,
            command,
            args,
            text: args.join(' '),
            url: args[0],
        }
    }
}

module.exports = CMDEvent
