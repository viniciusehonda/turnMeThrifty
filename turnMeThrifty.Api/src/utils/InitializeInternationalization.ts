import i18next from "i18next";
import i18nextMiddleware from "i18next-express-middleware"

export function initializeInternationalization() {
    i18next
        .use(i18nextMiddleware.LanguageDetector)
        .init({
            fallbackLng: 'en',
            preload: ['en', 'pt'],
            saveMissing: true,
            resources: {
                en: {
                    common: require('../locales/en/common.json'),
                    error: require('../locales/en/error.json'),
                    user: require('../locales/en/user.json'),
                    auth: require('../locales/en/auth.json')
                },
                pt: {
                    common: require('../locales/pt/common.json'),
                    error: require('../locales/pt/error.json'),
                    user: require('../locales/pt/user.json'),
                    auth: require('../locales/pt/auth.json')
                }
            }
        });
}