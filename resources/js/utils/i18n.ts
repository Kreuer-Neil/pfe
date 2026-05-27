import i18n from 'i18next';
import {initReactI18next, useTranslation} from 'react-i18next';
import LocalStorageBackend from "i18next-localstorage-backend";

import Backend from 'i18next-http-backend';

i18n
    // load translation using http -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
    // learn more: https://github.com/i18next/i18next-http-backend
    // want your translations to be loaded from a professional CDN? => https://github.com/locize/react-tutorial#step-2---use-the-locize-cdn
    .use(Backend)
    // pass the i18n instance to react-i18next.
    .use(initReactI18next)
    // init i18next
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init({
        // ns: ['dashboard','projects','pagination','main-nav','projects-index','date'],
        // detection: {
        //     order: ["path", "htmlTag"],
        // },
        fallbackLng: "en",
        lng: document.documentElement.lang,
        ns: 'common',
        interpolation: {
            escapeValue: false,
        },
        // backend: {
        //     backends: [
        //         LocalStorageBackend,
        //     ],
        //     backendOptions: [{
        //         // expirationTime: 7 * 24 * 60 * 60 * 1000
        //     // }, {
        //         loadPath: '../locales/{{lng}}/{{ns}}.json',
        //     }]
        // }
    }, /*(err, t) => {
    }*/);

// also import into "resources/js/app.tsx" and invoke into setup once
// also import into "resources/js/ssr.tsx"

export default i18n;
