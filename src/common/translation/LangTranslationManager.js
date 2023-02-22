import i18n from 'i18next';
import {
    initReactI18next
} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RNLocalize from 'react-native-localize';
import en from './lang/en.json';
import hi from './lang/hi.json';
import ta from './lang/ta.json';
import ml from './lang/ml.json';

const langStorageKey = 'app-language'
const languageRes = {
    en,
    hi,
    ta,
    ml
}

const langCode = Object.keys(languageRes)

const langDetector = {
    type: 'languageDetector',
    async: true,
    detect: callback => {
        AsyncStorage.getItem(langStorageKey, (err, language) => {
            if (err || !language) {
                if (err) {
                    console.log('Error fetching language from asyncstorage ', err)
                } else {
                    console.log('No language is set, choosing English as fallback')
                }
                const findBestAvailableLanguage = RNLocalize.findBestAvailableLanguage(langCode)
                callback(findBestAvailableLanguage?.languageTag || 'en')
                return;
            }
            callback(language);
        });
    },
    init: () => { },
    cacheUserLanguage: language => {
        AsyncStorage.setItem(langStorageKey, language);
    },
};

i18n
    .use(langDetector)
    .use(initReactI18next)
    .init({
        compatibilityJSON: 'v3',
        resources: languageRes,
        react: {
            useSuspense: false,
        },
        interpolation: {
            escapeValue: false,
        },
    });
