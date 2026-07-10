# Multi-Language Support (i18n)

Netronome supports multiple languages to make the application accessible to users worldwide.

## Supported Languages

- 🇬🇧 **English** (en) - Default
- 🇨🇳 **Simplified Chinese** (zh-CN) - 简体中文
- 🇯🇵 **Japanese** (ja) - 日本語

## Changing Language

1. Click the **Settings** gear icon in the navigation bar
2. Select **Language** from the settings menu
3. Choose your preferred language from the dropdown
4. Click **Save Changes**

Your language preference is saved and will persist across sessions.

## For Contributors

### Adding Translations

We use [Weblate](https://hosted.weblate.org/) for collaborative translation. To contribute:

1. Visit our Weblate project (URL to be added)
2. Sign in or create an account
3. Select your target language
4. Start translating!

See [docs/translation-guide.md](docs/translation-guide.md) for detailed instructions.

### Adding a New Language

To add support for a new language:

1. Add the language code to `web/src/i18n/index.ts`
2. Create translation directories in `web/public/locales/{lang}/`
3. Copy English templates and translate
4. Add language to `LanguageSettings.tsx`
5. Update `.weblate` configuration
6. Submit a pull request

See the [Translation Guide](docs/translation-guide.md) for complete instructions.

## For Developers

### Using Translations in Frontend

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <button>{t('common:save', 'Save')}</button>
  );
}
```

### Using Translations in Backend

```go
import "github.com/autobrr/netronome/internal/i18n"

func handler(c *gin.Context) {
    lang := i18n.GetLanguageFromHeader(c.GetHeader("Accept-Language"))
    message := i18n.GetMessage(lang, "error.not_found")
    c.JSON(404, gin.H{"error": message})
}
```

### Extracting New Strings

When you add new translatable strings to the code:

```bash
cd web
pnpm i18n:extract
```

This will scan the codebase and update all translation JSON files.

## Implementation Status

✅ **Phase 1 Complete:** Core infrastructure, language selector, initial translations

🚧 **Phase 2 In Progress:** Replace hardcoded strings throughout UI

📋 **Phase 3 Planned:** Backend error/notification translation

See [docs/i18n-implementation-status.md](docs/i18n-implementation-status.md) for detailed status.

## Translation Coverage

Current translation coverage:
- **Frontend:** 101 baseline strings per language (100% coverage)
- **Backend:** 18 message keys per language (100% coverage)
- **Component strings:** Not yet migrated (Phase 2)

## Technical Details

- **Frontend:** react-i18next with HTTP backend
- **Backend:** Custom implementation using Go embed
- **Storage:** User preference stored in database
- **Detection:** Browser language → User preference → English (default)
- **Namespaces:** 7 namespaces organized by feature

## Resources

- [Translation Guide](docs/translation-guide.md) - Comprehensive contributor guide
- [Implementation Status](docs/i18n-implementation-status.md) - Detailed progress report
- [Weblate Project](#) - Collaborative translation platform (coming soon)

## Contributing

We welcome translation contributions! Even if you're not fluent, you can help review existing translations or suggest improvements.

See [docs/translation-guide.md](docs/translation-guide.md) to get started.
