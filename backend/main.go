// Backend portofolio Dzaki Repi Nugroho.
//
// Tanpa database dan tanpa dashboard admin:
//   - Konten dibaca dari file di folder ./content (JSON + Markdown).
//     Ubah file-nya, simpan, lalu refresh browser — tidak perlu restart.
//   - Form kontak dikirim ke email lewat SMTP.
//   - Hasil build React (frontend/dist) ikut di-serve, jadi cukup deploy satu aplikasi.
//
// Hanya memakai standard library Go (tidak perlu `go mod download`).
package main

import (
	"log"
	"net/http"
	"time"
)

func main() {
	cfg := loadConfig()
	mux := http.NewServeMux()

	mux.HandleFunc("/api/v1/health", method(http.MethodGet, func(w http.ResponseWriter, r *http.Request) {
		writeJSON(w, http.StatusOK, map[string]any{"success": true, "status": "ok"})
	}))
	mux.HandleFunc("/api/v1/portfolio", method(http.MethodGet, portfolioHandler(cfg)))
	mux.HandleFunc("/api/v1/articles/", method(http.MethodGet, articleHandler(cfg)))
	mux.HandleFunc("/api/v1/contact", method(http.MethodPost, contactHandler(cfg)))
	mux.Handle("/", spaHandler(cfg.StaticDir))

	srv := &http.Server{
		Addr:              ":" + cfg.Port,
		Handler:           logRequests(withCORS(cfg, mux)),
		ReadHeaderTimeout: 10 * time.Second,
		ReadTimeout:       30 * time.Second,
		WriteTimeout:      30 * time.Second,
	}
	log.Printf("Portfolio berjalan di http://localhost:%s  (API: /api/v1/portfolio)", cfg.Port)
	if cfg.SMTPHost == "" {
		log.Printf("SMTP belum diatur: pesan dari form kontak hanya akan dicatat di log.")
	}
	log.Fatal(srv.ListenAndServe())
}
