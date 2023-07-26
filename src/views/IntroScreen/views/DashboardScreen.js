import React, { useEffect, useState, useContext } from 'react';
import { TouchableOpacity, Text, StyleSheet, Platform, View, Image, StatusBar, ImageBackground } from 'react-native';
import Lottie from 'lottie-react-native';
import { useIsFocused } from '@react-navigation/native';
import { useTranslation } from "react-i18next";
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Custom Icons
import AssetIconsPack from '../../../assets/IconProvide';
import Colors from '../../../common/Colors';
import { convertHeight, convertWidth } from '../../../common/utils/dimentionUtils';
import { ROUTE_KEYS } from '../../../navigation/constants';
import { darkModeColor } from '../../../common/utils/arrayObjectUtils';
import TouristPlaces from '../../../common/data/TouristPlaces.json';
import { AnimatedText } from '../../../components';
import { Context as AuthContext } from '../../../context/AuthContext';

export default function DashboardScreen(props) {
    const { navigation } = props;
    const isFocused = useIsFocused();
    const { t, i18n } = useTranslation();
    const { state, signin } = useContext(AuthContext);
    const [lottieAnimation, setLottieAnimation] = useState(true);
    const isDarkMode = useSelector(state => state?.settings?.isDarkMode);
    const { backgroundColor, textColor } = darkModeColor(isDarkMode);

    useEffect(() => {
        if (isFocused) {
            setLottieAnimation(false);
        }
        async function fetchUserItem() {
            var value = await AsyncStorage.getItem('userAuth');
            signin(JSON.parse(value));
        }
        fetchUserItem();
    }, [isFocused, lottieAnimation]);

    const styles = StyleSheet.create({
        button: {
            backgroundColor: isDarkMode ? '#3D3C3A' : Colors.primary, padding: 20, height: 160, width: 160,
            justifyContent: 'center', alignItems: 'center', borderWidth: 0.2, borderColor: Colors.primary, 
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
            marginTop: convertHeight(180),
            marginHorizontal: convertWidth(20),
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        textLabel: {
            fontWeight: 'bold',
            textAlign: 'center',
            fontSize: (i18n.language === 'ml' || i18n.language === 'ta') ? convertHeight(10) : convertHeight(11)
        }
    });

    const RenderCardComponent = (props) => {
        return (
            <TouchableOpacity activeOpacity={0.9} style={[styles.button]} onPress={props.onPress}>
                <Lottie source={props.cardIcon} loop={lottieAnimation} autoPlay style={{ height: convertHeight(70) }} />
                <Text style={[styles.textLabel, { color: isDarkMode ? Colors.primary : Colors.black }]}>{props.cardName}</Text>
            </TouchableOpacity>
        )
    }

    return (
        <View style={{ backgroundColor: isDarkMode ? '#565051' : '#e5e5e5', flex: 1 }}>
            <StatusBar backgroundColor={isDarkMode ? '#2c2c2e' : Colors.appIntro} barStyle='light-content' />
            <View style={styles.topCard}>
                <ImageBackground imageStyle={{ opacity: 0.1, height: '160%' }} 
                    source={AssetIconsPack.icons.checklist_clothes_image}>
                <View style={styles.topCardSubContainer}>
                    <Image source={AssetIconsPack.icons.app_logo_side_image} style={{ height: convertHeight(50), width: convertHeight(50), borderRadius: convertHeight(50), marginTop: convertHeight(5), backgroundColor: '#ffffff00' }} />
                    <Text style={[styles.textLabel, { color: Colors.primary, paddingTop: convertHeight(8), fontSize: convertHeight(16) }]}>{t('Dashboard:title')} {state?.userName}!</Text>
                    {/* <Text style={[styles.textLabel, { color: Colors.primary, paddingTop: convertHeight(5), fontStyle: 'italic', width: '90%' }]}>{t('Dashboard:subtitle')}</Text> */}
                    <AnimatedText style={[styles.textLabel, { color: Colors.primary, paddingTop: convertHeight(5), fontStyle: 'italic', width: '90%' }]} label={'Dashboard:subtitle'} />
                </View>
                </ImageBackground>
            </View>
            <View style={styles.subSection} >
                <RenderCardComponent cardIcon={AssetIconsPack.icons.checklist_empty_icon}
                    cardName={t('Dashboard:actions:checklist')} onPress={() => navigation.navigate(ROUTE_KEYS.CHECK_ITEM_LIST)} />
                <RenderCardComponent cardIcon={isDarkMode ? AssetIconsPack.icons.money_hand_dark : AssetIconsPack.icons.splitwise_empty_icon}
                    cardName={t('Dashboard:actions:money_splitter')} onPress={() => navigation.navigate(ROUTE_KEYS.SPLIT_WISE_LIST)} />
            </View>
            <View style={{ marginHorizontal: convertWidth(20), flexDirection: 'row', marginTop: convertHeight(20), justifyContent: 'space-between' }} >
                <RenderCardComponent cardIcon={AssetIconsPack.icons.tourist_icon}
                    cardName={t('Dashboard:actions:tourist_places')} onPress={() => navigation.navigate(ROUTE_KEYS.TOURIST_STATES)} />
                <RenderCardComponent cardIcon={AssetIconsPack.icons.cost_planner_icon}
                    cardName={t('Dashboard:actions:costPlanner')} onPress={() => navigation.navigate(ROUTE_KEYS.COST_PLANNER)} />
            </View>
            <View style={{ marginHorizontal: convertWidth(20), flexDirection: 'row', marginTop: convertHeight(20), justifyContent: 'space-between' }} >
                <RenderCardComponent cardIcon={AssetIconsPack.icons.checklist_history_icon}
                    cardName={t('Dashboard:actions:history')} onPress={() => navigation.navigate(ROUTE_KEYS.CHECK_ITEM_HISTORY_LIST)} />
                <RenderCardComponent cardIcon={AssetIconsPack.icons.settings_icon}
                    cardName={t('Dashboard:actions:settings')} onPress={() => navigation.navigate(ROUTE_KEYS.SETTINGS)} />
            </View>
        </View>
    )
}