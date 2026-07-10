import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';

// Use regular array instead of const assertion to avoid readonly issues
const SUPPORTED_LANGUAGES = ['en', 'zh-CN', 'ja'];
export type SupportedLanguage = 'en' | 'zh-CN' | 'ja';

// Detect language from localStorage or navigator
const getInitialLanguage = (): string => {
  const stored = localStorage.getItem('i18nextLng');
  console.log('🔍 Detecting language...');
  console.log('  localStorage i18nextLng:', stored);
  console.log('  navigator.language:', navigator.language);
  console.log('  SUPPORTED_LANGUAGES:', SUPPORTED_LANGUAGES);
  
  if (stored && SUPPORTED_LANGUAGES.includes(stored)) {
    console.log('  ✓ Using stored language:', stored);
    return stored;
  }
  
  // Check navigator language
  const navLang = navigator.language;
  if (SUPPORTED_LANGUAGES.includes(navLang)) {
    console.log('  ✓ Using navigator language:', navLang);
    return navLang;
  }
  
  // Check if navigator language starts with a supported language
  const matchedLang = SUPPORTED_LANGUAGES.find(lang => 
    navLang.startsWith(lang.split('-')[0])
  );
  if (matchedLang) {
    console.log('  ✓ Matched language:', matchedLang);
    return matchedLang;
  }
  
  console.log('  ✓ Using fallback: en');
  return 'en'; // Default fallback
};

const initialLanguage = getInitialLanguage();
console.log('🚀 Initializing i18next with language:', initialLanguage);

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    lng: initialLanguage,
    fallbackLng: 'en',
    supportedLngs: ['en', 'zh-CN', 'ja'],
    load: 'currentOnly', // Only load the current language, not all variations
    nonExplicitSupportedLngs: false, // Disable to avoid language code confusion
    cleanCode: false, // Don't clean language codes
    debug: import.meta.env.DEV,
    
    // Namespace configuration
    ns: ['common', 'speedtest', 'monitor', 'settings', 'notifications', 'auth', 'errors'],
    defaultNS: 'common',
    
    interpolation: {
      escapeValue: false, // React already escapes
    },
    
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    
    react: {
      useSuspense: true,
    },
  });

// Debug: Log language changes and loading events
i18n.on('languageChanged', (lng) => {
  console.log('✅ i18n language changed to:', lng);
  console.log('   localStorage value:', localStorage.getItem('i18nextLng'));
  console.log('   Resolved language:', i18n.resolvedLanguage);
  console.log('   Supported languages:', i18n.languages);
});

i18n.on('loaded', (loaded) => {
  console.log('✅ i18n resources loaded:', loaded);
});

i18n.on('failedLoading', (lng, ns, msg) => {
  console.error('❌ i18n failed loading:', { lng, ns, msg });
});

i18n.on('missingKey', (lngs, namespace, key) => {
  console.warn('⚠️ i18n missing key:', { lngs, namespace, key });
});

// Log initial state after initialization
i18n.on('initialized', (options) => {
  console.log('✅ i18next initialized');
  console.log('   Current language:', i18n.language);
  console.log('   Resolved language:', i18n.resolvedLanguage);
  console.log('   Supported languages:', i18n.languages);
  console.log('   Options.supportedLngs:', options.supportedLngs);
  console.log('   Options.lng:', options.lng);
  console.log('   Options.fallbackLng:', options.fallbackLng);
  console.log('   Loaded namespaces:', i18n.hasLoadedNamespace('common') ? 'common loaded' : 'common not loaded');
});

export default i18n;
export { SUPPORTED_LANGUAGES };
