# Multilingual Support (中文 / 日本語 / English) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add first-class UI language support with at least English (`en`), Simplified Chinese (`zh-CN`), and Japanese (`ja`) while keeping existing behavior stable.

**Architecture:** Introduce a frontend i18n layer (translation resources + runtime language switching), persist language preference via existing app settings storage, and localize date/number/unit formatting with locale-aware helpers.

**Tech Stack:** React + TypeScript frontend, Go (Gin) backend, existing `app_settings` persistence.

---

## Current-State Findings

- Frontend text is currently hardcoded in many components (auth, settings, dashboard/tabs, notifications, monitor, speedtest, traceroute, packet loss).
- No existing i18n framework is configured in `/home/runner/work/netronome/netronome/web/src`.
- Locale preference persistence can reuse existing backend app settings APIs/patterns:
  - `/home/runner/work/netronome/netronome/internal/server/settings_handlers.go`
  - `/home/runner/work/netronome/netronome/internal/database/app_settings.go`
  - `/home/runner/work/netronome/netronome/web/src/api/settings.ts`
- Existing time formatting utilities already centralize date/time behavior and are good extension points:
  - `/home/runner/work/netronome/netronome/web/src/utils/timeSettings.ts`
  - `/home/runner/work/netronome/netronome/web/src/utils/timeUtils.ts`

---

## File Map

### New
- Add: `/home/runner/work/netronome/netronome/web/src/i18n/index.ts`
- Add: `/home/runner/work/netronome/netronome/web/src/i18n/locales/en/common.json`
- Add: `/home/runner/work/netronome/netronome/web/src/i18n/locales/zh-CN/common.json`
- Add: `/home/runner/work/netronome/netronome/web/src/i18n/locales/ja/common.json`
- Add: `/home/runner/work/netronome/netronome/web/src/i18n/types.ts`
- Add: `/home/runner/work/netronome/netronome/web/src/components/settings/LanguageSettings.tsx`

### Modify
- Modify: `/home/runner/work/netronome/netronome/web/package.json` (add i18n runtime deps)
- Modify: `/home/runner/work/netronome/netronome/web/src/main.tsx` (initialize i18n provider)
- Modify: `/home/runner/work/netronome/netronome/web/src/components/SettingsMenu.tsx` (add Language section)
- Modify: `/home/runner/work/netronome/netronome/web/src/api/settings.ts` (locale settings API methods)
- Modify: `/home/runner/work/netronome/netronome/internal/server/settings_handlers.go` (read/write locale setting)
- Modify: `/home/runner/work/netronome/netronome/internal/server/server.go` (register locale settings route[s])
- Modify: `/home/runner/work/netronome/netronome/web/src/utils/timeSettings.ts` (locale-aware formatters)
- Modify: representative user-facing UI components first, then expand coverage incrementally:
  - `/home/runner/work/netronome/netronome/web/src/components/App.tsx`
  - `/home/runner/work/netronome/netronome/web/src/components/Main.tsx`
  - `/home/runner/work/netronome/netronome/web/src/components/auth/Login.tsx`
  - `/home/runner/work/netronome/netronome/web/src/components/auth/Register.tsx`
  - `/home/runner/work/netronome/netronome/web/src/components/speedtest/*.tsx`
  - `/home/runner/work/netronome/netronome/web/src/components/monitor/**/*.tsx`
  - `/home/runner/work/netronome/netronome/web/src/components/settings/**/*.tsx`

---

## Task 1: i18n Foundation (Frontend Bootstrap)

**Files:** `web/src/i18n/*`, `web/src/main.tsx`, `web/package.json`

- [ ] Add i18n library setup (recommended: `i18next` + `react-i18next`).
- [ ] Define supported locales as strict types (`en`, `zh-CN`, `ja`).
- [ ] Load translation resources and configure fallback language (`en`).
- [ ] Add language resolution order:
  1. persisted user preference
  2. browser language match
  3. fallback `en`
