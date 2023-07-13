import React from 'react';
import { View, Text, StyleSheet } from 'react-native'
import Lottie from 'lottie-react-native';
import { useTranslation } from "react-i18next";
import { useSelector } from 'react-redux';
// custom imports
import { convertHeight, convertWidth } from '../common/utils/dimentionUtils';
import COLORS from '../common/Colors';
import { darkModeColor } from '../common/utils/arrayObjectUtils';
import AnimatedText from './AnimatedText';

export default function EmptyList(props) {
    const { t } = useTranslation();
    const isDarkMode = useSelector(state => state?.settings?.isDarkMode);
    const { backgroundColor } = darkModeColor(isDarkMode);

    const styles = StyleSheet.create({
        mainContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: backgroundColor
        }
    });

    return (
        <View style={styles.mainContainer}>
            <Lottie source={props.lottieSrc} autoPlay loop style={{ height: convertHeight(120) }} />
            <AnimatedText label={props.shownText}  />
        </View>
    )
}