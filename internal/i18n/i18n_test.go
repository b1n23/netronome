package i18n

import (
	"testing"
)

func TestInit(t *testing.T) {
	err := Init()
	if err != nil {
		t.Fatalf("Init() failed: %v", err)
	}

	// Verify all supported languages are loaded
	for _, lang := range SupportedLanguages {
		if _, ok := messages[lang]; !ok {
			t.Errorf("Language %s not loaded", lang)
		}
	}
}

func TestGetMessage(t *testing.T) {
	if err := Init(); err != nil {
		t.Fatalf("Init() failed: %v", err)
	}

	tests := []struct {
		name     string
		lang     string
		key      string
		args     []interface{}
		expected string
	}{
		{
			name:     "English message",
			lang:     "en",
			key:      "error.not_found",
			args:     nil,
			expected: "Resource not found",
		},
		{
			name:     "Chinese message",
			lang:     "zh-CN",
			key:      "error.not_found",
			args:     nil,
			expected: "未找到资源",
		},
		{
			name:     "Japanese message",
			lang:     "ja",
			key:      "error.not_found",
			args:     nil,
			expected: "リソースが見つかりません",
		},
		{
			name:     "Message with formatting",
			lang:     "en",
			key:      "speedtest.failed",
			args:     []interface{}{"network timeout"},
			expected: "Speed test failed: network timeout",
		},
		{
			name:     "Fallback to English",
			lang:     "invalid-lang",
			key:      "error.not_found",
			args:     nil,
			expected: "Resource not found",
		},
		{
			name:     "Missing key returns key",
			lang:     "en",
			key:      "nonexistent.key",
			args:     nil,
			expected: "nonexistent.key",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := GetMessage(tt.lang, tt.key, tt.args...)
			if result != tt.expected {
				t.Errorf("GetMessage(%s, %s) = %q, want %q", tt.lang, tt.key, result, tt.expected)
			}
		})
	}
}

func TestGetLanguageFromHeader(t *testing.T) {
	tests := []struct {
		name   string
		header string
		want   string
	}{
		{
			name:   "Empty header returns default",
			header: "",
			want:   "en",
		},
		{
			name:   "English",
			header: "en-US,en;q=0.9",
			want:   "en",
		},
		{
			name:   "Simplified Chinese",
			header: "zh-CN,zh;q=0.9,en;q=0.8",
			want:   "zh-CN",
		},
		{
			name:   "Japanese",
			header: "ja,en;q=0.9",
			want:   "ja",
		},
		{
			name:   "Base language match",
			header: "zh,en;q=0.9",
			want:   "zh-CN",
		},
		{
			name:   "Unsupported language fallback",
			header: "fr-FR,fr;q=0.9",
			want:   "en",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := GetLanguageFromHeader(tt.header)
			if got != tt.want {
				t.Errorf("GetLanguageFromHeader(%q) = %q, want %q", tt.header, got, tt.want)
			}
		})
	}
}
