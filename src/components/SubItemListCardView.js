import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
// Custom Imports
import { convertHeight, convertWidth } from '../common/utils/dimentionUtils';
import COLORS from '../common/Colors';

export default function SubItemListCardView(props) {
    const { item, index, checkItem, onModalOpenFun, renderItemAccessory } = props;

    const Styles = StyleSheet.create({
        mainContainer: {
            elevation: 5,
            backgroundColor: COLORS.primary,
            borderRadius: 5,
            margin: convertHeight(4),
            alignItems: 'center',
            width: convertWidth(160)
        },
        bottomContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%'
        },
        thumbnail: {
            height: convertHeight(130),
            width: convertWidth(160),
            borderRadius: 2
        }
    });

    return (
        <TouchableOpacity style={Styles.mainContainer} onPress={() => { onModalOpenFun && onModalOpenFun(item.image) }}>

            {!item.image ?
                <Image style={Styles.thumbnail} source={require('../assets/clothes_three.png')} />
                :
                <Image style={Styles.thumbnail} source={{ uri: item.image }} />
            }

            <View style={Styles.bottomContainer}>
                <Text style={{ color: COLORS.black, fontWeight: 'bold', padding: convertHeight(7) }}>{`${item.counter} ${item.item}`}</Text>
                {checkItem && checkItem(item, index)}
                {renderItemAccessory && renderItemAccessory(item.id)}
            </View>

        </TouchableOpacity>
    )
}