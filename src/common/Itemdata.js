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

export const splitWiseDataItem = [
    'Select your food category',
    'Break Fast',
    'Lunch',
    'Dinner',
    'Other'
];

export const splitWiseDataItemMal = [
    'നിങ്ങളുടെ ഭക്ഷണ വിഭാഗം തിരഞ്ഞെടുക്കുക',
    'ബ്രേക്ക് ഫാസ്റ്റ്',
    'ഉച്ചഭക്ഷണം',
    'അത്താഴം',
    'മറ്റുള്ളവ'
];

export const FLOATING_ACTION = [
    // {
    //     text: "Post",
    //     icon: <Octicons name="checklist" size={convertHeight(16)} color={COLORS.primary} />,
    //     name: ROUTE_KEYS.FETCH_POST,
    //     color: COLORS.secondary,
    //     position: 4
    // },
    {
        text: i18n.t("Common:add_checklist"),
        icon: <Octicons name="checklist" size={convertHeight(16)} color={COLORS.primary} />,
        name: ROUTE_KEYS.WRITEUP_ABOUT_TRIP,
        color: COLORS.secondary,
        position: 3
    },
    // {
    //     text: "SplitWise",
    //     icon: <MaterialIcons name="call-split" size={convertHeight(16)} color={COLORS.primary} />,
    //     color: COLORS.secondary,
    //     name: ROUTE_KEYS.SPLIT_WISE_LIST,
    //     position: 2
    // },
    {
        text: i18n.t("Common:history"),
        icon: <MaterialIcons name="history" size={convertHeight(16)} color={COLORS.primary} />,
        color: COLORS.secondary,
        name: ROUTE_KEYS.CHECK_ITEM_HISTORY_LIST,
        position: 1
    }
];