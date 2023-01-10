import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
// Custom Imports
import { convertHeight, convertWidth } from '../common/utils/dimentionUtils';
import COLORS from '../common/Colors';

export default function SubItemSplitWise(props) {
    const { item, index, deleteItem, paidValue, onSubmitCheckList } = props;

    const styles = StyleSheet.create({
        listItemContainer: {
            elevation: 5,
            backgroundColor: COLORS.primary,
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
                <Text style={{ color: COLORS.black }}>For {item.expense} {item.name} paid {item.paid}</Text>
                :
                <Text style={{ color: COLORS.black }}>{item.name}</Text>}
            <TouchableOpacity onPress={() => deleteItem(item.id)}>
                {deleteItem &&
                    <Ionicons name="remove-circle-sharp" size={convertHeight(24)} color={'#787774'} />}
            </TouchableOpacity>
        </TouchableOpacity>
    )
}