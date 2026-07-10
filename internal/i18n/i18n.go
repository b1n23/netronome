// Package i18n provides internationalization support for Netronome backend.
package i18n

import (
	"embed"
	"encoding/json"
	"fmt"
	"sync"
)

//go:embed locales/*.json
var localesFS embed.FS

var (
	messages = make(map[string]map[string]string)
	mu       sync.RWMutex
)

// SupportedLanguages lists all supported language codes
var SupportedLanguages = []string{"en", "zh-CN", "ja"}

// Init initializes the i18n system by loading all translation files
func Init() error {
	mu.Lock()
	defer mu.Unlock()

	for _, lang := range SupportedLanguages {
		data, err := localesFS.ReadFile(fmt.Sprintf("locales/%s.json", lang))
		if err != nil {
			return fmt.Errorf("failed to load %s translations: %w", lang, err)
		}

		var msgs map[string]string
		if err := json.Unmarshal(data, &msgs); err != nil {
			return fmt.Errorf("failed to parse %s translations: %w", lang, err)
		}

		messages[lang] = msgs
	}

	return nil
}

// GetMessage returns a translated message for the given language and key.
// If the key is not found, it returns the key itself.
// If the language is not supported, it falls back to English.
func GetMessage(lang, key string, args ...interface{}) string {
	mu.RLock()
	defer mu.RUnlock()

	// Try requested language
	if msgs, ok := messages[lang]; ok {
		if msg, ok := msgs[key]; ok {
			if len(args) > 0 {
				return fmt.Sprintf(msg, args...)
			}
			return msg
		}
	}

	// Fallback to English
	if lang != "en" {
		if msgs, ok := messages["en"]; ok {
			if msg, ok := msgs[key]; ok {
				if len(args) > 0 {
					return fmt.Sprintf(msg, args...)
				}
				return msg
			}
		}
	}

	// Return key if not found
	return key
}

// GetLanguageFromHeader extracts the preferred language from Accept-Language header
// Returns "en" as default if no supported language is found
func GetLanguageFromHeader(acceptLanguage string) string {
	if acceptLanguage == "" {
		return "en"
	}

	// Simple implementation - parse the first language code
	// Format: "zh-CN,zh;q=0.9,en;q=0.8"
	for _, lang := range SupportedLanguages {
		if len(acceptLanguage) >= len(lang) && acceptLanguage[:len(lang)] == lang {
			return lang
		}
	}

	// Check for base language (e.g., "zh" should match "zh-CN")
	if len(acceptLanguage) >= 2 {
		baseLang := acceptLanguage[:2]
		for _, lang := range SupportedLanguages {
			if len(lang) >= 2 && lang[:2] == baseLang {
				return lang
			}
		}
	}

	return "en"
}
