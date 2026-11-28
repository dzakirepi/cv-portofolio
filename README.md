# Portfolio — Dzaki Repi Nugroho

Website portofolio pribadi: **React (Vite)** untuk frontend dan **Go** untuk backend.
Tanpa database dan tanpa dashboard admin. Semua konten ada di file JSON/Markdown.

```
cv-portofolio/
├── backend/                 # Go (standard library saja, tanpa dependency)
│   ├── content/             # ← SEMUA KONTEN WEBSITE ADA DI SINI
│   │   ├── profile.json     #   nama, bio, foto, kontak, sosmed, statistik
│   │   ├── projects.json    #   daftar proyek
│   │   ├── skills.json      #   keahlian per kategori
│   │   ├── experience.json  #   pengalaman kerja
│   │   ├── education.json   #   pendidikan
│   │   ├── certificates.json
│   │   └── articles/*.md    #   artikel blog (Markdown)
│   └── *.go
└── frontend/                # React + Vite
    ├── public/images/       # foto profil, gambar proyek & cover blog
    ├── public/files/        # CV (PDF)
    └── src/
```

## Menjalankan di komputer (development)

Butuh **Go 1.21+** dan **Node.js 20+**. Buka dua terminal:

```bash
# Terminal 1 — backend (http://localhost:8080)
cd backend
go run .

# Terminal 2 — frontend (http://localhost:2303)
cd frontend
npm install
npm run dev
```

Buka **http://localhost:2303**. Vite otomatis meneruskan request `/api` ke backend.

## Mengganti konten

Edit file di `backend/content/`, simpan, lalu refresh browser. Backend **tidak perlu di-restart**.

- **Teks dua bahasa**: tulis sebagai `{ "id": "teks Indonesia", "en": "English text" }`.
  Teks biasa (tanpa `id`/`en`) juga boleh dan akan tampil sama di kedua bahasa.
- **Foto profil**: `frontend/public/images/profile.webp`. Untuk mengganti, taruh foto baru di folder itu lalu ubah
  `"photo"` di `profile.json` menjadi `"/images/profile.png"`.
  Foto dengan **latar transparan (PNG)** akan terlihat paling mirip mockup.
  Latar foto bisa dihapus gratis di remove.bg.
- **CV**: ganti `frontend/public/files/cv-dzaki-repi-nugroho.pdf` dengan CV asli.
  Kosongkan `"cv"` jika tombol Download CV tidak ingin ditampilkan.
- **Proyek**: tambah item di `projects.json` (sinopsis, overview, fitur, tech, gambar).
  `"featured": true` = tampil di beranda (maks. 4). Gambar proyek taruh di
  `frontend/public/images/projects/`; gambar pertama dipakai sebagai cover kartu.
  Halaman detail otomatis tersedia di `/projects/<slug>`.
- **Sertifikat**: taruh file PDF/JPG di `frontend/public/certificates/`, lalu tambah satu
  baris di `certificates.json` (`"category"`: `certification`, `course`, `event`, atau
  `organization`). PDF ditampilkan langsung di browser, tidak perlu diubah jadi gambar.
- **Statistik hero** (12+, 8+, …): atur di `profile.json` → `"stats"`.
  Jika dikosongkan, angka dihitung otomatis dari jumlah data.
- **Artikel blog**: buat file baru `backend/content/articles/judul-artikel.md`:

  ```markdown
  ---
  title: Judul Artikel
  date: 2025-06-01
  readTime: 5 min read
  cover: /images/blog/cover.jpg
  excerpt: Ringkasan singkat
  tags: React, Golang
  draft: false
  ---
  Isi artikel dalam **Markdown**...
  ```

  Nama file menjadi URL-nya: `/blog/judul-artikel`. Isi `draft: true` untuk menyembunyikan artikel.

## Form kontak (kirim ke email)

Salin `backend/.env.example` menjadi `backend/.env`, lalu isi pengaturan SMTP.
Untuk Gmail, buat **App Password** di https://myaccount.google.com/apppasswords
(akun harus sudah memakai verifikasi 2 langkah).

Selama SMTP belum diatur, pesan dari form tetap diterima dan dicatat di log backend.
Form sudah dilengkapi validasi, honeypot anti-bot, dan batas 5 pesan per IP per jam.

## Build & deploy (satu aplikasi saja)

Backend Go sekaligus men-serve hasil build React, jadi cukup deploy satu aplikasi:

```bash
cd frontend && npm install && npm run build   # hasil di frontend/dist
cd ../backend && go build -o portfolio .
./portfolio                                    # buka http://localhost:8080
```

Karena tidak ada data yang ditulis ke disk, aplikasi ini aman di-deploy ke hosting
yang filesystem-nya sementara (Render, Railway, Fly.io, VPS, dll.).

Contoh di **Render** (Web Service):
- Build command: `cd frontend && npm ci && npm run build && cd ../backend && go build -o portfolio .`
- Start command: `cd backend && ./portfolio`
- Environment: isi variabel SMTP dari `.env.example`. `PORT` diatur otomatis oleh Render.

## API

| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/api/v1/portfolio` | Seluruh konten (profil, proyek, skill, pengalaman, pendidikan, sertifikat, daftar artikel) |
| GET | `/api/v1/articles/{slug}` | Satu artikel lengkap dengan isi Markdown |
| POST | `/api/v1/contact` | Kirim pesan `{ name, email, message }` |
| GET | `/api/v1/health` | Cek status server |
