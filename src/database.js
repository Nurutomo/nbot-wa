const path = require('path')
const fs = require('fs')

class Database {
    constructor(filepath) {
        this.file = path.resolve(path.join('./database', filepath))
        this.load()
    }

    get data() {
        return this._data
    }

    set data(value) {
        this._data = value
        this.save()
    }

    load() {
        if (fs.existsSync(this.file)) this._data = JSON.parse(fs.readFileSync(this.file))
        else this._data = {}
        return this._data
    }

    save() {
        let dirname = path.dirname(this.file)
        if (!fs.existsSync(dirname)) {
            fs.mkdirSync(dirname, { recursive: true })
        }
        fs.writeFileSync(this.file, JSON.stringify(this._data))
    }
}

class GroupData extends Database {
    constructor() {
        super('groups.json')
    }

    update(groupId, groupMetadata) {
        if (this.data[groupId]) {
            if (groupMetadata && groupMetadata.participants) {
                let member = this.data[groupId].member
                for (let user of groupMetadata.participants) {
                    if (!this.data[groupId].member[user.id]) member[user.id] = { ...user, role: 0 }
                }
                this.data[groupId] = {
                    ...this.data[groupId],
                    member,
                }
                this.save()
                return this.data[groupId]
            } else return false
        }
        this.data[groupId] = {
            broadcast: false,
            member: {},
            notes: '',
        }
        this.setMemberRole(groupId, 0, '?', true)
        if (groupMetadata && groupMetadata.participants) {
            let member = {}
            for (let user of groupMetadata.participants) member[user.id] = { ...user, role: 0 }
            this.data[groupId] = {
                ...this.data[groupId],
                member,
            }
        }
        this.save()
        return this.data[groupId]
    }

    setRole(groupId, index, key, value) {
        if (!this.data[groupId]) return false
        if (!this.data[groupId].roles) {
            this.data[groupId].roles = [{
                id: 0,
                name: 'Member'
            }]
        }
        if (!this.data[groupId].roles[index]) {
            this.data[groupId].roles.push({
                id: 0,
                name: 'Member'
            })
            return this.data[groupId].roles[this.data[groupId].roles.length - 1][key] = value
        }
        return this.data[groupId].roles[index][key] = value
    }


    /**
     * Is group allowed to receive broadcast?
     * @param {string} groupId
     * @returns {boolean}
     */
    isAllowBroadcast(groupId) {
        if (!this.data[groupId]) return false
        return this.data[groupId].broadcast || false
    }

    /**
     * Set group is allowed to receive broadcast
     * @param {string} groupId 
     * @param {boolean} condition 
     * @returns {boolean}
     */
    setAllowBroadcast(groupId, condition) {
        if (!this.data[groupId]) return false
        return this.data[groupId].broadcast = condition
    }

    /**
     * Get Member Role
     * @param {string} groupId 
     * @param {string} id 
     * @returns {number}
     */
    getMemberRole(groupId, id) {
        if (!this.data[groupId]) return false
        if (!this.data[groupId].member) return false
        if (!this.data[groupId].member[id]) return false
        return this.data[groupId].member[id].role || 0
    }

    /**
     * Set Member Role
     * @param {string} groupId 
     * @param {boolean} condition 
     * @returns {Number}
     */
    setMemberRole(groupId, id, level) {
        if (!this.data[groupId]) return false
        if (!this.data[groupId].member) return false
        if (!this.data[groupId].member[id]) return false
        return this.data[groupId].member[id].role = Math.floor(Math.max(level, 0))
    }

    /**
     * Get Group Peraturan
     * @param {string} groupId 
     */
    getNotes(groupId) {
        if (!this.data[groupId]) return false
        return this.data[groupId].notes || ''
    }

    /**
     * Set Group Peraturan
     * @param {string} groupId 
     */
    setNotes(groupId, notes) {
        if (!this.data[groupId]) return false
        return this.data[groupId].notes = notes
    }

    getRoleById(groupId, id) {
        if (!this.data[groupId]) return false
        if (!this.data[groupId].roles) return false
        return this.data[groupId].roles.filter(role => role.id == id)
    }

    getUsersRoleById(groupId, id) {
        if (!this.data[groupId]) return false
        if (!this.data[groupId].member) return false
        return Object.values(this.data[groupId].member).filter(user => user.role == id)
    }

    permission(groupId, id, name) {
        if (!this.data[groupId]) return true
        if (!this.data[groupId].member) return true
        if (!this.data[groupId].member[id]) return true
        if (this.data[groupId].member[id].isAdmin) return true
        if (!this.data[groupId].roles) return true
        if (this.data[groupId].roles.length < 1) return true
        let roleId = this.getMemberRole(groupId, id)
        let roles = this.data[groupId].roles.filter(role => role.id == roleId)
        console.log(roleId, roles)
        if (roles.length == 0) return true
        let isAllowed = false
        for (let isOk of roles) {
            isAllowed = isAllowed || (isOk.hasOwnProperty(name) && isOk[name]) || (!isOk.hasOwnProperty(name))
        }
        return isAllowed
    }
}

class UserData extends Database {
    constructor() {
        this.super('users.json')
    }
}

module.exports = {
    GroupData,
    UserData
}
delete require.cache[require.resolve(__filename)]
