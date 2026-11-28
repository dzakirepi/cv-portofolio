package main

import (
	"bufio"
	"os"
	"strings"
)

type Config struct {
	Port           string
	ContentDir     string
	StaticDir      string
	FrontendOrigin string // untuk CORS saat development (Vite di port 2303)

	SMTPHost string
	SMTPPort string
	SMTPUser string
	SMTPPass string
	MailFrom string
	MailTo   string
}

func loadConfig() Config {
	loadDotEnv(".env")
	return Config{
		Port:           env("PORT", "8080"),
		ContentDir:     env("CONTENT_DIR", "./content"),
		StaticDir:      env("STATIC_DIR", "../frontend/dist"),
		FrontendOrigin: env("FRONTEND_ORIGIN", "http://localhost:2303"),
		SMTPHost:       env("SMTP_HOST", ""),
		SMTPPort:       env("SMTP_PORT", "587"),
		SMTPUser:       env("SMTP_USER", ""),
		SMTPPass:       env("SMTP_PASS", ""),
		MailFrom:       env("MAIL_FROM", env("SMTP_USER", "")),
		MailTo:         env("MAIL_TO", ""),
	}
}

func env(key, fallback string) string {
	if v := strings.TrimSpace(os.Getenv(key)); v != "" {
		return v
	}
	return fallback
}

// loadDotEnv membaca file .env sederhana (KEY=VALUE) jika ada.
// Environment variable dari server tetap diprioritaskan.
func loadDotEnv(path string) {
	f, err := os.Open(path)
	if err != nil {
		return
	}
	defer f.Close()
	sc := bufio.NewScanner(f)
	for sc.Scan() {
		line := strings.TrimSpace(sc.Text())
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}
		k, v, ok := strings.Cut(line, "=")
		if !ok {
			continue
		}
		k = strings.TrimSpace(k)
		v = strings.Trim(strings.TrimSpace(v), `"'`)
		if _, exists := os.LookupEnv(k); !exists {
			os.Setenv(k, v)
		}
	}
}
