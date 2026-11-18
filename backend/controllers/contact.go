package controllers

import (
	"strings"

	"dzaki-portfolio/backend/storage"

	"github.com/gofiber/fiber/v2"
)

type ContactController struct {
	store *storage.Store
}

func NewContactController(store *storage.Store) *ContactController {
	return &ContactController{store: store}
}

func (h *ContactController) Create(c *fiber.Ctx) error {
	var input struct {
		Name    string `json:"name"`
		Email   string `json:"email"`
		Subject string `json:"subject"`
		Message string `json:"message"`
	}
	if err := c.BodyParser(&input); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Format pesan tidak valid")
	}
	input.Name = strings.TrimSpace(input.Name)
	input.Email = strings.TrimSpace(input.Email)
	input.Subject = strings.TrimSpace(input.Subject)
	input.Message = strings.TrimSpace(input.Message)

	if input.Name == "" || input.Email == "" || input.Message == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Nama, email, dan pesan wajib diisi")
	}
	if len(input.Message) > 5000 {
		return fiber.NewError(fiber.StatusBadRequest, "Pesan maksimal 5000 karakter")
	}

	record, err := h.store.Create("messages", storage.Record{
		"name": input.Name, "email": input.Email,
		"subject": input.Subject, "message": input.Message,
		"status": "unread",
	})
	if err != nil {
		return fiber.ErrInternalServerError
	}
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"success": true, "message": "Pesan berhasil dikirim", "data": fiber.Map{"id": record["id"]},
	})
}