- [ ] Ensure app renders safely before async locale resolution finishes (no crash/flicker).

---

## Task 2: Locale Preference Persistence

**Files:** `internal/server/settings_handlers.go`, `internal/server/server.go`, `web/src/api/settings.ts`, `web/src/components/settings/LanguageSettings.tsx`, `web/src/components/SettingsMenu.tsx`

- [ ] Add locale settings backend handler(s) using `app_settings` key (e.g., `ui_locale`).
- [ ] Validate allowed locale values server-side (`en`, `zh-CN`, `ja`).
- [ ] Expose locale read/write API in frontend settings client.
- [ ] Add language selector UI in settings modal (desktop/mobile compatible).
- [ ] On change:
  - switch language immediately in UI
  - persist setting
  - show success/error toast via translated messages

---

## Task 3: String Externalization + Priority Coverage

**Files:** major `web/src/components/**/*.tsx`, locale JSON files

- [ ] Externalize user-visible strings to translation keys (no hardcoded copy in JSX except proper nouns/brands).
- [ ] Prioritize high-traffic screens first:
  - auth (login/register)
  - top-level app chrome and tab labels
  - dashboard/speedtest actions
  - settings surface
- [ ] Replace inline error mappings with translated keys where possible.
- [ ] Keep semantic key naming (e.g., `auth.login.submit`, `settings.language.title`).
- [ ] Support interpolation/pluralization for dynamic strings (counts, durations, etc.).

---

## Task 4: Locale-Aware Formatting

**Files:** `web/src/utils/timeSettings.ts`, `web/src/utils/timeUtils.ts`, relevant table/chart components

- [ ] Route date/time formatting through selected locale (while preserving timezone settings).
- [ ] Localize number formatting (`Intl.NumberFormat`) for metrics where appropriate.
- [ ] Audit places using fixed English abbreviations in UI labels/tooltips; migrate to translated label keys.
- [ ] Keep machine-readable API data unchanged; localize display only.

---

## Task 5: Testing + Verification

**Backend**
- [ ] Add/extend handler tests for locale settings:
  - valid locales accepted
  - invalid locale rejected with 400
  - missing persisted setting returns default locale

**Frontend**
- [ ] Add/extend component tests for:
  - language selector persistence behavior
  - translated rendering for at least login + one dashboard view
  - fallback behavior when key is missing
- [ ] Add a small test helper to render components with i18n provider.

**Manual smoke**
- [ ] Switch language in settings to `zh-CN` then refresh: language remains Chinese.
- [ ] Switch language to `ja`: key surfaces (navigation/auth/settings) render Japanese copy.
- [ ] Confirm time/date formatting changes with locale while timezone setting still works.

---

## Rollout Strategy

- [ ] Ship in phases to reduce regression risk:
  1. foundation + language selector + auth/main shell
  2. speedtest/monitor/settings module coverage
  3. remaining component cleanup + formatting polish
- [ ] Keep English as default for backward compatibility.
- [ ] Document how contributors add new locales/keys.

---

## Risks & Mitigations

- **Risk:** Partial translation coverage leads to mixed-language UI.  
  **Mitigation:** Require module-level completion checklist and fallback audits before enabling a locale in selector.

- **Risk:** Key drift/typos in large refactor.  
  **Mitigation:** Type-safe key helpers (where practical) + CI lint/test checks for missing keys.

- **Risk:** Layout regressions for longer translated strings.  
  **Mitigation:** Validate critical responsive views (mobile settings, tab labels, auth forms) in manual smoke checks.

---

## Clarifying Questions (to resolve before implementation)

1. Should language preference be global per deployment (`app_settings`) or per user account?
2. Is `zh-CN` sufficient for Chinese initially, or do we need `zh-TW` too?
3. Should backend/API error messages also be localized now, or only frontend UI copy in this phase?
4. Do we require full locale coverage before shipping, or can we ship progressively with clearly marked fallback-to-English areas?
