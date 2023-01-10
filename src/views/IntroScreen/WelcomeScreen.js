import React from 'react';
import { View, StyleSheet, ImageBackground, StatusBar, Text, TouchableOpacity, } from 'react-native';
import PushNotification from "react-native-push-notification";
import AsyncStorage from '@react-native-async-storage/async-storage';
// Custom Imports
import { ROUTE_KEYS } from '../../navigation/constants';
import COLORS from '../../common/Colors';
import { convertHeight, convertWidth } from '../../common/utils/dimentionUtils';
import EN_IN from '../../common/languages/en_IN';

const WelcomeScreen = ({ navigation }) => {

    const onhandleWelcome = () => {
        PushNotification.createChannel({
            channelId: "test-channel",
            channelName: "Test Channel"
        });
        PushNotification.cancelAllLocalNotifications();
        AsyncStorage.setItem('userAuth', JSON.stringify(true));
        navigation.navigate(ROUTE_KEYS.CHECK_ITEM_LIST);
    }

    const Styles = StyleSheet.create({
        details: {
            height: '45%',
            bottom: 0,
            position: 'absolute',
            paddingHorizontal: convertWidth(30),
        },
        btn: {
            height: convertHeight(40),
            width: convertWidth(170),
            backgroundColor: COLORS.primary,
            marginTop: convertHeight(20),
            borderRadius: convertHeight(5),
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 3
        },
        txtStyle: {
            color: COLORS.primary,
            fontSize: convertHeight(30),
            fontWeight: 'bold'
        }
    });

    return (
        <View style={{ flex: 1 }}>
            <StatusBar translucent backgroundColor="rgba(0,0,0,0)" />
            <ImageBackground style={{ flex: 1 }} resizeMode={'cover'} source={require('../../assets/onboardImage.jpeg')}>
                <View style={Styles.details}>
                    <Text style={Styles.txtStyle}>{EN_IN.trip}</Text>
                    <Text style={Styles.txtStyle}>{EN_IN.checkList}</Text>
                    <Text style={{ color: COLORS.black, lineHeight: convertHeight(20), marginTop: convertHeight(10) }}>{EN_IN.welcomeSubTitle}</Text>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => onhandleWelcome()}>
                        <View style={Styles.btn}>
                            <Text style={{ fontWeight: 'bold', color: COLORS.black }}>{EN_IN.get_tarted}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    );
};

export default WelcomeScreen;