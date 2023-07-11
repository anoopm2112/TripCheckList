import React, { useState } from 'react';
import { View, StyleSheet, ImageBackground, StatusBar, Text, TouchableOpacity, TextInput } from 'react-native';
import PushNotification from "react-native-push-notification";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
// Custom Imports
import { ROUTE_KEYS } from '../../navigation/constants';
import COLORS from '../../common/Colors';
import { convertHeight, convertWidth } from '../../common/utils/dimentionUtils';
import EN_IN from '../../common/languages/en_IN';
import AssetIconsPack from '../../assets/IconProvide';

const WelcomeScreen = ({ navigation }) => {
    const [yourName, setYourName] = useState('');
    const [valYourName, setValYourName] = useState(false);

    const onhandleWelcome = () => {
        if (yourName === '') {
            setValYourName(true);
        } else {
            setYourName('');
            PushNotification.createChannel({
                channelId: "test-channel",
                channelName: "Test Channel"
            });
            PushNotification.cancelAllLocalNotifications();
            AsyncStorage.setItem('userAuth', JSON.stringify(true));
            AsyncStorage.setItem('userName', yourName);
            navigation.navigate(ROUTE_KEYS.DASHBOARD_SCREEN);
        }
    };

    const Styles = StyleSheet.create({
        details: {
            height: '48%',
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
        },
        input: {
            flex: 1,
            backgroundColor: '#7fccac',
        },
        inputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            borderBottomColor: valYourName ? COLORS.validation : '#7d7d7d',
            borderBottomWidth: 2,
            paddingTop: convertHeight(3)
        }
    });

    return (
        <View style={{ flex: 1 }}>
            <StatusBar translucent backgroundColor="rgba(0,0,0,0)" />
            <ImageBackground style={{ flex: 1 }} resizeMode={'cover'} source={AssetIconsPack.icons.on_board_image}>
                <View style={Styles.details}>
                    <Text style={Styles.txtStyle}>{EN_IN.trip}</Text>
                    <Text style={Styles.txtStyle}>{EN_IN.checkList}</Text>
                    <Text style={{ color: COLORS.black, lineHeight: convertHeight(20), marginTop: convertHeight(10), fontStyle: 'italic', fontWeight: '500' }}>{EN_IN.welcomeSubTitle}</Text>
                    <View style={Styles.inputContainer}>
                        <TextInput
                            placeholder={'ENTER YOUR NAME'}
                            placeholderTextColor={valYourName ? COLORS.validation : '#7d7d7d'}
                            value={yourName}
                            onChangeText={(text) => {
                                setYourName(text);
                                setValYourName(false);
                            }}
                            style={Styles.input}
                        />
                        {valYourName ?
                            <Feather name="alert-circle" size={24} color={COLORS.validation} /> :
                            <FontAwesome name="user-circle-o" size={24} color={"#7d7d7d"} />}
                    </View>

                    <TouchableOpacity style={Styles.btn} activeOpacity={0.8} onPress={() => onhandleWelcome()}>
                        <Text style={{ fontWeight: 'bold', color: COLORS.black, textTransform: 'uppercase' }}>{EN_IN.get_tarted}</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    );
};

export default WelcomeScreen;