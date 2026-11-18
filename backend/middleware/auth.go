package middleware

import (
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

type AuthMiddleware struct {
	secret []byte
}

func NewAuth(secret string) *AuthMiddleware {
	return &AuthMiddleware{secret: []byte(secret)}
}

func (a *AuthMiddleware) Require() fiber.Handler {
	return func(c *fiber.Ctx) error {
		header := c.Get("Authorization")
		if !strings.HasPrefix(header, "Bearer ") {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"success": false, "message": "Token autentikasi diperlukan",
			})
		}
		tokenString := strings.TrimSpace(strings.TrimPrefix(header, "Bearer "))
		claims := jwt.MapClaims{}
		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fiber.ErrUnauthorized
			}
			return a.secret, nil
		}, jwt.WithValidMethods([]string{"HS256"}), jwt.WithTimeFunc(time.Now))
		if err != nil || !token.Valid {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"success": false, "message": "Token tidak valid atau sudah kedaluwarsa",
			})
		}
		sub, _ := claims["sub"].(string)
		if sub == "" {
			return fiber.ErrUnauthorized
		}
		c.Locals("adminID", sub)
		c.Locals("username", claims["username"])
		return c.Next()
	}
}
