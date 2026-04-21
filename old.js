const puppeteer = require('puppeteer')
const fs = require('fs')
const path = require('path')
const config = require('./config.js')
const figlet = require('figlet')
const { bold, red, bgCyan, yellow, blue, magenta, cyan, green, white } = require('kleur/colors')

const args = process.argv.slice(2)
const isDebug = args.includes('--debug')


const main = async () => {
const banner = figlet.textSync('TikTok Streak', {
font: 'DOS Rebel',
horizontalLayout: 'default',
verticalLayout: 'default'
})

console.clear()
console.log(bold(cyan(banner)))
console.log(yellow('\n[+] Made with 🚬 and ☕ by Saturia.'))
console.log(blue('[+] Message:', config.message))
console.log(yellow(`[+] Mode: ${isDebug ? 'Debug' : 'Normal'}\n`))

// ==================== LOAD COOKIENYA ====================
if (!fs.existsSync(path.join(__dirname, config.cookiePath))) throw new Error('Session file not found')
let credentials
try {
const data = JSON.parse(fs.readFileSync(path.join(__dirname, config.cookiePath), 'utf8'))
credentials = Array.isArray(data) ? { cookies: data } : { cookies: [data] }
} catch { throw new Error('Invalid session file') }

let browser
try {
browser = await puppeteer.launch(BROWSER_CONFIG)
const page = await browser.newPage()
await page.setViewport({ width: 1280, height: 800 })
await page.setCookie(...credentials.cookies)

// ==================== NAVIGATE TO MESSAGES ====================
if (isDebug) console.log(yellow('[+] Membuka halaman TikTok messages...'))
await page.navigate('https://www.tiktok.com/business-suite/messages?from=homepage&lang=en', {
waitUntil: 'networkidle2',
timeout: 60000
})
if (isDebug) console.log(yellow('[+] Halaman loaded, tunggu UI siap...'))
await new Promise(r => setTimeout(r, 5000))

let success = 0, failed = 0

// ==================== LOOP SAMPE 16 (GANTI KALO MAU) ====================
for (let i = 0; i < 16; i++) {
try {
// ==================== CLOSE PASSKEY POPUP (JIKA ADA) ====================
try {
const passBtn = await page.$('button:has-text("Maybe later")')
if (passBtn) {
if (isDebug) console.log(magenta('  [~] Close passkey popup...'))
await passBtn.click()
await new Promise(r => setTimeout(r, 1000))
}
} catch (e) {
// Ignore jika popup tidak ada
}

// ==================== CARI IFRAME ====================
await page.waitForFunction(() => document.querySelector('iframe[data-testid*="message-index"]'), { timeout: 15000 })
const iframeHandle = await page.$('iframe[data-testid*="message-index"]')
const frame = await iframeHandle.contentFrame()
if (!frame) throw new Error('contentFrame returned null')

// ==================== TUTUP POPUP DI IFRAME (KALO ADA) ====================
try {
await frame.waitForSelector('.TUXButton--secondary', { visible: true, timeout: 3000 })
await frame.evaluate(() => {
const btns = document.querySelectorAll('.TUXButton--secondary')
for (const b of btns) {
if (b.innerText.includes('Maybe later')) {
b.click()
break
}
}
})
await new Promise(r => setTimeout(r, 1000))
} catch (e) {
// kalo gada, kita lanjut
}

// ==================== KLIK USER ====================
const userSelector = `#more-acton-icon-${i}`
await frame.click(userSelector)

// ==================== AMBIL USERNAME ====================
const nicknameSelector = `${userSelector} p[data-e2e="dm-new-conversation-nickname"]`
const username = await frame.evaluate((sel) => {
return document.querySelector(sel)?.textContent || `user${i}`
}, nicknameSelector)

console.log(yellow(`[${i + 1}/16] Mengirim pesan ke: ${username}`))

await new Promise(r => setTimeout(r, 2000))

// ==================== CARI EDITOR DI DALAM IFRAME ====================
if (isDebug) console.log(yellow('  [~] Mencari editor...'))
await frame.waitForSelector('div.notranslate.public-DraftEditor-content', { timeout: 10000 })
const editor = await frame.$('div.notranslate.public-DraftEditor-content')
if (!editor) throw new Error('Editor not found')

// ==================== KETIK PESAN ====================
if (isDebug) console.log(magenta(`  [~] Mengetik pesan...`))
await editor.click()
await new Promise(r => setTimeout(r, 500))
await page.keyboard.type(config, { delay: 50 })
await new Promise(r => setTimeout(r, 1000))

// ==================== CARI TOMBOL ====================
if (isDebug) console.log(blue(`  [~] Mencari tombol send...`))
const sendSelectors = [
'div[role="button"][aria-label*="send" i]',
'button[aria-label*="send" i]',
'div[data-e2e*="send"]',
'[data-e2e*="send"]',
]

let sent = false
for (const selector of sendSelectors) {
const btn = await frame.$(selector)
if (btn) {
if (isDebug) console.log(yellow(`  [~] Mengirim...`))
await btn.click()
await new Promise(r => setTimeout(r, 1000))
sent = true
break
}
}

if (!sent) {
if (isDebug) console.log(magenta(`  [~] Menggunakan Enter...`))
await page.keyboard.press('Enter')
await new Promise(r => setTimeout(r, 1000))
}

console.log(green(`  [✓] Terkirim!`))
success++

} catch (e) {
if (isDebug) console.log(red(`  [✗] Error: ${e.message}`))
failed++
}

// ==================== DELAY SEBELUM LANJUT ====================
if (i < 15) {
if (isDebug) console.log(yellow(`  [~] Tunggu ${config.delay}ms...`))
await new Promise(r => setTimeout(r, config.delay))
}
}

console.log(green(`\n[+] SELESAI!`))
console.log(blue(`[+] Success: ${success}`))
console.log(red(`[+] Failed: ${failed}\n`))
await new Promise(r => setTimeout(r, 3000))

} catch (e) {
if (isDebug) console.error(red('[!] Fatal error:', e.message))
process.exit(1)
} finally {
if (browser) await browser.close()
}
}

main()