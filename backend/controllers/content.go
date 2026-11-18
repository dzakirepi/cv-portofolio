package controllers

import (
	"fmt"
	"os"

	"dzaki-portfolio/backend/storage"

	"github.com/gofiber/fiber/v2"
)

type ContentController struct {
	store *storage.Store
}

func NewContentController(store *storage.Store) *ContentController {
	return &ContentController{store: store}
}

func allowedCollection(name string) bool {
	allowed := map[string]bool{
		"profile": true, "projects": true, "skills": true,
		"experience": true, "education": true, "certificates": true,
		"articles": true, "categories": true, "social_links": true,
		"settings": true, "media": true, "messages": true,
	}
	return allowed[name]
}

func (h *ContentController) PublicList(c *fiber.Ctx) error {
	name := c.Params("collection")
	// Koleksi privat seperti messages tidak boleh diakses tanpa login.
	publicAllowed := map[string]bool{
		"profile": true, "projects": true, "skills": true,
		"experience": true, "education": true, "certificates": true,
		"articles": true, "categories": true, "social_links": true,
		"settings": true,
	}
	if !publicAllowed[name] {
		return fiber.ErrNotFound
	}
	items, err := h.store.List(name)
	if err != nil {
		return fiber.ErrInternalServerError
	}
	// Konten berstatus draft/archived tidak ditampilkan ke publik.
	if name == "projects" || name == "articles" || name == "certificates" {
		published := make([]storage.Record, 0)
		for _, item := range items {
			if item["status"] == "published" {
				published = append(published, item)
			}
		}
		items = published
	}
	return c.JSON(fiber.Map{"success": true, "data": items})
}

func (h *ContentController) AdminList(c *fiber.Ctx) error {
	name := c.Params("collection")
	if !allowedCollection(name) {
		return fiber.ErrNotFound
	}
	items, err := h.store.List(name)
	if err != nil {
		return fiber.ErrInternalServerError
	}
	return c.JSON(fiber.Map{"success": true, "data": items})
}

func (h *ContentController) Create(c *fiber.Ctx) error {
	name := c.Params("collection")
	if !allowedCollection(name) {
		return fiber.ErrNotFound
	}
	var record storage.Record
	if err := c.BodyParser(&record); err != nil || record == nil {
		return fiber.NewError(fiber.StatusBadRequest, "Body JSON tidak valid")
	}
	delete(record, "id")
	delete(record, "created_at")
	delete(record, "updated_at")
	item, err := h.store.Create(name, record)
	if err != nil {
		return fiber.ErrInternalServerError
	}
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"success": true, "message": "Data berhasil ditambahkan", "data": item,
	})
}

func (h *ContentController) Update(c *fiber.Ctx) error {
	name, id := c.Params("collection"), c.Params("id")
	if !allowedCollection(name) {
		return fiber.ErrNotFound
	}
	var updates storage.Record
	if err := c.BodyParser(&updates); err != nil || updates == nil {
		return fiber.NewError(fiber.StatusBadRequest, "Body JSON tidak valid")
	}
	item, err := h.store.Update(name, id, updates)
	if err != nil {
		if os.IsNotExist(err) {
			return fiber.ErrNotFound
		}
		return fiber.ErrInternalServerError
	}
	return c.JSON(fiber.Map{"success": true, "message": "Data berhasil diperbarui", "data": item})
}

func (h *ContentController) Delete(c *fiber.Ctx) error {
	name, id := c.Params("collection"), c.Params("id")
	if !allowedCollection(name) {
		return fiber.ErrNotFound
	}
	err := h.store.Delete(name, id)
	if err != nil {
		if os.IsNotExist(err) {
			return fiber.ErrNotFound
		}
		return fiber.ErrInternalServerError
	}
	return c.JSON(fiber.Map{"success": true, "message": "Data berhasil dihapus"})
}

func (h *ContentController) PublicPortfolio(c *fiber.Ctx) error {
	profile, _ := h.store.List("profile")
	projects, _ := h.store.List("projects")
	skills, _ := h.store.List("skills")
	experience, _ := h.store.List("experience")
	education, _ := h.store.List("education")
	certificates, _ := h.store.List("certificates")
	articles, _ := h.store.List("articles")
	social, _ := h.store.List("social_links")

	filterPublished := func(items []storage.Record) []storage.Record {
		result := make([]storage.Record, 0)
		for _, item := range items {
			if item["status"] == "published" {
				result = append(result, item)
			}
		}
		return result
	}

	return c.JSON(fiber.Map{
		"success": true,
		"data": fiber.Map{
			"profile": profile, "projects": filterPublished(projects),
			"skills": skills, "experience": experience, "education": education,
			"certificates": filterPublished(certificates),
			"articles": filterPublished(articles), "social_links": social,
		},
	})
}

func (h *ContentController) String() string {
	return fmt.Sprintf("ContentController{%p}", h.store)
}
