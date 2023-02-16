import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
// Custom Imports
import { convertHeight, convertWidth } from '../common/utils/dimentionUtils';
import COLORS from '../common/Colors';
import CustomFlipView from './CustomFlipView';

export default function SubItemListCardView(props) {
    const { item, index, checkItem, onModalOpenFun, renderItemAccessory } = props;

    const Styles = StyleSheet.create({
        mainContainer: {
            elevation: 5,
            backgroundColor: COLORS.primary,
            borderRadius: 5,
            margin: convertHeight(4),
            alignItems: 'center',
            width: convertWidth(160),
            height: convertWidth(193)
        },
        bottomContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            padding: convertHeight(7),
            borderTopColor: COLORS.info,
            borderTopWidth: 1
        }
    });

    return (
        <View style={Styles.mainContainer}>
            <CustomFlipView item={item} />

            <View style={Styles.bottomContainer}>
                <TouchableOpacity onPress={() => { onModalOpenFun && onModalOpenFun(item.image) }}>
                    <FontAwesome name="picture-o" size={24} color={item.image ? "black" : COLORS.info} />
                </TouchableOpacity>
                <Text style={{ color: COLORS.black, fontWeight: 'bold', fontSize: convertHeight(12) }}>{item.item}</Text>
                {checkItem && checkItem(item, index)}
                {renderItemAccessory && renderItemAccessory(item.id)}
            </View>

        </View>
    )
}