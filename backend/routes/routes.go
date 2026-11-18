package routes

import (
	"dzaki-portfolio/backend/controllers"
	"dzaki-portfolio/backend/middleware"

	"github.com/gofiber/fiber/v2"
)

type Dependencies struct {
	Auth    *middleware.AuthMiddleware
	AuthCtrl *controllers.AuthController
	Content *controllers.ContentController
	Upload  *controllers.UploadController
	Contact *controllers.ContactController
}

func Register(app *fiber.App, d Dependencies) {
	api := app.Group("/api/v1")

	// Endpoint publik.
	api.Get("/portfolio", d.Content.PublicPortfolio)
	api.Get("/public/:collection", d.Content.PublicList)
	api.Post("/contact", d.Contact.Create)

	// Authentication.
	api.Post("/auth/login", d.AuthCtrl.Login)

	// Endpoint admin wajib token JWT.
	admin := api.Group("/admin", d.Auth.Require())
	admin.Get("/me", d.AuthCtrl.Me)
	admin.Post("/upload", d.Upload.Upload)
	admin.Get("/:collection", d.Content.AdminList)
	admin.Post("/:collection", d.Content.Create)
	admin.Put("/:collection/:id", d.Content.Update)
	admin.Delete("/:collection/:id", d.Content.Delete)

}
