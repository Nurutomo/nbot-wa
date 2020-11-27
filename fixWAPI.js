const fs = require('fs')
let dir = './node_modules/@open-wa/wa-automate/dist/lib/wapi.js'

const find = /\{ id: "UploadUtils", conditions: \(module\) => (module\.default && module\.default\.encryptAndUpload) \? module\.default : null \}[^,]/
const replace = `$&
                { id: "genId", conditions: (module) => (module.default && typeof module.default === 'function' && module.default.toString().match(/crypto/)) ? module.default : null }
`

text = fs.readFileSync(dir).toString()
text = text.replace(find, replace)

if (find.test(text)) fs.writeFileSync(dir, text)
console.log('Modify \'%s\' Done!', dir)
