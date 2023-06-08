import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, StatusBar, Text } from 'react-native';
import { useTranslation } from "react-i18next";
// Custom Imports
import { ROUTE_KEYS } from '../../../navigation/constants';
import { AnimatedText } from '../../../components';
import { convertHeight, convertWidth } from '../../../common/utils/dimentionUtils';
import AssetIconsPack from '../../../assets/IconProvide';

export default function TouristPlaceList(props) {
    const { navigation } = props;

    const { t, i18n } = useTranslation();

    const handleDistrictPress = (district) => {
        navigation.navigate(ROUTE_KEYS.TOURIST_DISTRICT, { districtName: district });
    };

    const styles = StyleSheet.create({
        commonStyle: {
            position: 'absolute',
            borderRadius: convertHeight(10)
        }
    });

    return (
        <View>
            <StatusBar backgroundColor={'#FFFFFF'} barStyle='dark-content' />
            <Image resizeMode='stretch' source={
                i18n.language === 'en' ? AssetIconsPack.icons.Kerala_district_map_en :
                    i18n.language === 'ml' ? AssetIconsPack.icons.Kerala_district_map_ml :
                        i18n.language === 'hi' ? AssetIconsPack.icons.Kerala_district_map_hi : AssetIconsPack.icons.Kerala_district_map_ta
            }
                style={{ width: '100%', height: '100%', backgroundColor: '#FFFFFF' }} />

            {/* Clickable areas for each district */}
            <TouchableOpacity style={[styles.commonStyle, {
                top: convertHeight(12), left: convertWidth(32), width: convertWidth(45),
                height: convertHeight(75), transform: [{ rotate: '-30deg' }]
            }]} onPress={() => handleDistrictPress('Kasaragod')} />

            <TouchableOpacity style={[styles.commonStyle, {
                top: convertHeight(76), left: convertWidth(75), width: convertWidth(55),
                height: convertHeight(70), transform: [{ rotate: '-40deg' }]
            }]} onPress={() => handleDistrictPress('Kannur')} />

            <TouchableOpacity style={[styles.commonStyle, {
                top: convertHeight(140), left: convertWidth(115), width: convertWidth(50),
                height: convertHeight(70), transform: [{ rotate: '-40deg' }]
            }]} onPress={() => handleDistrictPress('Kozhikode')} />

            <TouchableOpacity style={[styles.commonStyle, {
                top: convertHeight(115), left: convertWidth(150), width: convertWidth(50),
                height: convertHeight(60), transform: [{ rotate: '-40deg' }]
            }]} onPress={() => handleDistrictPress('Wayanad')} />

            <TouchableOpacity style={[styles.commonStyle, {
                top: convertHeight(200), left: convertWidth(130), width: convertWidth(100),
                height: convertHeight(50), transform: [{ rotate: '-40deg' }]
            }]} onPress={() => handleDistrictPress('Malappuram')} />

            <TouchableOpacity style={[styles.commonStyle, {
                top: convertHeight(225), left: convertWidth(190), width: convertWidth(100),
                height: convertHeight(70), transform: [{ rotate: '40deg' }]
            }]} onPress={() => handleDistrictPress('Palakkad')} />

            <TouchableOpacity style={[styles.commonStyle, {
                top: convertHeight(270), left: convertWidth(160), width: convertWidth(60),
                height: convertHeight(70), transform: [{ rotate: '-40deg' }]
            }]} onPress={() => handleDistrictPress('Thrissur')} />

            {/* SEVEN DISTRICT ENDS */}

            <TouchableOpacity style={[styles.commonStyle, {
                top: convertHeight(330), left: convertWidth(190), width: convertWidth(80),
                height: convertHeight(50), transform: [{ rotate: '-30deg' }]
            }]} onPress={() => handleDistrictPress('Ernakulam')} />

            <TouchableOpacity style={[styles.commonStyle, {
                top: convertHeight(350), left: convertWidth(270), width: convertWidth(60),
                height: convertHeight(100), transform: [{ rotate: '-30deg' }]
            }]} onPress={() => handleDistrictPress('Idukki')} />

            <TouchableOpacity style={[styles.commonStyle, {
                top: convertHeight(390), left: convertWidth(215), width: convertWidth(60),
                height: convertHeight(50)
            }]} onPress={() => handleDistrictPress('Kottayam')} />

            <TouchableOpacity style={[styles.commonStyle, {
                top: convertHeight(390), left: convertWidth(200), width: convertWidth(30),
                height: convertHeight(90), transform: [{ rotate: '-20deg' }]
            }]} onPress={() => handleDistrictPress('Alappuzha')} />

            <TouchableOpacity style={[styles.commonStyle, {
                top: convertHeight(440), left: convertWidth(245), width: convertWidth(80),
                height: convertHeight(40)
            }]} onPress={() => handleDistrictPress('Pathanamthitta')} />

            <TouchableOpacity style={[styles.commonStyle, {
                top: convertHeight(480), left: convertWidth(225), width: convertWidth(90),
                height: convertHeight(40)
            }]} onPress={() => handleDistrictPress('Kollam')} />

            <TouchableOpacity style={[styles.commonStyle, {
                top: convertHeight(515), left: convertWidth(245), width: convertWidth(80),
                height: convertHeight(70)
            }]} onPress={() => handleDistrictPress('Thiruvananthapuram')} />

            {/* OTHER ITEMS IN SCREEN */}
            <View style={{ position: 'absolute', top: 15, left: 100, width: 300, height: 75 }}>
                <Text style={{ color: '#6e6c6a', fontSize: 32, fontWeight: 'bold', textAlign: 'center' }}>
                    {t('Touristplace:kerala')}
                </Text>
                <AnimatedText label={'Touristplace:district_info'} />
            </View>
        </View>
    );
}