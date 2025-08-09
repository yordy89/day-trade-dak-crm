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
import enFaq from '../../../public/locales/en/faq.json';
import esFaq from '../../../public/locales/es/faq.json';
import enRisk from '../../../public/locales/en/risk.json';
import esRisk from '../../../public/locales/es/risk.json';
import enAuth from '../../../public/locales/en/auth.json';
import esAuth from '../../../public/locales/es/auth.json';
import enSuccessStories from '../../../public/locales/en/success-stories.json';
import esSuccessStories from '../../../public/locales/es/success-stories.json';

const resources = {
  en: {
    common: enCommon,
    landing: enLanding,
    communityEvent: enCommunityEvent,
    masterCourse: enMasterCourse,
    academy: enAcademy,
    faq: enFaq,
    risk: enRisk,
    auth: enAuth,
    'success-stories': enSuccessStories,
  },
  es: {
    common: esCommon,
    landing: esLanding,
    communityEvent: esCommunityEvent,
    masterCourse: esMasterCourse,
    academy: esAcademy,
    faq: esFaq,
    risk: esRisk,
    auth: esAuth,
    'success-stories': esSuccessStories,
  },
};

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'es',
    defaultNS: 'common',
    ns: ['common', 'landing', 'communityEvent', 'masterCourse', 'academy', 'faq', 'risk', 'auth', 'success-stories'],
    
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    
    lng: 'es', // Force Spanish as default
  });

export default i18n;