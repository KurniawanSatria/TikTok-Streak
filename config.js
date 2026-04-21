module.exports = {
  // ==================== BROWSER CONFIG ====================
  headless: true,          // true = browser tidak terlihat, false = browser terbuka
  viewportWidth: 1280,      // Lebar browser
  viewportHeight: 800,      // Tinggi browser
  
  // ==================== LOOP CONFIG ====================
  loop: 16,                 // Jumlah user yang akan dikirim pesan
  
  // ==================== DELAY CONFIG ====================
  delay: 2000,              // Delay antara pengiriman pesan (ms)
  pageLoadDelay: 5000,      // Delay setelah halaman load (ms)
  clickDelay: 1000,         // Delay setelah klik (ms)
  typeDelay: 50,            // Delay saat mengetik pesan (ms)
  
  // ==================== MESSAGE CONFIG ====================
  message: 'API',           // Pesan yang akan dikirim
  includeTimestamp: false,  // Tambahkan timestamp di awal pesan?
  
  // ==================== FILE PATH ====================
  cookiePath: 'cookies.json',       // Path file cookie/session
  sessionPath: 'cookies.json', // Path fallback untuk session lama
  
  // ==================== SELECTORS ====================
  passkeyBtn: 'button:has-text("Maybe later")',  // Selector untuk tombol passkey popup
  iframeSelector: 'iframe[data-testid*="message-index"]', // Selector untuk iframe
  popupBtn: '.TUXButton--secondary',              // Selector untuk popup di iframe
  userIconSelector: '#more-acton-icon-',          // Selector untuk icon user (ditambah index)
  nicknameSelector: 'p[data-e2e="dm-new-conversation-nickname"]', // Selector untuk username
  editorSelector: 'div.notranslate.public-DraftEditor-content', // Selector untuk editor
  sendBtnSelectors: [                             // Selector untuk tombol send (urutan prioritas)
    'div[role="button"][aria-label*="send" i]',
    'button[aria-label*="send" i]',
    'div[data-e2e*="send"]',
    '[data-e2e*="send"]'
  ],
  
  // ==================== TIMEOUTS ====================
  iframeTimeout: 15000,       // Timeout menunggu iframe (ms)
  popupTimeout: 3000,         // Timeout menunggu popup (ms)
  editorTimeout: 10000,       // Timeout menunggu editor (ms)
  navigationTimeout: 60000,   // Timeout navigasi halaman (ms)
  
  // ==================== UI CONFIG ====================
  bannerFont: 'DOS Rebel',    // Font untuk banner figlet
  debug: true,               // Default mode (true = log semua, false = log penting saja)
}