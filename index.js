const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const figlet = require("figlet");
const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Jakarta");
const {
  bold,
  red,
  bgCyan,
  yellow,
  blue,
  magenta,
  cyan,
  green,
  white,
} = require("kleur/colors");

const args = process.argv.slice(2);
const isDebug = args.includes("--debug");
const CREDENTIALS_FILE = path.join(__dirname, "cookies.json");
const CONFIG_FILE = path.join(__dirname, "config.json");

const DEFAULT_CONFIG = {
  message: "API",
  totalUsers: 13,
  actionDelayMs: 300,
  typeDelayMs: 0,
  afterSendDelayMs: 500,
  afterClickDelayMs: 300,
  pageLoadDelayMs: 5000,
  finishDelayMs: 3000,
  headless: true,
  bannerFont: "DOS Rebel",
  targetUrl: "https://www.tiktok.com/messages?lang=en",
};

const loadConfig = () => {
  let fileConfig = {};
  if (fs.existsSync(CONFIG_FILE)) {
    try {
      fileConfig = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8"));
    } catch {
      fileConfig = {};
    }
  }
  const merged = { ...DEFAULT_CONFIG, ...fileConfig };
  const getArg = (flag) => {
    const idx = args.indexOf(flag);
    return idx !== -1 ? args[idx + 1] : null;
  };
  const message = getArg("--message");
  const count = getArg("--count");
  const delay = getArg("--delay");
  if (message) merged.message = message;
  if (count) merged.totalUsers = parseInt(count, 10);
  if (delay) merged.actionDelayMs = parseInt(delay, 10);
  return merged;
};

const CONFIG = loadConfig();

const BROWSER_CONFIG = {
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
  headless: CONFIG.headless,
};

const main = async () => {
  const banner = figlet.textSync("TikTok Streak", {
    font: CONFIG.bannerFont,
    horizontalLayout: "default",
    verticalLayout: "default",
  });
  console.clear();
  console.log(bold(cyan(banner)));
  console.log(yellow("\n[+] Made with 🚬 and ☕ by Saturia."));
  console.log(blue("[+] Message:", CONFIG.message));
  console.log(magenta("[+] Delay:", `${CONFIG.actionDelayMs} ms\n`));
  console.log(yellow(`[+] Mode: ${isDebug ? "Debug" : "Normal"}\n`));
  let credentials;
  if (process.env.COOKIES_JSON) {
    try {
      const data = JSON.parse(process.env.COOKIES_JSON);
      credentials = Array.isArray(data) ? { cookies: data } : { cookies: [data] };
      console.log(green("[+] Cookies loaded from COOKIES_JSON env var"));
    } catch {
      throw new Error("Invalid COOKIES_JSON environment variable");
    }
  } else if (fs.existsSync(CREDENTIALS_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, "utf8"));
      credentials = Array.isArray(data) ? { cookies: data } : { cookies: [data] };
      console.log(yellow("[+] Cookies loaded from cookies.json (local only)"));
    } catch {
      throw new Error("Invalid session file");
    }
  } else {
    throw new Error(
      "Session not found. Set COOKIES_JSON env var or create cookies.json",
    );
  }
  let browser;
  try {
    browser = await puppeteer.launch(BROWSER_CONFIG);
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.setCookie(...credentials.cookies);
    if (isDebug) console.log(yellow("[+] Membuka halaman TikTok messages..."));
    await page.goto(CONFIG.targetUrl, {
      waitUntil: "networkidle2",
      timeout: 60000,
    });
    if (isDebug) console.log(yellow("[+] Halaman loaded, tunggu UI siap..."));
    await new Promise((r) => setTimeout(r, CONFIG.pageLoadDelayMs));
    let success = 0,
      failed = 0;
    for (let i = 0; i < CONFIG.totalUsers; i++) {
      try {
        const frame = page;
        try {
          await frame.waitForSelector(".TUXButton--secondary", {
            visible: true,
            timeout: 3000,
          });
          await frame.evaluate(() => {
            const btns = document.querySelectorAll(".TUXButton--secondary");
            for (const b of btns) {
              if (b.innerText.includes("Maybe later")) {
                b.click();
                break;
              }
            }
          });
          await new Promise((r) => setTimeout(r, 100));
        } catch (e) {}
        const userSelector = `div[data-index="${i}"] [data-e2e="dm-new-conversation-item"]`;
        await frame.waitForSelector(userSelector, { timeout: 3000 });
        await frame.click(userSelector);
        const nicknameSelector = `div[data-index="${i}"] [data-e2e="dm-new-conversation-nickname"]`;
        const username = await frame.evaluate((sel) => {
          return document.querySelector(sel)?.textContent || `user${i}`;
        }, nicknameSelector);
        console.log(
          yellow(
            `\n[${i + 1}/${CONFIG.totalUsers}] Mengirim pesan ke: ${username}`,
          ),
        );
        await new Promise((r) => setTimeout(r, 500));
        if (isDebug) console.log(yellow("  [~] Mencari editor..."));
        await frame.waitForSelector(
          "div.notranslate.public-DraftEditor-content",
          { timeout: 3000 },
        );
        const editor = await frame.$(
          "div.notranslate.public-DraftEditor-content",
        );
        if (!editor) throw new Error("Editor not found");
        await editor.click();
        await new Promise((r) => setTimeout(r, CONFIG.afterClickDelayMs));
        await page.keyboard.type(CONFIG.message, { delay: CONFIG.typeDelayMs });
        await new Promise((r) => setTimeout(r, CONFIG.afterSendDelayMs));
        if (isDebug) console.log(blue("  [~] Mengirim dengan Ctrl+Enter..."));
        await page.keyboard.down("Control");
        await page.keyboard.press("Enter");
        await page.keyboard.up("Control");
        await new Promise((r) => setTimeout(r, CONFIG.afterSendDelayMs));
        console.log(green(`  [✓] Terkirim!`));
        success++;
      } catch (e) {
        if (isDebug) console.log(red(`  [✗] Error: ${e.message}`));
        failed++;
      }
      if (i < CONFIG.totalUsers - 1) {
        if (isDebug)
          console.log(yellow(`  [~] Tunggu ${CONFIG.actionDelayMs} ms...`));
        await new Promise((r) => setTimeout(r, CONFIG.actionDelayMs));
      }
    }
    console.log(green(`\n[+] SELESAI!`));
    console.log(blue(`[+] Success: ${success}`));
    console.log(red(`[+] Failed: ${failed}\n`));
    await new Promise((r) => setTimeout(r, CONFIG.finishDelayMs));
  } catch (e) {
    if (isDebug) console.error(red("[!] Fatal error:", e.message));
    process.exit(1);
  } finally {
    if (browser) await browser.close();
  }
};
main();
