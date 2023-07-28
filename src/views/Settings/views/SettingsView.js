import React, { useEffect, useRef, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Image, Share, Linking, Animated, ScrollView } from 'react-native';
import RBSheet from "react-native-raw-bottom-sheet";
import { useTranslation } from "react-i18next";
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useIsFocused } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import DeviceInfo from 'react-native-device-info';
import * as Animatable from 'react-native-animatable';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
// Custom Imports
import { ROUTE_KEYS } from '../../../navigation/constants';
import Colors from '../../../common/Colors';
import { convertHeight, convertWidth } from '../../../common/utils/dimentionUtils';
import { CustomPopup, EraseModal, List } from '../../../components';
import { languagesInitialValue } from '../../../common/translation/constant';
import { toggleDarkMode } from '../settingsSlice';
import { checkIfDataExistsInLocalDB, darkModeColor } from '../../../common/utils/arrayObjectUtils';
import { deleteAllSplitWise } from '../../SplitWise/api/SplitWiseApi';
import { deleteAllChecklist } from '../../CheckList/api/ChecklistApi';
import AssetIconsPack from '../../../assets/IconProvide';
import QuoteModal from '../../AboutUs/views/QuoteModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PrivacyPolicyModal from './PrivacyPolicyModal';
import { Context as AuthContext } from '../../../context/AuthContext';

