
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { CircularProgressBase } from 'react-native-circular-progress-indicator';
import { useTranslation } from "react-i18next";
import Lottie from 'lottie-react-native';
import { useSelector } from 'react-redux';
import AssetIconsPack from '../assets/IconProvide';
import { convertHeight, convertWidth } from '../common/utils/dimentionUtils';
import Colors from '../common/Colors';
import { darkModeColor } from '../common/utils/arrayObjectUtils';

export default function App(props) {
    const { onClose } = props;
    const [value, setValue] = useState(false);
    const { t } = useTranslation();
    const isDarkMode = useSelector(state => state?.settings?.isDarkMode);
    const { backgroundFlipColor, textColor } = darkModeColor(isDarkMode);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: backgroundFlipColor,
            alignItems: 'center',
            justifyContent: 'center',
        },
        progressContainer: {
            position: 'relative',
            alignItems: 'center',
            justifyContent: 'center',
        },
        innerText: {
            position: 'absolute',
            color: 'white',
            fontSize: 20,
            fontWeight: 'bold'
        },
        title: {
            fontSize: convertHeight(16),
            fontWeight: 'bold',
            color: Colors.black,
            textAlign: 'center',
            marginBottom: convertHeight(15)
        },
        closeButton: {
            width: convertWidth(250),
            padding: convertHeight(8),
            marginTop: convertHeight(25),
            alignItems: 'center',
            borderRadius: 3,
            backgroundColor: value ? Colors.tertiary : Colors.info
        },
        closeText: {
            color: value ? Colors.primary : Colors.black,
            fontWeight: 'bold',
        },
    });

    return (
        <View style={styles.container}>
            <View style={styles.progressContainer}>
                <CircularProgressBase
                    radius={100}
                    value={100}
                    valueSuffix={'%'}
                    inActiveStrokeColor={'#87a0fa'}
                    inActiveStrokeOpacity={0.2}
                    inActiveStrokeWidth={10}
                    duration={3000}
                    activeStrokeColor={'#3490dc'}
                    onAnimationComplete={() => setValue(true)}>
                    {value ?
                        <Lottie source={AssetIconsPack.icons.tick_complete_blue} autoPlay loop={false}
                            style={{ height: convertHeight(180), width: convertWidth(180), borderRadius: 30 }} />
                        :
                        <Lottie source={AssetIconsPack.icons.clean_app_data} autoPlay loop={true}
                            style={{ height: convertHeight(180), width: convertWidth(180), borderRadius: 30 }} />
                    }
                </CircularProgressBase>
                <TouchableOpacity style={styles.closeButton} disabled={!value}
                    onPress={() => {
                        onClose();
                    }}>
                    <Text style={styles.closeText}>{value ? t('Common:done') : t('Settings:data_cleaning')}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}