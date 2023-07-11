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
        },
        buttonViewContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: deleteItem ? 'space-between' : 'center',
            backgroundColor: backgroundLiteColor,
            borderRadius: 5,
            width: convertWidth(150),
            borderWidth: 0.5,
            borderColor: COLORS.info,
            elevation: 3,
            margin: convertHeight(10),
        },
        textBtnSplit: {
            flex: 1,
            textAlign: 'center',
            fontWeight: '500',
            textTransform: 'uppercase',
            fontSize: convertHeight(9),
            paddingHorizontal: 1
        },
        reminderIconContainer: {
            height: convertHeight(35), 
            width: convertHeight(35), 
            borderRadius: convertHeight(2), 
            justifyContent: 'center',
            alignItems: 'center', 
            backgroundColor: COLORS.tertiary
        }
    });

    return (
        <>
            {deleteItem ?
                <TouchableOpacity activeOpacity={0.8}
                    style={[styles.buttonViewContainer]}>
                    <Text numberOfLines={2} style={[styles.textBtnSplit, { color: textColor }]}>{item.name}</Text>
                    <TouchableOpacity onPress={() => deleteItem(item.id)} activeOpacity={0.8} 
                        style={[styles.reminderIconContainer, { backgroundColor: COLORS.info }]}>
                        <Ionicons name="remove-sharp" size={convertHeight(20)} color={COLORS.primary} />
                    </TouchableOpacity>
                </TouchableOpacity>
                :
                <TouchableOpacity
                    onPress={() => onSubmitCheckList && onSubmitCheckList(item.name, index)}
                    disabled={onSubmitCheckList ? false : true}
                    style={styles.listItemContainer}>
                    <Text style={{ color: textColor }}>For {item.expense} {item.name} paid {item.paid}</Text>
                </TouchableOpacity> 
            }
        </>

    );
}