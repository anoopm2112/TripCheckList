import React, { useEffect, useState, useContext, useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, Platform, View, Image, StatusBar, ImageBackground, ScrollView } from 'react-native';
import Lottie from 'lottie-react-native';
import { useIsFocused } from '@react-navigation/native';
import { useTranslation } from "react-i18next";
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';
import NetInfo from '@react-native-community/netinfo';
// Custom Icons
import AssetIconsPack from '../../../assets/IconProvide';
import Colors from '../../../common/Colors';
import { convertHeight, convertWidth } from '../../../common/utils/dimentionUtils';
import { ROUTE_KEYS } from '../../../navigation/constants';
import { checkIfDataExistsInLocalDB, darkModeColor } from '../../../common/utils/arrayObjectUtils';
import TouristPlaces from '../../../common/data/TouristPlaces.json';
import { AnimatedText } from '../../../components';
import { Context as AuthContext } from '../../../context/AuthContext';

export default function DashboardScreen(props) {
    const { navigation } = props;
    const isFocused = useIsFocused();
    const { t, i18n } = useTranslation();
    const netInfo = NetInfo.useNetInfo();
    const { state, signin } = useContext(AuthContext);
    const viewAnimation = useRef(null);
    const [lottieAnimation, setLottieAnimation] = useState(false);
    const isDarkMode = useSelector(state => state?.settings?.isDarkMode);
    const { backgroundColor, textColor } = darkModeColor(isDarkMode);
    const [visibleItem, setVisibleItem] = useState(false);
    const [showView, setShowView] = useState(visibleItem);

    useEffect(() => {
        if (isFocused) {
            setLottieAnimation(false);

            async function fetchUserItem() {
                var value = await AsyncStorage.getItem('userAuth');
                if (value !== null) {
                    signin(JSON.parse(value));
                }
                if (netInfo.isConnected) {
                    let checklistLen = await checkIfDataExistsInLocalDB();
                    setVisibleItem(checklistLen);
                } else {
                    setVisibleItem(false);
                }
            }
            fetchUserItem();
        }

    }, [isFocused, netInfo, lottieAnimation]);

    useEffect(() => {
        const Animation = async () => {
            if (visibleItem) {
                setShowView(true);
                if (viewAnimation.current)
                    await viewAnimation.current.fadeInRight(2000);
            } else {
                if (viewAnimation.current) {
                    await viewAnimation.current.fadeOutRight(1000);
                }
                setShowView(false);
            }
        };
        Animation();
    }, [isFocused, visibleItem, viewAnimation]);

    const styles = StyleSheet.create({
        button: {
            backgroundColor: isDarkMode ? '#3D3C3A' : Colors.primary, padding: convertHeight(10), height: convertHeight(120), width: convertHeight(130),
            // justifyContent: 'center', alignItems: 'center', 
            borderWidth: 3, borderColor: Colors.primary,
            borderRadius: convertHeight(5),
            ...Platform.select({
                ios: {
                    shadowColor: '#c7c7c7', shadowOffset: { width: 5, height: 5 },
                    shadowOpacity: 0.5, shadowRadius: 5,
                },
                android: {
                    elevation: 5, shadowColor: Colors.black, shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2, shadowRadius: 2,
                },
            }),
        },
        title: {
            color: '#000',
            fontSize: 16,
            fontWeight: 'bold',
            textAlign: 'center',
            textTransform: 'uppercase',
        },
        topCard: {
            width: '100%',
            height: '40%',
            backgroundColor: isDarkMode ? '#000' : Colors.appIntro,
            position: 'absolute'
        },
        topCardSubContainer: {
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: convertHeight(35)
        },
        subSection: {
            marginTop: convertHeight(210),
            marginHorizontal: convertWidth(20),
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        textLabel: {
            fontWeight: 'bold',
            // textAlign: 'center',
            fontSize: (i18n.language === 'ml' || i18n.language === 'ta') ? convertHeight(10) : convertHeight(11)
        },
        syncIconContainer: {
            position: 'absolute',
            top: convertHeight(10),
            right: convertHeight(10),
            paddingLeft: convertWidth(7),
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: isDarkMode ? '#3D3C3A' : Colors.primary,
            borderRadius: 5
        },
        syncTxtContainer: {
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            alignItems: 'center',
        },
        syncTxt: {
            color: Colors.lightRed,
            fontSize: convertHeight(12),
            fontWeight: 'bold',
            paddingLeft: convertWidth(5),
            padding: convertHeight(5)
        },
        iconContainer: {
            backgroundColor: isDarkMode ? Colors.black : Colors.primary,
            justifyContent: 'center',
            alignItems: 'center'
        }
    });

    const RenderCardComponent = (props) => {
        return (
            <TouchableOpacity activeOpacity={0.9} style={[styles.button, { backgroundColor: props.bgColor }]} onPress={props.onPress}>
                <Text style={[styles.textLabel, { color: isDarkMode ? Colors.primary : Colors.black }]}>{props.cardName}</Text>
                <View style={props.bottomStyle}>
                    <Lottie source={props.cardIcon} loop={lottieAnimation} autoPlay style={props.style} />
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={{ backgroundColor: isDarkMode ? '#565051' : '#93B5C6', flex: 1 }}>
            <StatusBar backgroundColor={isDarkMode ? '#2c2c2e' : Colors.appIntro} barStyle='light-content' />
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.topCard}>
                <ImageBackground imageStyle={{ opacity: 0.1, height: '160%' }}
                    source={AssetIconsPack.icons.checklist_clothes_two}>
                    {showView &&
                        <Animatable.View animation={'fadeInRight'} ref={viewAnimation} style={styles.syncTxtContainer}>
                            <TouchableOpacity onPress={() => navigation.navigate(ROUTE_KEYS.SYNC_LOCAL_SERVER)}
                                activeOpacity={0.8} style={styles.syncIconContainer}>
                                <MaterialCommunityIcons name="cloud-sync-outline" size={convertHeight(17)} color={visibleItem ? Colors.lightRed : Colors.primary} />
                                <Text style={styles.syncTxt}>{t('Dashboard:actions:sync_info')}</Text>
                            </TouchableOpacity>
                        </Animatable.View>
                    }
                    <View style={styles.topCardSubContainer}>
                        <Image source={AssetIconsPack.icons.app_logo_side_image} style={{ height: convertHeight(80), width: convertHeight(80), borderRadius: convertHeight(50), backgroundColor: '#ffffff00' }} />
                        <Text style={[styles.textLabel, { color: Colors.primary, paddingTop: convertHeight(8), fontSize: convertHeight(16) }]}>{t('Dashboard:title')} {state?.userName}!</Text>
                        {/* <Text style={[styles.textLabel, { color: Colors.primary, paddingTop: convertHeight(5), fontStyle: 'italic', width: '90%' }]}>{t('Dashboard:subtitle')}</Text> */}
                        <AnimatedText style={[styles.textLabel, { color: Colors.primary, paddingTop: convertHeight(5), fontStyle: 'italic', width: '90%' }]} label={'Dashboard:subtitle'} />
                    </View>
                </ImageBackground>
            </View>
            <View style={styles.subSection} >
                <RenderCardComponent cardIcon={AssetIconsPack.icons.checklist_empty_icon} style={{ height: convertHeight(50) }}
                    bottomStyle={{ position: 'absolute', bottom: 5, right: 5 }}
                    bgColor={'#FCFFE0'}
                    cardName={t('Dashboard:actions:checklist')} onPress={() => navigation.navigate(ROUTE_KEYS.CHECK_ITEM_LIST)} />
                <RenderCardComponent cardIcon={isDarkMode ? AssetIconsPack.icons.money_hand_dark : AssetIconsPack.icons.splitwise_empty_icon} style={{ height: convertHeight(40) }} 
                    bottomStyle={{ position: 'absolute', bottom: 5, right: -10 }}
                    bgColor={'#F6F5F2'}
                    cardName={t('Dashboard:actions:money_splitter')} onPress={() => navigation.navigate(ROUTE_KEYS.SPLIT_WISE_LIST)} />
            </View>
            <View style={{ marginHorizontal: convertWidth(20), flexDirection: 'row', marginTop: convertHeight(20), justifyContent: 'space-between' }} >
                <RenderCardComponent cardIcon={AssetIconsPack.icons.tourist_icon} style={{ height: convertHeight(32), marginBottom: convertHeight(12) }}
                    bottomStyle={{ position: 'absolute', bottom: 0, right: 15 }}
                    bgColor={'#E0FBE2'}
                    cardName={t('Dashboard:actions:tourist_places')} onPress={() => navigation.navigate(ROUTE_KEYS.TOURIST_STATES)} />
                <RenderCardComponent cardIcon={AssetIconsPack.icons.cost_planner_icon} style={{ height: convertHeight(35), marginBottom: convertHeight(12) }}
                    bottomStyle={{ position: 'absolute', bottom: 0, right: 5 }}
                    bgColor={'#E1E5EA'}
                    cardName={t('Dashboard:actions:costPlanner')} onPress={() => navigation.navigate(ROUTE_KEYS.COST_PLANNER)} />
            </View>
            <View style={{ marginHorizontal: convertWidth(20), flexDirection: 'row', marginVertical: convertHeight(20), justifyContent: 'space-between' }} >
                <RenderCardComponent cardIcon={AssetIconsPack.icons.checklist_history_icon} style={{height: convertHeight(45) }}
                    bottomStyle={{ position: 'absolute', bottom: 5, right: 8 }}
                    bgColor={'#FFEEEE'}
                    cardName={t('Dashboard:actions:history')} onPress={() => navigation.navigate(ROUTE_KEYS.CHECK_ITEM_HISTORY_LIST)} />
                <RenderCardComponent cardIcon={AssetIconsPack.icons.settings_icon} style={{height: convertHeight(50) }}
                    bottomStyle={{ position: 'absolute', bottom: 0, right: 0 }}
                    bgColor={'#E3F4F4'}
                    cardName={t('Dashboard:actions:settings')} onPress={() => navigation.navigate(ROUTE_KEYS.SETTINGS)} />
            </View>
            </ScrollView>
        </View>
    );
}