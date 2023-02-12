import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import { ROUTE_KEYS } from '../navigation/constants';
import COLORS from '../common/Colors';
import { convertHeight } from '../common/utils/dimentionUtils';

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

export const FLOATING_ACTION = [
    {
        text: "Add Checklist",
        icon: <Octicons name="checklist" size={convertHeight(16)} color={COLORS.primary} />,
        name: ROUTE_KEYS.WRITEUP_ABOUT_TRIP,
        color: COLORS.secondary,
        position: 3
    },
    {
        text: "SplitWise",
        icon: <MaterialIcons name="call-split" size={convertHeight(16)} color={COLORS.primary} />,
        color: COLORS.secondary,
        name: ROUTE_KEYS.SPLIT_WISE_LIST,
        position: 2
    },
    {
        text: "History",
        icon: <MaterialIcons name="history" size={convertHeight(16)} color={COLORS.primary} />,
        color: COLORS.secondary,
        name: ROUTE_KEYS.CHECK_ITEM_HISTORY_LIST,
        position: 1
    }
];