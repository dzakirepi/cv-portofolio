---
title: Golang Best Practices
date: 2025-04-15
readTime: 7 min read
cover: /images/blog/golang.svg
excerpt: Prinsip sederhana untuk menulis kode Go yang idiomatis dan mudah dirawat.
tags: Golang, Backend
---

Go dirancang agar sederhana. Kode Go yang baik biasanya juga terlihat sederhana.

## Tangani error secara eksplisit

```go
data, err := os.ReadFile("profile.json")
if err != nil {
    return fmt.Errorf("baca profil: %w", err)
}
```

Bungkus error dengan konteks (`%w`) supaya mudah dilacak.

## Interface kecil

Definisikan interface di sisi yang **memakai**, dan buat sekecil mungkin. `io.Reader` hanya punya satu method — dan dipakai di mana-mana.

## Manfaatkan standard library

Paket `net/http`, `encoding/json`, dan `testing` sudah sangat lengkap. Backend portofolio ini pun hanya memakai standard library.

## Lainnya

- Jalankan `gofmt` dan `go vet` sebelum commit.
- Gunakan `context.Context` untuk timeout dan pembatalan.
- Tulis test berbentuk *table-driven*.
