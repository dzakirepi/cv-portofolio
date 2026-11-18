package controllers

import (
	"fmt"
	"mime"
	"os"
	"path/filepath"
	"strings"
	"time"

	"dzaki-portfolio/backend/storage"

	"github.com/gofiber/fiber/v2"
)

type UploadController struct {
	store *storage.Store
	dir string
	maxMB int
}

func NewUploadController(store *storage.Store, dir string, maxMB int) *UploadController {
	return &UploadController{store: store, dir: dir, maxMB: maxMB}
}

func (h *UploadController) Upload(c *fiber.Ctx) error {
	file, err := c.FormFile("file")
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "File dengan field 'file' wajib dipilih")
	}
	if file.Size > int64(h.maxMB)*1024*1024 {
		return fiber.NewError(fiber.StatusBadRequest, fmt.Sprintf("Ukuran file maksimal %d MB", h.maxMB))
	}

	ext := strings.ToLower(filepath.Ext(file.Filename))
	allowed := map[string]bool{
		".jpg": true, ".jpeg": true, ".png": true, ".webp": true,
		".pdf": true, ".svg": true,
	}
	if !allowed[ext] {
		return fiber.NewError(fiber.StatusBadRequest, "Format file tidak diizinkan")
	}

	contentType := mime.TypeByExtension(ext)
	if contentType == "" {
		contentType = "application/octet-stream"
	}
	id := fmt.Sprintf("%d", time.Now().UnixNano())
	filename := id + ext
	destination := filepath.Join(h.dir, filename)

	if err := c.SaveFile(file, destination); err != nil {
		return fiber.ErrInternalServerError
	}

	record, err := h.store.Create("media", storage.Record{
		"original_name": filepath.Base(file.Filename),
		"file_name": filename,
		"mime_type": contentType,
		"size": file.Size,
		"url": "/uploads/" + filename,
	})
	if err != nil {
		_ = os.Remove(destination)
		return fiber.ErrInternalServerError
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"success": true, "message": "File berhasil diunggah", "data": record,
	})
}
