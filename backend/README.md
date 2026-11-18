# Dzaki Personal Portfolio Backend

Backend portfolio berbasis Go + Fiber dengan penyimpanan JSON di disk. Tidak menggunakan PostgreSQL.

## Persyaratan
- Go 1.21 atau lebih baru

## Menjalankan di Windows PowerShell
1. Masuk ke folder `backend`.
2. Salin `.env.example` menjadi `.env`, lalu atur nilainya. Backend otomatis membaca file `.env`.
3. Jalankan:
   ```powershell
   go mod tidy
   go run .
   ```
5. Buka `http://localhost:8080/portfolio`.

## URL penting
- `GET /portfolio` — informasi backend portfolio (URL utama backend).
- `GET /api/v1/portfolio` — gabungan data portfolio publik.
- `GET /api/v1/public/projects` — daftar project published.
- `POST /api/v1/auth/login` — login admin.
- `GET /api/v1/admin/me` — profil admin dari token.
- `GET|POST /api/v1/admin/:collection` — list/create.
- `PUT|DELETE /api/v1/admin/:collection/:id` — update/delete.
- `POST /api/v1/admin/upload` — upload file dengan multipart field `file`.
- `POST /api/v1/contact` — kirim pesan kontak publik.
- `GET /uploads/:filename` — file yang telah diunggah.

Collection yang dapat dikelola: `profile`, `projects`, `skills`, `experience`, `education`, `certificates`, `articles`, `categories`, `social_links`, `settings`, `media`.
Pesan kontak hanya bisa dibaca admin melalui `/api/v1/admin/messages`.

## Login
Akun admin pertama dibuat otomatis saat server pertama kali berjalan:
- Username dari `ADMIN_USERNAME` (default lokal: `admin`)
- Password dari `ADMIN_PASSWORD` (default lokal: `ChangeMe123!`)

Segera ubah password default sebelum dipublikasikan. Password disimpan menggunakan bcrypt. Token JWT berlaku 12 jam.

Contoh login:
```json
{"username":"admin","password":"ChangeMe123!"}
```

Gunakan token dari response sebagai header:
`Authorization: Bearer <token>`

## Penyimpanan
Data tersimpan di `STORAGE_DIR/json/*.json`, file upload di `STORAGE_DIR/uploads/`.
Folder `STORAGE_DIR` harus dipasang pada persistent disk ketika deployment. Jangan deploy ke hosting yang filesystem-nya sementara tanpa persistent volume. Lakukan backup berkala.

## Catatan produksi
- Ganti `JWT_SECRET` dengan secret acak yang kuat.
- Ganti password admin default.
- Atur `FRONTEND_ORIGIN` sesuai domain frontend.
- Tambahkan HTTPS melalui reverse proxy/platform hosting.
- Batasi ukuran upload dan gunakan storage persisten.
- Implementasi awal ini ditujukan untuk satu admin dan trafik portfolio rendah; JSON file bukan pengganti database untuk beban tulis bersamaan yang tinggi.