export default function SettingsView(props) {
    const { i18n, t } = useTranslation();
    const refRBSheet = useRef();
    const refRBThemeSheet = useRef();
    const refRBClearAllSheet = useRef();
    const dispatch = useDispatch();
    const isDarkMode = useSelector(state => state?.settings?.isDarkMode);
    const { backgroundColor, textColor } = darkModeColor(isDarkMode);
    const [eraseModalVisible, setEraseModalVisible] = useState(false);
    const [quoteModalVisible, setQuoteModalVisible] = useState(false);
    const [logoutAlertVisible, setLogoutAlertVisible] = useState(false);
    const [privacyPolicyModalVisible, setPrivacyPolicyModalVisible] = useState(false);
    const [visibleItem, setVisibleItem] = useState(false);
    const [tapCount, setTapCount] = useState(0);
    const isFocused = useIsFocused();
    const iconAnimation = useRef(new Animated.Value(0)).current;
    const iconLanguageAnimation = useRef(new Animated.Value(0)).current;
    const { signout, state } = useContext(AuthContext);

    useEffect(() => {
        if (tapCount === 2) {
            setQuoteModalVisible(true);
        }
    }, [tapCount]);

    const handlePress = () => {
        setTapCount(tapCount + 1);
        setTimeout(() => {
            setTapCount(0);
        }, 300); // Reset tap count after 300 milliseconds (adjust as needed)
    };

    const onChangeLanguage = (lang) => {
        Animated.sequence([
            Animated.timing(iconLanguageAnimation, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(iconLanguageAnimation, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();
        refRBSheet.current.close();
        i18n.changeLanguage(lang);
        // props.navigation.navigate(ROUTE_KEYS.DASHBOARD_SCREEN);
    };

    useEffect(() => {
        if (isFocused) {
            StatusBar.setBackgroundColor(backgroundColor);
            async function fetchUserItem() {
                let checklistLen = await checkIfDataExistsInLocalDB();
                setVisibleItem(checklistLen);
            }
            fetchUserItem();
        }
    }, [isFocused]);

    const settingsArray = [
        {
            id: 1,
            name: 'Settings:changelanguage',
            icon_name: 'language',
            onPress: () => refRBSheet.current.open()
        },
        {
            id: 2,
            name: 'Settings:theme',
            icon_name: 'theme-light-dark',
            onPress: () => refRBThemeSheet.current.open()
        },
        {
            id: 8,
            name: 'Settings:local_data_sync',
            icon_name: 'database-sync',
            onPress: () => props.navigation.navigate(ROUTE_KEYS.SYNC_LOCAL_SERVER)
        },
        {
            id: 3,
            name: 'Settings:clear_all_data',
            icon_name: 'broom',
            onPress: () => refRBClearAllSheet.current.open()
        },
        {
            id: 4,
            name: 'AboutUs:AboutUs',
            icon_name: 'information',
            onPress: () => props.navigation.navigate(ROUTE_KEYS.ABOUT_US)
        },
        {
            id: 5,
            name: 'ContactUs:contactUs',
            icon_name: 'contacts',
            onPress: () => props.navigation.navigate(ROUTE_KEYS.CONTACT_US)
        },
        {
            id: 6,
            name: 'Help:takeTour',
            icon_name: 'help-circle',
            onPress: () => props.navigation.navigate(ROUTE_KEYS.HELP_VIEW)
        },
        {
            id: 7,
            name: 'Logout:logout',
            icon_name: 'location-exit',
            onPress: () => setLogoutAlertVisible(true)
        }
    ];

    const perfomLogout = async () => {
        AsyncStorage.removeItem('userAuth');
        await GoogleSignin.signOut();
        signout();
    }

    const renderItem = (item) => {
        return (
            <TouchableOpacity activeOpacity={0.9} onPress={() => onChangeLanguage(item.languageCode)} style={[styles.button, { backgroundColor: isDarkMode ? '#2c2c2e' : Colors.primary }]}>
                <Text style={{ color: textColor, fontWeight: 'bold' }}>{t(`Languages:${item?.language}`)}</Text>
                {i18n.language === item.languageCode &&
                    <AntDesign name="checkcircle" size={24} color={isDarkMode ? Colors.primary : Colors.lightGreen} />
                }
            </TouchableOpacity>
        );
    };

    const handleToggleDarkMode = () => {
        Animated.sequence([
            Animated.timing(iconAnimation, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(iconAnimation, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();
        dispatch(toggleDarkMode());
        refRBThemeSheet.current.close();
    };

    const rotateInterpolation = iconAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const iconStyle = {
        opacity: iconAnimation,
        transform: [{ rotate: rotateInterpolation }],
    };

    const rotateLangInterpolation = iconLanguageAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const iconLangStyle = {
        opacity: iconLanguageAnimation,
        transform: [{ rotate: rotateLangInterpolation }],
    };

    const handleEraseAllData = () => {
        refRBClearAllSheet.current.close();
        setEraseModalVisible(true);
        dispatch(deleteAllSplitWise());
        dispatch(deleteAllChecklist());
    };

    const AppShareHandler = async () => {
        try {
            await Share.share({
                title: 'Trip Checklist',
                message: `Please install this app and explore more ${'https://play.google.com/store/apps/details?id=com.tripchecklist&pli=1'}`,
                url: 'https://play.google.com/store/apps/details?id=com.tripchecklist&pli=1'
            });
        } catch (error) {
            alert(error.message);
        }
    };

    const RateUsHandler = () => {
        const url = Platform.OS === 'android' ?
            'https://play.google.com/store/apps/details?id=com.tripchecklist&pli=1' :
            'https://apps.apple.com/us/app/doorhub-driver/id=com.tripchecklist&pli=1';
        Linking.openURL(url);
    };

    const styles = StyleSheet.create({
        mainContainer: {
            backgroundColor: backgroundColor,
            flex: 1
        },
        button: {
            backgroundColor: backgroundColor,
            paddingHorizontal: convertHeight(15),
            paddingVertical: convertHeight(12),
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center'
        },
        buttonErase: {
            backgroundColor: isDarkMode ? '#2c2c2e' : Colors.primary,
            marginTop: 25,
            width: 150,
            height: 50,
            justifyContent: 'space-around',
            flexDirection: 'row',
            alignItems: 'center',
            elevation: 3,
            borderRadius: 3,
            borderColor: Colors.primary,
            borderWidth: isDarkMode ? 1 : 0
        },
        bottomText: {
            color: isDarkMode ? '#8f8f8f' : '#696969',
            fontWeight: '400',
            textDecorationLine: 'underline',
            fontSize: 13
        },
        bottomContainer: {
            padding: 40,
            position: 'absolute',
            bottom: 0,
            backgroundColor: isDarkMode ? '#262626' : '#f0f0f0',
            borderTopWidth: 0.5,
            borderTopColor: '#f2f2f2'
        },
        appVesrion: { 
            color: isDarkMode ? '#8f8f8f' : '#696969', 
            fontWeight: '400', 
            paddingVertical: 20, 
            textAlign: 'center', 
            fontSize: 12 
        }
    });

    return (
        <View style={styles.mainContainer}>
            <StatusBar backgroundColor={backgroundColor} barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

            {settingsArray.map((item) => {
                return (
                    <TouchableOpacity key={item.id} style={styles.button} onPress={item.onPress}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {item.id === 1 ?
                                <FontAwesome name={item.icon_name} size={24} color={textColor} />
                                :
                                <MaterialCommunityIcons name={item.icon_name} size={24} color={textColor} />
                            }
                            <View>
                                <Text style={{ color: textColor, paddingLeft: convertWidth(12), fontWeight: '500', paddingVertical: 5 }}>{t(item.name)}</Text>   
                                {item.id === 7 && <Text style={{ color: textColor, paddingLeft: convertWidth(12), fontStyle: 'italic', fontWeight: '400', fontSize: convertHeight(9) }}>{state?.userToken}</Text>}
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {item.id === 1 && 
                                <Animated.View style={[iconLangStyle, { opacity: 1 }]}>
                                    <MaterialCommunityIcons 
                                        name={
                                            i18n.language === 'en' ? 'alpha-e-circle-outline' : 
                                                i18n.language === 'ml' ? 'alpha-m-circle-outline' :
                                                    i18n.language === 'hi' ? 'alpha-h-circle-outline' : 'alpha-t-circle-outline'
                                        }
                                        size={24} color={textColor} />
                                </Animated.View>
                            }
                            {item.id === 2 && 
                                <Animated.View style={[iconStyle, { opacity: 1 }]}>
                                    <MaterialCommunityIcons 
                                        name={isDarkMode ? 'weather-night' : 'white-balance-sunny'}
                                        size={24} color={textColor} />
                                </Animated.View>
                            }
                            {(item.id === 8 && visibleItem) &&
                                <Ionicons name="sync-circle" size={24} color={Colors.lightRed} />
                            }
                            <Ionicons name="md-chevron-forward-sharp" size={24} color={textColor} />
                        </View>
                    </TouchableOpacity>
                );
            })}

            <RBSheet
                height={convertHeight(223)} ref={refRBSheet}
                closeOnDragDown={true}
                customStyles={{
                    draggableIcon: { backgroundColor: textColor },
                    container: {
                        backgroundColor: isDarkMode ? '#2c2c2e' : Colors.primary
                    }
                }}>
                <List style={{ backgroundColor: isDarkMode ? '#2c2c2e' : Colors.primary }} data={languagesInitialValue} renderItem={({ item }) => renderItem(item)} />
            </RBSheet>

            <RBSheet height={convertHeight(127)} ref={refRBThemeSheet} closeOnDragDown={true}
                customStyles={{
                    draggableIcon: { backgroundColor: textColor },
                    container: { backgroundColor: isDarkMode ? '#2c2c2e' : Colors.primary }
                }}>
                <View>

                    <TouchableOpacity disabled={isDarkMode} onPress={() => handleToggleDarkMode()} style={[styles.button, { backgroundColor: isDarkMode ? '#2c2c2e' : Colors.primary }]}>
                        <Text style={{ color: textColor, fontWeight: 'bold' }}>{t('Settings:dark')}</Text>
                        {isDarkMode && <AntDesign name="checkcircle" size={24} color={Colors.primary} />}
                    </TouchableOpacity>

                    <TouchableOpacity disabled={!isDarkMode} onPress={() => handleToggleDarkMode()} style={[styles.button, { backgroundColor: isDarkMode ? '#2c2c2e' : Colors.primary }]}>
                        <Text style={{ color: textColor, fontWeight: 'bold' }}>{t('Settings:light')}</Text>
                        {!isDarkMode && <AntDesign name="checkcircle" size={24} color={Colors.lightGreen} />}
                    </TouchableOpacity>

                </View>
            </RBSheet>

            <RBSheet
                height={convertHeight(127)} ref={refRBClearAllSheet} closeOnDragDown={true}
                customStyles={{
                    draggableIcon: { backgroundColor: textColor },
                    container: { backgroundColor: isDarkMode ? '#2c2c2e' : Colors.primary }
                }}>
                <View>
                    <Text style={{ color: textColor, fontWeight: 'bold', textAlign: 'center' }}>{t('Settings:clear_all_val')}</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 32 }}>
                        <TouchableOpacity activeOpacity={0.5} onPress={() => handleEraseAllData()} style={styles.buttonErase}>
                            <Text style={{ color: textColor, fontWeight: 'bold' }}>{t('Common:yes')}</Text>
                            <AntDesign name="checkcircle" size={24} color={Colors.lightGreen} />
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.5} onPress={() => refRBClearAllSheet.current.close()} style={styles.buttonErase}>
                            <Text style={{ color: textColor, fontWeight: 'bold' }}>{t('Common:no')}</Text>
                            <AntDesign name="closecircle" size={24} color={Colors.lightRed} />
                        </TouchableOpacity>
                    </View>
                </View>
            </RBSheet>

            <EraseModal
                visible={eraseModalVisible}
                onClose={() => { setEraseModalVisible(false); }}
                onConfirm={() => { }} />

            <View style={styles.bottomContainer}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', width: '100%' }}>
                    <TouchableOpacity onPress={() => AppShareHandler()}>
                        <Text style={styles.bottomText}>{t('Settings:share')}</Text>
                    </TouchableOpacity>
                    <Text style={{ color: '#696969', fontWeight: '300' }}>|</Text>
                    <TouchableOpacity onPress={() => RateUsHandler()}>
                        <Text style={styles.bottomText}>{t('Settings:rateus')}</Text>
                    </TouchableOpacity>
                    <Text style={{ color: '#696969', fontWeight: '300' }}>|</Text>
                    <TouchableOpacity onPress={handlePress}>
                        <Animatable.View animation="pulse" easing="ease-out" iterationCount="infinite">  
                            <Image source={AssetIconsPack.icons.app_logo_side_image} 
                                style={{ resizeMode: 'cover', height: convertHeight(20), width: convertHeight(20), backgroundColor: isDarkMode ? '#262626' : '#f0f0f0' }} />
                        </Animatable.View>
                    </TouchableOpacity>
                </View>

                <View>
                    <Text style={styles.appVesrion}>{t('Settings:appVersion')}: {DeviceInfo.getVersion()}</Text>
                    <TouchableOpacity onPress={() => setPrivacyPolicyModalVisible(true)}>
                        <Text style={[styles.bottomText, { paddingVertical: 10, textAlign: 'center', fontSize: 12 }]}>{t('Settings:privacyPolicy')}</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <QuoteModal
                visible={quoteModalVisible}
                onClose={() => { setQuoteModalVisible(false); }}
                onConfirm={() => { }} />

            <PrivacyPolicyModal
                visible={privacyPolicyModalVisible}
                onClose={() => { setPrivacyPolicyModalVisible(false); }}
                onConfirm={() => { }} />

            <CustomPopup
                title={'Common:logoutApp'} message={'Common:please_confirm'}
                visible={logoutAlertVisible} onClose={() => setLogoutAlertVisible(false)}
                onConfirm={() => perfomLogout()} />

        </View>
    );
}