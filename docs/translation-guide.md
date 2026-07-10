# Translation Guide for Netronome

Netronome uses [Weblate](https://hosted.weblate.org/) for collaborative translation. This guide explains how to contribute translations and maintain translation quality.

## Overview

Netronome supports multiple languages with the following structure:
- **Frontend**: React application with i18next
- **Backend**: Go application with golang.org/x/text/message (planned)
- **Supported Languages**: English (en), Simplified Chinese (zh-CN), Japanese (ja)

## Translation Files

### Frontend Translation Files
Located in `web/public/locales/{language}/`:
- `common.json` - Common UI strings (buttons, labels, etc.)
- `speedtest.json` - Speed test module strings
- `monitor.json` - Monitoring module strings
- `settings.json` - Settings page strings
- `notifications.json` - Notification-related strings
- `auth.json` - Authentication strings
- `errors.json` - Error messages

### Backend Translation Files (Planned)
Located in `internal/i18n/locales/`:
- `{language}.json` - Backend messages (errors, notifications)

## Contributing Translations

### Using Weblate (Recommended)

1. Visit the [Netronome Weblate project](https://hosted.weblate.org/) (URL to be confirmed after setup)
2. Sign in or create an account
3. Select the component you want to translate (e.g., frontend-common, frontend-speedtest)
4. Choose your target language
5. Start translating!

Weblate will:
- Automatically create pull requests for your translations
- Check for translation quality issues
- Notify maintainers of changes
- Sync with the GitHub repository

### Manual Translation (Advanced)

If you prefer to edit translation files directly:

1. Fork the repository
2. Edit the JSON files in `web/public/locales/{language}/`
3. Ensure proper JSON formatting
4. Test your translations locally (see Testing section)
5. Submit a pull request

## Translation Guidelines

### General Principles

1. **Context Matters**: Understand where the string appears in the UI
2. **Consistency**: Use consistent terminology throughout
3. **Natural Language**: Translate meaning, not word-for-word
4. **Length**: Keep translations similar in length to avoid UI breaking
5. **Placeholders**: Preserve placeholders like `{{variable}}` exactly as they appear
6. **HTML/Formatting**: Don't translate HTML tags or formatting codes

### Specific Guidelines by Language

#### Simplified Chinese (zh-CN)
- Use simplified characters (简体中文)
- Prefer concise expressions
- Technical terms: Use widely accepted translations
- Example: "Speed Test" → "速度测试" (not "速度检验")

#### Japanese (ja)
- Use appropriate politeness level (です/ます form for UI)
- Balance Kanji, Hiragana, and Katakana appropriately
- Technical terms: Use katakana for foreign technical terms
- Example: "Server" → "サーバー" (not "サーバ" or "鯖")

### Translation Keys

Translation keys use the format: `namespace:key`
- `common:save` → Common namespace, save button
- `speedtest:run_test` → Speedtest namespace, run test button

Do not translate the keys themselves, only the values!

## Testing Translations

### Testing Frontend Translations

1. Install dependencies:
   ```bash
   cd web
   pnpm install
   ```

2. Run the development server:
   ```bash
   pnpm dev
   ```

3. Open the application in your browser
4. Go to Settings → Language
5. Select your language
6. Navigate through the application to verify translations

### Extracting New Strings

When developers add new strings to the code, translators need updated translation files:

```bash
cd web
pnpm i18n:extract
```

This command scans the codebase and updates all translation JSON files with new keys.

## Translation Quality Checks

Weblate automatically checks for:
- Missing translations
- Inconsistent placeholders
- Invalid JSON syntax
- Duplicate translations
- Translation length (if configured)

### Manual Quality Checks

Before submitting translations:
1. ✅ All placeholders preserved: `{{name}}` → `{{name}}`
2. ✅ No HTML tags translated: `<strong>text</strong>`
3. ✅ Punctuation appropriate for language
4. ✅ Consistent terminology across files
5. ✅ UI displays correctly (no overflow, truncation)

## Adding a New Language

To add support for a new language:

1. Add language code to `web/src/i18n/index.ts`:
   ```typescript
   const SUPPORTED_LANGUAGES = ['en', 'zh-CN', 'ja', 'your-lang'] as const;
   ```

2. Create translation directories:
   ```bash
   mkdir -p web/public/locales/your-lang
   ```

3. Copy English templates:
   ```bash
   cp web/public/locales/en/*.json web/public/locales/your-lang/
   ```

4. Translate the new files

5. Add language to `LanguageSettings.tsx`:
   ```typescript
   { code: 'your-lang', name: 'Your Language', nativeName: 'Native Name' }
   ```

6. Update Weblate configuration in `.weblate`

7. Submit a pull request

## Translation Workflow

### For Translators
1. Weblate notifies you of new strings
2. Translate in Weblate interface
3. Weblate creates PR automatically
4. Maintainers review and merge

### For Developers
1. Add new strings in code using `t('namespace:key', 'English text')`
2. Run `pnpm i18n:extract` to generate translation keys
3. Commit updated English translation files
4. Weblate syncs automatically
5. Translators receive notification

### For Maintainers
1. Review Weblate PRs for quality
2. Test translations in staging
3. Merge to develop/main branches
4. Translations deploy with next release

## Troubleshooting

### Translation Not Showing

1. Check browser console for i18n errors
2. Verify JSON syntax is valid
3. Ensure language code matches exactly
4. Clear browser cache and localStorage
5. Check that translation key exists in code

### Missing Translations

If you see English text instead of your language:
1. Check if the key exists in your language's JSON file
2. Run `pnpm i18n:extract` to ensure files are up to date
3. Add the missing translation
4. Refresh the page

### Weblate Sync Issues

If Weblate isn't syncing:
1. Check GitHub repository permissions
2. Verify `.weblate` configuration
3. Check Weblate project settings
4. Contact maintainers

## Resources

- [i18next Documentation](https://www.i18next.com/)
- [React i18next Documentation](https://react.i18next.com/)
- [Weblate Documentation](https://docs.weblate.org/)
- [Netronome GitHub Repository](https://github.com/autobrr/netronome)

## Contact

For translation questions or issues:
- Open an issue on [GitHub](https://github.com/autobrr/netronome/issues)
- Join our Discord/Slack (if available)
- Email maintainers (if applicable)

## Credits

Thank you to all translators who contribute to making Netronome accessible worldwide! 🌍

Translation contributors are listed in the project's AUTHORS or CONTRIBUTORS file.
