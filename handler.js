// Config
var config = {
    botName: '🔹 𝙉 O T 🔹',
    operator: ['6281515860089'].map(id => id.replace(/[^\d]/g, '') + '@c.us'),
    prefix: process.env.prefix ? new RegExp('^' + process.env.prefix) : /^[°•π÷×¶∆£¢€¥®™✓_=|~!?@#$%^&.\/\\©^]/,
    downloadStatus: false, // Curi Status Orang :|
    devMode: false, // true,
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
        listUser: user => `- @${user.replace(/^@?|@c.us$/, '')}`,
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
    sizeLimit: -Infinity, // Megabytes
    API: {
        mhankbarbar: {
            url: 'https://mhankbarbar-api--nurutomo.repl.co',
            ig: '/api/ig',
        }
    },
    features: {
        ytv: false,
        yta: false
    }
}


/*    Modules List    */

// Built-in Modules
const fs = require('fs')
const os = require('os')
const path = require('path')
const util = require('util')
const { Readable, Writable } = require('stream')

// Local Modules
delete require.cache[require.resolve('./src/database')]
delete require.cache[require.resolve('./src/event')]
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

module.exports = async function (client = new Client(), message) {
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
        const groupId = isGroupMsg ? chat.id : ''
        const groupAdmins = isGroupMsg && groupId ? await client.getGroupAdmins(groupId) : ''
        const groupMembers = isGroupMsg && groupId ? await client.getGroupMembersId(groupId) : ''
        const isGroupAdmins = groupAdmins.includes(sender ? sender.id : '') || false
        const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
        const isOperator = (sender ? config.operator.includes(sender.id) || sender.isMe : false) || false
        if (isGroupMsg) group.update(groupId, chat.groupMetadata)

        body = (type === 'chat' && cmd.prefix.test(body)) ?
            body :
            (((type === 'image' || type === 'video') && caption) && cmd.prefix.test(caption)) ?
                caption :
                ''
        const isImage = type === 'image'
        const isVideo = type === 'video'
        const isQuotedImage = quotedMsg && quotedMsg.type === 'image'
        const isQuotedVideo = quotedMsg && quotedMsg.type === 'video'
        const isQuotedAudio = quotedMsg && (quotedMsg.type === 'audio' || quotedMsg.type === 'ptt')
        const isQuotedFile = quotedMsg && quotedMsg.type === 'document'
        const isQuotedSticker = quotedMsg && quotedMsg.type === 'sticker'
        let rawText = type === 'chat' ?
            message.body :
            (type === 'image' || type === 'video') && caption ?
                message.caption : ''
        if (rawText.startsWith('> ') /* && sender.id == ownerNumber*/) {
            console.log(sender.id, 'is trying to use the execute command')
            let type = Function
            if (/await/.test(rawText)) type = AsyncFunction
            let func = new type('print', 'client', 'message', 'config', 'group', 'fetch', 'fs', 'cmd', 'require', 'ti', rawText.slice(2))
            let output
            try {
                output = func((...args) => {
                    console.log(...args)
                    client.reply(from, util.format(...args), id)
                }, client, message, config, group, fetch, fs, cmd, require, text2image)
                console.log(output)
                client.reply(from, '*Console Output*\n\n' + util.format(output), id)
            } catch (e) {
                client.reply(from, '*Console Error*\n\n' + util.format(e), id)
            }
        }

        if (isGroupMsg) group.update(chat.id, chat.groupMetadata)

        // cmd.middleware = (next, name) => {
        //     if (group.permission(groupId, sender.id, name)) next()
        //     else client.reply(from, config.msg.notAllowed)
        // }
        cmd.middleware = next => {
            if (config.devMode && isOperator) next()
            else if (!config.devMode) next()
        }


        cmd.check(body, true, client, {
            ...message,
            pushname,
            botNumber,
            groupId,
            groupAdmins,
            groupMembers,
            isGroupAdmins,
            isBotGroupAdmins,
            isOperator,
            isImage,
            isVideo,
            isQuotedImage,
            isQuotedVideo,
            isQuotedAudio,
            isQuotedFile,
            isQuotedSticker,
            rawText,
            body,
            message,
            from,
            to
        }).then(data => {
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
                else if (!isGroupMsg && message.ack < 0) console.log('[RECV]', color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), `${tipe} from`, color(pushname))
                else if (isGroupMsg && message.ack < 0) console.log('[RECV]', color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), `${tipe} from`, color(pushname), 'in', color(name || formattedTitle))
            }
        }).catch(e => {
            _err(e)
            if (e.usedPrefix) client.sendText(message.from, config.msg.error(util.format(e)))
        })
    } catch (e) {
        _err(e)
    }
}

cmd.on('help', ['menu', 'help', '?', 'tolong'], async function (client = new Client(), { from, id, pushname }) {
    try {
        client.reply(from, showHelp(this.usedPrefix, pushname, this.args[0]), id)
    } catch (e) {
        client.sendText(from, showHelp(this.usedPrefix, pushname, this.args[0]))
        _err(e)
    }
})

cmd.on('sticker', /^sti(c|)ker$/i, async function (client = new Client(), { from, id, isImage, isQuotedImage, isQuotedFile, quotedMsg, message }) {
    if (isImage || isQuotedImage || isQuotedFile) {
        const encryptMedia = isQuotedImage || isQuotedFile ? quotedMsg : message
        const _mimetype = encryptMedia.mimetype
        const mediaData = await decryptMedia(encryptMedia)
        if (_mimetype === 'image/webp') client.sendRawWebpAsSticker(from, mediaData.toString('base64'), false)

        const sticker = await processSticker(mediaData, 'contain')
        await client.sendRawWebpAsSticker(from, sticker.toString('base64'), false)
    } else client.reply(from, config.msg.noMedia, id)
})

