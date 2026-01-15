import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationZH_CN from './locales/zh_CN/translation.json';

export const resources = {
  zh_CN: {
    translation: translationZH_CN,
  },
  zh: {
    translation: translationZH_CN,
  },
};

const initI18n = () => {
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: 'zh_CN',
      fallbackLng: 'zh_CN',
      debug: false,
      interpolation: {
        escapeValue: false,
      },
    })
    .then();
};

export default initI18n;
