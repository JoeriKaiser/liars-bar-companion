import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from './locales/en/translations.json';
import frTranslation from './locales/fr/translations.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation
      },
      fr: {
        translation: frTranslation
      }
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;