cmd.on('meme', 'meme', async function (client = new Client(), { from, id, isImage, isQuotedImage, quotedMsg, message }) {
    if (isImage || isQuotedImage) {
        let top = ''
        let bottom = this.text
        if (/\|/.test(this.text)) {
            [top, bottom] = this.text.split('|')
        }
        const encryptMedia = isQuotedImage ? quotedMsg : message
        const mediaData = await decryptMedia(encryptMedia)
        const getUrl = await uploadImages(mediaData, false)
        const ImageBase64 = await customText(getUrl, top, bottom)
        client.sendFile(from, ImageBase64, 'image.png', '', null, true)
            .then((serialized) => console.log(`Sukses Mengirim File dengan id: ${serialized}`))
    } else client.reply(from, config.msg.noMedia, id)
})

cmd.on('memesticker', /^(memesti(c|)ker|sti(c|)kermeme)$/i, async function (client = new Client(), { from, id, isImage, isQuotedImage, quotedMsg, message }) {
    if (isImage || isQuotedImage) {
        let top = ''
        let bottom = this.text
        if (/\|/.test(this.text)) {
            [top, bottom] = this.text.split('|')
        }
        const encryptMedia = isQuotedImage ? quotedMsg : message
        const mediaData = await decryptMedia(encryptMedia)
        const getUrl = await uploadImages(mediaData, false)
        const ImageBase64 = await customText(getUrl, top, bottom)
        const stiker = await processSticker(ImageBase64, 'contain')
        client.sendRawWebpAsSticker(from, stiker.toString('base64'), false)
    } else client.reply(from, config.msg.noMedia, id)
})

