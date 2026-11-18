package main

import (
	"log"
	"os"
	"path/filepath"

	"dzaki-portfolio/backend/config"
	"dzaki-portfolio/backend/controllers"
	"dzaki-portfolio/backend/middleware"
	"dzaki-portfolio/backend/routes"
	"dzaki-portfolio/backend/storage"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
)

func main() {
	cfg := config.Load()

	jsonDir := filepath.Join(cfg.StorageDir, "json")
	uploadDir := filepath.Join(cfg.StorageDir, "uploads")

	if err := os.MkdirAll(uploadDir, 0755); err != nil {
		log.Fatal("gagal membuat folder upload: ", err)
	}

	store, err := storage.New(jsonDir)
	if err != nil {
		log.Fatal("gagal menginisialisasi JSON storage: ", err)
	}

	if err := controllers.EnsureInitialAdmin(store, cfg.AdminUsername, cfg.AdminPassword); err != nil {
		log.Fatal("gagal menyiapkan admin awal: ", err)
	}

	app := fiber.New(fiber.Config{
		AppName:      "Dzaki Personal Portfolio API",
		BodyLimit:    cfg.MaxUploadMB * 1024 * 1024,
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			code := fiber.StatusInternalServerError
			if e, ok := err.(*fiber.Error); ok {
				code = e.Code
			}
			return c.Status(code).JSON(fiber.Map{
				"success": false,
				"message": err.Error(),
			})
		},
	})

	app.Use(recover.New())
	app.Use(logger.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins: cfg.FrontendOrigin,
		AllowMethods: "GET,POST,PUT,PATCH,DELETE,OPTIONS",
		AllowHeaders: "Origin,Content-Type,Accept,Authorization",
	}))

	auth := middleware.NewAuth(cfg.JWTSecret)
	authController := controllers.NewAuthController(store, cfg.JWTSecret)
	contentController := controllers.NewContentController(store)
	uploadController := controllers.NewUploadController(store, uploadDir, cfg.MaxUploadMB)
	contactController := controllers.NewContactController(store)

	// URL utama backend: http://localhost:8080/portfolio
	app.Get("/", func(c *fiber.Ctx) error {
		return c.Redirect("/portfolio")
	})
	app.Get("/portfolio", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"success": true,
			"name":    "Dzaki Personal Portfolio",
			"message": "Portfolio API is running",
			"api":     "/api/v1",
		})
	})

	app.Static("/uploads", uploadDir)

	routes.Register(app, routes.Dependencies{
			Auth:    auth,
		AuthCtrl: authController,
		Content: contentController,
		Upload:  uploadController,
		Contact: contactController,
	})

	log.Printf("Dzaki Portfolio API berjalan di http://localhost:%s/portfolio", cfg.Port)
	log.Fatal(app.Listen(":" + cfg.Port))
}
