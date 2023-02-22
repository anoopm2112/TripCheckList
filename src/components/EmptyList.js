import React from 'react';
import { View, Text, StyleSheet } from 'react-native'
import Lottie from 'lottie-react-native';
import { useTranslation } from "react-i18next";
// custom imports
import { convertHeight, convertWidth } from '../common/utils/dimentionUtils';
import COLORS from '../common/Colors';

export default function EmptyList(props) {
    const { t } = useTranslation();

    const styles = StyleSheet.create({
        mainContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: COLORS.primary
        },
        infoTxt: {
            color: COLORS.info,
            fontStyle: 'italic',
            paddingHorizontal: convertWidth(30),
            textAlign: 'center'
        }
    });

    return (
        <View style={styles.mainContainer}>
            <Lottie source={props.lottieSrc} autoPlay loop style={{ height: convertHeight(120) }} />
            <Text style={styles.infoTxt}>{t(props.shownText)}</Text>
        </View>
    )
}