cmd.on('sgif', /^(sti(c|)kergif|gifsti(c|)ker|sgif)$/i, async function (client = new Client(), { from, id, isMedia, isQuotedVideo, isQuotedFile, quotedMsg, message }) {
    if ((isMedia || isQuotedVideo || isQuotedFile) && this.args.length === 0) {
        const encryptMedia = isQuotedVideo || isQuotedFile ? quotedMsg : message
        const _mimetype = encryptMedia.mimetype
        client.reply(from, config.msg.waitConvert(_mimetype.replace(/.+\//, ''), 'webp', 'Stiker itu pakai format *webp*'), id)
        if (/image/.test(_mimetype)) client.reply(from, config.msg.recommend(this.usedPrefix, 'stiker'), id)
        console.log(color('[WAPI]'), 'Downloading and decrypting media...')
        const mediaData = await decryptMedia(encryptMedia)
        if (_mimetype === 'image/webp') client.sendRawWebpAsSticker(from, baseURI(mediaData.toString('base64')), true)
        const sticker = await stream2Buffer(write => {
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
        })
        client.sendRawWebpAsSticker(from, sticker.toString('base64'), true)
    }
})

cmd.on('add', ['add', '+'], async function (client = new Client(), { from, id, isGroupMsg, isBotGroupAdmins, botNumber, groupId }) {
    args = this.args.join(' ').split(',').map(number => number.trim())
    failed = permission([
        [!isGroupMsg, config.msg.notGroup],
        // [!isGroupAdmins, config.msg.notAdmin],
        [!isBotGroupAdmins, config.msg.notBotAdmin],
        [this.args.length === 0, config.msg.noArgs],
        [this.args.includes(botNumber.replace('@c.us', '')), config.msg.self],
    ])
    if (failed[0]) return client.reply(from, failed[1], id)
    await client.sendTextWithMentions(from, config.msg.add + args.map(config.msg.listUser).join('\n'))
    for (let i = 0; i < args.length; i++) {
        client.addParticipant(groupId, args[i] + '@c.us')
    }
})

cmd.on('kick', ['kick', '-'], async function (client = new Client(), { from, id, isGroupMsg, isGroupAdmins, isBotGroupAdmins, botNumber, groupId }) {
    failed = permission([
        [!isGroupMsg, config.msg.notGroup],
        [!isGroupAdmins, config.msg.notAdmin],
        [!isBotGroupAdmins, config.msg.notBotAdmin],
        [this.args.length === 0, config.msg.noArgs],
        [this.args.includes(botNumber), config.msg.self],
    ])
    if (failed[0]) return client.reply(from, failed[1], id)
    await client.sendTextWithMentions(from, config.msg.remove + this.args.map(config.msg.listUser).join('\n'))
    for (let i = 0; i < this.args.length; i++) {
        client.removeParticipant(groupId, this.args[i] + '@c.us')
    }
})

cmd.on('promote', ['promote', '^'], async function (client = new Client(), { from, id, isGroupMsg, isGroupAdmins, isBotGroupAdmins, mentionedJidList, groupMembers, groupAdmins, groupId, botNumber }) {
    failed = permission([
        [!isGroupMsg, config.msg.notGroup],
        [!isGroupAdmins, config.msg.notAdmin],
        [!isBotGroupAdmins, config.msg.notBotAdmin],
    ])
    if (failed[0]) return client.reply(from, failed[1], id)
    if (this.args.length > 0 && this.args[0] == '@a') mentionedJidList = groupMembers
    else if (this.args.length > 0 && this.args[0] == '@r') mentionedJidList = pickRandom(groupMembers.filter(id => !groupAdmins.includes(id)))
    failed = permission([
        [mentionedJidList.length < 1, config.msg.noJid]
    ])
    if (failed[0]) return client.reply(from, failed[1], id)
    let successList = []
    let failedList = []
    for (let mentionid of mentionedJidList) {
        if (groupAdmins.includes(mentionid) || mentionid === botNumber) {
            failedList.push(mentionid)
            continue
        }
        client.promoteParticipant(groupId, mentionid)
        successList.push(mentionid)
        // let success = await client.promoteParticipant(groupId, mentionid)
        // if (success) successList.push(mentionid)
        // else failedList.push('Maaf, Error')
    }
    client.sendTextWithMentions(from, config.msg.promoteFormat(successList, failedList))
})

cmd.on('demote', ['demote', 'v'], async function (client = new Client(), { from, id, isGroupMsg, isGroupAdmins, isBotGroupAdmins, mentionedJidList, groupMembers, groupAdmins, groupId, botNumber }) {
    failed = permission([
        [!isGroupMsg, config.msg.notGroup],
        [!isGroupAdmins, config.msg.notAdmin],
        [!isBotGroupAdmins, config.msg.notBotAdmin],
    ])
    if (failed[0]) return client.reply(from, failed[1], id)
    if (this.args.length > 0 && this.args[0] == '@a') mentionedJidList = groupAdmins
    else if (this.args.length > 0 && this.args[0] == '@r') mentionedJidList = pickRandom(groupAdmins)
    failed = permission([
        [mentionedJidList.length < 1, config.msg.noJid]
    ])
    if (failed[0]) return client.reply(from, failed[1], id)
    let successList = [],
        failedList = []
    for (let mentionid of mentionedJidList) {
        if (!groupAdmins.includes(mentionid) || mentionid === botNumber) {
            failedList.push(mentionid)
            continue
        }
        client.demoteParticipant(groupId, mentionid)
        successList.push(mentionid)
        // let success = await client.promoteParticipant(groupId, mentionid)
        // if (success) successList.push(mentionid)
        // else failedList.push('Maaf, Error')
    }
    client.sendTextWithMentions(from, config.msg.demoteFormat(successList, failedList))
})

cmd.on('resend', /^(re(send|post)|to(img|image))$/i, async function (client = new Client(), { from, id, quotedMsgObj }) {
    if (quotedMsgObj) {
        let encryptMedia
        const replyOnReply = await client.getMessageById(quotedMsgObj.id)
        const obj = replyOnReply.quotedMsgObj
        if (/ptt|audio|video|image|document|sticker/.test(quotedMsgObj.type)) encryptMedia = quotedMsgObj
        else if (obj && /ptt|audio|video|image/.test(obj.type)) encryptMedia = obj
        else return
        const _mimetype = encryptMedia.mimetype
        console.log(color('[WAPI]', 'green'), 'Downloading and decrypt media...')
        const mediaData = await decryptMedia(encryptMedia)

        if (encryptMedia.animated) {
            client.reply(from, config.msg.waitConvert('webp', 'mp4', 'Kebalikan dari gifstiker'), id)
            const sticker = await stream2Buffer(write => {
                ffmpeg(buffer2Stream(mediaData))
                    .format('mp4')
                    .on('start', commandLine => console.log(color('[FFmpeg]'), commandLine))
                    .on('progress', progress => console.log(color('[FFmpeg]'), progress))
                    .on('end', () => console.log(color('[FFmpeg]'), 'Processing finished!'))
                    .stream(write)
            })
            client.sendRawWebpAsSticker(from, sticker.toString('base64'), true)
        } else client.sendFile(from, baseURI(mediaData, _mimetype), `file.${_mimetype.replace(/.+\//, '')}`, ':)', encryptMedia.id)
    } else client.reply(from, config.msg.noMedia, id)
})

cmd.on('ytv', /^yt((dl|)mp4|v)$/i, async function (client = new Client(), { from, id }) {
    failed = permission([
        [!this.url, config.msg.notURL]
    ])
    if (failed[0]) return client.reply(from, failed[1], id)
    let res = await ytv(this.url)
    if (res.filesize > config.sizeLimit * 1000) return client.sendImage(from, res.thumb, 'thumbs.jpg', config.msg.yt(res.title, res.filesizeF) + '\n\nUse Link: ' + res.dl_link + '\n' + config.msg.sizeExceed(res.filesizeF), id)
    client.sendImage(from, res.thumb, 'thumbs.jpg', config.msg.yt(res.title, res.filesizeF) + '\n' + res.dl_link, id)
    client.sendFileFromUrl(from, res.dl_link, `media.${res.ext}`, config.msg.yt(res.title, res.filesizeF), id)

})

cmd.on('yta', /^yt((dl|)mp3|a)$/i, async function (client = new Client(), { from, id }) {
    failed = permission([
        [!this.url, config.msg.notURL]
    ])
    if (failed[0]) return client.reply(from, failed[1], id)
    let res = await yta(this.url)
    if (res.filesize > config.sizeLimit * 1000) return client.sendImage(from, res.thumb, 'thumbs.jpg', config.msg.yt(res.title, res.filesizeF) + '\n\nUse Link: ' + res.dl_link + '\n' + config.msg.sizeExceed(res.filesizeF), id)
    client.sendImage(from, res.thumb, 'thumbs.jpg', config.msg.yt(res.title, res.filesizeF) + '\n' + res.dl_link, id)
    client.sendFileFromUrl(from, res.dl_link, `media.${res.ext}`, config.msg.yt(res.title, res.filesizeF), id)
})

cmd.on('ping', /^((bot|)stat(s|)|botinfo|infobot|ping|speed)$/i, async function (client = new Client(), { from, botNumber, t }) {
    const loadedMsg = await client.getAmountOfLoadedMessages()
    const chatIds = await client.getAllChatIds()
    const groups = await client.getAllGroups()
    const groupsIn = groups.filter(x => x.groupMetadata.participants.map(x => [botNumber, '6281515860089@c.us'].includes(x.id._serialized)).includes(true))
    const me = await client.getMe()
    const battery = await client.getBatteryLevel()
    const isCharging = await client.getIsPlugged()
    const used = process.memoryUsage()
    const cpus = os.cpus().map(cpu => {
        cpu.total = Object.keys(cpu.times).reduce((last, type) => last + cpu.times[type], 0)
        return cpu
    })
    const cpu = cpus.reduce((last, cpu, _, { length }) => {
        last.total += cpu.total
        last.speed += cpu.speed / length
        last.times.user += cpu.times.user
        last.times.nice += cpu.times.nice
        last.times.sys += cpu.times.sys
        last.times.idle += cpu.times.idle
        last.times.irq += cpu.times.irq
        return last
    }, {
        speed: 0,
        total: 0,
        times: {
            user: 0,
            nice: 0,
            sys: 0,
            idle: 0,
            irq: 0
        }
    })
    const speed = moment() / 1000 - t
    client.sendText(from, `
Merespon dalam ${speed} detik

💬 Status :
- *${loadedMsg}* Loaded Messages
- *${groups.length}* Group Chats
- *${groupsIn.length}* Groups Joined
- *${groups.length - groupsIn.length}* Groups Left
- *${chatIds.length - groups.length}* Personal Chats
- *${chatIds.length - groups.length - groupsIn.length}* Personal Chats Active
- *${chatIds.length}* Total Chats
- *${chatIds.length - groupsIn.length}* Total Chats Active

📱 *Phone Info* :
${monospace(`
🔋 Battery : ${battery}% ${isCharging ? '🔌 Charging...' : '⚡ Discharging'}
${Object.keys(me.phone).map(key => `${key} : ${me.phone[key]}`).join('\n')}
`.trim())}

💻 *Server Info* :
RAM: ${format(os.totalmem() - os.freemem())} / ${format(os.totalmem())}

_NodeJS Memory Usage_
${monospace(Object.keys(used).map(key => `${key} : ${format(used[key])}`).join('\n'))}

_Total CPU Usage_
${cpus[0].model.trim()} (${cpu.speed} MHZ)\n${Object.keys(cpu.times).map(type => `- *${(type + '*').padEnd(6)}: ${(100 * cpu.times[type] / cpu.total).toFixed(2)}%`).join('\n')}

_CPU Core(s) Usage (${cpus.length} Core CPU)_
${cpus.map((cpu, i) => `${i + 1}. ${cpu.model.trim()} (${cpu.speed} MHZ)\n${Object.keys(cpu.times).map(type => `- *${(type + '*').padEnd(6)}: ${(100 * cpu.times[type] / cpu.total).toFixed(2)}%`).join('\n')}`).join('\n\n')}
`.trim())
})

cmd.on('nulis', /^(mager|)[nt]ulis$/i, async function (client = new Client(), { from, id }) {
    let text = this.text || (quotedMsgObj ? quotedMsgObj.body : '')
    failed = permission([
        [!text, config.msg.noArgs]
    ])
    if (failed[0]) return client.reply(from, failed[1], id)
    let font = text2image.loadFont('./src/IndieFlower')
    // client.reply(from, config.msg.waitConvert('jpeg', 'png', '...'), id)
    let pages = await nulis(font, text, 1)
    console.log(pages)
    client.sendFile(from, 'data:image/jpg;base64,' + pages.toString('base64'), 'nulis.png', ':v', id)
    // for (let i = 0; i < pages.length; i++) {
    //     client.sendFile(from, 'data:image/jpg;base64,' + pages[i].toString('base64'), 'nulis.png', ':v', id)
    // }
})

cmd.on('ig', /^ig(dl|)$/i, async function (client = new Client(), { from, id }) {
    failed = permission([
        [!this.url, config.msg.notURL]
    ])
    if (failed[0]) return client.reply(from, failed[1], id)
    let res = await mhankbarbar('ig', '?url=' + encodeURIComponent(this.url))
    let json = await res.json()
    client.sendFile(from, json.result, 'ig', '', id)
})

cmd.on('source', 'source', async function (client = new Client(), { from, id }) {
    client.sendLinkWithAutoPreview(from, 'https://github.com/Nurutomo/nbot-wa', 'Repository:\nhttps://github.com/Nurutomo/nbot-wa')
})

cmd.on('mp3', ['mp3', 'audio'], async function (client = new Client(), { from, id, isQuotedVideo, quotedMsg, message }) {
    if (isQuotedVideo) {
        client.reply(from, config.msg.waitConvert('mp4', 'mp3', 'Meng-ekstrak audio dari video'), id)
        const encryptMedia = isQuotedVideo ? quotedMsg : message
        const _mimetype = isQuotedVideo ? quotedMsg.mimetype : mimetype
        console.log(color('[WAPI]', 'green'), 'Downloading and decrypt media...')
        const mediaData = await decryptMedia(encryptMedia)
        const audio = stream2Buffer(write => {
            ffmpeg(buffer2Stream(mediaData))
                .format('mp3')
                .on('start', commandLine => console.log(color('[FFmpeg]'), commandLine))
                .on('progress', progress => console.log(color('[FFmpeg]'), progress))
                .on('end', () => console.log(color('[FFmpeg]'), 'Processing finished!'))
                .stream(write)
        })
        client.sendFile(from, baseURI(audio, 'audio/mp3'), 'bass_boosted.mp3', '', id)
    } else if (this.text) {
        let search = await ytsr(this.text)
        let ss = await ssPage(search.link, 1000)
        client.sendFile(from, ss, 'yt.png', `Menampilkan hasil untuk ${search.correctQuery ? `*${search.correctQuery}* atau telusuri _${search.query}_` : `*${search.query}*`}\n\n${search.items.map(config.msg.ytsearch).join('\n\n')}`, id)
    }
})

cmd.on('ss', /^ss(s|)$/i, async function (client = new Client(), { from, id }) {
    if (/\d/.test(this.args[0])) {
        let page = await client.getPage()
        let index = parseInt(this.args[0], 10)
        await page.evaluate(index => new Store.OpenChat().openChat(Store.Chat._models.filter(t=>!t.__x_isGroup)[index].__x_id._serialized), index)
    }
    let ss = await client.getSnapshot()
    let pic = await client.sendImage(from, ss, 'screenshot.png', '', id, true)
    setTimeout(() => {
        client.deleteMessage(from, pic, false)
    }, 20000)
})

cmd.on('fs', 'fs', async function (client = new Client(), { from, id }) {
    client.sendText(from, monospace(tree(__dirname, {
        exclude: [/node_modules/, /status/],
        depth: 5
    }).replace(/── (.+)/g, (_, group) => `── ${/\..+/.test(group) ? '📄' : '📁'} ${group}`)))
})

cmd.on('distord', ['distord', 'distorsi', 'earrape'], async function (client = new Client(), { from, id, isQuotedAudio, isQuotedVideo, quotedMsg, message }) {
    if (isQuotedAudio || isQuotedVideo) {
        const encryptMedia = isQuotedAudio || isQuotedVideo ? quotedMsg : message
        const _mimetype = encryptMedia.mimetype
        client.reply(from, config.msg.waitConvert(_mimetype.replace(/.+\//, ''), 'mp3', '⚠ WARNING ⚠\n🔇 Tau lah :v'), id)
        console.log(color('[WAPI]', 'green'), 'Downloading and decrypt media...')
        const mediaData = await decryptMedia(encryptMedia)
        const distord = await stream2Buffer(write => {
            ffmpeg(buffer2Stream(mediaData))
                .audioFilter('aeval=sgn(val(ch))')
                .format('mp3')
                .on('start', commandLine => console.log(color('[FFmpeg]'), commandLine))
                .on('progress', progress => console.log(color('[FFmpeg]'), progress))
                .on('end', () => console.log(color('[FFmpeg]'), 'Processing finished!'))
                .stream(write)
        })
        client.sendFile(from, baseURI(distord, 'audio/mp3'), 'distorted.mp3', '', id)
    } else if (isQuotedVideo) {
        // // Bantuin ffmpeg nya :')
        // // biar bisa video filter sama audio filter
        client.reply(from, config.msg.waitConvert('mp4', 'mp4', '⚠ WARNING ⚠\n🔇 Tau lah :v'), id)
        const encryptMedia = isQuotedVideo ? quotedMsg : message
        console.log(color('[WAPI]', 'green'), 'Downloading and decrypt media...')
        const mediaData = await decryptMedia(encryptMedia)
        const distord = await stream2Buffer(write => {
            ffmpeg(buffer2Stream(mediaData))
                .complexFilter('scale=iw/2:ih/2,eq=saturation=100:contrast=10:brightness=0.3:gamma=10,noise=alls=100:allf=t,unsharp=5:5:1.25:5:5:1,eq=gamma_r=100:gamma=50,scale=iw/5:ih/5,scale=iw*4:ih*4,eq=brightness=-.1,unsharp=5:5:1.25:5:5:1')
                .audioFilter('aeval=sgn(val(ch))')
                .outputOptions(
                    '-codec:v', 'libx264',
                    '-crf', '32',
                    '-preset', 'veryfast'
                )
                .format('mp4')
                .on('start', commandLine => console.log(color('[FFmpeg]'), commandLine))
                .on('progress', progress => console.log(color('[FFmpeg]'), progress))
                .on('end', () => console.log(color('[FFmpeg]'), 'Processing finished!'))
                .stream(write)
        })
        client.sendFile(from, baseURI(distord, 'video/mp4'), 'distorted.mp4', '', id)
    }
})

cmd.on('ssweb', 'ssweb', async function (client = new Client(), { from, id }) {
    if (this.url) {
        try {
            if (!/^file|^http(s|):\/\//.test(this.url)) url = 'https://' + this.url
            else url = this.url
            let ss = await ssPage(url, this.args[1])
            client.sendImage(from, ss, 'screenshot.png', url, id)
        } catch (e) {
            client.reply(from, config.msg.error(e), id)
        }
    }
})

cmd.on('sswebf', 'sswebf', async function (client = new Client(), { from, id }) {
    if (this.url) {
        try {
            if (!/^file|^http(s|):\/\//.test(this.url)) url = 'https://' + this.url
            else url = this.url
            let [ss] = await Promise.all([
                ssPage(url, this.args[1], true),
                // ssPage(url, this.args[1], true, true)
            ])
            client.sendImage(from, ss, 'screenshot.png', url, id)
            // client.sendFile(from, ssPDF, 'screenshot.pdf', url, id)
        } catch (e) {
            client.reply(from, config.msg.error(e), id)
        }
    }
})

cmd.on('google', 'google', async function (client = new Client(), { from, id }) {
    if (this.url) {
        try {
            let url = 'https://google.com/search?q=' + encodeURIComponent(this.text)
            let ss = await ssPage(url, 1000, false)
            await client.sendImage(from, ss, 'screenshot.png', url, id)
            // await client.sendImage(from, ssFull, 'screenshot.png', url, id)
            // client.sendFile(from, ssPDF, 'screenshot.pdf', url, id)
        } catch (e) {
            client.reply(from, config.msg.error(e), id)
        }
    }
})

cmd.on('googlef', 'googlef', async function (client = new Client(), { from, id }) {
    if (this.url) {
        try {
            let url = 'https://google.com/search?q=' + encodeURIComponent(this.text) + '&tbm=isch'
            let ss = await ssPage(url, 1000, false)
            await client.sendImage(from, ss, 'screenshot.png', url, id)
            // await client.sendImage(from, ssFull, 'screenshot.png', url, id)
            // client.sendFile(from, ssPDF, 'screenshot.pdf', url, id)
        } catch (e) {
            client.reply(from, config.msg.error(e), id)
        }
    }
})

cmd.on('style', /^style|gaya$/i, async function (client = new Client(), { from, id, quotedMsgObj }) {
    let text = ''
    switch (useQuoted(this.text, quotedMsgObj)) {
        case !0:
            text = await stylizeText(quotedMsgObj.body)
            client.reply(from, Object.keys(text).map(name => `*${name}*\n${text[name]}`).join('\n\n'), id)
            break
        case !1:
            text = await stylizeText(this.text)
            client.sendText(from, Object.keys(text).map(name => `*${name}*\n${text[name]}`).join('\n\n'))
            break
        default:
            client.reply(from, config.msg.noArgs, id)
    }
})

cmd.on('bass', /^(bass(boost|)|fullbass)$/i, async function (client = new Client(), { from, id, quotedMsg }) {
    if (isQuotedAudio) {
        let dB = 20
        let freq = 60
        if (this.args[0]) dB = clamp(parseInt(this.args[0]) || 20, 0, 50)
        if (this.args[1]) freq = clamp(parseInt(this.args[1]) || 20, 20, 500)
        console.log(color('[WAPI]', 'green'), 'Downloading and decrypt media...')
        const mediaData = await decryptMedia(quotedMsg)
        const bass = await stream2Buffer(write => {
            ffmpeg(buffer2Stream(mediaData))
                .audioFilter('equalizer=f=' + freq + ':width_type=o:width=2:g=' + dB)
                .format('mp3')
                .on('start', commandLine => console.log(color('[FFmpeg]'), commandLine))
                .on('progress', progress => console.log(color('[FFmpeg]'), progress))
                .on('end', () => console.log(color('[FFmpeg]'), 'Processing finished!'))
                .stream(write)
        })
        client.sendFile(from, baseURI(bass, 'audio/mp3'), 'bass_boosted.mp3', '', id)
    }
})

cmd.on('setuserrole', 'setuserrole', async function (client = new Client(), { from, id, isGroupMsg, mentionedJidList }) {
    failed = permission([
        [!isGroupMsg, config.msg.notGroup],
        [mentionedJidList.length < 1, config.msg.noJid]
    ])
    if (failed[0]) return client.reply(from, failed[1], id)

    let successList = []
    let failedList = []
    let users = /@(\d{5,15}) (\d+)/g.exec(this.text)
    for (let [, user, role] of users) {
        if (group.setMemberRole(groupId, user + '@c.us', role)) successList.push(user + '@c.us')
        else failedList.push(user + '@c.us')
    }
    client.sendTextWithMentions(from, `Done:\n${successList.map(config.msg.listUser)}\n\nFailed:\n${failedList.map(config.msg.listUser)}`)
})

cmd.on('getuserrole', 'getuserrole', async function (client = new Client(), { from, id, isGroupMsg, mentionedJidList, groupId }) {
    failed = permission([
        [!isGroupMsg, config.msg.notGroup],
        [mentionedJidList.length < 1, config.msg.noJid]
    ])
    if (failed[0]) return client.reply(from, failed[1], id)


    client.sendTextWithMentions(from, mentionedJidList.map(user => `@${user.replace('@c.us', '')} ${group.getRoleById(groupId, user)}`))
})

cmd.on('setrole', 'setrole', async function (client = new Client(), { from, id, isGroupMsg }) {
    failed = permission([
        [!isGroupMsg, config.msg.notGroup],
        [this.args.length < 3, config.msg.noArgs]
    ])
    if (failed[0]) return client.reply(from, failed[1], id)

    if (this.args[1] === 'name') this.args[2] = this.args[2]
    else if (this.args[1] === 'id') this.args[2] = parseInt(this.args[2])
    else this.args[2] = !!this.args[2]
    if (group.setRole(groupId, this.args[0], this.args[1], this.args.slice(2).join(' '))) client.reply(from, config.msg.success, id)
    else client.reply(from, config.msg.failed, id)
})

cmd.on('rolelist', 'rolelist', async function (client = new Client(), { from, id, isGroupMsg, groupId }) {
    failed = permission([
        [!isGroupMsg, config.msg.notGroup]
    ])
    if (failed[0]) return client.reply(from, failed[1], id)

    client.sendText(from, group.data[groupId].roles.map(role => {
        return `*${role.name}*\n${monospace(JSON.stringify(role.name, null, 1))}`
    }).join('\n\n'))
})

cmd.on('broadcast', ['broadcast', 'bc'], async function (client = new Client(), { from, id, isOperator, sender }) {
    failed = permission([
        [!isOperator, config.msg.notAllowed]
    ])
    if (failed[0]) return client.reply(from, failed[1], id)
    if (Object.keys(group.data).filter(chatId => group.data[chatId].broadcast).length > 0) client.reply(from, `Mengirim broadcast ke ${Object.keys(group.data).filter(chatId => group.data[chatId].broadcast).length} grup...`, id)
    else client.reply(from, 'Tidak ada penerima', id)
    broadcast(client, sender, this.text)
})

cmd.on('allowbroadcast', 'allowbroadcast', async function (client = new Client(), { from, id, isGroupMsg, isGroupAdmins, isOperator }) {
    if (!isOperator) {
        failed = permission([
            [!isGroupMsg, config.msg.notGroup],
            [!isGroupAdmins, config.msg.notAdmin]
        ])
        if (failed[0]) return client.reply(from, failed[1], id)
    }
    bool = /^(y|ya|yes|enable|activate|true|1)$/i.test(this.args[0])
    group.setAllowBroadcast(groupId, bool)
    client.reply(from, `Allow receive broadcast from bot to this group is now set to *${bool ? 'en' : 'dis'}abled*`, id)
})

cmd.on('ttsticker', ['ttsticker', 'ttstiker', 't2s'], async function (client = new Client(), { from, id, quotedMsgObj }) {
    let text = this.text || (quotedMsgObj ? quotedMsgObj.body : '')
    failed = permission([
        [!text, config.msg.noArgs]
    ])
    if (failed[0]) return client.reply(from, failed[1], id)
    let font = text2image.loadFont('Futura Bold Italic font')
    let imgText = await text2image.convert(font, text.slice(0, 50), 0, 0, 512, {
        attr: 'fill="#fff"',
        align: 'center'
    })
    let sticker = await processSticker(imgText)
    client.sendRawWebpAsSticker(from, baseURI(sticker.toString('base64'), 'image/webp'))
})

cmd.on('keylist', 'keylist', async function (client = new Client(), { from, id }) {
    client.reply(from, `List:\n${Object.keys(this._events).join('\n')}`, id)
})

cmd.on('test', 'test', function (_, o) {
    // client.sendText('6281515860089@c.us', util.format(_, o))
    console.log(this)
})

cmd.on('ytsr', /^((yt|youtube)(search|sr)|lagu|musik|nyanyi|sing|song|play)$/, async function (client = new Client(), { from, id }) {
    const search = await ytsr(this.text)
    const ss = await ssPage(search.link, 1000)
    client.sendFile(from, ss, 'yt.png', `Menampilkan hasil untuk ${search.correctQuery ? `*${search.correctQuery}* atau telusuri _${search.query}_` : `*${search.query}*`}\n\n${search.items.map(config.msg.ytsearch).join('\n\n')}`, id)
})

cmd.on('deepfry', ['deepfry', 'goreng'], async function (client = new Client(), { from, id, isImage, isQuotedImage, isQuotedSticker, quotedMsg, message }) {
    if (isImage || isQuotedImage || isQuotedSticker) {
        if (isQuotedSticker) client.reply(from, config.msg.waitConvert('webp (jpg 3x)', 'webp (jpg 3x)', 'Sedang menggoreng stiker:v (4 kali)'), id)
        else client.reply(from, config.msg.waitConvert('jpg', 'jpg', 'Sedang menggoreng:v (4 kali)'), id)
        const encryptMedia = !isImage && (isQuotedImage || isQuotedSticker) ? quotedMsg : message
        console.log(color('[WAPI]', 'green'), 'Downloading and decrypt media...')
        const mediaData = await decryptMedia(encryptMedia)
        // .complexFilter('eq=saturation=100:contrast=10:brightness=0.1:gamma=10,noise=alls=60:allf=t,unsharp=5:5:1.25:5:5:1,eq=gamma_r=100')
        const filter = 'eq=saturation=100,unsharp=5:5:1.25:5:5:1.0,noise=alls=40:allf=t'
        const quality = '20'
        let fry = await stream2Buffer(write => {
            ffmpeg(buffer2Stream(mediaData))
                .complexFilter(filter + ',scale=iw/2:ih/2')
                .outputOptions('-q:v', quality)
                .format('mjpeg')
                .on('start', commandLine => console.log(color('[FFmpeg]'), commandLine))
                .on('progress', progress => console.log(color('[FFmpeg]'), progress))
                .on('end', () => console.log(color('[FFmpeg]'), 'Processing finished!'))
                .stream(write)
        })
        fry = await stream2Buffer(write => {
            ffmpeg(buffer2Stream(fry))
                .complexFilter(filter + ',scale=iw/2:ih/2')
                .outputOptions('-q:v', quality)
                .format('mjpeg')
                .on('start', commandLine => console.log(color('[FFmpeg]'), commandLine))
                .on('progress', progress => console.log(color('[FFmpeg]'), progress))
                .on('end', () => console.log(color('[FFmpeg]'), 'Processing finished!'))
                .stream(write)
        })
        fry = await stream2Buffer(write => {
            ffmpeg(buffer2Stream(fry))
                .complexFilter(filter)
                .outputOptions('-q:v', quality)
                .format('mjpeg')
                .on('start', commandLine => console.log(color('[FFmpeg]'), commandLine))
                .on('progress', progress => console.log(color('[FFmpeg]'), progress))
                .on('end', () => console.log(color('[FFmpeg]'), 'Processing finished!'))
                .stream(write)
        })
        fry = await stream2Buffer(write => {
            ffmpeg(buffer2Stream(fry))
                .complexFilter(filter)
                .outputOptions('-q:v', quality)
                .format('mjpeg')
                .on('start', commandLine => console.log(color('[FFmpeg]'), commandLine))
                .on('progress', progress => console.log(color('[FFmpeg]'), progress))
                .on('end', () => console.log(color('[FFmpeg]'), 'Processing finished!'))
                .stream(write)
        })
        if (isQuotedSticker) {
            fry = await processSticker(fry, 'contain')
            client.sendRawWebpAsSticker(from, fry.toString('base64'))
        }
        else client.sendFile(from, baseURI(fry, 'image/jpg'), 'deepfry.jpg', 'Nih gorengannya (deepfry)', id)
    } else client.reply(from, config.msg.noMedia, id)
})

cmd.on('random', ['random', 'rng', 'dice', 'acak'], async function (client = new Client(), { from, id }) {
    let min = this.args.length > 1 ? parseFloat(this.args[0]) : 1
    let max = this.args.length > 1 ? parseFloat(this.args[1]) : 12
    if (min > max) [min, max] = [max, min]

    let rng = Math.floor(Math.random() * (max - min + 1))
    client.reply(from, `🎲 ${rng}\nRange: ${min} - ${max}`, id)
})

cmd.on('freeup', ['freeup', 'cutcache', 'cutmsgcache'], async function (client = new Client(), { from, id, isOperator }) {
    failed = permission([
        [!isOperator, config.msg.notAllowed]
    ])
    if (failed[0]) return client.reply(from, failed[1], id)
    let before = await client.getAmountOfLoadedMessages()
    await client.cutMsgCache()
    let after = await client.getAmountOfLoadedMessages()
    client.reply(from, `*Message Cache Cutted*\n_RAM Free Up_\n\nBefore: ${before} Messages\nAfter: ${after} Messages`, id)
})

cmd.on('title', ['title', 'settitle', 'judul', 'ubahjudul'], async function (client = new Client(), { from, id, isGroupMsg, isGroupAdmins, isBotGroupAdmins, groupId }) {
    failed = permission([
        [!isGroupMsg, config.msg.notGroup],
        [!isGroupAdmins, config.msg.notAdmin],
        [!isBotGroupAdmins, config.msg.notBotAdmin],
        [!cmd.text, config.msg.noArgs],
    ])
    if (failed[0]) return client.reply(from, failed[1], id)
    client.setGroupTitle(groupId, cmd.text)
})

cmd.on('desc', /^((set|)desc(ription|)|(ubah|)deskripsi)/i, async function (client = new Client(), { from, id, isGroupMsg, isGroupAdmins, isBotGroupAdmins, groupId }) {
    failed = permission([
        [!isGroupMsg, config.msg.notGroup],
        [!isGroupAdmins, config.msg.notAdmin],
        [!isBotGroupAdmins, config.msg.notBotAdmin],
        [!cmd.text, config.msg.noArgs],
    ])
    if (failed[0]) return client.reply(from, failed[1], id)
    client.setGroupDescription(groupId, cmd.text)
})

cmd.on('lock', ['lock', 'kunci', 'tutup'], async function (client = new Client(), { from, id, isGroupMsg, isGroupAdmins, isBotGroupAdmins, groupId }) {
    failed = permission([
        [!isGroupMsg, config.msg.notGroup],
        [!isGroupAdmins, config.msg.notAdmin],
        [!isBotGroupAdmins, config.msg.notBotAdmin],
    ])
    if (failed[0]) return client.reply(from, failed[1], id)
    client.setGroupEditToAdminsOnly(groupId, true)
})

cmd.on('unlock', ['unlock', 'buka'], async function (client = new Client(), { from, id, isGroupMsg, isGroupAdmins, isBotGroupAdmins, groupId }) {
    failed = permission([
        [!isGroupMsg, config.msg.notGroup],
        [!isGroupAdmins, config.msg.notAdmin],
        [!isBotGroupAdmins, config.msg.notBotAdmin],
    ])
    if (failed[0]) return client.reply(from, failed[1], id)
    client.setGroupEditToAdminsOnly(groupId, false)
})

cmd.on('adminlist', ['adminlist', 'listadmin', 'admins'], async function (client = new Client(), { from, id, isGroupMsg, groupAdmins }) {
    failed = permission([
        [!isGroupMsg, config.msg.notGroup]
    ])
    if (failed[0]) return client.reply(from, failed[1], id)
    client.sendTextWithMentions(from, `List Admin:\n${groupAdmins.map(config.msg.listUser)}`)
})

/*
Template Command Baru

cmd.on('nama', ['command'], async function (client = new Client(), { from, id }) {
    failed = permission([
        [!cmd.text, config.msg.noArgs]
    ])
    if (failed[0]) return client.reply(from, failed[1], id)
    client.reply(from, 'pesan', id)
})

*/
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
        timeout: 120000,
        headless: false
    });
    console.log(chromeText, 'Browser Launched')
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
😂 *${prefix}deepfry*
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
        if (typeof input == 'string' && /^data/.test(input)) input = Buffer.from(input.replace(/^data:.+;base64,/, ''))
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
    return new Promise(async function (resolve, reject) {
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
    return new Promise(async function (resolve, reject) {
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
    return new Promise(async function (resolve, reject) {
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
    return new Promise((resolve, reject) => {
        fetch('http://qaz.wtf/u/convert.cgi?text=' + encodeURIComponent(text))
            .then(res => res.text())
            .then(html => {
                let dom = new JSDOM(html)
                let table = dom.window.document.querySelector('table').children[0].children
                let obj = {}
                for (let tr of table) {
                    let name = tr.querySelector('.aname').innerHTML
                    let content = tr.children[1].textContent.replace(/^\n/, '').replace(/\n$/, '')
                    obj[name + (obj[name] ? ' Reversed' : '')] = content
                }
                resolve(obj)
            })
            .catch(reject)
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
    return new Promise(async function (resolve, reject) {
        try {
            text = text.replace(/\r\n/g, '\n')
            let kata = ''
            let size = 20

            if (!Array.isArray(text)) {
                let tempkata = ''
                for (let i of [...text]) {
                    if (i != '\n' && font.getAdvanceWidth(tempkata + i, size) < 734) tempkata += i
                    else {
                        kata += tempkata + '\n'
                        tempkata = i
                    }
                }
                if (tempkata) kata += tempkata
            } else kata = text.join('\n')

            let fixText = kata.split('\n').slice(0, 25).join('\n')
            let textImage = await text2image.convert(font, fixText, 170, 200, size, {
                lineHeight: 19.5
            })
            sharp('./src/buku.jpg').composite([
                {
                    input: textImage,
                    gravity: 'northwest'
                }
            ]).toBuffer((err, buf) => {
                if (err) reject(err)
                resolve(buf)
            })
        } catch (e) {
            reject(e)
        }
    })
}
// function nulis(font, text, pagesLimit = 38) {
//     return new Promise(async function (resolve, reject) {
//         try {
//             text = text.replace(/\r\n/g, '\n')
//             let spliter = []
//             let size = 20

//             if (!Array.isArray(text)) {
//                 let tempkata = ''
//                 let kata = ''
//                 for (let i of [...text]) {
//                     if (i != '\n' && font.getAdvanceWidth(tempkata + i, size) < 734) tempkata += i
//                     else {
//                         kata += tempkata + '\n'
//                         tempkata = i
//                     }
//                 }
//                 if (tempkata) kata += tempkata
//                 spliter = kata.split('\n')
//             } else spliter = text

//             let line = 200
//             let lines = []
//             for (let i of spliter) {
//                 lines.push(text2image.convert(font, i, 170, line, size))
//                 line += 19.5 // 39.5
//             }
//             lines = await Promise.all(lines)
//             sharp('./src/buku.jpg').composite(lines.map(a => {
//                 return {
//                     input: a,
//                     gravity: 'northwest'
//                 }
//             })).toBuffer((err, buf) => {
//                 if (err) reject(err)
//                 resolve(buf)
//             })
//         } catch (e) {
//             reject(e)
//         }
//     })
// }

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
    // if (now - last > 10000) broadcast(client, {
    //     id: 'System (Owner)'
    // }, `'./handler.js' Updated on ${now}`)
}
