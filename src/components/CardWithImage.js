import React from 'react';
import { Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { convertHeight, convertWidth } from '../common/utils/dimentionUtils';
import Colors from '../common/Colors';

const CardWithImage = ({ item, handleFoodClick, bgColor }) => {

    const styles = StyleSheet.create({
        card: {
            backgroundColor: bgColor,
            borderRadius: 5,
            padding: convertHeight(10),
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 5,
            elevation: 5,
            position: 'relative',
            overflow: 'visible',
            marginRight: convertWidth(25),
            borderWidth: 0.50,
            borderColor: Colors.appIntro,
            paddingRight: convertWidth(25)
        },
        cardText: {
            fontSize: 16,
            color: '#FFF',
            fontWeight: 'bold'
        },
        cardImage: {
            width: convertHeight(32),
            height: convertHeight(32),
            position: 'absolute',
            top: convertHeight(-15),
            right: convertWidth(-15),
            transform: [{ rotate: '-8deg' }]
        },
    });

    return (
        <TouchableOpacity onPress={handleFoodClick} style={styles.card}>
            <Image source={item?.icon} style={styles.cardImage} />
            <Text style={styles.cardText}>{item?.name}</Text>
        </TouchableOpacity>
    );
};

export default CardWithImage;
