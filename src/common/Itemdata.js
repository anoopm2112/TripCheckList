import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import { ROUTE_KEYS } from '../navigation/constants';
import COLORS from '../common/Colors';
import { convertHeight } from '../common/utils/dimentionUtils';
import i18n from 'i18next';

export const dataItem = [
    'Shirt',
    'Pant',
    'Trouser',
    'Other'
];

export const dataItemML = [
    'ഷർട്ട്',
    'പാന്റ്',
    'ട്രൗസർ',
    'മറ്റുള്ളവ'
];

export const dataItemHI = [
    'शर्ट',
    'पंत',
    'पतलून',
    'अन्य'
];

export const dataItemTA = [
    'சட்டை',
    'பேன்ட்',
    'ட்ரவுசர்',
    'மற்றவை'
];

export const splitWiseDataItem = [
    'Select your food category',
    'Break Fast',
    'Lunch',
    'Dinner',
    'Other'
];

// export const splitWiseDataItem = [
//     { label: 'Break Fast', value: 'Break Fast' },
//     { label: 'Lunch', value: 'Lunch' },
//     { label: 'Dinner', value: 'Dinner' },
//     { label: 'Other', value: 'Other' }
// ];



export const splitWiseDataItemMal = [
    'നിങ്ങളുടെ ഭക്ഷണ വിഭാഗം തിരഞ്ഞെടുക്കുക',
    'ബ്രേക്ക് ഫാസ്റ്റ്',
    'ഉച്ചഭക്ഷണം',
    'അത്താഴം',
    'മറ്റുള്ളവ'
];

export const splitWiseDataItemTamil = [
    'உங்கள் உணவு வகையைத் தேர்ந்தெடுங்கள்',
    'பிரேக் ஃபாஸ்ட்',
    'மதிய உணவு',
    'இரவு உணவு',
    'மற்றவை'
];

export const splitWiseDataItemHindi = [
    'अपनी भोजन श्रेणी चुनें',
    'नाश्ता',
    'दिन का खाना',
    'रात का खाना',
    'अन्य'
];

export const FLOATING_ACTION = [
    {
        text: i18n.t("Common:add_checklist"),
        icon: <Octicons name="checklist" size={convertHeight(16)} color={COLORS.primary} />,
        name: ROUTE_KEYS.WRITEUP_ABOUT_TRIP,
        color: COLORS.secondary,
        position: 3
    },
    {
        text: i18n.t("Common:history"),
        icon: <MaterialIcons name="history" size={convertHeight(16)} color={COLORS.primary} />,
        color: COLORS.secondary,
        name: ROUTE_KEYS.CHECK_ITEM_HISTORY_LIST,
        position: 1
    }
];