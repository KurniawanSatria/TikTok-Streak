# TikTok Streak Bot

Otomatis kirim pesan streak ke percakapan TikTok via **GitHub Actions** — jalan di cloud, ga perlu PC nyala.

## Fitur

- Login pakai cookies session TikTok
- Kirim pesan otomatis ke banyak chat
- Konfigurasi via `config.json`
- Jalan otomatis sesuai cron schedule
- Bisa di-trigger manual kapan aja

## Setup

### 1. Fork / Clone repo ke GitHub

Buat repo public dari project ini.

### 2. Setup Secret `COOKIES_JSON`

Karena repo public, cookies disimpan sebagai **GitHub Secret**:

1. Export cookies TikTok dari browser (pakai EditThisCookie / cookie-export extension)
2. Dapet JSON array, contoh:
   ```json
   [{"name":"sessionid","value":"xxx","domain":".tiktok.com"}]
   ```
3. Di repo GitHub, buka **Settings → Secrets and variables → Actions**
4. Klik **New repository secret**
   - **Name:** `COOKIES_JSON`
   - **Secret:** paste JSON cookies (compress jadi satu baris)
5. Save

### 3. Setup Config (Opsional)

Sesuain `config.json` di root repo sesuai kebutuhan:

```json
{
  "message": "Auto Streak",
  "totalUsers": 13,
  "actionDelayMs": 300,
  "headless": true
}
```

| Key | Fungsi | Default |
|---|---|---|
| `message` | Isi pesan | `"Auto Streak"` |
| `totalUsers` | Jumlah chat diproses | `13` |
| `actionDelayMs` | Delay antar chat (ms) | `300` |
| `typeDelayMs` | Delay per karakter (ms) | `0` |
| `afterSendDelayMs` | Delay setelah kirim (ms) | `500` |
| `afterClickDelayMs` | Delay setelah klik (ms) | `300` |
| `pageLoadDelayMs` | Delay tunggu halaman (ms) | `5000` |
| `finishDelayMs` | Delay sebelum tutup (ms) | `3000` |
| `headless` | Headless mode | `true` |
| `bannerFont` | Font figlet banner | `"DOS Rebel"` |
| `targetUrl` | URL pesan TikTok | `https://www.tiktok.com/messages?lang=en` |

## Menjalankan

### Otomatis (Cron)

Workflow sudah jalan otomatis setiap jam **22:00 & 00:00 WIB** (15:00 & 17:00 UTC):

```yaml
cron: "0 15 * * *"   # 22:00 WIB
cron: "0 17 * * *"   # 00:00 WIB
```

Edit schedule di `.github/workflows/TikTok-Streak.yml` kalo mau diubah.

### Manual (Workflow Dispatch)

1. Buka repo GitHub
2. **Actions → TikTok Streak → Run workflow**
3. Klik **Run workflow**, langsung jalan

Hasil log bisa dilihat realtime di tab Actions.

## Cara Kerja

1. GitHub Actions checkout repo + install dependencies
2. Inject `COOKIES_JSON` dari secrets ke environment
3. Puppeteer login pake cookies & kirim pesan ke tiap chat
4. Hasil (sukses/gagal) keluar di log Actions

## Catatan

- Cookies bisa expired. Kalo mulai gagal login, export ulang cookies dari browser dan update secret `COOKIES_JSON`
- Selector CSS TikTok bisa berubah kalo mereka update UI — fork aja dan sesuaikan selector di `index.js`
- Bot jalan di `windows-latest` runner (Chromium bundling stabil)
