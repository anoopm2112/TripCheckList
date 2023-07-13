import React, { useEffect } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { useTranslation } from "react-i18next";
// Custom Imports
import { convertHeight, convertWidth } from '../common/utils/dimentionUtils';
import COLORS from '../common/Colors';

export default FloatingText = (props) => {
    const { t } = useTranslation();
    const animatedValue = new Animated.Value(0);

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(animatedValue, { toValue: 1, duration: 1000, useNativeDriver: true }),
                Animated.timing(animatedValue, { toValue: 0, duration: 1000, useNativeDriver: true }),
            ])
        ).start();
    }, [props]);

    const translateY = animatedValue.interpolate({ inputRange: [0, 1], outputRange: [0, 5] });

    const styles = StyleSheet.create({
        infoText: {
            color: COLORS.info,
            fontStyle: 'italic',
            paddingHorizontal: convertWidth(30),
            textAlign: 'center',
            fontSize: convertHeight(10),
            paddingBottom: convertHeight(5),
            fontWeight: 'bold'
        }
    });

    return (
        <View style={{ alignItems: 'center' }}>
            <Animated.Text
                style={[styles.infoText, { transform: [{ translateY }] }, props.style && props.style]}>
                {t(props.label)}
            </Animated.Text>
        </View>
    );
};

