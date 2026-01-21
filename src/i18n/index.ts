import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';
import en from './locales/en';
import tr from './locales/tr';
import de from './locales/de';
import es from './locales/es';
import fr from './locales/fr';

const i18n = new I18n({
    en,
    tr,
    de,
    es,
    fr
});

i18n.enableFallback = true;
i18n.defaultLocale = 'en';

// Set the locale once at the beginning of your app
const deviceLocale = getLocales()[0]?.languageCode ?? 'en';
i18n.locale = deviceLocale;

export default i18n;
