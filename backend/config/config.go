package config

import (
	"os"
	"strconv"
	"strings"

	"github.com/joho/godotenv"
)

type Config struct {
	Port           string
	FrontendOrigin string
	JWTSecret      string
	StorageDir     string
	AdminUsername  string
	AdminPassword  string
	MaxUploadMB    int
}

func Load() Config {
	// .env bersifat opsional; environment variables server tetap didukung.
	_ = godotenv.Load()
	return Config{
		Port:           env("PORT", "2303"),
		FrontendOrigin: env("FRONTEND_ORIGIN", "http://localhost:2303"),
		JWTSecret:      env("JWT_SECRET", "local-development-secret-change-before-deploy-123"),
		StorageDir:     env("STORAGE_DIR", "./storage-data"),
		AdminUsername:  env("ADMIN_USERNAME", "admin"),
		AdminPassword:  env("ADMIN_PASSWORD", "ChangeMe123!"),
		MaxUploadMB:    envInt("MAX_UPLOAD_MB", 5),
	}
}

func env(key, fallback string) string {
	value := strings.TrimSpace(os.Getenv(key))
	if value == "" {
		return fallback
	}
	return value
}

func envInt(key string, fallback int) int {
	value, err := strconv.Atoi(os.Getenv(key))
	if err != nil || value < 1 {
		return fallback
	}
	return value
}
