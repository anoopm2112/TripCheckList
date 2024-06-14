import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import { ROUTE_KEYS } from '../navigation/constants';
import COLORS from '../common/Colors';
import { convertHeight } from '../common/utils/dimentionUtils';
import i18n from 'i18next';
import AssetIconsPack from '../assets/IconProvide';

export const dataItem = [
    { id: 1, name: 'SHIRT', icon: AssetIconsPack.icons.shirt },
    { id: 2, name: 'JEANS', icon: AssetIconsPack.icons.jeans },
    { id: 3, name: 'SHOES', icon: AssetIconsPack.icons.running_shoe },
    { id: 4, name: 'OTHER', icon: AssetIconsPack.icons.school_bag },
];

export const dataItemML = [
    { id: 1, name: 'ഷർട്ട്', icon: AssetIconsPack.icons.shirt },
    { id: 2, name: 'പാന്റ്', icon: AssetIconsPack.icons.jeans },
    { id: 3, name: 'ഷൂസ്', icon: AssetIconsPack.icons.running_shoe },
    { id: 4, name: 'മറ്റുള്ളവ', icon: AssetIconsPack.icons.school_bag }
];

export const dataItemHI = [
    { id: 1, name: 'शर्ट', icon: AssetIconsPack.icons.shirt },
    { id: 2, name: 'पंत', icon: AssetIconsPack.icons.jeans },
    { id: 3, name: 'जूते', icon: AssetIconsPack.icons.running_shoe },
    { id: 4, name: 'अन्य', icon: AssetIconsPack.icons.school_bag }
];

export const dataItemTA = [
    { id: 1, name: 'சட்டை', icon: AssetIconsPack.icons.shirt },
    { id: 2, name: 'பேன்ட்', icon: AssetIconsPack.icons.jeans },
    { id: 3, name: 'காலணிகள்', icon: AssetIconsPack.icons.running_shoe },
    { id: 4, name: 'மற்றவை', icon: AssetIconsPack.icons.school_bag }
];

export const splitWiseDataItem = [
    // 'Select your food category',
    { id: 1, name: 'BREAK FAST', icon: AssetIconsPack.icons.breakfast },
    { id: 2, name: 'LUNCH', icon: AssetIconsPack.icons.lunch },
    { id: 3, name: 'DINNER', icon: AssetIconsPack.icons.dinner },
    { id: 4, name: 'OTHER', icon: AssetIconsPack.icons.other_food },
];

// export const splitWiseDataItem = [
//     { label: 'Break Fast', value: 'Break Fast' },
//     { label: 'Lunch', value: 'Lunch' },
//     { label: 'Dinner', value: 'Dinner' },
//     { label: 'Other', value: 'Other' }
// ];



export const splitWiseDataItemMal = [
    { id: 1, name: 'ബ്രേക്ക് ഫാസ്റ്റ്', icon: AssetIconsPack.icons.breakfast },
    { id: 2, name: 'ഉച്ചഭക്ഷണം', icon: AssetIconsPack.icons.lunch },
    { id: 3, name: 'അത്താഴം', icon: AssetIconsPack.icons.dinner },
    { id: 4, name: 'മറ്റുള്ളവ', icon: AssetIconsPack.icons.other_food },
];

export const splitWiseDataItemTamil = [
    { id: 1, name: 'பிரேக் ஃபாஸ்ட்', icon: AssetIconsPack.icons.breakfast },
    { id: 2, name: 'மதிய உணவு', icon: AssetIconsPack.icons.lunch },
    { id: 3, name: 'இரவு உணவு', icon: AssetIconsPack.icons.dinner },
    { id: 4, name: 'மற்றவை', icon: AssetIconsPack.icons.other_food },
];

export const splitWiseDataItemHindi = [
    { id: 1, name: 'नाश्ता', icon: AssetIconsPack.icons.breakfast },
    { id: 2, name: 'दिन का खाना', icon: AssetIconsPack.icons.lunch },
    { id: 3, name: 'रात का खाना', icon: AssetIconsPack.icons.dinner },
    { id: 4, name: 'अन्य', icon: AssetIconsPack.icons.other_food }
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