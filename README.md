# TikTok Streak - Automated DM Bot

Bot otomatis untuk mengirim pesan ke 16 user pertama di TikTok Business Suite Messages.

## 🚀 Fitur

- ✅ Auto-send pesan ke 16 user pertama
- ✅ Support multiple session files (cookies.json & tiktok-session.json)
- ✅ Configurable delay & loop count
- ✅ Debug mode untuk troubleshooting
- ✅ Auto-close passkey popup
- ✅ Auto-close iframe popup
- ✅ Customizable message & selectors
- ✅ Colorful logging dengan Kleur

## 📋 Prasyarat

- Node.js v16+
- Puppeteer
- Kleur

## 🛠️ Instalasi

```bash
npm install puppeteer kleur
```

## ⚙️ Konfigurasi

Edit file `config.js` untuk menyesuaikan pengaturan:

```javascript
module.exports = {
  // Browser Config
  headless: false,          // true = browser tidak terlihat
  viewportWidth: 1280,      // Lebar browser
  viewportHeight: 800,      // Tinggi browser
  
  // Loop Config
  loop: 16,                 // Jumlah user yang akan dikirim pesan
  
  // Delay Config (ms)
  delay: 2000,              // Delay antara pengiriman pesan
  pageLoadDelay: 5000,      // Delay setelah halaman load
  clickDelay: 1000,         // Delay setelah klik
  typeDelay: 50,            // Delay saat mengetik pesan
  
  // Message Config
  message: 'API',           // Pesan yang akan dikirim
  includeTimestamp: false,  // Tambahkan timestamp di awal pesan?
  
  // File Path
  cookiePath: 'cookies.json',       // Path file cookie/session
  sessionPath: 'tiktok-session.json', // Path fallback untuk session lama
  
  // Selectors (CSS selectors)
  passkeyBtn: 'button:has-text("Maybe later")',
  iframeSelector: 'iframe[data-testid*="message-index"]',
  popupBtn: '.TUXButton--secondary',
  userIconSelector: '#more-acton-icon-',
  nicknameSelector: 'p[data-e2e="dm-new-conversation-nickname"]',
  editorSelector: 'div.notranslate.public-DraftEditor-content',
  sendBtnSelectors: [
    'div[role="button"][aria-label*="send" i]',
    'button[aria-label*="send" i]',
    'div[data-e2e*="send"]',
    '[data-e2e*="send"]'
  ],
  
  // Timeouts (ms)
  iframeTimeout: 15000,
  popupTimeout: 3000,
  editorTimeout: 10000,
  navigationTimeout: 60000,
  
  // UI Config
  bannerFont: 'DOS Rebel',
  debug: false,               // Default mode
}
```

## 📝 Cara Menggunakan

### 1. Siapkan Session File

Buat file `cookies.json` atau `tiktok-session.json` dengan format:

```json
[
  {
    "name": "sessionid",
    "value": "your_session_id",
    "domain": ".tiktok.com",
    "path": "/"
  }
]
```

### 2. Jalankan Bot

```bash
# Normal mode (hanya log penting)
node index.js

# Debug mode (log semua)
node index.js --debug
```

## 🎨 Logging Colors

- 🟡 **Yellow** - Status loading/navigasi
- 🔵 **Blue** - Informasi utama
- 🟣 **Magenta** - Proses mengetik/menggunakan Enter
- 🟢 **Green** - Sukses/berhasil
- 🔴 **Red** - Error/gagal

## 📄 License

MIT License - Free to use and modify.

## 🙏 Credits

Made with 🚬 and ☕ by Saturia.
