import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import Lottie from 'lottie-react-native';
import { useTranslation } from "react-i18next";
import { useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
// custom imports
import { convertHeight, convertWidth } from '../common/utils/dimentionUtils';
import { darkModeColor } from '../common/utils/arrayObjectUtils';
import AssetIconsPack from '../assets/IconProvide';

export default function NetworkErrorView(props) {
    const { t } = useTranslation();
    const isDarkMode = useSelector(state => state?.settings?.isDarkMode);
    const { backgroundColor, textColor } = darkModeColor(isDarkMode);

    const styles = StyleSheet.create({
        mainContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: backgroundColor
        },
        buttonViewContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 5,
            padding: convertWidth(10)
        },
        reloadText: { 
            color: textColor, 
            paddingRight: convertWidth(5), 
            textTransform: 'uppercase',
            fontWeight: '500'
        }
    });

    return (
        <View style={styles.mainContainer}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={backgroundColor} />
            <Lottie source={AssetIconsPack.icons.network_error_lottie} autoPlay loop
                style={{ height: convertHeight(170), width: convertHeight(170) }} />
            <TouchableOpacity style={styles.buttonViewContainer} onPress={() => props.onAction()}>
                <Text style={styles.reloadText}>{t('Common:network_error')}</Text>
                <Ionicons name="reload-circle" size={24} color={textColor} />
            </TouchableOpacity>
        </View>
    );
}