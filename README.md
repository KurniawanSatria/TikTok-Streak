# TikTok Streak Bot

Script otomatisasi untuk mengirim pesan streak ke daftar percakapan TikTok menggunakan Puppeteer.

## Fitur

- Login pakai cookies (session) TikTok, tanpa perlu login manual
- Kirim pesan otomatis ke banyak chat sekaligus
- Konfigurasi fleksibel via `config.json` atau CLI args
- Cookies bisa dari file atau environment variable (cocok buat deploy/hosting)
- Mode debug untuk lihat detail proses

## Instalasi

```bash
npm install puppeteer figlet moment-timezone kleur dotenv
```

## Setup Cookies

Ada dua cara, pilih salah satu:

### 1. Pakai file `cookies.json`

Buat file `cookies.json` di folder yang sama, isinya array cookies dari browser:

```json
[
  {
    "name": "sessionid",
    "value": "xxx",
    "domain": ".tiktok.com"
  }
]
```

### 2. Pakai Environment Variable (lebih aman buat deploy)

Set env var `COOKIES_JSON` dengan isi JSON yang sama (satu baris):

```
COOKIES_JSON=[{"name":"sessionid","value":"xxx","domain":".tiktok.com"}]
```

Bisa lewat file `.env` (untuk local dev) atau langsung di environment hosting (Pterodactyl, Azure, dll).

Jika `COOKIES_JSON` ada, dia akan dipakai duluan. Kalau tidak ada, otomatis fallback ke `cookies.json`.

## Konfigurasi

Buat file `config.json` (opsional, kalau tidak ada pakai default):

```json
{
  "message": "Auto Streak",
  "totalUsers": 13,
  "actionDelayMs": 300,
  "headless": true
}
```

| Key | Deskripsi | Default |
|---|---|---|
| `message` | Isi pesan yang dikirim | `"Auto Streak"` |
| `totalUsers` | Jumlah chat yang diproses | `13` |
| `actionDelayMs` | Delay antar user (ms) | `300` |
| `typeDelayMs` | Delay tiap karakter saat mengetik (ms) | `0` |
| `afterSendDelayMs` | Delay setelah kirim pesan (ms) | `500` |
| `afterClickDelayMs` | Delay setelah klik editor (ms) | `300` |
| `pageLoadDelayMs` | Delay tunggu halaman load (ms) | `5000` |
| `finishDelayMs` | Delay sebelum browser ditutup (ms) | `3000` |
| `headless` | Jalankan browser tanpa tampilan | `true` |
| `bannerFont` | Font ASCII banner (figlet) | `"DOS Rebel"` |
| `targetUrl` | URL halaman pesan TikTok | `https://www.tiktok.com/messages?lang=en` |

## Menjalankan

```bash
node index.js
```

Dengan opsi tambahan:

```bash
node index.js --debug
node index.js --message "Halo bro" --count 16 --delay 500
```

| Flag | Fungsi |
|---|---|
| `--debug` | Tampilkan log detail tiap langkah |
| `--message <teks>` | Override isi pesan |
| `--count <angka>` | Override jumlah chat yang diproses |
| `--delay <ms>` | Override delay antar user |

## Cara Kerja

1. Browser dibuka dan login otomatis pakai cookies
2. Membuka halaman pesan TikTok
3. Untuk setiap chat dalam daftar:
   - Buka percakapan
   - Klik kotak teks
   - Ketik pesan
   - Kirim dengan `Ctrl+Enter`
4. Tampilkan ringkasan hasil (berapa sukses/gagal)

## Catatan

- Pastikan `.env` dan `cookies.json` ada di `.gitignore`, jangan ikut ter-commit
- Session cookies bisa expired, kalau bot gagal login coba ambil cookies baru
- Selector CSS bisa berubah kalau TikTok update UI, perlu disesuaikan ulang
