package controllers

import (
	"os"
	"time"

	"dzaki-portfolio/backend/storage"
	"dzaki-portfolio/backend/utils"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

type AuthController struct {
	store  *storage.Store
	secret []byte
}

func NewAuthController(store *storage.Store, secret string) *AuthController {
	return &AuthController{store: store, secret: []byte(secret)}
}

func EnsureInitialAdmin(store *storage.Store, username, password string) error {
	admins, err := store.List("admins")
	if err != nil {
		return err
	}
	if len(admins) > 0 {
		return nil
	}
	if username == "" || password == "" {
		return os.ErrInvalid
	}
	hash, err := utils.HashPassword(password)
	if err != nil {
		return err
	}
	_, err = store.Create("admins", storage.Record{
		"username": username,
		"password_hash": hash,
		"role": "owner",
		"active": true,
	})
	return err
}

func (a *AuthController) Login(c *fiber.Ctx) error {
	var input struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}
	if err := c.BodyParser(&input); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Format request tidak valid")
	}
	if input.Username == "" || input.Password == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Username dan password wajib diisi")
	}

	admin, err := a.store.FindByField("admins", "username", input.Username)
	if err != nil || admin["active"] != true {
		return fiber.ErrUnauthorized
	}
	hash, _ := admin["password_hash"].(string)
	if !utils.CheckPassword(hash, input.Password) {
		return fiber.ErrUnauthorized
	}

	now := time.Now()
	claims := jwt.MapClaims{
		"sub": admin["id"],
		"username": admin["username"],
		"iat": now.Unix(),
		"exp": now.Add(12 * time.Hour).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signed, err := token.SignedString(a.secret)
	if err != nil {
		return fiber.ErrInternalServerError
	}

	return c.JSON(fiber.Map{
		"success": true,
		"message": "Login berhasil",
		"data": fiber.Map{
			"token": signed,
			"admin": fiber.Map{
				"id": admin["id"],
				"username": admin["username"],
				"role": admin["role"],
			},
		},
	})
}

func (a *AuthController) Me(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{
		"success": true,
		"data": fiber.Map{
			"id": c.Locals("adminID"),
			"username": c.Locals("username"),
		},
	})
}
