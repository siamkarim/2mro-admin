import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./en.json";
import tr from "./tr.json";

export const resources = {
  en: {
    translation: en,
  },
  tr: {
    translation: tr,
  },
};

export type SupportedLocale = keyof typeof resources;
const DEFAULT_LANGUAGE: SupportedLocale = "en";

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: DEFAULT_LANGUAGE,
    fallbackLng: DEFAULT_LANGUAGE,
    interpolation: {
      escapeValue: false,
    },
  });
}

export default i18n;

