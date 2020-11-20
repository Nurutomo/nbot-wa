// Config
var config = {
    botName: '🔹 𝙉 O T 🔹',
    operator: ['6281515860089'].map(id => id.replace(/[^\d]/g, '') + '@c.us'),
    prefix: process.env.prefix ? new RegExp('^' + process.env.prefix) : /^[!@#$%^&.\/\\^]/,
    downloadStatus: false, // Curi Status Orang :|
    msg: {
        notAdmin: '🔰 Maaf anda bukan admin grup',
        notGroup: '👨‍👩‍👧‍👦 Fitur ini hanya bisa digunakan di grup',
        notBotAdmin: '🔰 Bot belum menjadi admin grup',
        notURL: '🌐 Tidak ada URL',
        noMedia: '📷 Tidak ada Media',
        noArgs: '❓ Tidak ada argumen',
        noJid: '❓ Tidak ada @user yang disebut',
        notAllowed: `❌ Fitur ini tidak bisa kamu gunakan`,
        add: '➕ Menambahkan:\n',
        remove: '➖ Mengeluarkan:\n',
        promote: '🔰 Menambahkan:\n',
        demote: '🙍‍♂️ Menurunkan:\n',
        self: 'Kok aku?',
        dev: '👨‍💻 Fitur masih dalam tahap pengembangan 🔧',
        devOff: '🔧 Fitur dinonaktifkan oleh developer',
        groupOff: '❌ Fitur dinonaktifkan untuk grup ini',
        success: '✅ Sukses',
        success: '❌ Gagal',
        list: value => `- ${value}`,
        listUser: user => `- @${user}`,
        promoteEach: user => `- @${user} menjadi Admin 🔰`,
        demoteEach: user => `- @${user} menjadi Member 🙍‍♂️`,
        promoteFail: user => `- @${user} sudah menjadi Admin 🔰`,
        demoteFail: user => `- @${user} sudah menjadi Member 🙍‍♂️`,
        promoteFormat: (success, failed) => config.msg.promote + success.map(config.msg.promoteEach).join('\n') + '\n' + failed.length > 0 ? failed.map(config.msg.promoteFail).join('\n') : '',
        demoteFormat: (success, failed) => config.msg.demote + success.map(config.msg.demoteEach).join('\n') + '\n' + failed.length > 0 ? failed.map(config.msg.demoteFail).join('\n') : '',
        yt: (title, filesize) => `*${title}*\n\n💾 Filesize: ${filesize}`,
        recommend: (prefix, command) => `Direkomendasikan pakai *${prefix + command}*`,
        sizeExceed: size => `❌ Ukuran file melebihi batas yang ditentukan\n💾 Filesize: *${size}*\n📈 Limit: *${config.sizeLimit} MB*`,
        waitConvert: (a, b, desc) => `⏱ Tunggu beberapa detik!\nSedang melakukan proses konversi *${a}* → *${b}*${desc ? `\n\n${desc.split('\n').map(v => `_${v}_`).join('\n')}` : ''}`,
        broadcast: (sender, msg) => `📢 *BROADCAST* 📢\n_From: @${sender.id}_\n\n${msg}`,
        error: e => `⚠ *ERROR* ⚠\n\n${e}`,
        ytsearch: item => {
            switch (item.type) {
                case 'video':
                    return `
*${item.type}*
├> Judul: ${item.title}
├> Durasi: ${item.duration[0]} (${item.duration[1]})
├> Channel: ${item.author.name} ${item.author.verified ? item.author.verified == 'artist' ? '🎶' : '✅' : ''}
├> Link: ${item.link}
├> Deskripsi: ${item.description}
`.slice(1, -1)
                case 'channel':
                    return `
*${item.type}*
├> Nama: ${item.title} ${item.verified ? item.verified == 'artist' ? '🎶' : '✅' : ''}
├> Jumlah Video: ${item.videoCount}
├> Subscriber: ${item.subscriberCount}
├> Link: ${item.link}
├> Deskripsi: ${item.description}
`.slice(1, -1)
            }
        }
    },
    iklan: [
        'Anda butuh API? Sini aja:v https://st4rz.herokuapp.com (Iklan by https://wa.me/6285221100126)',
        // 'Grup: https://chat.whatsapp.com/EN08hYxatxgJXdxo9dsART',
        'Github: https://github.com/Nurutomo/nbot-wa',
        'API: https://repl.it/@Nurutomo/MhankBarBar-Api',
    ],
    stickerGIF: {
        fps: 30, // Lumayan
        quality: 1, // Buriq?
        target: '1M',
        duration: 15 // Detik (Durasi Maksimal)
    },
    sizeLimit: '50', // Megabytes
    API: {
        mhankbarbar: {
            url: 'https://mhankbarbar-api--nurutomo.repl.co',
            yta: '/api/yta',
            ytv: '/api/ytv',
            ig: '/api/ig',
            nulis: '/nulis',
        }
    }
}


/*    Modules List    */

// Built-in Modules
const fs = require('fs')
const path = require('path')
const util = require('util')
const { Readable, Writable } = require('stream')

// Local Modules
const { GroupData } = require('./src/database')
const _event = require('./src/event')
const group = new GroupData()
const cmd = new _event()
cmd.prefix = config.prefix

// External Modules
const sharp = require('sharp')
const chalk = require('chalk')
const { JSDOM } = require('jsdom')
const fetch = require('node-fetch')
const FormData = require('form-data')
const tree = require('tree-node-cli')
const puppeteer = require('puppeteer')
const ffmpeg = require('fluent-ffmpeg')
const text2image = require('text2image')
const moment = require('moment-timezone')
const { fromBuffer } = require('file-type')
const { sizeFormatter } = require('human-readable')
const translate = require('google-translate-open-api')
const { decryptMedia, Client } = require('@open-wa/wa-automate')
// const  = require('')

moment.tz.setDefault('Asia/Jakarta').locale('id')
const format = sizeFormatter({
    std: 'JEDEC', // 'SI' (default) | 'IEC' | 'JEDEC'
    decimalPlaces: 2,
    keepTrailingZeroes: false,
    render: (literal, symbol) => `${literal} ${symbol}B`,
})

// Internal Modules
const AsyncFunction = Object.getPrototypeOf(async function () { }).constructor

// Variables
const ytIdRegex = /(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:watch\?.*(?:|\&)v=|embed\/|v\/)|youtu\.be\/)([-_0-9A-Za-z]{11})/
const chromeText = bgColor(color(`[${color('Ch', '#1DA462') + color('ro', '#DD5144') + color('me', '#FFCD46')}]`, '#4C8BF5'), '#112')

