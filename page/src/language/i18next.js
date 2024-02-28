import en from "./en.json";
import ru from "./ru.json";

import i18next from "i18next";
import { initReactI18next } from "react-i18next";


i18next.use(initReactI18next).init({
    resources: {
        en: {
            translation: en,
        },
        ru: {
            translation: ru,
        },
    },
    lng: JSON.parse(localStorage.getItem("language")),
    fallbackLng: "en",
});

export default i18next;
