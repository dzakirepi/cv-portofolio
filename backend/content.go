package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"regexp"
	"sort"
	"strings"
)

// File JSON yang digabung menjadi respons /api/v1/portfolio.
var contentFiles = []string{"profile", "projects", "skills", "experience", "education", "certificates"}

type Article struct {
	Slug     string   `json:"slug"`
	Title    string   `json:"title"`
	Date     string   `json:"date"`
	ReadTime string   `json:"readTime,omitempty"`
	Cover    string   `json:"cover,omitempty"`
	Excerpt  string   `json:"excerpt,omitempty"`
	Tags     []string `json:"tags,omitempty"`
	Draft    bool     `json:"-"`
	Content  string   `json:"content,omitempty"`
}

var slugPattern = regexp.MustCompile(`^[a-z0-9][a-z0-9-]*$`)

func readJSONFile(path string) (json.RawMessage, error) {
	b, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}
	if !json.Valid(b) {
		return nil, &json.SyntaxError{}
	}
	return json.RawMessage(b), nil
}

// parseArticle membaca file Markdown dengan "front matter" di bagian atas:
//
//	---
//	title: Judul Artikel
//	date: 2025-05-10
//	readTime: 5 min read
//	cover: /images/blog/cover.jpg
//	excerpt: Ringkasan singkat
//	tags: React, Golang
//	draft: false
//	---
//	Isi artikel dalam Markdown...
func parseArticle(path string) (Article, error) {
	b, err := os.ReadFile(path)
	if err != nil {
		return Article{}, err
	}
	text := strings.ReplaceAll(string(b), "\r\n", "\n")
	a := Article{Slug: strings.TrimSuffix(filepath.Base(path), ".md")}

	if strings.HasPrefix(text, "---\n") {
		if end := strings.Index(text[4:], "\n---"); end >= 0 {
			meta := text[4 : 4+end]
			text = strings.TrimLeft(text[4+end+4:], "\n")
			for _, line := range strings.Split(meta, "\n") {
				k, v, ok := strings.Cut(line, ":")
				if !ok {
					continue
				}
				v = strings.Trim(strings.TrimSpace(v), `"`)
				switch strings.TrimSpace(k) {
				case "title":
					a.Title = v
				case "date":
					a.Date = v
				case "readTime":
					a.ReadTime = v
				case "cover":
					a.Cover = v
				case "excerpt":
					a.Excerpt = v
				case "draft":
					a.Draft = v == "true"
				case "tags":
					for _, t := range strings.Split(v, ",") {
						if t = strings.TrimSpace(t); t != "" {
							a.Tags = append(a.Tags, t)
						}
					}
				}
			}
		}
	}
	a.Content = text
	if a.Title == "" {
		a.Title = a.Slug
	}
	return a, nil
}

func listArticles(dir string) []Article {
	files, _ := filepath.Glob(filepath.Join(dir, "articles", "*.md"))
	out := make([]Article, 0, len(files))
	for _, f := range files {
		a, err := parseArticle(f)
		if err != nil || a.Draft {
			continue
		}
		a.Content = ""
		out = append(out, a)
	}
	sort.Slice(out, func(i, j int) bool { return out[i].Date > out[j].Date })
	return out
}

func portfolioHandler(cfg Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		data := map[string]any{}
		for _, name := range contentFiles {
			raw, err := readJSONFile(filepath.Join(cfg.ContentDir, name+".json"))
			if err != nil {
				log.Printf("[content] %s.json tidak bisa dibaca: %v", name, err)
				data[name] = nil
				continue
			}
			data[name] = raw
		}
		data["articles"] = listArticles(cfg.ContentDir)
		writeJSON(w, http.StatusOK, map[string]any{"success": true, "data": data})
	}
}

func articleHandler(cfg Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		slug := strings.TrimPrefix(r.URL.Path, "/api/v1/articles/")
		if !slugPattern.MatchString(slug) {
			writeJSON(w, http.StatusNotFound, map[string]any{"success": false, "message": "Artikel tidak ditemukan"})
			return
		}
		a, err := parseArticle(filepath.Join(cfg.ContentDir, "articles", slug+".md"))
		if err != nil || a.Draft {
			writeJSON(w, http.StatusNotFound, map[string]any{"success": false, "message": "Artikel tidak ditemukan"})
			return
		}
		writeJSON(w, http.StatusOK, map[string]any{"success": true, "data": a})
	}
}
