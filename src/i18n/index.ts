import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';
import en from './locales/en';
import tr from './locales/tr';
import de from './locales/de';
import es from './locales/es';
import fr from './locales/fr';
import it from './locales/it';
import pt from './locales/pt';
import ru from './locales/ru';
import zh from './locales/zh';
import ja from './locales/ja';
import ko from './locales/ko';
import ar from './locales/ar';
import hi from './locales/hi';

const i18n = new I18n({
    en,
    tr,
    de,
    es,
    fr,
    it,
    pt,
    ru,
    zh,
    ja,
    ko,
    ar,
    hi,
});

i18n.enableFallback = true;
i18n.defaultLocale = 'en';

// Set the locale once at the beginning of your app
const deviceLocale = getLocales()[0]?.languageCode ?? 'en';
i18n.locale = deviceLocale;

export default i18n;
