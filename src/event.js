class CMDEvent {
    constructor(prefix) {
        this._events = {}
        this._prefix = /^!/
        this.middleware = next => next()
        this.prefix = prefix
    }

    on(eventName, match = /./, callback = () => { }, noPrefix) {
        this._events[eventName] = {
            match,
            callback,
            enabled: true,
            externalDisable: true,
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
        return new Promise((resolve, reject) => {
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
                            this.middleware(() => {
                                callback.apply(this, args)
                                resolve({ pass: true, name: eventName, data: this._events[eventName] })
                            })
                        } else {
                            callback.apply(this, args)
                            resolve({ pass: true, name: eventName, data: this._events[eventName] })
                        }
                        return
                    } catch (e) { reject(e) }
                }
            }
            resolve({ pass: false })
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
        let usedPrefix = this._prefix.exec(string)
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