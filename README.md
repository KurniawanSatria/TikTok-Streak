# TikTok Streak

## 📋 Syarat

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

### 1. Mendapatkan Cookies

#### Metode 1: Ekstensi Browser (Paling Mudah)

Install ekstensi **Cookie-Editor** atau **EditThisCookie** di Chrome/Edge:

1. Buka [Cookie-Editor](https://chrome.google.com/webstore/detail/cookie-editor/hlkenndednhfkekhgcdicfdnnnalkblc) di Chrome Web Store
2. Buka TikTok dan login
3. Klik icon ekstensi di toolbar
4. Cari cookie dengan nama `sessionid` atau cookie TikTok lainnya
5. Export semua cookie TikTok dalam format JSON

#### Metode 2: DevTools Manual

1. Buka TikTok di browser
2. Tekan `F12` atau `Ctrl+Shift+I` untuk membuka DevTools
3. Pergi ke tab **Application** (Chrome) atau **Storage** (Edge)
4. Klik **Cookies** di sidebar kiri
5. Pilih `https://www.tiktok.com`
6. Copy semua cookie dan ubah ke format JSON

#### Metode 3: Script DevTools

Buka DevTools (F12) dan jalankan script ini:

```javascript
// Copy cookies ke clipboard
copy(document.cookie.split(';').map(c => c.trim()).reduce((acc, curr) => {
  const [name, value] = curr.split('=');
  acc.push({ name, value, domain: '.tiktok.com', path: '/' });
  return acc;
}, []));
```

Lalu paste hasilnya ke file `cookies.json`.

### 2. Siapkan Session File

Buat file `cookies.json` atau `tiktok-session.json` dengan format:

```json
[
  {
    "name": "sessionid",
    "value": "your_session_id",
    "domain": ".tiktok.com",
    "path": "/",
    "expires": -1,
    "httpOnly": true,
    "secure": true
  }
]
```

**⚠️ Penting:** Pastikan cookie masih valid (belum expired). Cookie TikTok biasanya berlaku 90 hari.

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
