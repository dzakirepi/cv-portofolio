package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/mail"
	"net/smtp"
	"strings"
	"sync"
	"time"
	"unicode/utf8"
)

type contactInput struct {
	Name    string `json:"name"`
	Email   string `json:"email"`
	Message string `json:"message"`
	Website string `json:"website"` // honeypot anti-bot: manusia tidak melihat field ini
}

// rateLimiter sederhana: maksimal 5 pesan per IP per jam.
type rateLimiter struct {
	mu   sync.Mutex
	hits map[string][]time.Time
}

func (l *rateLimiter) allow(ip string) bool {
	l.mu.Lock()
	defer l.mu.Unlock()
	now := time.Now()
	kept := l.hits[ip][:0]
	for _, t := range l.hits[ip] {
		if now.Sub(t) < time.Hour {
			kept = append(kept, t)
		}
	}
	if len(kept) >= 5 {
		l.hits[ip] = kept
		return false
	}
	l.hits[ip] = append(kept, now)
	return true
}

func clientIP(r *http.Request) string {
	if f := r.Header.Get("X-Forwarded-For"); f != "" {
		return strings.TrimSpace(strings.Split(f, ",")[0])
	}
	host := r.RemoteAddr
	if i := strings.LastIndex(host, ":"); i > 0 {
		host = host[:i]
	}
	return host
}

func oneLine(s string) string {
	return strings.NewReplacer("\r", " ", "\n", " ").Replace(s)
}

func sendContactMail(cfg Config, in contactInput) error {
	if cfg.SMTPHost == "" || cfg.MailTo == "" {
		log.Printf("[contact] Pesan baru (SMTP belum diatur)\n  Dari : %s <%s>\n  Pesan: %s", in.Name, in.Email, in.Message)
		return nil
	}
	body := fmt.Sprintf("Nama : %s\nEmail: %s\n\n%s\n", in.Name, in.Email, in.Message)
	msg := "From: Portfolio <" + cfg.MailFrom + ">\r\n" +
		"To: " + cfg.MailTo + "\r\n" +
		"Reply-To: " + oneLine(in.Email) + "\r\n" +
		"Subject: Pesan baru dari portfolio - " + oneLine(in.Name) + "\r\n" +
		"MIME-Version: 1.0\r\n" +
		"Content-Type: text/plain; charset=UTF-8\r\n\r\n" + body
	auth := smtp.PlainAuth("", cfg.SMTPUser, cfg.SMTPPass, cfg.SMTPHost)
	return smtp.SendMail(cfg.SMTPHost+":"+cfg.SMTPPort, auth, cfg.MailFrom, []string{cfg.MailTo}, []byte(msg))
}

func contactHandler(cfg Config) http.HandlerFunc {
	limiter := &rateLimiter{hits: map[string][]time.Time{}}
	return func(w http.ResponseWriter, r *http.Request) {
		r.Body = http.MaxBytesReader(w, r.Body, 32<<10)
		var in contactInput
		if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]any{"success": false, "message": "Format pesan tidak valid"})
			return
		}
		if in.Website != "" { // terisi oleh bot: pura-pura berhasil
			writeJSON(w, http.StatusOK, map[string]any{"success": true})
			return
		}
		in.Name = strings.TrimSpace(in.Name)
		in.Email = strings.TrimSpace(in.Email)
		in.Message = strings.TrimSpace(in.Message)

		if in.Name == "" || in.Email == "" || in.Message == "" {
			writeJSON(w, http.StatusBadRequest, map[string]any{"success": false, "message": "Nama, email, dan pesan wajib diisi"})
			return
		}
		if addr, err := mail.ParseAddress(in.Email); err != nil || addr.Address != in.Email {
			writeJSON(w, http.StatusBadRequest, map[string]any{"success": false, "message": "Alamat email tidak valid"})
			return
		}
		if utf8.RuneCountInString(in.Name) > 100 || utf8.RuneCountInString(in.Message) > 5000 {
			writeJSON(w, http.StatusBadRequest, map[string]any{"success": false, "message": "Pesan terlalu panjang (maks. 5000 karakter)"})
			return
		}
		if !limiter.allow(clientIP(r)) {
			writeJSON(w, http.StatusTooManyRequests, map[string]any{"success": false, "message": "Terlalu banyak pesan. Coba lagi nanti."})
			return
		}
		if err := sendContactMail(cfg, in); err != nil {
			log.Printf("[contact] gagal mengirim email: %v", err)
			writeJSON(w, http.StatusBadGateway, map[string]any{"success": false, "message": "Pesan gagal dikirim. Silakan hubungi lewat email."})
			return
		}
		writeJSON(w, http.StatusOK, map[string]any{"success": true, "message": "Pesan berhasil dikirim"})
	}
}
