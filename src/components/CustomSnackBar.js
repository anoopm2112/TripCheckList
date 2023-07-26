import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from "react-i18next";
// Custom Imports
import { convertHeight, convertWidth } from '../common/utils/dimentionUtils';
import Colors from '../common/Colors';

const CustomSnackbar = ({ visible, message, onHideSnackbar }) => {
    const { t } = useTranslation();
    const animation = useRef(new Animated.Value(0)).current;

    const showSnackbar = () => {
        Animated.timing(animation, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const hideSnackbar = () => {
        Animated.timing(animation, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => onHideSnackbar(false));
    };

    useEffect(() => {
        if (visible) {
            showSnackbar();
            const timer = setTimeout(() => {
                hideSnackbar();
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [visible]);

    const translateY = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [100, 0],
    });

    const styles = StyleSheet.create({
        container: { 
            position: 'absolute', 
            bottom: 0, 
            width: '100%', 
            alignItems: 'center' 
        },
        mainView: {
            backgroundColor: '#333',
            padding: convertHeight(12),
            width: '100%',
            transform: [{ translateY }],
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        textStyle: { 
            color: Colors.info, 
            paddingLeft: convertWidth(7),
            textTransform: 'uppercase',
            fontWeight: 'bold',
            fontSize: convertHeight(12)
        }
    });

    return (
        <View style={styles.container}>
            {visible && (
                <Animated.View style={styles.mainView}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <MaterialIcons name="wifi-off" size={convertHeight(17)} color={Colors.info} />
                        <Text style={styles.textStyle}>{t(message)}</Text>   
                    </View>
                    <TouchableOpacity onPress={() => hideSnackbar()}>
                        <MaterialIcons name="close" size={convertHeight(17)} color={Colors.info} />
                    </TouchableOpacity>
                </Animated.View>
            )}
        </View>
    );
};

export default CustomSnackbar;
