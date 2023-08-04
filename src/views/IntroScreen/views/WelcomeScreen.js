import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, ImageBackground, StatusBar, Text, TouchableOpacity, BackHandler, Image, Modal } from 'react-native';
import PushNotification from "react-native-push-notification";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { useDispatch } from 'react-redux';
import NetInfo from '@react-native-community/netinfo';
// Custom Imports
import COLORS from '../../../common/Colors';
import { convertHeight, convertWidth } from '../../../common/utils/dimentionUtils';
import EN_IN from '../../../common/languages/en_IN';
import AssetIconsPack from '../../../assets/IconProvide';
import { Context as AuthContext } from '../../../context/AuthContext';
import { registerNewUserIntro } from '../api/IntroScreenAPI';
import { selectAllIntro } from '../introSlice';
import { AppLoader } from '../../../components';

const WelcomeScreen = () => {
    const { signin } = useContext(AuthContext);
    const dispatch = useDispatch();
    const netInfo = NetInfo.useNetInfo();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: '961469081993-6sf354d9chcl26v989hu9or625a7a5cf.apps.googleusercontent.com',
        });
    }, []);

    useEffect(() => {
        const handleBackButton = () => {
            BackHandler.exitApp();
            return true;
        };
        BackHandler.addEventListener('hardwareBackPress', handleBackButton);
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
        };
    }, []);

    const onhandleWelcome = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const { idToken } = await GoogleSignin.signIn();
            const googleCredential = auth.GoogleAuthProvider.credential(idToken);
            setIsLoading(true);

            // Sign-in the user with the credential
            const googleResult = await auth().signInWithCredential(googleCredential);
            let userResult = { 
                userToken: googleResult?.user?.email,
                userName: googleResult?.user?.displayName
            }

            dispatch(registerNewUserIntro({
                name: googleResult?.user?.displayName,
                email: googleResult?.user?.email
            }));

            PushNotification.createChannel({
                channelId: "test-channel",
                channelName: "Test Channel"
            });
            PushNotification.cancelAllLocalNotifications();
            signin(userResult);
            AsyncStorage.setItem('userAuth', JSON.stringify(userResult));
        } catch (error) {
            console.log('Error:', error.message);
        }
    };

    const Styles = StyleSheet.create({
        details: {
            height: '36%',
            bottom: 0,
            position: 'absolute',
            paddingHorizontal: convertWidth(30),
        },
        btn: {
            backgroundColor: netInfo.isConnected ? COLORS.primary : COLORS.info,
            marginTop: convertHeight(20),
            borderRadius: convertHeight(3),
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 3,
            flexDirection: 'row',
            padding: convertWidth(10)
        },
        txtStyle: {
            color: COLORS.primary,
            fontSize: convertHeight(30),
            fontWeight: 'bold'
        },
        googleIcon: {
            width: convertHeight(18),
            height: convertHeight(18)
        },
        loading: {
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            backgroundColor: '#4F4F4F'
        }
    });

    if (isLoading) {
        return (
            <Modal animationType='fade' transparent={true} visible={true}>
                <StatusBar backgroundColor={'#4F4F4F'} />
                <View style={Styles.loading}><AppLoader /></View>
            </Modal>
        )
    }

    return (
        <View style={{ flex: 1 }}>
            <StatusBar translucent backgroundColor="rgba(0,0,0,0)" />
            <ImageBackground style={{ flex: 1 }} resizeMode={'cover'} source={AssetIconsPack.icons.on_board_image}>
                <View style={Styles.details}>
                    <Text style={Styles.txtStyle}>{EN_IN.trip}</Text>
                    <Text style={Styles.txtStyle}>{EN_IN.checkList}</Text>
                    <Text style={{ color: COLORS.primary, lineHeight: convertHeight(20), marginTop: convertHeight(10), fontStyle: 'italic', fontWeight: '500' }}>{EN_IN.welcomeSubTitle}</Text>

                    <TouchableOpacity disabled={!netInfo.isConnected} style={Styles.btn} activeOpacity={0.8} onPress={() => onhandleWelcome()}>
                        <Image source={AssetIconsPack.icons.google_icon} resizeMode='contain' style={Styles.googleIcon} />
                        <Text style={{
                            fontWeight: 'bold', color: COLORS.lightGreen,
                            textTransform: 'uppercase', paddingLeft: convertWidth(12)
                        }}>{EN_IN.get_tarted}</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    );
};

export default WelcomeScreen;