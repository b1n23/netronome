/*
 * Copyright (c) 2024-2026, s0up and the autobrr contributors.
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { GlobeAltIcon, CheckIcon } from "@heroicons/react/24/outline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { showToast } from "@/components/common/Toast";

const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'zh-CN', name: 'Chinese (Simplified)', nativeName: '简体中文' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
] as const;

export const LanguageSettings: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<string>(i18n.language);
  const [hasChanges, setHasChanges] = useState(false);

  // Debug: log current language
  console.log('LanguageSettings - Current i18n.language:', i18n.language);
  console.log('LanguageSettings - localStorage i18nextLng:', localStorage.getItem('i18nextLng'));
  console.log('LanguageSettings - selectedLanguage state:', selectedLanguage);

  const updateLanguage = (langCode: string) => {
    setSelectedLanguage(langCode);
    setHasChanges(true);
  };

  const saveSettings = async () => {
    await i18n.changeLanguage(selectedLanguage);
    localStorage.setItem('i18nextLng', selectedLanguage);
    setHasChanges(false);
    showToast(t('settings:language_saved', 'Language settings saved'), "success", {
      description: t('settings:language_applied', 'Changes will be applied across the application')
    });
  };

  const resetToDefaults = () => {
    const browserLang = navigator.language;
    const matchedLang = SUPPORTED_LANGUAGES.find(lang => 
      browserLang.startsWith(lang.code.split('-')[0])
    )?.code || 'en';
    setSelectedLanguage(matchedLang);
    setHasChanges(true);
  };

  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage) || SUPPORTED_LANGUAGES[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <GlobeAltIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            {t('settings:language_settings', 'Language Settings')}
          </h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {t('settings:language_description', 'Configure language preferences for the application')}
          </p>
        </div>

        {hasChanges && (
          <div className="flex items-center gap-2">
            <Button 
              onClick={saveSettings}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <CheckIcon className="w-4 h-4" />
              {t('common:save', 'Save Changes')}
            </Button>
            <Button 
              onClick={() => {
                setSelectedLanguage(i18n.language);
                setHasChanges(false);
              }}
              variant="secondary"
            >
              {t('common:cancel', 'Cancel')}
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Language Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GlobeAltIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              {t('settings:display_language', 'Display Language')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900 dark:text-white">
                {t('settings:select_language', 'Select Language')}
              </label>
              <Select value={selectedLanguage} onValueChange={updateLanguage}>
                <SelectTrigger className="w-full">
                  <SelectValue>
                    {currentLang.nativeName} - {currentLang.name}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.nativeName} - {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t('settings:current_language', 'Current language')}: {currentLang.nativeName}
              </p>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button 
                onClick={resetToDefaults}
                variant="outline"
                size="sm"
              >
                {t('settings:reset_to_browser', 'Reset to Browser Language')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {t('settings:about_translations', 'About Translations')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <p>
              {t('settings:translation_info', 
                'Netronome supports multiple languages to make the application accessible to users worldwide.'
              )}
            </p>
            <p>
              {t('settings:contribute_translations',
                'Want to help improve translations? Visit our Weblate project to contribute.'
              )}
            </p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open('https://hosted.weblate.org/', '_blank')}
            >
              {t('settings:contribute', 'Contribute Translations')}
            </Button>
          </CardContent>
        </Card>

        {/* Debug Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              🐛 Debug Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs font-mono text-gray-600 dark:text-gray-400">
            <div><strong>Current i18n.language:</strong> {i18n.language}</div>
            <div><strong>Resolved language:</strong> {i18n.resolvedLanguage}</div>
            <div><strong>localStorage i18nextLng:</strong> {localStorage.getItem('i18nextLng') || 'not set'}</div>
            <div><strong>navigator.language:</strong> {navigator.language}</div>
            <div><strong>selectedLanguage state:</strong> {selectedLanguage}</div>
            <div><strong>Supported languages:</strong> {i18n.languages?.join(', ')}</div>
            <div className="pt-2">
              <strong>Test translations:</strong>
              <div className="pl-4 mt-1">
                <div>• common:dashboard = "{t('common:dashboard')}"</div>
                <div>• speedtest:title = "{t('speedtest:title')}"</div>
                <div>• speedtest:no_history = "{t('speedtest:no_history')}"</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
