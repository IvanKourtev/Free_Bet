import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import bgTranslations from './locales/bg.json';
import enTranslations from './locales/en.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      bg: {
        translation: bgTranslations,
      },
      en: {
        translation: enTranslations,
      },
    },
    fallbackLng: 'bg',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n; 