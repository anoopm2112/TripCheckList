import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
// Custom Imports
import { convertHeight, convertWidth } from '../common/utils/dimentionUtils';
import COLORS from '../common/Colors';
import { darkModeColor } from '../common/utils/arrayObjectUtils';

export default function SubItemSplitWise(props) {
    const { item, index, deleteItem, paidValue, onSubmitCheckList } = props;

    const isDarkMode = useSelector(state => state?.settings?.isDarkMode);
    const { backgroundLiteColor, textColor } = darkModeColor(isDarkMode);

    const styles = StyleSheet.create({
        listItemContainer: {
            elevation: 5,
            backgroundColor: backgroundLiteColor,
            borderRadius: 5,
            margin: convertHeight(10),
            justifyContent: deleteItem ? 'space-between' : 'center',
            alignItems: 'center',
            width: convertWidth(150),
            paddingHorizontal: convertWidth(5),
            height: convertHeight(32),
            flexDirection: 'row'
        }
    });

    return (
        <TouchableOpacity
            onPress={() => onSubmitCheckList && onSubmitCheckList(item.name, index)}
            disabled={onSubmitCheckList ? false : true}
            style={styles.listItemContainer}>
            {paidValue ?
                <Text style={{ color: textColor }}>For {item.expense} {item.name} paid {item.paid}</Text>
                :
                <Text style={{ color: textColor }}>{item.name}</Text>}
            <TouchableOpacity onPress={() => deleteItem(item.id)}>
                {deleteItem &&
                    <Ionicons name="remove-circle-sharp" size={convertHeight(24)} color={'#2E2E2E'} />}
            </TouchableOpacity>
        </TouchableOpacity>
    )
}