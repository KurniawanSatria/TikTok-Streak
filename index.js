const puppeteer = require('puppeteer')
const fs = require('fs')
const path = require('path')
const config = require('./config.js')
const figlet = require('figlet')
const { bold, red, bgCyan, yellow, blue, magenta, cyan, green, white } = require('kleur/colors')

// ==================== PARSE COMMAND LINE ARGUMENTS ====================
const args = process.argv.slice(2)
const isDebug = args.includes('--debug') || config.debug

// ==================== BROWSER CONFIG ====================
const BROWSER_CONFIG = {
  headless: config.headless,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
}

const CREDENTIALS_FILE = path.join(__dirname, config.cookiePath)
const SESSION_FILE = path.join(__dirname, config.sessionPath)

const main = async () => {
  const banner = figlet.textSync('TikTok Streak', {
    font: config.bannerFont,
    horizontalLayout: 'default',
    verticalLayout: 'default'
  })

  console.clear()
  console.log(bold(cyan(banner)))
  console.log(yellow('\n[+] Made with 🚬 and ☕ by Saturia.'))
  console.log(blue('[+] Message:', config.message))
  console.log(yellow(`[+] Mode: ${isDebug ? 'Debug' : 'Normal'}\n`))
  console.log(magenta(`[+] Loop: ${config.loop} users\n`))

// ==================== LOAD COOKIENYA ====================
if (!fs.existsSync(CREDENTIALS_FILE) && !fs.existsSync(SESSION_FILE)) throw new Error('Session file not found')
let credentials
try {
  const data = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, 'utf8'))
  credentials = Array.isArray(data) ? { cookies: data } : { cookies: [data] }
} catch {
  try {
    const data = JSON.parse(fs.readFileSync(SESSION_FILE, 'utf8'))
    credentials = Array.isArray(data) ? { cookies: data } : { cookies: [data] }
  } catch { throw new Error('Invalid session file') }
}

let browser
try {
  browser = await puppeteer.launch(BROWSER_CONFIG)
  const page = await browser.newPage()
  await page.setViewport({ width: config.viewportWidth, height: config.viewportHeight })
  await page.setCookie(...credentials.cookies)

// ==================== NAVIGATE TO MESSAGES ====================
if (isDebug) console.log(yellow('[+] Membuka halaman TikTok messages...'))
await page.goto('https://www.tiktok.com/business-suite/messages?from=homepage&lang=en', {
  waitUntil: 'networkidle2',
  timeout: config.navigationTimeout
})
if (isDebug) console.log(yellow('[+] Halaman loaded, tunggu UI siap...'))
await new Promise(r => setTimeout(r, config.pageLoadDelay))

let success = 0, failed = 0

// ==================== LOOP SAMPE 16 (GANTI KALO MAU) ====================
for (let i = 0; i < config.loop; i++) {
  try {
    // ==================== CLOSE PASSKEY POPUP (JIKA ADA) ====================
    try {
      const passBtn = await page.$(config.passkeyBtn)
      if (passBtn) {
        if (isDebug) console.log(magenta('  [~] Close passkey popup...'))
        await passBtn.click()
        await new Promise(r => setTimeout(r, config.clickDelay))
      }
    } catch (e) {
      // Ignore jika popup tidak ada
    }

    // ==================== CARI IFRAME ====================
    await page.waitForFunction(() => document.querySelector(config.iframeSelector), { timeout: config.iframeTimeout })
    const iframeHandle = await page.$(config.iframeSelector)
    const frame = await iframeHandle.contentFrame()
    if (!frame) throw new Error('contentFrame returned null')

    // ==================== TUTUP POPUP DI IFRAME (KALO ADA) ====================
    try {
      await frame.waitForSelector(config.popupBtn, { visible: true, timeout: config.popupTimeout })
      await frame.evaluate(() => {
        const btns = document.querySelectorAll(config.popupBtn)
        for (const b of btns) {
          if (b.innerText.includes('Maybe later')) {
            b.click()
            break
          }
        }
      })
      await new Promise(r => setTimeout(r, config.clickDelay))
    } catch (e) {
      // kalo gada, kita lanjut
    }

    // ==================== KLIK USER ====================
    const userSelector = `${config.userIconSelector}${i}`
    await frame.click(userSelector)

    // ==================== AMBIL USERNAME ====================
    const nicknameSelector = `${userSelector} ${config.nicknameSelector}`
    const username = await frame.evaluate((sel) => {
      return document.querySelector(sel)?.textContent || `user${i}`
    }, nicknameSelector)

    console.log(yellow(`[${i + 1}/${config.loop}] Mengirim pesan ke: ${username}`))

    await new Promise(r => setTimeout(r, 2000))

    // ==================== CARI EDITOR DI DALAM IFRAME ====================
    if (isDebug) console.log(yellow('  [~] Mencari editor...'))
    await frame.waitForSelector(config.editorSelector, { timeout: config.editorTimeout })
    const editor = await frame.$(config.editorSelector)
    if (!editor) throw new Error('Editor not found')

    // ==================== KETIK PESAN ====================
    if (isDebug) console.log(magenta(`  [~] Mengetik pesan...`))
    await editor.click()
    await new Promise(r => setTimeout(r, 500))
    const messageToSend = config.includeTimestamp 
      ? `${new Date().toLocaleString()} ${config.message}`
      : config.message
    await page.keyboard.type(messageToSend, { delay: config.typeDelay })
    await new Promise(r => setTimeout(r, 1000))

    // ==================== CARI TOMBOL ====================
    if (isDebug) console.log(blue(`  [~] Mencari tombol send...`))
    const sendSelectors = config.sendBtnSelectors

    let sent = false
    for (const selector of sendSelectors) {
      const btn = await frame.$(selector)
      if (btn) {
        if (isDebug) console.log(yellow(`  [~] Mengirim...`))
        await btn.click()
        await new Promise(r => setTimeout(r, config.clickDelay))
        sent = true
        break
      }
    }

    if (!sent) {
      if (isDebug) console.log(magenta(`  [~] Menggunakan Enter...`))
      await page.keyboard.press('Enter')
      await new Promise(r => setTimeout(r, config.clickDelay))
    }

    console.log(green(`  [✓] Terkirim!`))
    success++

  } catch (e) {
    if (isDebug) console.log(red(`  [✗] Error: ${e.message}`))
    failed++
  }

  // ==================== DELAY SEBELUM LANJUT ====================
  if (i < config.loop - 1) {
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