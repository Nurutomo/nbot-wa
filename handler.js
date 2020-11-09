// Config
const config = {
    botName: '🔹 𝙉 O T 🔹',
    operator: ['6281515860089@c.us', '6289505648879@c.us'],
    downloadStatus: false, // Curi Status Orang :|
    msg: {
        notAdmin: '🔰 Maaf anda bukan admin',
        notGroup: '👨‍👩‍👧‍👦 Fitur ini hanya bisa digunakan di grup',
        notBotAdmin: '🔰 Bot belum menjadi admin',
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
        waitConvert: (a, b, desc) => `⏱ Tunggu beberapa detik!\nSedang melakukan proses konversi *${a}* → *${b}*${desc ? `\n\n_${desc}_` : ''}`,
        broadcast: (sender, msg) => `📢 *BROADCAST* 📢\n_From: @${sender.id}_\n\n${msg}`,
        error: e => `⚠ *ERROR* ⚠\n\n${e}`,
    },
    iklan: [
        'Grup: https://chat.whatsapp.com/KkZns1hc7FbErRvRMu4GBM',
        'API: https://repl.it/@Nurutomo/MhankBarBar-Api',
    ],
    stickerGIF: {
        fps: 30, // Lumayan
        quality: 1, // Buriq?
        target: '1M',
        duration: 20 // Detik (Durasi Maksimal)
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
const { Writable } = require('stream')

// Local Modules
const { GroupData } = require('./src/database')
const group = new GroupData()

// External Modules
const ffmpeg = require('fluent-ffmpeg')
const sharp = require('sharp')
const { decryptMedia, Client } = require('@open-wa/wa-automate')
const fetch = require('node-fetch')
const chalk = require('chalk')
const moment = require('moment-timezone')
moment.tz.setDefault('Asia/Jakarta').locale('id')
const { fromBuffer } = require('file-type')
const puppeteer = require('puppeteer')
const chromeText = bgColor(color(`[${color('Ch', '#1DA462') + color('ro', '#DD5144') + color('me', '#FFCD46')}]`, '#4C8BF5'), '#112')
const FormData = require('form-data')
// const dirTree = require("directory-tree")
const tree = require('tree-node-cli');
const Utils = require('web-audio-api/build/utils')
const wav = require('node-wav')
const { JSDOM } = require('jsdom')
const PImage = require('pureimage')
const { measureText } = require('pureimage/src/text.js')
try {
    var font = PImage.registerFont('IndieFlower.ttf', 'IndieFlower').loadSync()
} catch (e) { }
const { sizeFormatter } = require('human-readable')
const format = sizeFormatter({
    std: 'JEDEC', // 'SI' (default) | 'IEC' | 'JEDEC'
    decimalPlaces: 2,
    keepTrailingZeroes: false,
    render: (literal, symbol) => `${literal} ${symbol}B`,
})
// const  = require('')

// Internal Modules
const AsyncFunction = Object.getPrototypeOf(async function () { }).constructor

// Variables
const ytIdRegex = /(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:watch\?.*(?:|\&)v=|embed\/|v\/)|youtu\.be\/)([-_0-9A-Za-z]{11})/
var buku

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
        const prefix = /^[!@#$%^&.\/\\^]/
        body = (type === 'chat' && prefix.test(body)) ?
            body :
            (((type === 'image' || type === 'video') && caption) && prefix.test(caption)) ?
                caption :
                ''
        const isQuotedImage = quotedMsg && quotedMsg.type === 'image'
        const isQuotedVideo = quotedMsg && quotedMsg.type === 'video'
        const isQuotedAudio = quotedMsg && (quotedMsg.type === 'audio' || quotedMsg.type === 'ptt' || quotedMsg.type === 'ppt')
        const isQuotedFile = quotedMsg && quotedMsg.type === 'document'
        let rawText = type === 'chat' ?
            message.body :
            (type === 'image' || type === 'video') && caption ?
                message.caption :
                ''
        let { usedPrefix, command, args, text, url } = parseCmd(prefix, body)

        if (message.body && /video|image|chat/.test(message.type)) console.log(rawText.slice(0, 192))
        if (rawText.startsWith('> ')/* && sender.id == ownerNumber*/) {
            console.log(sender.id, 'is trying to use the execute command')
            let type = Function
            if (/await/.test(rawText)) type = AsyncFunction
            let func = new type('print', 'client', 'message', 'config', 'group', rawText.slice(2))
            let output
            try {
                output = func((...args) => {
                    console.log(...args)
                    if (args.length < 2) client.sendTextWithMentions(from, args[0])
                    else client.sendTextWithMentions(from, JSON.stringify(args))
                }, client, message, config, group)
                await client.reply(from, '*Console Output*\n\n' + output, id)
            } catch (e) {
                await client.reply(from, '*Console Error*\n\n' + e, id)
            }
        }

        let tipe = bgColor(color(type.replace(/^./, (str) => str.toUpperCase()) + (from.startsWith('status') ? ' Status' : ''), 'black'), 'yellow')
        if (!usedPrefix && !isGroupMsg && sender && sender.isMe) { return console.log('[RECV]', color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), `${tipe} from`, color(pushname)), 'in', color(name || formattedTitle) }
        else if (!usedPrefix && !isGroupMsg) { return console.log('[RECV]', color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), `${tipe} from`, color(pushname)) }
        else if (!usedPrefix && isGroupMsg) { return console.log('[RECV]', color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), `${tipe} from`, color(pushname), 'in', color(name || formattedTitle)) }
        if (usedPrefix && !isGroupMsg && sender && sender.isMe) { console.log(color('[EXEC]'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname), 'in', color(name || formattedTitle)) }
        else if (usedPrefix && !isGroupMsg) { console.log(color('[EXEC]'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname)) }
        else if (usedPrefix && isGroupMsg) { console.log(color('[EXEC]'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname), 'in', color(name || formattedTitle)) }


        let c = match(command, isGroupMsg, groupId, sender.id, reason => client.reply(from, reason, id))
        try {
            switch (true) {
                case c(/^(menu|help|\?)$/i, '?'):
                    client.reply(from, showHelp(usedPrefix, pushname, args[0]), id)
                    break
                case c(/^(speed|ping|\?)$/i, 'ping'):
                    client.sendText(from, `Pong!\nMerespon dalam ${moment() / 1000 - t} detik`)
                    break
                case c(/^sti(c|)ker$/i, 'sticker'):
                    // TODO: Sticker
                    if (isMedia || isQuotedImage || isQuotedFile) {
                        const encryptMedia = isQuotedImage || isQuotedFile ? quotedMsg : message
                        const _mimetype = encryptMedia.mimetype
                        const mediaData = await decryptMedia(encryptMedia)
                        if (_mimetype === 'image/webp') client.sendRawWebpAsSticker(from, mediaData.toString('base64'), false)

                        const stiker = await processSticker(mediaData, 'contain')
                        await client.sendRawWebpAsSticker(from, stiker.toString('base64'), false)
                    }
                    break
                case c(/^meme$/i, 'meme'):
                    if (isMedia || isQuotedImage) {
                        let top = ''
                        let bottom = text
                        if (/\|/.test(text)) {
                            [top, bottom] = text.split('|')
                        }
                        const encryptMedia = isQuotedImage ? quotedMsg : message
                        const mediaData = await decryptMedia(encryptMedia)
                        const getUrl = await uploadImages(mediaData, false)
                        const ImageBase64 = await customText(getUrl, top, bottom)
                        client.sendFile(from, ImageBase64, 'image.png', '', null, true)
                            .then((serialized) => console.log(`Sukses Mengirim File dengan id: ${serialized}`))
                            .catch((err) => console.log(color('[ERROR]', 'red'), err))
                    } else {
                        await client.reply(from, config.msg.noMedia, id)
                    }
                    break
                case c(/^(memesti(c|)ker|sti(c|)kermeme)$/i, 'memesticker'):
                    if (isMedia || isQuotedImage) {
                        let top = ''
                        let bottom = text
                        if (/\|/.test(text)) {
                            [top, bottom] = text.split('|')
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
                    break
                case c(/sti(c|)kergif|gifsti(c|)ker|sgif/i, 'sgif'):
                    // TODO: Sticker GIF
                    if ((isMedia || isQuotedVideo || isQuotedFile) && args.length === 0) {
                        const encryptMedia = isQuotedVideo || isQuotedFile ? quotedMsg : message
                        const _mimetype = isQuotedVideo || isQuotedFile ? quotedMsg.mimetype : mimetype
                        client.reply(from, config.msg.waitConvert(_mimetype.replace(/.+\//, ''), 'webp', 'Stiker itu pakai format *webp*'), id)
                        if (/image/.test(_mimetype)) client.reply(from, config.msg.recommend(usedPrefix, 'stiker'), id)
                        console.log(color('[WAPI]'), 'Downloading and decrypting media...')
                        const mediaData = await decryptMedia(encryptMedia)
                        if (_mimetype === 'image/webp') client.sendRawWebpAsSticker(from, mediaData.toString('base64'), true)
                        let temp = './temp'
                        let name = new Date() * 1
                        let fileInputPath = path.join(temp, /(.+)\//.exec(_mimetype)[1], `${name}.${_mimetype.replace(/.+\//, '')}`)
                        let fileOutputPath = path.join(temp, 'webp', `${name}.webp`)
                        console.log(color('[fs'), `Writing media file into '${fileInputPath}'`)
                        fs.writeFile(fileInputPath, mediaData, err => {
                            if (err) return client.sendText(from, config.msg.error('Ada yang error saat menulis file\n\n' + err)) && console.log(color('[ERROR]', 'red'), err)
                            // ffmpeg -y -t 5 -i <input_file> -vf "scale=512:512:flags=lanczos:force_original_aspect_ratio=decrease" -qscale 100 <output_file>.webp
                            ffmpeg(fileInputPath)
                                .inputOptions([
                                    '-y',
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
                                .on('start', function (commandLine) {
                                    console.log(color('[FFmpeg]'), commandLine)
                                })
                                .on('progress', function (progress) {
                                    console.log(color('[FFmpeg]'), progress, '')
                                })
                                .on('end', function () {
                                    console.log(color('[FFmpeg]'), 'Processing finished!')
                                    fs.readFile(fileOutputPath, { encoding: 'base64' }, async (err, base64) => {
                                        if (err) return client.sendText(from, config.msg.error('Ada yang error saat membaca file .webp\n\n' + err)) && console.log(color('[ERROR]', 'red'), err)
                                        try {
                                            await client.sendRawWebpAsSticker(from, base64, true)
                                        } catch (e) {
                                            console.log(color('[ERROR]', 'red'), e)
                                            client.sendText(from, config.msg.error('Ada yang error saat mengirim stiker\n\n' + e))
                                        }
                                        setTimeout(() => {
                                            try {
                                                fs.unlinkSync(fileInputPath)
                                                fs.unlinkSync(fileOutputPath)
                                            } catch (e) {
                                                console.log(color('[ERROR]', 'red'), e)
                                            }
                                        }, 5000)
                                    })
                                })
                                .save(fileOutputPath)
                        })
                    }
                    break
                case c(/^(add|\+)$/i, 'add'):
                    // TODO: Add Users
                    args = args.join(' ').split(',').map(number => number.trim())
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
                    break
                case c(/^(kick|\-)$/i, 'kick'):
                    // TODO: Kick Users
                    failed = permission([
                        [!isGroupMsg, config.msg.notGroup],
                        [!isGroupAdmins, config.msg.notAdmin],
                        [!isBotGroupAdmins, config.msg.notBotAdmin],
                        [args.length === 0, config.msg.noArgs],
                        [args.includes(botNumber), config.msg.self],
                    ])
                    if (failed[0]) return client.reply(from, failed[1], id)
                    await client.sendTextWithMentions(from, config.msg.remove + args.map(config.msg.listUser).join('\n'))
                    for (let i = 0; i < args.length; i++) {
                        client.removeParticipant(groupId, args[i] + '@c.us')
                    }
                    break
                case c(/^(promote|\^)$/i, 'promote'):
                    // TODO: Promote Users
                    failed = permission([
                        [!isGroupMsg, config.msg.notGroup],
                        [!isGroupAdmins, config.msg.notAdmin],
                        [!isBotGroupAdmins, config.msg.notBotAdmin],
                    ])
                    if (failed[0]) return client.reply(from, failed[1], id)
                    if (args.length > 0 && args[0] == '@a') mentionedJidList = groupMembers
                    else if (args.length > 0 && args[0] == '@r') mentionedJidList = pickRandom(groupMembers.filter(id => !groupAdmins.includes(id)))
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
                    break
                case c(/^(demote|v)$/i, 'demote'):
                    // TODO: Demote Users
                    failed = permission([
                        [!isGroupMsg, config.msg.notGroup],
                        [!isGroupAdmins, config.msg.notAdmin],
                        [!isBotGroupAdmins, config.msg.notBotAdmin],
                    ])
                    if (failed[0]) return client.reply(from, failed[1], id)
                    if (args.length > 0 && args[0] == '@a') mentionedJidList = groupMembers
                    else if (args.length > 0 && args[0] == '@r') mentionedJidList = pickRandom(groupAdmins)
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
                    break
                case c(/^re(send|post)$/i, 'resend'):
                    // TODO: Repost Media
                    if (quotedMsgObj) {
                        let encryptMedia
                        let replyOnReply = await client.getMessageById(quotedMsgObj.id)
                        let obj = replyOnReply.quotedMsgObj
                        if (/ptt|audio|video|image|document|sticker/.test(quotedMsgObj.type)) {
                            encryptMedia = quotedMsgObj
                            if (encryptMedia.animated) encryptMedia.mimetype = ''
                        } else if (obj && /ptt|audio|video|image/.test(obj.type)) {
                            encryptMedia = obj
                        } else return
                        const _mimetype = encryptMedia.mimetype
                        const mediaData = await decryptMedia(encryptMedia)
                        await client.sendFile(from, `data:${_mimetype};base64,${mediaData.toString('base64')}`, 'file', ':)', encryptMedia.id)
                    } else client.reply(from, config.msg.noMedia, id)
                    break
                case c(/^yt((dl|)mp4|v)$/i, 'ytv'):
                    failed = permission([
                        [!url, config.msg.notURL]
                    ])
                    if (failed[0]) return client.repl(from, failed[1], id)
                    yta(url)
                        .then(res => {
                            if (res.filesize > config.sizeLimit * 1000) return client.sendImage(from, res.thumb, 'thumbs.jpg', config.msg.yt(res.title, res.filesizeF) + '\n\n' + config.msg.sizeExceed(res.filesizeF), id)
                            client.sendImage(from, res.thumb, 'thumbs.jpg', config.msg.yt(res.title, res.filesizeF) + '\n' + res.dl_link, id)
                            client.sendFileFromUrl(from, res.dl_link, `media.${res.ext}`, config.msg.yt(res.title, res.filesizeF), id)
                        })
                    // mhankbarbar('ytv', '?url=' + encodeURIComponent(url))
                    //     .then(res => res.json())
                    //     .then(res => {
                    //         if (res.status) {
                    //             if (parseFloat(res.filesize) * (1024 * /MB/.test(res.filesize)) > config.sizeLimit * 1024) client.reply(from, config.msg.sizeExceed(res.filesize, id))
                    //             client.sendImage(from, res.thumb, 'thumbs.jpg', config.msg.yt(res.title, res.filesize), id)
                    //             client.sendFileFromUrl(from, res.result, `music.${res.ext}`, config.msg.yt(res.title, res.filesize), id)
                    //         } else {
                    //             client.reply(from, config.msg.error(res.error), id)
                    //             console.log(res.error)
                    //         }
                    //     })
                    break
                case c(/^yt((dl|)mp3|a)$/i, 'yta'):
                    failed = permission([
                        [!url, config.msg.notURL]
                    ])
                    if (failed[0]) return client.reply(from, failed[1], id)
                    yta(url)
                        .then(res => {
                            client.sendImage(from, res.thumb, 'thumbs.jpg', config.msg.yt(res.title, res.filesizeF) + '\n' + res.dl_link, id)
                            client.sendFileFromUrl(from, res.dl_link, `media.${res.ext}`, config.msg.yt(res.title, res.filesizeF), id)
                        })
                    // mhankbarbar('yta', '?url=' + encodeURIComponent(url))
                    //     .then(res => res.json())
                    //     .then(res => {
                    //         if (res.status) {
                    //             client.sendImage(from, res.thumb, 'thumbs.jpg', config.msg.yt(res.title, res.filesize), id)
                    //             client.sendFileFromUrl(from, res.result, `music.${res.ext}`, config.msg.yt(res.title, res.filesize), id)
                    //         } else {
                    //             client.reply(from, config.msg.error(res.error), id)
                    //             console.log(res.error)
                    //         }
                    //     })
                    break
                case c(/^((bot|)stat(s|)|botinfo|infobot)$/i, 'stat'):
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
                    break
                case c(/^[nt]ulis$/i, 'nulis'):
                    text = text || (quotedMsgObj ? quotedMsgObj.body : '')
                    failed = permission([
                        [!text, config.msg.noArgs]
                    ])
                    text = text.split('\n').slice(0, 25)
                    if (failed[0]) return client.reply(from, failed[1], id)
                    else {
                        let converter = new Writable();
                        converter._write = chunk => {
                            client.sendFile(from, `data:image/jpeg;base64,${chunk.toString('base64')}`, 'nulis.jpg', 'Sukses', id)
                        }
                        let output = await nulis(text)
                        console.log(output)
                        // for (let image of output) {
                        PImage.encodeJPEGToStream(output, converter, 100)
                        // }
                        setTimeout(() => {
                            converter.end()
                            delete converter
                        }, 5000)
                    }
                    // mhankbarbar('nulis', '?text=' + encodeURIComponent(text))
                    //     .then(res => res.json())
                    //     .then(res => {
                    //         client.sendFile(from, res.result, 'nulis.jpg', '*Isi Teks*\n\n' + monospace(text), id)
                    //     })
                    break
                case c(/^ig(dl|)$/i, 'ig'):
                    failed = permission([
                        [!url, config.msg.notURL]
                    ])
                    if (failed[0]) return client.repl(from, failed[1], id)
                    mhankbarbar('ig', '?url=' + encodeURIComponent(url))
                        .then(res => res.json())
                        .then(res => {
                            client.sendFile(from, res.result, 'ig', '', id)
                        })
                    break
                case c(/^source$/i, 'source'):
                    // let selfSourceCode = fs.readFileSync(__filename)
                    // client.sendText(from, monospace(selfSourceCode))
                    await client.sendFile(from, __filename, 'handler.js')
                    await client.sendFile(from, path.join(__dirname, 'index.js'), 'index.js')
                    await client.sendFile(from, path.join(__dirname, 'package.json'), 'package.json')
                    client.sendText(from, 'Install ini Sebelum Mulai:\n- Node JS\n- FFmpeg\n- Git\n\nTutorial:\nnpm i\nnpm i node-gyp\nnode .\n_Scan QR_')
                    break
                case c(/^(mp3|audio)$/i, 'mp3'):
                    if ((isMedia || isQuotedVideo || isQuotedFile)) {
                        client.reply(from, config.msg.waitConvert('mp4', 'mp3', 'Meng-ekstrak audio dari video'), id)
                        const encryptMedia = isQuotedVideo || isQuotedFile ? quotedMsg : message
                        const _mimetype = isQuotedVideo || isQuotedFile ? quotedMsg.mimetype : mimetype
                        console.log(color('[WAPI]', 'green'), 'Downloading and decrypt media...')
                        const mediaData = await decryptMedia(encryptMedia)
                        let temp = './temp'
                        let name = new Date() * 1
                        let fileInputPath = path.join(temp, 'video', `${name}.${_mimetype.replace(/.+\//, '')}`)
                        let fileOutputPath = path.join(temp, 'audio', `${name}.mp3`)
                        console.log(color('[fs]', 'green'), `Downloading media into '${fileInputPath}'`)
                        fs.writeFile(fileInputPath, mediaData, err => {
                            if (err) return client.sendText(from, 'Ada yang error saat menulis file\n\n' + err) && console.log(color('[ERROR]', 'red'), err)
                            // ffmpeg -y -t 5 -i <input_file> -vf "scale=512:512:flags=lanczos:force_original_aspect_ratio=decrease" -qscale 100 <output_file>.webp
                            ffmpeg(fileInputPath)
                                .format('mp3')
                                .on('start', function (commandLine) {
                                    console.log(color('[FFmpeg]', 'green'), commandLine)
                                })
                                .on('progress', function (progress) {
                                    console.log(color('[FFmpeg]', 'green'), progress)
                                })
                                .on('end', function () {
                                    console.log(color('[FFmpeg]', 'green'), 'Processing finished!')
                                    // fs.readFile(fileOutputPath, { encoding: 'base64' }, (err, base64) => {
                                    // if (err) return client.sendText(from, 'Ada yang error saat membaca file .mp3') && console.log(color('[ERROR]', 'red'), err)
                                    client.sendFile(from, fileOutputPath, 'audio.mp3', '', id)
                                    // })
                                    setTimeout(() => {
                                        try {
                                            fs.unlinkSync(fileInputPath)
                                            fs.unlinkSync(fileOutputPath)
                                        } catch (e) {
                                            console.log(color('[ERROR]', 'red'), e)
                                        }
                                    }, 30000)
                                })
                                .save(fileOutputPath)
                        })
                    }
                    break
                case c(/^ss(s|)$/i, 'ss'):
                    let ss = await client.getSnapshot()
                    let pic = await client.sendImage(from, ss, 'screenshot.png', '', id, true)
                    setTimeout(() => {
                        client.deleteMessage(pic.from, pic.id, false)
                    }, 30000)
                    break
                case c(/^fs$/, 'fs'):
                    client.sendText(from, monospace(tree(__dirname, { exclude: [/node_modules/, /status/], depth: 5 }).replace(/── (.+)/g, (_, group) => `── ${/\..+/.test(group) ? '📄' : '📁'} ${group}`)))
                    break
                case c(/^(earrape|distord|distorsi)$/i, 'distord'):
                    if (isQuotedAudio) {
                        client.reply(from, config.msg.waitConvert('mp3', 'wav', 'Biar mudah ngedit audionya ketika pake format itu'), id)
                        const encryptMedia = isQuotedAudio ? quotedMsg : message
                        const _mimetype = isQuotedAudio ? quotedMsg.mimetype : mimetype
                        console.log(color('[WAPI]', 'green'), 'Downloading and decrypt media...')
                        const mediaData = await decryptMedia(encryptMedia)
                        Utils.decodeAudioData(mediaData, (err, audioBuffer) => {
                            if (err) return client.sendText(from, config.msg.error('Ada yang error saat decoding file mp3\n\n' + e)) && console.log(e)
                            generated = audioBuffer._data.map(channel => {
                                return channel.map(value => clampFloat(distordFX(value)))
                            })

                            buffer = wav.encode(generated, {
                                sampleRate: audioBuffer.sampleRate,
                                float: true,
                                bitDepth: 32
                            })

                            let temp = './temp'
                            let name = new Date() * 1
                            let fileInputPath = path.join(temp, 'audio', `${name}.wav`)
                            let fileOutputPath = path.join(temp, 'audio', `${name}.mp3`)
                            console.log(color('[fs]', 'green'), `Writing media into '${fileInputPath}'`)
                            client.reply(from, config.msg.waitConvert('wav', 'mp3', 'Nah... sekarang dikembaliin lagi formatnya'), id)
                            fs.writeFile(fileInputPath, buffer, err => {
                                if (err) return client.sendText(from, config.msg.error('Ada yang error saat menulis file\n\n' + err)) && console.log(color('[ERROR]', 'red'), err)
                                ffmpeg(fileInputPath)
                                    .format('mp3')
                                    .on('start', function (commandLine) {
                                        console.log(color('[FFmpeg]', 'green'), commandLine)
                                    })
                                    .on('progress', function (progress) {
                                        console.log(color('[FFmpeg]', 'green'), progress)
                                    })
                                    .on('end', function () {
                                        console.log(color('[FFmpeg]', 'green'), 'Processing finished!')
                                        // fs.readFile(fileOutputPath, { encoding: 'base64' }, (err, base64) => {
                                        // if (err) return client.sendText(from, 'Ada yang error saat membaca file .mp3') && console.log(color('[ERROR]', 'red'), err)
                                        client.sendFile(from, fileOutputPath, 'distorted.mp3', '', id)
                                        // })
                                        setTimeout(() => {
                                            try {
                                                fs.unlinkSync(fileInputPath)
                                                fs.unlinkSync(fileOutputPath)
                                            } catch (e) {
                                                console.log(color('[ERROR]', 'red'), e)
                                            }
                                        }, 30000)
                                    })
                                    .save(fileOutputPath)
                            })
                        })
                    }
                    break
                case c('ssweb', 'ssweb'):
                    if (url) {
                        try {
                            if (!/^file|^http(s|):\/\//.test(url)) url = 'https://' + url
                            let ss = await ssPage(url, args[1])
                            client.sendImage(from, ss, 'screenshot.png', url, id)
                        } catch (e) {
                            client.reply(from, config.msg.error(e), id)
                        }
                    }
                    break
                case c('sswebf', 'sswebfull'):
                    if (url) {
                        try {
                            if (!/^file|^http(s|):\/\//.test(url)) url = 'https://' + url
                            let [ss, ssPDF] = await Promise.all([
                                ssPage(url, args[1], true),
                                // ssPage(url, args[1], true, true)
                            ])
                            client.sendImage(from, ss, 'screenshot.png', url, id)
                            client.sendFile(from, ssPDF, 'screenshot.pdf', url, id)
                        } catch (e) {
                            client.reply(from, config.msg.error(e), id)
                        }
                    }
                    break
                case c('google', 'google'):
                    if (url) {
                        try {
                            let url = 'https://google.com/search?q=' + encodeURIComponent(text)
                            let [ss, ssFull, ssPDF] = await Promise.all([
                                ssPage(url, 1000, false),
                                ssPage(url, 1000, true),
                                // ssPage(url, 1000, true, true)
                            ])
                            await client.sendImage(from, ss, 'screenshot.png', url, id)
                            await client.sendImage(from, ssFull, 'screenshot.png', url, id)
                            client.sendFile(from, ssPDF, 'screenshot.pdf', url, id)
                        } catch (e) {
                            client.reply(from, config.msg.error(e), id)
                        }
                    }
                    break
                case c('googlef', 'googleImage'):
                    if (url) {
                        try {
                            let url = 'https://google.com/search?q=' + encodeURIComponent(text) + '&tbm=isch'
                            let ss = await ssPage(url, 1000)
                            client.sendImage(from, ss, 'screenshot.png', url, id)
                        } catch (e) {
                            client.reply(from, config.msg.error(e), id)
                        }
                    }
                    break
                case c(/^style|gaya$/i, 'style'):
                    switch (useQuoted(text, quotedMsgObj)) {
                        case !0:
                            client.reply(from, (await stylizeText(quotedMsgObj.body)), id)
                            break
                        case !1:
                            client.sendText(from, (await stylizeText(quotedMsgObj.body)))
                            break
                        default:
                            client.reply(from, config.msg.noArgs, id)
                    }
                    break
                case c(/^(bass(boost|)|fullbass)$/i, 'bass'):
                    if (isQuotedAudio) {
                        let dB = 20
                        let freq = 60
                        if (args[0]) dB = clamp(parseInt(args[0]) || 20, 0, 50)
                        if (args[1]) freq = clamp(parseInt(args[1]) || 20, 20, 500)
                        let mediaData = await decryptMedia(quotedMsg)
                        let temp = './temp'
                        let name = new Date() * 1
                        let fileInputPath = path.join(temp, 'audio', `${name}.mp3`)
                        let fileOutputPath = path.join(temp, 'audio', `${name}_2.mp3`)
                        console.log(color('[fs]', 'green'), `Writing media into '${fileInputPath}'`)
                        client.reply(from, config.msg.waitConvert('mp3', 'mp3', `Bass ${freq}hz: +${dB}dB`), id)
                        fs.writeFile(fileInputPath, mediaData, err => {
                            if (err) return client.sendText(from, config.msg.error('Ada yang error saat menulis file\n\n' + err)) && console.log(color('[ERROR]', 'red'), err)
                            ffmpeg(fileInputPath)
                                .audioFilter('equalizer=f=' + freq + ':width_type=o:width=2:g=' + dB)
                                .format('mp3')
                                .on('start', function (commandLine) {
                                    console.log(color('[FFmpeg]', 'green'), commandLine)
                                })
                                .on('progress', function (progress) {
                                    console.log(color('[FFmpeg]', 'green'), progress)
                                })
                                .on('end', function () {
                                    console.log(color('[FFmpeg]', 'green'), 'Processing finished!')
                                    // fs.readFile(fileOutputPath, { encoding: 'base64' }, (err, base64) => {
                                    // if (err) return client.sendText(from, 'Ada yang error saat membaca file .mp3') && console.log(color('[ERROR]', 'red'), err)
                                    client.sendFile(from, fileOutputPath, 'distorted.mp3', '', id)
                                    // })
                                    setTimeout(() => {
                                        try {
                                            fs.unlinkSync(fileInputPath)
                                            fs.unlinkSync(fileOutputPath)
                                        } catch (e) {
                                            console.log(color('[ERROR]', 'red'), e)
                                        }
                                    }, 30000)
                                })
                                .save(fileOutputPath)
                        })
                    }
                    break
                case c(/^link(group|)$/i, 'linkGroup'):
                // failed = permission([
                //     [!isGroup, config.msg.notGroup]
                // ])
                // if (failed[0]) return client.reply(from, failed[1], id)
                case c('test', 'test'):
                    // let groups = await client.getAllGroups()
                    // console.log(groups)
                    break
                case c('setuserrole', 'setUserRole'):
                    failed = permission([
                        [!isGroupMsg, config.msg.notGroup],
                        [mentionedJidList.length < 1, config.msg.noJid]
                    ])
                    if (failed[0]) return client.reply(from, failed[1], id)

                    let users = /@(\d{5,15}) (\d+)/g.exec(text)
                    for (let [, user, role] of users) {
                        if (group.setMemberRole(groupId, user + '@c.us', role)) successList.push('@' + user)
                        else failedList.push('@' + user)
                    }
                    client.sendTextWithMentions(from, `Done:\n${successList.map(config.msg.listUser)}\n\nFailed:\n${failedList.map(config.msg.listUser)}`)
                    break
                case c('getuserrole', 'getUserRole'):
                    failed = permission([
                        [!isGroupMsg, config.msg.notGroup],
                        [mentionedJidList.length < 1, config.msg.noJid]
                    ])
                    if (failed[0]) return client.reply(from, failed[1], id)

                    mentionedJidList.map(user => `@${user.replace('@c.us', '')} ${group.getRoleById(groupId, user)}`)
                    client.sendTextWithMentions(from, `Done:\n${successList.map(config.msg.listUser)}\n\nFailed:\n${failedList.map(config.msg.listUser)}`)
                    break
                case c('setrole', 'setRole'):
                    failed = permission([
                        [!isGroupMsg, config.msg.notGroup],
                        [args.length < 3, config.msg.noArgs]
                    ])
                    if (failed[0]) return client.reply(from, failed[1], id)

                    if (args[1] === 'name') args[2] = args[2]
                    else if (args[1] === 'id') args[2] = parseInt(args[2])
                    else args[2] = !!args[2]
                    if (group.setRole(groupId, args[0], args[1], args.slice(2).join(' '))) client.reply(from, config.msg.success, id)
                    else client.reply(from, config.msg.failed, id)
                    break
                case c('rolelist', 'roleList'):
                    failed = permission([
                        [!isGroupMsg, config.msg.notGroup]
                    ])
                    if (failed[0]) return client.reply(from, failed[1], id)

                    client.sendText(from, group.data[groupId].roles.map(role => {
                        return `*${role.name}*\n${monospace(JSON.stringify(role.name, null, 1))}`
                    }).join('\n\n'))
                    break
                case c('broadcast', 'broadcast'):
                    failed = permission([
                        [!isOperator, config.msg.notAllowed]
                    ])
                    if (failed[0]) return client.reply(from, failed[1], id)
                    client.reply(from, 'Mengirim broadcast...', id)
                    for (let chatId in group.data) {
                        if (group.data[chatId].broadcast) await client.sendTextWithMentions(chatId, config.msg.broadcast(sender, text))
                    }
                    break
                case c('allowbroadcast', 'allowBroadcast'):
                    failed = permission([
                        [!isGroupMsg, config.msg.notGroup],
                        [!isGroupAdmins, config.msg.notAdmin]
                    ])
                    if (failed[0]) return client.reply(from, failed[1], id)
                    bool = /^(y|ya|yes|enable|activate|true|1)$/i.test(args[0])
                    group.setAllowBroadcast(groupId, bool)
                    client.reply(from, `Allow receive broadcast from bot to this group is now set to *${bool ? 'en' : 'dis'}abled*`, id)
                    break
                case c('keylist', 'keylist'):
                    let keyList = [
                        'name',
                        'id',
                        'ping',
                        'sticker',
                        'meme',
                        'memesticker',
                        'sgif',
                        'add',
                        'kick',
                        'promote',
                        'demote',
                        'resend',
                        'ytv',
                        'yta',
                        'stat',
                        'nulis',
                        'ig',
                        'source',
                        'mp3',
                        'ss',
                        'fs',
                        'distord',
                        'ssweb',
                        'sswebfull',
                        'google',
                        'googleImage',
                        'style',
                        'bass',
                        'linkGroup',
                        'test',
                        'setUserRole',
                        'getUserRole',
                        'setRole',
                        'roleList',
                        'allowBroadcast',
                    ]
                    client.reply(from, `List:\n${keyList.join('\n')}`)
                    break
                default:
                    console.log(color('[????]', 'red'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`, 'red'), 'from', color(pushname), 'in', color(name || formattedTitle))
                    break
            }
        } catch (e) {
            console.log(color('[ERR]', 'red'), e)
            if (usedPrefix) client.sendText(message.from, config.msg.error(e))
        }
    } catch (e) {
        console.log(color('[ERR]', 'red'), e)
    }
}

(async () => {
    if (global.browser) return
    console.log(chromeText, 'Launching Browser')
    global.browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
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

function parseCmd(prefix = /^!/, msg = '') {
    let usedPrefix = prefix.exec(msg)
    let args = msg.replace(prefix, '').split(' ')
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

function match(body, isGroup, groupId, id, onDisabled = () => { }) {
    return (match, name) => {
        if (true||name == '?' || (isGroup && group.permission(groupId, id, name)) || !isGroup) {
            if (match instanceof RegExp) {
                return match.test(body)
            } else if (Array.isArray(match)) {
                return match.includes(body)
            } else {
                return match === body
            }
        } else {
            let reason = config.msg.notAllowed
            // onDisabled(reason)
            return false
        }
    }
}

function permission(rules) {
    for (let rule of rules) if (rule[0]) return rule
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
        nulis: `Nulis teks: *${prefix}nulis teks*`,
    })[command] || 'Tidak ditemukan [404 Not Found]' : ''
    return `
╔═ *${config.botName}*
║ 👋 Hai, ${name}!
╠═════════════════════
║ *${prefix}help* command${command ? `\n║\n║ *Info Fitur*:\n║ ${reference}` : ''}
╟─── *Menu Admin* ────
║
║ ➕ *${prefix}add* 62XXXXXXXXXX1, 62XXXXXXXXXX2
║ ➖ *${prefix}kick* @user
║ 🔼 *${prefix}promote* @user
║ 🔽 *${prefix}demote* @user
║
╟──── *Main Menu* ────
║
║ 🖼 *${prefix}stiker*
║ 📽 *${prefix}gifstiker*
║ #️⃣ *${prefix}meme* atas|bawah
║ #️⃣ *${prefix}memestiker* atas|bawah
║ ➡ *${prefix}resend*
║ 🎵 *${prefix}mp3*
║ 🔊 *${prefix}bass* desibel freqkuensi
║ ℹ *${prefix}botstat*
║ 😂 *${prefix}distord*
║ 🌐 *${prefix}ssweb* url
║ 🌐 *${prefix}sswebf* url
║ 🔎 *${prefix}google* pencarian
║ 🔎 *${prefix}googlef* pencarian
║ 📄 *${prefix}nulis* teks
║
╟──── *Downloader* ────
║
║ ❌ Maaf, fitur ini masih
║ dalam tahap pengembangan
║
║ ✅ Fitur sudah dikembangkan
║ Fitur berikut pakai API
║
║ ✔ Tanpa API
║
║ ✔ *${prefix}ytmp3* url
║ ✔ *${prefix}ytmp4* url
║ ✅ *${prefix}ig* url
║ ❌ *${prefix}fb* url
║ ❌ *${prefix}tiktok* url
║
╟──── *Butuh API* ────
║
║ • ${config.API.mhankbarbar.url} •
║ Tidak ada...
║
╟──── *Advanced* ────
║
║ *${prefix}setBroadcast* enable|disable
║ *${prefix}setUserRole* @user index
║ *${prefix}getUserRole* @user
║ *${prefix}setRole* index key value
║ *${prefix}keyList*
║ *${prefix}roleList*
║
╟──── *Operator Only* ────
║
║ **
║
╟──── *Iklan* ────
║
${(config.iklan || []).map((iklan, i) => `║ ${i + 1}. ${iklan}`).join('\n') || '║ _Tidak ada iklan_'}
║
╟──── *Bot Author* ────
║
║ Nurutomo
║ wa.me/6281515860089
║ https://github.com/Nurutomo/
║
╚═════════════════════
`.slice(1, -1)
}

function processSticker(input) {
    return new Promise((resolve, reject) => {
        sharp(input)
            .toFormat('webp')
            .resize(512, 512, {
                fit: 'contain',
                background: { r: 0, g: 0, b: 0, alpha: 0 }
            })
            .toBuffer()
            .then(data => resolve(data))
            .catch((err) => reject(err))
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
        const { ext } = await fromBuffer(buffData)
        let temp = './temp'
        let name = new Date() * 1
        let filePath = path.join(temp, 'image', `${name}.${ext}`)
        const _buffData = type ? await resizeImage(buffData, false) : buffData
        fs.writeFile(filePath, _buffData, { encoding: 'base64' }, (err) => {
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
        const { mime } = await fromBuffer(buff)
        sharp(buff, { failOnError: false })
            .toFormat('png')
            .resize(512, 512, {
                fit: 'contain',
                background: { r: 0, g: 0, b: 0, alpha: 0 }
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

function distordFX(value) {
    return value > 0 ? 1 : value < 0 ? -1 : 0
}

function clampFloat(value) {
    return value > 1 ? 1 : value < -1 ? -1 : value
}

async function ssPage(url, delay = 0, isFull, isPDF) {
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

async function nulis(text) {
    try {
        let buku = await loadJPGImg(fs.createReadStream('./src/buku.jpg'))
        let output = []
        let tulisan = PImage.make(buku.width, buku.height);
        let splitter = []
        let ctx = tulisan.getContext('2d');
        ctx.font = "27pt IndieFlower";
        ctx.drawImage(buku, 0, 0, buku.width, buku.height)

        if (!Array.isArray(text)) {
            let tempkata = ''
            let kata = ''
            for (let i of [...text]) {
                if (i != '\n' && measureText(ctx, tempkata + i).width < 734) tempkata += i
                else {
                    kata += tempkata + '\n'
                    tempkata = ''
                }
            }
            if (tempkata) kata += tempkata
            spliter = kata.split('\n')
        } else spliter = text

        let line = 222
        ctx.fillStyle = '#000';
        for (let i of spliter.slice(0, 25)) {
            ctx.fillText(i, 170, line)
            line += 39.5
        }
        output.push(tulisan)
        if (spliter.length > 25) output.push(...nulis(spliter.slice(25)))
        return output
    } catch (e) {
        console.log(e)
    }
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
                                thumb, title, filesizeF: filesize, filesize: KB
                            })
                        })
                })
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
                                thumb, title, filesizeF: filesize, filesize: KB
                            })
                        })
                })
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

function loadJPGImg(stream) {
    return new Promise(resolve => PImage.decodeJPEGFromStream(stream).then(resolve))
}