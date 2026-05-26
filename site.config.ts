/**
 * Site config — consumed by the stx dev/build server (see
 * storage/framework/core/actions/src/dev/views.ts → loadStxSiteConfig).
 *
 * The `i18n` block turns on locale-prefix routing (`/de/…`), `{t:key}`
 * marker substitution in rendered HTML, and the injected language picker
 * (wired to any element matching `pickerSelector`). Translation strings are
 * loaded from `locales/<code>.yml` (nested YAML, flattened to dotted keys),
 * with the fallback chain: requested locale → default locale → the key.
 */
export default {
  // NOTE: intentionally no `url` — setting it makes dev/views.ts pass the
  // whole `site` object to stx serve(), which turns on the SEO-tag
  // injection pass. i18n is wired up independently of `site`, so we keep
  // `site` minimal (i18n only) to drive locale routing + {t:} substitution.
  i18n: {
    locales: ['en', 'de'],
    defaultLocale: 'en',
    // Use the project's existing locales/ directory (YAML) instead of the
    // stx default `translations/` so EN/DE live in one obvious place.
    translationsDir: 'locales',
    format: 'yaml',
    labels: {
      en: 'EN',
      de: 'DE',
    },
    pickerSelector: '#lang-picker',
  },
}