module.exports = async (client = new Client(), message) => {
    try {
        let { body, type, id, from, to, t, sender, isGroupMsg, chat, caption, isMedia, mimetype, quotedMsg, quotedMsgObj, mentionedJidList, author } = message
        if (sender && sender.isMe) from = to

        if (config.downloadStatus && from.startsWith('status')) { // Curi status orang:v
            let dir = path.join('./database/status/', (await client.getHostNumber()))
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
            let filename = t + (sender ? `_${(sender.formattedName || sender.verifiedName || sender.pushname)}` : '') + '_' + author.replace('@c.us', '') + (sender && sender.pushname ? `_${sender.pushname}` : '')
            filename = filename.replace(/[\\\/\:\*\?\"\<\>\|]/g, '_')
            if (mimetype) { // Foto/Video?
                fs.writeFile(path.join(dir, filename + mimetype.replace(/.*\//, '.')), (await decryptMedia(message)).toString('binary'), { encoding: 'binary' }, err => {
                    if (err) console.error(err)
                })
                if (caption) { // Cek Caption
                    fs.writeFile(path.join(dir, filename + '.txt'), caption, err => {
                        if (err) console.error(err)
                    })
                }
            } else { // Teks Biasa
                let { textColor, backgroundColor, font } = message
                textColor = textColor.toString(16)
                backgroundColor = backgroundColor.toString(16)
                fs.writeFile(path.join(dir, filename + '.txt'), `${body}\n${'-'.repeat(25)}\nText: #${textColor}\nBackground: #${backgroundColor}\nFont: ${font}`, err => {
                    if (err) console.error(err)
                })
            }
        }

        const { name, formattedTitle } = chat
        let { pushname, verifiedName, formattedName } = sender || { pushname: null, verifiedName: null, formattedName: null }
        pushname = pushname || verifiedName || formattedName // verifiedName is the name of someone who uses a business account
        const botNumber = await client.getHostNumber() + '@c.us'
        const groupId = isGroupMsg && chat.groupMetadata ? chat.groupMetadata.id : ''
        const groupAdmins = isGroupMsg && groupId ? await client.getGroupAdmins(groupId) : ''
        const groupMembers = isGroupMsg && groupId ? await client.getGroupMembersId(groupId) : ''
        const isGroupAdmins = groupAdmins.includes(sender ? sender.id : '') || false
        const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
        const isOperator = (sender ? config.operator.includes(sender.id) || sender.isMe : false) || false
        if (isGroupMsg) group.update(groupId, chat.groupMetadata)
        let successList = []
        let failedList = []
        let promises = []
        let list = []

        // Bot Prefix
        body = (type === 'chat' && cmd.prefix.test(body)) ?
            body :
            (((type === 'image' || type === 'video') && caption) && cmd.prefix.test(caption)) ?
                caption :
                ''
        const isQuotedImage = quotedMsg && quotedMsg.type === 'image'
        const isQuotedVideo = quotedMsg && quotedMsg.type === 'video'
        const isQuotedAudio = quotedMsg && (quotedMsg.type === 'audio' || quotedMsg.type === 'ptt' || quotedMsg.type === 'ppt')
        const isQuotedFile = quotedMsg && quotedMsg.type === 'document'
        let rawText = type === 'chat' ?
            message.body :
            (type === 'image' || type === 'video') && caption ?
                message.caption : ''
        if (rawText.startsWith('> ') /* && sender.id == ownerNumber*/) {
            console.log(sender.id, 'is trying to use the execute command')
            let type = Function
            if (/await/.test(rawText)) type = AsyncFunction
            let func = new type('print', 'client', 'message', 'config', 'group', 'fetch', 'fs', 'cmd', rawText.slice(2))
            let output
            try {
                output = func((...args) => {
                    console.log(...args)
                    client.reply(from, util.format(...args), id)
                }, client, message, config, group, fetch, fs, cmd)
                console.log(output)
                await client.reply(from, '*Console Output*\n\n' + util.format(output), id)
            } catch (e) {
                await client.reply(from, '*Console Error*\n\n' + util.format(e), id)
            }
        }

        if (isGroupMsg) group.update(chat.id, chat.groupMetadata)

        // cmd.middleware = (next, name) => {
        //     if (group.permission(groupId, sender.id, name)) next()
        //     else client.reply(from, config.msg.notAllowed)
        // }
        cmd.middleware = next => next()

        cmd.on('help', ['menu', 'help', '?'], () => {
            client.reply(from, showHelp(cmd.usedPrefix, pushname, cmd.args[0]), id)
        })

        cmd.on('ping', ['speed', 'ping'], () => {
            client.sendText(from, `Pong!\nMerespon dalam ${moment() / 1000 - t} detik`)
        })

        cmd.on('sticker', /^sti(c|)ker$/i, async () => {
            if (isMedia || isQuotedImage || isQuotedFile) {
                const encryptMedia = isQuotedImage || isQuotedFile ? quotedMsg : message
                const _mimetype = encryptMedia.mimetype
                const mediaData = await decryptMedia(encryptMedia)
                if (_mimetype === 'image/webp') client.sendRawWebpAsSticker(from, mediaData.toString('base64'), false)

                const stiker = await processSticker(mediaData, 'contain')
                await client.sendRawWebpAsSticker(from, stiker.toString('base64'), false)
            }
        })

        cmd.on('meme', 'meme', async () => {
            if (isMedia || isQuotedImage) {
                let top = ''
                let bottom = cmd.text
                if (/\|/.test(cmd.text)) {
                    [top, bottom] = cmd.text.split('|')
                }
                const encryptMedia = isQuotedImage ? quotedMsg : message
                const mediaData = await decryptMedia(encryptMedia)
                const getUrl = await uploadImages(mediaData, false)
                const ImageBase64 = await customText(getUrl, top, bottom)
                client.sendFile(from, ImageBase64, 'image.png', '', null, true)
                    .then((serialized) => console.log(`Sukses Mengirim File dengan id: ${serialized}`))
            } else await client.reply(from, config.msg.noMedia, id)
        })

        cmd.on('memesticker', /^(memesti(c|)ker|sti(c|)kermeme)$/i, async () => {
            if (isMedia || isQuotedImage) {
                let top = ''
                let bottom = cmd.text
                if (/\|/.test(cmd.text)) {
                    [top, bottom] = cmd.text.split('|')
                }
                const encryptMedia = isQuotedImage ? quotedMsg : message
                const mediaData = await decryptMedia(encryptMedia)
                const getUrl = await uploadImages(mediaData, false)
                const ImageBase64 = await customText(getUrl, top, bottom)
                const stiker = await processSticker(ImageBase64, 'contain') //.replace(/data:.+;base64,/, '')
                await client.sendRawWebpAsSticker(from, Buffer.from(stiker.replace(/data:.+;base64,/, ''), 'base64'), false)
            } else {
                await client.reply(from, config.msg.noMedia, id)
            }
        })

        cmd.on('sgif', /sti(c|)kergif|gifsti(c|)ker|sgif/i, async () => {
            if ((isMedia || isQuotedVideo || isQuotedFile) && cmd.args.length === 0) {
                const encryptMedia = isQuotedVideo || isQuotedFile ? quotedMsg : message
                const _mimetype = isQuotedVideo || isQuotedFile ? quotedMsg.mimetype : mimetype
                client.reply(from, config.msg.waitConvert(_mimetype.replace(/.+\//, ''), 'webp', 'Stiker itu pakai format *webp*'), id)
                if (/image/.test(_mimetype)) client.reply(from, config.msg.recommend(cmd.usedPrefix, 'stiker'), id)
                console.log(color('[WAPI]'), 'Downloading and decrypting media...')
                const mediaData = await decryptMedia(encryptMedia)
                if (_mimetype === 'image/webp') client.sendRawWebpAsSticker(from, mediaData.toString('base64'), true)
                stream2Buffer(write => {
                    ffmpeg(buffer2Stream(mediaData))
                        .inputOptions([
                            '-t', config.stickerGIF.duration
                        ])
                        .complexFilter([
                            (config.stickerGIF.fps >= 1 ? 'fps=' + config.stickerGIF.fps + ',' : '') + 'scale=512:512:flags=lanczos:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000,setsar=1'
                        ])
                        .outputOptions([
                            '-qscale', config.stickerGIF.quality,
                            '-fs', config.stickerGIF.target || '1M',
                            '-vcodec', 'libwebp',
                            // '-lossless', '1',
                            '-preset', 'default',
                            '-loop', '0',
                            '-an',
                            '-vsync', '0'
                        ])
                        .format('webp')
                        .on('start', commandLine => console.log(color('[FFmpeg]'), commandLine))
                        .on('progress', progress => console.log(color('[FFmpeg]'), progress))
                        .on('end', () => console.log(color('[FFmpeg]'), 'Processing finished!'))
                        .stream(write)
                }).then(buffer => {
                    client.sendRawWebpAsSticker(from, buffer.toString('base64'), true)
                }).catch(_err)
            }
        })

        cmd.on('add', ['add', '+'], async () => {
            args = cmd.args.join(' ').split(',').map(number => number.trim())
            failed = permission([
                [!isGroupMsg, config.msg.notGroup],
                // [!isGroupAdmins, config.msg.notAdmin],
                [!isBotGroupAdmins, config.msg.notBotAdmin],
                [args.length === 0, config.msg.noArgs],
                [args.includes(botNumber), config.msg.self],
            ])
            if (failed[0]) return client.reply(from, failed[1], id)
            await client.sendTextWithMentions(from, config.msg.add + args.map(config.msg.listUser).join('\n'))
            for (let i = 0; i < args.length; i++) {
                client.addParticipant(groupId, args[i] + '@c.us')
            }
        })

        cmd.on('kick', ['kick', '-'], async () => {
            failed = permission([
                [!isGroupMsg, config.msg.notGroup],
                [!isGroupAdmins, config.msg.notAdmin],
                [!isBotGroupAdmins, config.msg.notBotAdmin],
                [cmd.args.length === 0, config.msg.noArgs],
                [cmd.args.includes(botNumber), config.msg.self],
            ])
            if (failed[0]) return client.reply(from, failed[1], id)
            await client.sendTextWithMentions(from, config.msg.remove + cmd.args.map(config.msg.listUser).join('\n'))
            for (let i = 0; i < cmd.args.length; i++) {
                client.removeParticipant(groupId, cmd.args[i] + '@c.us')
            }
        })

        cmd.on('promote', ['promote', '^'], async () => {
            failed = permission([
                [!isGroupMsg, config.msg.notGroup],
                [!isGroupAdmins, config.msg.notAdmin],
                [!isBotGroupAdmins, config.msg.notBotAdmin],
            ])
            if (failed[0]) return client.reply(from, failed[1], id)
            if (cmd.args.length > 0 && cmd.args[0] == '@a') mentionedJidList = groupMembers
            else if (cmd.args.length > 0 && cmd.args[0] == '@r') mentionedJidList = pickRandom(groupMembers.filter(id => !groupAdmins.includes(id)))
            failed = permission([
                [mentionedJidList.length < 1, config.msg.noJid]
            ])
            if (failed[0]) return client.reply(from, failed[1], id)
            for (let mentionid of mentionedJidList) {
                if (groupAdmins.includes(mentionid)) {
                    promises.push(_ => new Promise(r => r(false)))
                    failedList.push(mentionid)
                    continue
                }
                if (mentionid === botNumber) {
                    promises.push(_ => new Promise(r => r(false)))
                    failedList.push(mentionid)
                    continue
                }
                promises.push(client.promoteParticipant(groupId, mentionid))
                // let success = await client.promoteParticipant(groupId, mentionid)
                // if (success) successList.push(mentionid)
                // else failedList.push('Maaf, Error')
            }
            list = await Promise.all(promises)
            for (let id in list) {
                if (list[id]) successList.push(mentionedJidList[id])
            }
            client.sendTextWithMentions(from, config.msg.promoteFormat(successList, failedList))
        })

        cmd.on('demote', ['demote', 'v'], async () => {
            failed = permission([
                [!isGroupMsg, config.msg.notGroup],
                [!isGroupAdmins, config.msg.notAdmin],
                [!isBotGroupAdmins, config.msg.notBotAdmin],
            ])
            if (failed[0]) return client.reply(from, failed[1], id)
            if (cmd.args.length > 0 && cmd.args[0] == '@a') mentionedJidList = groupMembers
            else if (cmd.args.length > 0 && cmd.args[0] == '@r') mentionedJidList = pickRandom(groupAdmins)
            failed = permission([
                [mentionedJidList.length < 1, config.msg.noJid]
            ])
            if (failed[0]) return client.reply(from, failed[1], id)
            for (let mentionid of mentionedJidList) {
                if (groupAdmins.includes(mentionid)) {
                    promises.push(_ => new Promise(r => r(false)))
                    failedList.push(mentionid)
                    continue
                }
                if (mentionid === botNumber) {
                    promises.push(_ => new Promise(r => r(false)))
                    failedList.push(mentionid)
                    continue
                }
                promises.push(client.demoteParticipant(groupId, mentionid))
                // let success = await client.promoteParticipant(groupId, mentionid)
                // if (success) successList.push(mentionid)
                // else failedList.push('Maaf, Error')
            }
            list = await Promise.all(promises)
            for (let id in list) {
                if (list[id]) successList.push(mentionedJidList[id])
            }
            client.sendTextWithMentions(from, config.msg.demoteFormat(successList, failedList))
        })

        cmd.on('resend', /^re(send|post)$/i, async () => {
            if (quotedMsgObj) {
                let encryptMedia
                let replyOnReply = await client.getMessageById(quotedMsgObj.id)
                let obj = replyOnReply.quotedMsgObj
                if (/ptt|audio|video|image|document|sticker/.test(quotedMsgObj.type)) encryptMedia = quotedMsgObj
                else if (obj && /ptt|audio|video|image/.test(obj.type)) encryptMedia = obj
                else return
                const _mimetype = encryptMedia.mimetype
                console.log(color('[WAPI]', 'green'), 'Downloading and decrypt media...')
                const mediaData = await decryptMedia(encryptMedia)

                if (encryptMedia.animated) {
                    client.reply(from, config.msg.waitConvert('webp', 'mp4', 'Kebalikan dari gifstiker'), id)
                    stream2Buffer(write => {
                        ffmpeg(buffer2Stream(mediaData))
                            .format('mp4')
                            .on('start', commandLine => console.log(color('[FFmpeg]'), commandLine))
                            .on('progress', progress => console.log(color('[FFmpeg]'), progress))
                            .on('end', () => console.log(color('[FFmpeg]'), 'Processing finished!'))
                            .stream(write)
                    }).then(buffer => {
                        client.sendRawWebpAsSticker(from, buffer.toString('base64'), true)
                    }).catch(_err)
                } else client.sendFile(from, baseURI(mediaData, _mimetype), `file.${_mimetype.replace(/.+\//, '')}`, ':)', encryptMedia.id)
            } else client.reply(from, config.msg.noMedia, id)
        })

        cmd.on('ytv', /^yt((dl|)mp4|v)$/i, async () => {
            failed = permission([
                [!cmd.url, config.msg.notURL]
            ])
            if (failed[0]) return client.reply(from, failed[1], id)
            ytv(cmd.url)
                .then(res => {
                    if (res.filesize > config.sizeLimit * 1000) return client.sendImage(from, res.thumb, 'thumbs.jpg', config.msg.yt(res.title, res.filesizeF) + '\n\nUse Link: ' + config.msg.sizeExceed(res.filesizeF), id)
                    client.sendImage(from, res.thumb, 'thumbs.jpg', config.msg.yt(res.title, res.filesizeF) + '\n' + res.dl_link, id)
                    client.sendFileFromUrl(from, res.dl_link, `media.${res.ext}`, config.msg.yt(res.title, res.filesizeF), id)
                })
                .catch(_err)
        })

        cmd.on('yta', /^yt((dl|)mp3|a)$/i, async () => {
            failed = permission([
                [!cmd.url, config.msg.notURL]
            ])
            if (failed[0]) return client.reply(from, failed[1], id)
            yta(cmd.url)
                .then(res => {
                    client.sendImage(from, res.thumb, 'thumbs.jpg', config.msg.yt(res.title, res.filesizeF) + '\n' + res.dl_link, id)
                    client.sendFileFromUrl(from, res.dl_link, `media.${res.ext}`, config.msg.yt(res.title, res.filesizeF), id)
                })
                .catch(_err)
        })

        cmd.on('botstat', /^((bot|)stat(s|)|botinfo|infobot)$/i, async () => {
            const loadedMsg = await client.getAmountOfLoadedMessages()
            const chatIds = await client.getAllChatIds()
            const groups = await client.getAllGroups()
            const me = await client.getMe()
            const battery = await client.getBatteryLevel()
            const isCharging = await client.getIsPlugged()
            const used = process.memoryUsage()
            client.sendText(from, `
💬 Status :
- *${loadedMsg}* Loaded Messages
- *${groups.length}* Group Chats
- *${chatIds.length - groups.length}* Personal Chats
- *${chatIds.length}* Total Chats

📱 *Phone Info* :
${monospace(`
🔋 Battery : ${battery}% ${isCharging ? '🔌 Charging...' : '⚡ Discharging'}
${Object.keys(me.phone).map(key => `${key} : ${me.phone[key]}`).join('\n')}
`.slice(1, -1))}

💻 *${'Server Memory Usage'}* :
${monospace(
                Object.keys(used).map(key => `${key} : ${format(used[key])}`).join('\n')
            )}`)
        })

        cmd.on('nulis', /^(mager|)[nt]ulis$/i, async () => {
            let text = cmd.text || (quotedMsgObj ? quotedMsgObj.body : '')
            failed = permission([
                [!text, config.msg.noArgs]
            ])
            if (failed[0]) return client.reply(from, failed[1], id)
            let font = text2image.loadFont('./src/IndieFlower.ttf')
            // client.reply(from, config.msg.waitConvert('jpeg', 'png', '...'), id)
            let pages = await nulis(font, text, 1)
            console.log(pages)
            client.sendFile(from, 'data:image/jpg;base64,' + pages.toString('base64'), 'nulis.png', ':v', id)
            // for (let i = 0; i < pages.length; i++) {
            //     client.sendFile(from, 'data:image/jpg;base64,' + pages[i].toString('base64'), 'nulis.png', ':v', id)
            // }
        })

        cmd.on('ig', /^ig(dl|)$/i, async () => {
            failed = permission([
                [!cmd.url, config.msg.notURL]
            ])
            if (failed[0]) return client.repl(from, failed[1], id)
            mhankbarbar('ig', '?url=' + encodeURIComponent(cmd.url))
                .then(res => res.json())
                .then(res => {
                    client.sendFile(from, res.result, 'ig', '', id)
                }).catch(_err)
        })

        cmd.on('source', 'source', async () => {
            client.sendLinkWithAutoPreview(from, 'https://github.com/Nurutomo/nbot-wa', 'Repository:\nhttps://github.com/Nurutomo/nbot-wa')
        })

        cmd.on('mp3', ['mp3', 'audio'], async () => {
            if ((isMedia || isQuotedVideo || isQuotedFile)) {
                client.reply(from, config.msg.waitConvert('mp4', 'mp3', 'Meng-ekstrak audio dari video'), id)
                const encryptMedia = isQuotedVideo || isQuotedFile ? quotedMsg : message
                const _mimetype = isQuotedVideo || isQuotedFile ? quotedMsg.mimetype : mimetype
                console.log(color('[WAPI]', 'green'), 'Downloading and decrypt media...')
                const mediaData = await decryptMedia(encryptMedia)
                stream2Buffer(write => {
                    ffmpeg(buffer2Stream(mediaData))
                        .format('mp3')
                        .on('start', commandLine => console.log(color('[FFmpeg]'), commandLine))
                        .on('progress', progress => console.log(color('[FFmpeg]'), progress))
                        .on('end', () => console.log(color('[FFmpeg]'), 'Processing finished!'))
                        .stream(write)
                }).then(buffer => {
                    client.sendFile(from, baseURI(buffer, 'audio/mp3'), 'bass_boosted.mp3', '', id)
                }).catch(_err)
            } else if (cmd.text) {
                let search = await ytsr(cmd.text)
                let ss = await ssPage(search.link, 1000)
                client.sendFile(from, ss, 'yt.png', `Menampilkan hasil untuk ${search.correctQuery ? `*${search.correctQuery}* atau telusuri _${search.query}_` : `*${search.query}*`}\n\n${search.items.map(config.msg.ytsearch).join('\n\n')}`, id)
            }
        })

        cmd.on('ss', /^ss(s|)$/i, async () => {
            if (/\d/.test(cmd.args[0])) {
                let page = await client.getPage()
                let index = parseInt(cmd.args[0], 10)
                await page.evaluate(new Function(`new Store.OpenChat().openChat(Store.Chat._models.filter(t=>!t.__x_isGroup)[${index}].__x_id._serialized)`))
            }
            let ss = await client.getSnapshot()
            let pic = await client.sendImage(from, ss, 'screenshot.png', '', id, true)
            setTimeout(() => {
                client.deleteMessage(pic.from, pic.id, false)
            }, 20000)
        })

        cmd.on('fs', 'fs', async () => {
            client.sendText(from, monospace(tree(__dirname, {
                exclude: [/node_modules/, /status/],
                depth: 5
            }).replace(/── (.+)/g, (_, group) => `── ${/\..+/.test(group) ? '📄' : '📁'} ${group}`)))
        })

        cmd.on('distord', ['distord', 'distorsi', 'earrape'], async () => {
            if (isQuotedAudio) {
                client.reply(from, config.msg.waitConvert('mp3', 'mp3', '⚠ WARNING ⚠\n🔇 Tau lah :v'), id)
                const encryptMedia = isQuotedAudio ? quotedMsg : message
                const _mimetype = isQuotedAudio ? quotedMsg.mimetype : mimetype
                console.log(color('[WAPI]', 'green'), 'Downloading and decrypt media...')
                const mediaData = await decryptMedia(encryptMedia)
                stream2Buffer(write => {
                    ffmpeg(buffer2Stream(mediaData))
                        .audioFilter('aeval=sgn(val(ch))')
                        .format('mp3')
                        .on('start', commandLine => console.log(color('[FFmpeg]'), commandLine))
                        .on('progress', progress => console.log(color('[FFmpeg]'), progress))
                        .on('end', () => console.log(color('[FFmpeg]'), 'Processing finished!'))
                        .stream(write)
                }).then(buffer => {
                    client.sendFile(from, baseURI(buffer, 'audio/mp3'), 'distorted.mp3', '', id)
                }).catch(_err)
            } else if (isQuotedVideo) {
                // Bantuin ffmpeg nya :')
                // biar bisa video filter sama audio filter
                // client.reply(from, config.msg.waitConvert('mp4', 'mp4', '⚠ WARNING ⚠\n🔇 Tau lah :v'), id)
                // const encryptMedia = isQuotedVideo ? quotedMsg : message
                // const _mimetype = isQuotedVideo ? quotedMsg.mimetype : mimetype
                // console.log(color('[WAPI]', 'green'), 'Downloading and decrypt media...')
                // const mediaData = await decryptMedia(encryptMedia)
                // stream2Buffer(write => {
                //     ffmpeg(buffer2Stream(mediaData))
                //         .complexFilter('scale=iw/2:ih/2,eq=saturation=100:contrast=10:brightness=0.3:gamma=10,noise=alls=100:allf=t,unsharp=5:5:1.25:5:5:1,eq=gamma_r=100:gamma=50,scale=iw/5:ih/5,scale=iw*4:ih*4,eq=brightness=-.1,unsharp=5:5:1.25:5:5:1')
                //         .audioFilter('aeval=sgn(val(ch))')
                //         .format('mp4')
                //         .on('start', commandLine => console.log(color('[FFmpeg]'), commandLine))
                //         .on('progress', progress => console.log(color('[FFmpeg]'), progress))
                //         .on('end', () => console.log(color('[FFmpeg]'), 'Processing finished!'))
                //         .stream(write)
                // }).then(buffer => {
                //     client.sendFile(from, baseURI(buffer, _mimetype), 'distorted.mp4', '', id)
                // }).catch(_err)
            }
        })

        cmd.on('ssweb', 'ssweb', async () => {
            if (cmd.url) {
                try {
                    if (!/^file|^http(s|):\/\//.test(cmd.url)) url = 'https://' + cmd.url
                    else url = cmd.url
                    let ss = await ssPage(url, cmd.args[1])
                    client.sendImage(from, ss, 'screenshot.png', url, id)
                } catch (e) {
                    client.reply(from, config.msg.error(e), id)
                }
            }
        })

        cmd.on('sswebf', 'sswebf', async () => {
            if (cmd.url) {
                try {
                    if (!/^file|^http(s|):\/\//.test(cmd.url)) url = 'https://' + cmd.url
                    else url = cmd.url
                    let [ss] = await Promise.all([
                        ssPage(url, cmd.args[1], true),
                        // ssPage(url, cmd.args[1], true, true)
                    ])
                    client.sendImage(from, ss, 'screenshot.png', url, id)
                    // client.sendFile(from, ssPDF, 'screenshot.pdf', url, id)
                } catch (e) {
                    client.reply(from, config.msg.error(e), id)
                }
            }
        })

        cmd.on('google', 'google', async () => {
            if (cmd.url) {
                try {
                    let url = 'https://google.com/search?q=' + encodeURIComponent(cmd.text)
                    let ss = await ssPage(url, 1000, false)
                    await client.sendImage(from, ss, 'screenshot.png', url, id)
                    // await client.sendImage(from, ssFull, 'screenshot.png', url, id)
                    // client.sendFile(from, ssPDF, 'screenshot.pdf', url, id)
                } catch (e) {
                    client.reply(from, config.msg.error(e), id)
                }
            }
        })

        cmd.on('style', /^style|gaya$/i, async () => {
            switch (useQuoted(cmd.text, quotedMsgObj)) {
                case !0:
                    client.reply(from, (await stylizeText(quotedMsgObj.body).catch(_err)), id)
                    break
                case !1:
                    client.sendText(from, (await stylizeText(cmd.text).catch(_err)))
                    break
                default:
                    client.reply(from, config.msg.noArgs, id)
            }
        })

        cmd.on('bass', /^(bass(boost|)|fullbass)$/i, async () => {
            if (isQuotedAudio) {
                let dB = 20
                let freq = 60
                if (cmd.args[0]) dB = clamp(parseInt(cmd.args[0]) || 20, 0, 50)
                if (cmd.args[1]) freq = clamp(parseInt(cmd.args[1]) || 20, 20, 500)
                console.log(color('[WAPI]', 'green'), 'Downloading and decrypt media...')
                let mediaData = await decryptMedia(quotedMsg)
                stream2Buffer(write => {
                    ffmpeg(buffer2Stream(mediaData))
                        .audioFilter('equalizer=f=' + freq + ':width_type=o:width=2:g=' + dB)
                        .format('mp3')
                        .on('start', commandLine => console.log(color('[FFmpeg]'), commandLine))
                        .on('progress', progress => console.log(color('[FFmpeg]'), progress))
                        .on('end', () => console.log(color('[FFmpeg]'), 'Processing finished!'))
                        .stream(write)
                }).then(buffer => {
                    client.sendFile(from, baseURI(buffer, 'audio/mp3'), 'bass_boosted.mp3', '', id)
                }).catch(_err)
            }
        })

        cmd.on('setuserrole', 'setuserrole', async () => {
            failed = permission([
                [!isGroupMsg, config.msg.notGroup],
                [mentionedJidList.length < 1, config.msg.noJid]
            ])
            if (failed[0]) return client.reply(from, failed[1], id)

            let users = /@(\d{5,15}) (\d+)/g.exec(cmd.text)
            for (let [, user, role] of users) {
                if (group.setMemberRole(groupId, user + '@c.us', role)) successList.push('@' + user)
                else failedList.push('@' + user)
            }
            client.sendTextWithMentions(from, `Done:\n${successList.map(config.msg.listUser)}\n\nFailed:\n${failedList.map(config.msg.listUser)}`)
        })

        cmd.on('getuserrole', 'getuserrole', async () => {
            failed = permission([
                [!isGroupMsg, config.msg.notGroup],
                [mentionedJidList.length < 1, config.msg.noJid]
            ])
            if (failed[0]) return client.reply(from, failed[1], id)

            mentionedJidList.map(user => `@${user.replace('@c.us', '')} ${group.getRoleById(groupId, user)}`)
            client.sendTextWithMentions(from, `Done:\n${successList.map(config.msg.listUser)}\n\nFailed:\n${failedList.map(config.msg.listUser)}`)
        })

        cmd.on('setrole', 'setrole', async () => {
            failed = permission([
                [!isGroupMsg, config.msg.notGroup],
                [cmd.args.length < 3, config.msg.noArgs]
            ])
            if (failed[0]) return client.reply(from, failed[1], id)

            if (cmd.args[1] === 'name') cmd.args[2] = cmd.args[2]
            else if (cmd.args[1] === 'id') cmd.args[2] = parseInt(cmd.args[2])
            else cmd.args[2] = !!cmd.args[2]
            if (group.setRole(groupId, cmd.args[0], cmd.args[1], cmd.args.slice(2).join(' '))) client.reply(from, config.msg.success, id)
            else client.reply(from, config.msg.failed, id)
        })

        cmd.on('rolelist', 'rolelist', async () => {
            failed = permission([
                [!isGroupMsg, config.msg.notGroup]
            ])
            if (failed[0]) return client.reply(from, failed[1], id)

            client.sendText(from, group.data[groupId].roles.map(role => {
                return `*${role.name}*\n${monospace(JSON.stringify(role.name, null, 1))}`
            }).join('\n\n'))
        })

        cmd.on('broadcast', 'broadcast', async () => {
            failed = permission([
                [!isOperator, config.msg.notAllowed]
            ])
            if (failed[0]) return client.reply(from, failed[1], id)
            if (Object.keys(group.data).filter(chatId => group.data[chatId].broadcast).length > 0) client.reply(from, 'Mengirim broadcast...', id)
            else client.reply(from, 'Tidak ada penerima', id)
            broadcast(client, sender, cmd.text)
        })

        cmd.on('allowbroadcast', 'allowbroadcast', async () => {
            if (!isOperator) {
                failed = permission([
                    [!isGroupMsg, config.msg.notGroup],
                    [!isGroupAdmins, config.msg.notAdmin]
                ])
                if (failed[0]) return client.reply(from, failed[1], id)
            }
            bool = /^(y|ya|yes|enable|activate|true|1)$/i.test(cmd.args[0])
            group.setAllowBroadcast(groupId, bool)
            client.reply(from, `Allow receive broadcast from bot to this group is now set to *${bool ? 'en' : 'dis'}abled*`, id)
        })

        cmd.on('ttsticker', ['ttsticker', 'ttstiker', 't2s'], async () => {
            let text = cmd.text || (quotedMsgObj ? quotedMsgObj.body : '')
            failed = permission([
                [!text, config.msg.noArgs]
            ])
            if (failed[0]) return client.reply(from, failed[1], id)
            let font = text2image.loadFont('C:\\Users\\LENOVO\\AppData\\Local\\Microsoft\\Windows\\Fonts\\Futura Bold Italic font.ttf')
            let imgText = await text2image.convert(font, text.slice(0, 50), 0, 0, 512, {
                attr: 'fill="#fff"'
            })
            let sticker = await processSticker(imgText)
            client.sendRawWebpAsSticker(from, 'data:image/webp;base64,' + sticker.toString('base64'))
        })

        cmd.on('keylist', 'keylist', async () => {
            client.reply(from, `List:\n${Object.keys(cmd._events).join('\n')}`)
        })

        cmd.on('ytsr', /^(yt|youtube)(search|sr)$/, async () => {
            let search = await ytsr(cmd.text)
            let ss = await ssPage(search.link, 1000)
            client.sendFile(from, ss, 'yt.png', `Menampilkan hasil untuk ${search.correctQuery ? `*${search.correctQuery}* atau telusuri _${search.query}_` : `*${search.query}*`}\n\n${search.items.map(config.msg.ytsearch).join('\n\n')}`, id)
        })

        cmd.check(body, true).then(data => {
            let tipe = bgColor(color(type.replace(/^./, (str) => str.toUpperCase()) + (from.startsWith('status') ? ' Status' : ''), 'black'), 'yellow')
            if (data.known) {
                if (data.pass) {
                    if (!isGroupMsg && sender && sender.isMe) console.log(color('[EXEC]'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${cmd.command} [${cmd.args.length}]`), 'from', color(pushname), 'in', color(name || formattedTitle))
                    else if (!isGroupMsg) console.log(color('[EXEC]'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${cmd.command} [${cmd.args.length}]`), 'from', color(pushname))
                    else if (isGroupMsg) console.log(color('[EXEC]'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${cmd.command} [${cmd.args.length}]`), 'from', color(pushname), 'in', color(name || formattedTitle))
                } else {
                    if (!isGroupMsg && sender && sender.isMe) console.log(color('[????]'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${cmd.command} [${cmd.args.length}]`, 'red'), 'from', color(pushname), 'in', color(name || formattedTitle))
                    else if (!isGroupMsg) console.log(color('[????]'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${cmd.command} [${cmd.args.length}]`, 'red'), 'from', color(pushname))
                    else if (isGroupMsg) console.log(color('[????]'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${cmd.command} [${cmd.args.length}]`, 'red'), 'from', color(pushname), 'in', color(name || formattedTitle))
                }
            } else {
                if (!isGroupMsg && sender && sender.isMe && message.ack > 0) console.log('[RECV]', color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), `${tipe} from`, color(pushname)), 'in', color(name || formattedTitle)
                else if (!isGroupMsg) console.log('[RECV]', color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), `${tipe} from`, color(pushname))
                else if (isGroupMsg) console.log('[RECV]', color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), `${tipe} from`, color(pushname), 'in', color(name || formattedTitle))
            }
        }).catch(e => {
            _err(e)
            if (e.usedPrefix) client.sendText(message.from, config.msg.error(util.format(e)))
        })
    } catch (e) {
        _err(e)
    }
}

function _err(e) {
    console.log(console.log(color('[ERR]', 'red'), e))
}

(async () => {
    if (global.browser) return
    const chromePath = {
        win32: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', // Windows 32 bit
        win64: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe', // Windows 64 bit
        linuxChrome: '/usr/bin/google-chrome-stable', // Linux - Chrome
        linuxChromium: '/usr/bin/chromium-browser', // Linux - Chromium
        darwin: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' // MacOS
    }

    if (fs.existsSync(chromePath.win32)) {
        execPath = chromePath.win32
    } else if (fs.existsSync(chromePath.win64)) {
        execPath = chromePath.win64
    } else if (fs.existsSync(chromePath.linuxChrome)) {
        execPath = chromePath.linuxChrome
    } else if (fs.existsSync(chromePath.linuxChromium)) {
        execPath = chromePath.linuxChromium
    } else if (process.platform === 'darwin') {
        execPath = chromePath.darwin
    } else {
        console.error(new Error('Google Chrome Is Not Installed'))
        process.exit(1)
    }
    console.log(chromeText, 'Launching Browser')
    global.browser = await puppeteer.launch({
        executablePath: execPath,
        defaultViewport: {
            width: 1920,
            height: 1080
        },
        timeout: 120000
    });

    console.log(chromeText, 'Opening Blank Page')
    const page = await browser.newPage()
    await page.goto('about:blank')

    console.log(chromeText, 'Init Completed')
})()

function permission(rules) {
    for (let rule of rules)
        if (rule[0]) return rule
    return [false, '']
}

function showHelp(prefix, name = '', command) {
    let reference = command ? ({
        help: `Contoh: *${prefix}help stiker*`,
        stiker: `Kirim foto dengan caption: *${prefix}stiker*`,
        gifstiker: `Kirim video/gif dengan caption: *${prefix}gifstiker*`,
        meme: `Kirim foto dengan caption: *${prefix}meme teks atas|teks bawah*`,
        memestiker: `Kirim foto dengan caption: *${prefix}memestiker teks atas|teks bawah*`,
        resend: `Tag pesan sesorang yang ada medianya untuk mengirimkannya kembali: *${prefix}resend*`,
        mp3: `Tag video untuk mengekstrak audio nya: *${prefix}mp3*`,
        bass: `Tag audio dengan desibel 10dB dan frekuensi 100hz: *${prefix}bass 10 100*`,
        botstat: `Cek keadaan bot: *${prefix}botstat*`,
        distord: `Tag audio untuk mendistorsi audionya: *${prefix}distord*`,
        ssweb: `Screenshot Website google.com: *${prefix}ssweb google.com*`,
        sswebf: `Screenshot Website google.com (Full Page): *${prefix}sswebf google.com*`,
        google: `Screenshot hasil pencarian 'google': *${prefix}google google*`,
        googlef: `Screenshot hasil pencarian gambar 'google': *${prefix}sswebf google*`,
        ytmp4: `Download YouTube Mp4: *${prefix}ytmp4 https://youtu.be/VQMCJgWxUoE*`,
        ytmp3: `Download YouTube Mp3: *${prefix}ytmp3 https://youtu.be/VQMCJgWxUoE*`,
        ig: `Download postingan Instagram: *${prefix}ig https://www.instagram.com/p/CFs8MvLg0s_/?igshid=1982zv2awlaqj*`,
        nulis: `Nulis teks: *${prefix}nulis tulisan*`,
    })[command] || 'Tidak ditemukan [404 Not Found]' : ''
    return `
• *${config.botName}* •
👋 Hai, ${name}!

• *Info Tanda di Argumen* •
Tanda *<>* = itu harus diisi
Tanda *[]*  = tidak harus diisi
Tanda *...* = dan seterusnya
Tanda *|* = atau
Tanda *@user* = di mention atau disebut

• Info Fitur •
*${prefix}help* [command]${command ? `\n║\n║ *Info Fitur*:\n║ ${reference}` : ''}
${readMore}
• *Menu Admin* •
➕ *${prefix}add* <62XXXXXXXXXX1> [<62XXXXXXXXXXX> ...]
➖ *${prefix}kick* <62XXXXXXXXXX1> [<62XXXXXXXXXXX> ...]
🔼 *${prefix}promote* <@user>
🔽 *${prefix}demote* <@user>

• *Menu Utama* •
🖼 *${prefix}stiker*
📽 *${prefix}gifstiker*
#️⃣ *${prefix}meme* <[atas|]bawah>
#️⃣ *${prefix}memestiker* <[atas|]bawah>
➡ *${prefix}resend*
🎵 *${prefix}mp3* [pencarian]
🔊 *${prefix}bass* [<desibel> <freqkuensi>]
ℹ *${prefix}botstat*
😂 *${prefix}distord*
🌐 *${prefix}ssweb* <url>
🌐 *${prefix}sswebf* <url>
🔎 *${prefix}google* <pencarian>
🔎 *${prefix}googlef* <pencarian>
📄 *${prefix}nulis* <teks>
📄 *${prefix}ttstiker* <teks>
🔎 *${prefix}ytsr* <pencarian>
• *Downloader* •
❌ Not Working
✔ With API
✅ No API

✅ *${prefix}ytmp3* <url>
✅ *${prefix}ytmp4* <url>
✔ *${prefix}ig* <url>
❌ *${prefix}fb* <url>
❌ *${prefix}tiktok* <url>

• *Butuh API* •
- ${config.API.mhankbarbar.url}
Cuma IG :|

• *Advanced* •
📢 *${prefix}allowBroadcast* <enable|disable>
🔰 *${prefix}setUserRole* <@user> <index>
🔰 *${prefix}getUserRole* <@user>
🔰 *${prefix}setRole* <index> <key> <value>
🗝 *${prefix}keyList*
🔰 ${prefix}roleList*

• *Operator Only* •
📢 *${prefix}broadcast* <text>

• *Iklan* •
${(config.iklan || []).map((iklan, i) => `${i + 1}. ${iklan}`).join('\n') || '_Tidak ada iklan_'}

• *Bot Author* •
𝙉𝙪𝙧𝙪𝙩𝙤𝙢𝙤 (Nurutomo)
https://github.com/Nurutomo/
Repo: https://github.com/Nurutomo/nbot-wa
${readMore}wa.me/6281515860089
`.slice(1, -1)
}

function processSticker(input) {
    return new Promise((resolve, reject) => {
        sharp(input)
            .toFormat('webp')
            .resize(512, 512, {
                fit: 'contain',
                background: {
                    r: 0,
                    g: 0,
                    b: 0,
                    alpha: 0
                }
            })
            .toBuffer()
            .then(resolve)
            .catch(reject)
    })
}

function color(text, color) {
    return !color ? chalk.green(text) : color.startsWith('#') ? chalk.hex(color)(text) : chalk.keyword(color)(text)
}

function bgColor(text, color) {
    return !color ? chalk.bgGreen(text) : color.startsWith('#') ? chalk.bgHex(color)(text) : chalk.bgKeyword(color)(text)
}

/**
 * Pick Random Array
 * @param {Array} arr Input Array 
 * @param {Number} count Output Count
 * @returns {Array} Randomly Selected Array
 */
function pickRandom(arr, count = 1) {
    let result = []
    for (let i = 0; i < Math.max(count, 1); i++) {
        result.push(arr[Math.floor(arr.length * Math.random())])
    }
    return result
}

function mhankbarbar(apiName, query) {
    return fetch(config.API.mhankbarbar.url + config.API.mhankbarbar[apiName] + query)
}

/**
 * Monospace format
 * @param {String} string input
 */
function monospace(string) {
    let _3 = '`'.repeat(3)
    return _3 + string + _3
}

/**
 * create custom meme
 * @param  {String} imageUrl
 * @param  {String} topText
 * @param  {String} bottomText
 */
async function customText(imageUrl, top, bottom) {
    return new Promise((resolve, reject) => {
        let fix = str => str.trim().replace(/\s/g, '_').replace(/\?/g, '~q').replace(/\%/g, '~p').replace(/\#/g, '~h').replace(/\//g, '~s')
        fetchBase64(`https://api.memegen.link/images/custom/${fix(top)}/${fix(bottom)}.png?background=${imageUrl}`, 'image/png')
            .then(result => resolve(result))
            .catch(err => {
                console.error(err)
                reject(err)
            })
    })
}

function uploadImages(buffData, type) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
        const {
            ext
        } = await fromBuffer(buffData)
        let temp = './temp'
        let name = new Date() * 1
        let filePath = path.join(temp, 'image', `${name}.${ext}`)
        const _buffData = type ? await resizeImage(buffData, false) : buffData
        fs.writeFile(filePath, _buffData, {
            encoding: 'base64'
        }, (err) => {
            if (err) return reject(err)
            console.log('Uploading image to telegra.ph server...')
            const fileData = fs.readFileSync(filePath)
            const form = new FormData()
            form.append('file', fileData, 'tmp.' + ext)
            fetch('https://telegra.ph/upload', {
                method: 'POST',
                body: form
            })
                .then(res => res.json())
                .then(res => {
                    if (res.error) return reject(res.error)
                    resolve('https://telegra.ph' + res[0].src)
                })
                .then(() => fs.unlinkSync(filePath))
                .catch(err => reject(err))
        })
    })
}

function resizeImage(buff, encode) {
    return new Promise(async (resolve, reject) => {
        console.log('Resizeing image...')
        const {
            mime
        } = await fromBuffer(buff)
        sharp(buff, {
            failOnError: false
        })
            .toFormat('png')
            .resize(512, 512, {
                fit: 'contain',
                background: {
                    r: 0,
                    g: 0,
                    b: 0,
                    alpha: 0
                }
            })
            .toBuffer()
            .then(resizedImageBuffer => {
                if (!encode) return resolve(resizedImageBuffer)
                console.log('Create base64 from resizedImageBuffer...')
                const resizedImageData = resizedImageBuffer.toString('base64')
                const resizedBase64 = `data:${mime};base64,${resizedImageData}`
                resolve(resizedBase64)
            })
            .catch(error => reject(error))
    })
}

/**
 * Fetch base64 from url
 * @param {String} url
 */

const fetchBase64 = (url, mimetype) => {
    return new Promise((resolve, reject) => {
        console.log('Get base64 from:', url)
        return fetch(url)
            .then((res) => {
                const _mimetype = mimetype || res.headers.get('content-type')
                res.buffer()
                    .then((result) => resolve(`data:${_mimetype};base64,` + result.toString('base64')))
            })
            .catch((err) => {
                console.error(err)
                reject(err)
            })
    })
}

async function ssPage(url = 'about:blank', delay = 0, isFull = false, isPDF = false) {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(chromeText, 'Opening New Tab')
            const page = await browser.newPage()

            console.log(chromeText, `Opening '${url}'`)
            await page.goto(url, {
                waitUntil: 'load',
                timeout: 300000
            })

            if (delay > 0) {
                console.log(chromeText, 'Wait', delay, 'ms')
                await sleep(delay)
            }

            console.log(chromeText, 'Taking Screenshot...')

            let screenshot
            if (isPDF) {
                //await page.emulateMedia('screen');
                screenshot = await page.pdf();
            } else {
                screenshot = await page.screenshot({
                    type: 'png',
                    encoding: 'base64',
                    fullPage: isFull
                })
            }

            console.log(chromeText, 'Done Screenshot', screenshot.length / 1024, 'kB')

            if (isPDF) resolve('data:application/pdf;base64,' + screenshot)
            else resolve('data:image/png;base64,' + screenshot)

            await page.close()
        } catch (e) {
            console.log(chromeText, color(e, 'red'))
            reject(e)
        }
    })
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

function stylizeText(text) {
    return new Promise(resolve => {
        fetch('http://qaz.wtf/u/convert.cgi?text=' + encodeURIComponent(text))
            .then(res => res.text())
            .then(html => {
                let dom = new JSDOM(html)
                let table = dom.window.document.querySelector('table').children[0].children
                let obj = {}
                for (let tr of table) {
                    let name = tr.querySelector('.aname').innerHTML
                    let content = tr.children[1].textContent
                    obj[name + obj[name] ? ' Reversed' : ''] = content
                }
                resolve(obj)
            })
    })
}

function useQuoted(text, quotedMsgObj) {
    if (text && quotedMsgObj) return false
    else if (!text && quotedMsgObj) return true
    else if (text && !quotedMsgObj) return false
    else return ''
}

function clamp(value, min, max) {
    return Math.min(Math.max(min, value), max)
}

/**
 * Nulis teks
 * @param {Font} font 
 * @param {String} text 
 * @param {Number} pagesLimit 
 * @returns {Array<Promise>}
 */
function nulis(font, text, pagesLimit = 38) {
    return new Promise(async (resolve, reject) => {
        try {
            text = text.replace(/\r\n/g, '\n')
            let spliter = []
            let size = 20

            if (!Array.isArray(text)) {
                let tempkata = ''
                let kata = ''
                for (let i of [...text]) {
                    if (i != '\n' && font.getAdvanceWidth(tempkata + i, size) < 734) tempkata += i
                    else {
                        kata += tempkata + '\n'
                        tempkata = i
                    }
                }
                if (tempkata) kata += tempkata
                spliter = kata.split('\n')
            } else spliter = text

            let line = 200
            let lines = []
            for (let i of spliter) {
                lines.push(text2image.convert(font, i, 170, line, size))
                line += 39.5
            }
            lines = await Promise.all(lines)
            sharp('./src/buku.jpg').composite(lines.map(a => {
                return {
                    input: a,
                    gravity: 'northwest'
                }
            })).toBuffer((err, buf) => {
                if (err) reject(err)
                resolve(buf)
            })
        } catch (e) {
            reject(err)
        }
    })
}

function ytv(url) {
    return new Promise((resolve, reject) => {
        if (ytIdRegex.test(url)) {
            let ytId = ytIdRegex.exec(url)
            url = 'https://youtu.be/' + ytId[1]
            post('https://www.y2mate.com/mates/en60/analyze/ajax', {
                url,
                q_auto: 0,
                ajax: 1
            })
                .then(res => res.json())
                .then(res => {
                    console.log('Scraping...')
                    document = (new JSDOM(res.result)).window.document
                    yaha = document.querySelectorAll('td')
                    filesize = yaha[yaha.length - 23].innerHTML
                    id = /var k__id = "(.*?)"/.exec(document.body.innerHTML) || ['', '']
                    thumb = document.querySelector('img').src
                    title = document.querySelector('b').innerHTML

                    post('https://www.y2mate.com/mates/en60/convert', {
                        type: 'youtube',
                        _id: id[1],
                        v_id: ytId[1],
                        ajax: '1',
                        token: '',
                        ftype: 'mp4',
                        fquality: 360
                    })
                        .then(res => res.json())
                        .then(res => {
                            let KB = parseFloat(filesize) * (1000 * /MB$/.test(filesize))
                            resolve({
                                dl_link: /<a.+?href="(.+?)"/.exec(res.result)[1],
                                thumb,
                                title,
                                filesizeF: filesize,
                                filesize: KB
                            })
                        }).catch(reject)
                }).catch(reject)
        } else reject('URL INVALID')
    })
}

function yta(url) {
    return new Promise((resolve, reject) => {
        if (ytIdRegex.test(url)) {
            let ytId = ytIdRegex.exec(url)
            url = 'https://youtu.be/' + ytId[1]
            post('https://www.y2mate.com/mates/en60/analyze/ajax', {
                url,
                q_auto: 0,
                ajax: 1
            })
                .then(res => res.json())
                .then(res => {
                    let document = (new JSDOM(res.result)).window.document
                    let type = document.querySelectorAll('td')
                    let filesize = type[type.length - 10].innerHTML
                    let id = /var k__id = "(.*?)"/.exec(document.body.innerHTML) || ['', '']
                    let thumb = document.querySelector('img').src
                    let title = document.querySelector('b').innerHTML

                    post('https://www.y2mate.com/mates/en60/convert', {
                        type: 'youtube',
                        _id: id[1],
                        v_id: ytId[1],
                        ajax: '1',
                        token: '',
                        ftype: 'mp3',
                        fquality: 128
                    })
                        .then(res => res.json())
                        .then(res => {
                            let KB = parseFloat(filesize) * (1000 * /MB$/.test(filesize))
                            resolve({
                                dl_link: /<a.+?href="(.+?)"/.exec(res.result)[1],
                                thumb,
                                title,
                                filesizeF: filesize,
                                filesize: KB
                            })
                        }).catch(reject)
                }).catch(reject)
        } else reject('URL INVALID')
    })
}

function post(url, formdata) {
    console.log(Object.keys(formdata).map(key => `${key}=${encodeURIComponent(formdata[key])}`).join('&'))
    return fetch(url, {
        method: 'POST',
        headers: {
            accept: "*/*",
            'accept-language': "en-US,en;q=0.9",
            'content-type': "application/x-www-form-urlencoded; charset=UTF-8"
        },
        body: Object.keys(formdata).map(key => `${key}=${encodeURIComponent(formdata[key])}`).join('&')
    })
}

function broadcast(client = new Client(), sender, text) {
    let promises = []
    for (let chatId in group.data) {
        if (group.isAllowBroadcast(chatId)) promises.push(client.sendTextWithMentions(chatId, config.msg.broadcast(sender, text)))
    }
    return Promise.all(promises)
}

function formattedName(client = new Client(), message) {
    body.match(/@(\d*)/g).filter(x => x.length > 5).map(x => Store.Contact.get(x.replace("@", "") + "@c.us"))

    message.pushname || message.verifiedName || message.formattedName
}

/**
 * Writable Stream Callback
 * @callback WritableStreamCallback
 * @param {WritableStream} stream 
 */

/**
 * Convert Writable Stream to Buffer
 * @param {WritableStreamCallback} cb Callback with stream
 * @returns {Promise<Buffer>}
 */
function stream2Buffer(cb = noop) {
    return new Promise(resolve => {
        let write = new Writable()
        write.data = []
        write.write = function (chunk) {
            this.data.push(chunk)
        }
        write.on('finish', function () {
            resolve(Buffer.concat(this.data))
        })

        cb(write)
    })
}

/**
 * Convert Buffer to Readable Stream
 * @param {Buffer} buffer
 * @returns {ReadableStream}
 */
function buffer2Stream(buffer) {
    return new Readable({
        read() {
            this.push(buffer)
            this.push(null)
        }
    })
}

function baseURI(buffer = Buffer.from([]), metatype = 'text/plain') {
    return `data:${metatype};base64,${buffer.toString('base64')}`
}

async function ytsr(query) {
    let link = /youtube\.com\/results\?search_query=/.test(query) ? query : ('https://youtube.com/results?search_query=' + encodeURIComponent(query))
    let res = await fetch(link)
    let html = await res.text()
    let data = new Function('return ' + /var ytInitialData = (.+)/.exec(html)[1])()
    let lists = data.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents[0].itemSectionRenderer.contents
    let formatList = {
        query,
        link,
        items: []
    }
    for (let list of lists) {
        let type = {
            videoRenderer: 'video',
            shelfRenderer: 'playlist',
            radioRenderer: 'live',
            channelRenderer: 'channel',
            showingResultsForRenderer: 'typo',
            horizontalCardListRenderer: 'suggestionCard',
        }[Object.keys(list)[0]] || ''
        let content = list[Object.keys(list)[0]] || {}
        if (content) {
            switch (type) {
                case 'typo':
                    formatList.correctQuery = content.correctedQuery.runs[0].text
                    break
                case 'video':
                    formatList.items.push({
                        type,
                        title: content.title.runs[0].text.replace('â€’', '‒'),
                        views: content.viewCountText.simpleText,
                        description: content.descriptionSnippet ? content.descriptionSnippet.runs[0].text.replace('Â ...', ' ...') : '',
                        duration: content.lengthText ? [content.lengthText.simpleText, content.lengthText.accessibility.accessibilityData.label] : ['', ''],
                        thumbnail: content.thumbnail.thumbnails,
                        link: 'https://youtu.be/' + content.videoId,
                        videoId: content.videoId,
                        author: {
                            name: content.ownerText.runs[0].text,
                            link: content.ownerText.runs[0].navigationEndpoint.commandMetadata.webCommandMetadata.url,
                            thumbnail: content.channelThumbnailWithLinkRenderer ? content.channelThumbnailWithLinkRenderer.thumbnail.thumbnails : [],
                            verified: content.ownerBadges && /BADGE_STYLE_TYPE_VERIFIED/.test(content.ownerBadges[0].metadataBadgeRenderer.style) ? /BADGE_STYLE_TYPE_VERIFIED_ARTIST/.test(content.ownerBadges[0].metadataBadgeRenderer.style) ? 'artist' : true : false
                        }
                    })
                    break
                case 'channel':
                    formatList.items.push({
                        type,
                        title: content.title ? content.title.simpleText.replace('â€’', '‒') : '',
                        description: content.descriptionSnippet ? content.descriptionSnippet.runs[0].text.replace('Â ...', ' ...') : '',
                        videoCount: content.videoCountText ? content.videoCountText.runs[0].text : '',
                        thumbnail: content.thumbnail.thumbnails,
                        subscriberCount: content.subscriberCountText ? content.subscriberCountText.simpleText.replace('Â ', ' ') : '',
                        link: 'https://youtube.com' + content.navigationEndpoint.commandMetadata.webCommandMetadata.url,
                        verified: content.ownerBadges && /BADGE_STYLE_TYPE_VERIFIED/.test(content.ownerBadges[0].metadataBadgeRenderer.style) ? /BADGE_STYLE_TYPE_VERIFIED_ARTIST/.test(content.ownerBadges[0].metadataBadgeRenderer.style) ? 'artist' : true : false
                    })
                    break
                case 'playlist':
                    formatList.items.push({
                        type,
                        title: content.title.simpleText.replace('â€’', '‒'),
                    })
                    break
            }
        }
    }
    return formatList
}

/**
 * No Operation
 */
function noop() { }

/**
 * WhatsApp Readmore Text
 */
const readMore = '​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​'

global.handlerUpdate = function (client = new Client(), last, now) {
    if (now - last > 10000) broadcast(client, {
        id: 'System (Owner)'
    }, `'./handler.js' Updated on ${now}`)
}
