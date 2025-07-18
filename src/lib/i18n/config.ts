import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enCommon from '../../../public/locales/en/common.json';
import esCommon from '../../../public/locales/es/common.json';
import enLanding from '../../../public/locales/en/landing.json';
import esLanding from '../../../public/locales/es/landing.json';
import enCommunityEvent from '../../../public/locales/en/community-event.json';
import esCommunityEvent from '../../../public/locales/es/community-event.json';
import enMasterCourse from '../../../public/locales/en/master-course.json';
import esMasterCourse from '../../../public/locales/es/master-course.json';
import enAcademy from '../../../public/locales/en/academy.json';
import esAcademy from '../../../public/locales/es/academy.json';

const resources = {
  en: {
    common: enCommon,
    landing: enLanding,
    communityEvent: enCommunityEvent,
    masterCourse: enMasterCourse,
    academy: enAcademy,
  },
  es: {
    common: esCommon,
    landing: esLanding,
    communityEvent: esCommunityEvent,
    masterCourse: esMasterCourse,
    academy: esAcademy,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common', 'landing', 'communityEvent', 'masterCourse', 'academy'],
    
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;