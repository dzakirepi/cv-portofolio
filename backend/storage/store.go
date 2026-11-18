package storage

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"sync"
	"time"
)

type Record map[string]interface{}

var Collections = []string{
	"profile", "projects", "skills", "experience", "education",
	"certificates", "articles", "categories", "social_links",
	"messages", "settings", "admins", "media",
}

type Store struct {
	dir string
	mu  sync.RWMutex
}

func New(dir string) (*Store, error) {
	if err := os.MkdirAll(dir, 0755); err != nil {
		return nil, err
	}
	s := &Store{dir: dir}
	for _, name := range Collections {
		path := s.filePath(name)
		if _, err := os.Stat(path); errors.Is(err, os.ErrNotExist) {
			if err := s.writeLocked(name, []Record{}); err != nil {
				return nil, err
			}
		} else if err != nil {
			return nil, err
		}
	}
	return s, nil
}

func (s *Store) valid(name string) bool {
	for _, item := range Collections {
		if item == name {
			return true
		}
	}
	return false
}

func (s *Store) filePath(name string) string {
	return filepath.Join(s.dir, name+".json")
}

func (s *Store) readLocked(name string) ([]Record, error) {
	if !s.valid(name) {
		return nil, fmt.Errorf("koleksi %q tidak diizinkan", name)
	}
	data, err := os.ReadFile(s.filePath(name))
	if err != nil {
		return nil, err
	}
	var records []Record
	if err := json.Unmarshal(data, &records); err != nil {
		return nil, fmt.Errorf("JSON %s rusak: %w", name, err)
	}
	if records == nil {
		records = []Record{}
	}
	return records, nil
}

// Menulis ke file sementara lalu rename agar file utama tidak setengah tertulis.
func (s *Store) writeLocked(name string, records []Record) error {
	if !s.valid(name) {
		return fmt.Errorf("koleksi %q tidak diizinkan", name)
	}
	data, err := json.MarshalIndent(records, "", "  ")
	if err != nil {
		return err
	}
	tmp, err := os.CreateTemp(s.dir, name+"-*.tmp")
	if err != nil {
		return err
	}
	tmpName := tmp.Name()
	defer os.Remove(tmpName)

	if _, err = tmp.Write(data); err != nil {
		tmp.Close()
		return err
	}
	if err = tmp.Sync(); err != nil {
		tmp.Close()
		return err
	}
	if err = tmp.Close(); err != nil {
		return err
	}
	target := s.filePath(name)
	if err = os.Rename(tmpName, target); err != nil {
		// Windows tidak selalu mengizinkan rename di atas file yang sudah ada.
		// Fallback ini menjaga kompatibilitas; backup tetap disarankan.
		if removeErr := os.Remove(target); removeErr != nil && !errors.Is(removeErr, os.ErrNotExist) {
			return fmt.Errorf("gagal mengganti file %s: %w", name, err)
		}
		if retryErr := os.Rename(tmpName, target); retryErr != nil {
			return fmt.Errorf("gagal menyimpan file %s: %w", name, retryErr)
		}
	}
	return nil
}

func newID() (string, error) {
	b := make([]byte, 16)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return hex.EncodeToString(b), nil
}

func (s *Store) List(name string) ([]Record, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return s.readLocked(name)
}

func (s *Store) FindByField(name, field, value string) (Record, error) {
	records, err := s.List(name)
	if err != nil {
		return nil, err
	}
	for _, record := range records {
		if fmt.Sprint(record[field]) == value {
			return record, nil
		}
	}
	return nil, os.ErrNotExist
}

func (s *Store) Create(name string, record Record) (Record, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	records, err := s.readLocked(name)
	if err != nil {
		return nil, err
	}
	id, err := newID()
	if err != nil {
		return nil, err
	}
	now := time.Now().UTC().Format(time.RFC3339)
	record["id"] = id
	record["created_at"] = now
	record["updated_at"] = now
	records = append(records, record)
	if err := s.writeLocked(name, records); err != nil {
		return nil, err
	}
	return record, nil
}

func (s *Store) Update(name, id string, updates Record) (Record, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	records, err := s.readLocked(name)
	if err != nil {
		return nil, err
	}
	for i, record := range records {
		if fmt.Sprint(record["id"]) == id {
			for key, value := range updates {
				if key != "id" && key != "created_at" {
					record[key] = value
				}
			}
			record["updated_at"] = time.Now().UTC().Format(time.RFC3339)
			records[i] = record
			if err := s.writeLocked(name, records); err != nil {
				return nil, err
			}
			return record, nil
		}
	}
	return nil, os.ErrNotExist
}

func (s *Store) Delete(name, id string) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	records, err := s.readLocked(name)
	if err != nil {
		return err
	}
	for i, record := range records {
		if fmt.Sprint(record["id"]) == id {
			records = append(records[:i], records[i+1:]...)
			return s.writeLocked(name, records)
		}
	}
	return os.ErrNotExist
}
