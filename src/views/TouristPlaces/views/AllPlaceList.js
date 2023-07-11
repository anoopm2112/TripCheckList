import React, { useState, useRef } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, Platform, PermissionsAndroid, Linking, StatusBar, ScrollView
} from 'react-native';
import { useTranslation } from "react-i18next";
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { RESULTS } from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
import { useSelector } from 'react-redux';
// Custom Imports
import TouristPlaces from '../../../common/data/TouristPlaces.json';
import { convertHeight, convertWidth } from '../../../common/utils/dimentionUtils';
import Colors from '../../../common/Colors';
import { ROUTE_KEYS } from '../../../navigation/constants';
import { locationPermissionCheck, locationPermissionRequest } from '../../../common/utils/permissionUtils';
import LocationAlertModal from '../../../components/LocationAlertModal';
import { darkModeColor } from '../../../common/utils/arrayObjectUtils';
import UpDownIconAnimation from '../../../components/UpAndDownAnimation';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AllPlaceList(props) {
    const { navigation } = props;
    const { districtName } = props.route.params;

    const [currentIndex, setCurrentIndex] = useState(null);
    const [userLocation, setUserLocation] = useState(undefined);
    const [accessLocation, setAccessLocation] = useState(true);
    const [permissionStatus, setPermissionStatus] = useState('');
    const [locationAlertVisible, setLocationAlertVisible] = useState(false);
    const [touristPlace, setTouristPlace] = useState([]);

    const isDarkMode = useSelector(state => state?.settings?.isDarkMode);
    const { backgroundColor, textColor } = darkModeColor(isDarkMode);
    const ref = useRef();
    const { i18n, t } = useTranslation();

    useEffect(() => {
        async function fetchTouristPlace() {
            var value = await AsyncStorage.getItem('TouristPlaceData');
            setTouristPlace(JSON.parse(value));
        }

        fetchTouristPlace();
    }, []);

    function selectItemBgColor(index) {
        const items = [
            { bg: isDarkMode ? '#797979' : '#F5FFFA', color: isDarkMode ? Colors.primary : '#3F5B98' },
            { bg: backgroundColor, color: isDarkMode ? Colors.primary : '#3F5B98' }
        ];
        if (index % 2 == 0) { return items[0]; } else { return items[1]; }
    };

    const locationCheckPermission = async (location) => {
        const checkStatus = await locationPermissionCheck();
        if (checkStatus) {
            setPermissionStatus('granted');
            setAccessLocation(true);
            getCurrentLocation(location);
        } else {
            permissionRequest(location);
        }
    };

    const permissionRequest = async (location) => {
        const checkStatus = await locationPermissionCheck();
        if (checkStatus) {
            setPermissionStatus('granted');
            setAccessLocation(true);
            getCurrentLocation(location);
            return;
        }

        const requestStatus = await locationPermissionRequest();
        if (Platform.OS === 'android') {
            if (requestStatus === PermissionsAndroid.RESULTS.GRANTED) {
                setPermissionStatus('granted');
                setAccessLocation(true);
                getCurrentLocation(location);
            } else if (requestStatus === PermissionsAndroid.RESULTS.DENIED) {
                setPermissionStatus('denied');
            } else if (requestStatus === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
                setPermissionStatus('blocked');
                setLocationAlertVisible(true);
            }
        } else if (Platform.OS === 'ios') {
            if (requestStatus === RESULTS.GRANTED) {
                setPermissionStatus('granted');
                setAccessLocation(true);
                getCurrentLocation();
            } else if (requestStatus === RESULTS.DENIED) {
                setPermissionStatus('denied');
            } else if (requestStatus === RESULTS.BLOCKED) {
                setPermissionStatus('blocked');
                setLocationAlertVisible(true);
            }
        }
    };

    const getCurrentLocation = (location) => {
        Geolocation.getCurrentPosition((coords) => {
            navigation.navigate(ROUTE_KEYS.TOURIST_LOCATION, {
                myLocation: coords, values: '', onGetLocation: '',
                currentPlaceLoc: location
            });
        }, (error) => {
            setAccessLocation(false);
        }, { enableHighAccuracy: true, maximumAge: 0 });
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: backgroundColor,
            justifyContent: 'center',
        },
        cardContainer: {
            padding: convertHeight(10)
        },
        card: {
            flexGrow: 1,
            justifyContent: 'center',
            padding: convertWidth(15),
            borderRadius: 3,
            elevation: 1
        },
        heading: {
            fontSize: 15,
            fontWeight: '900',
            textTransform: 'uppercase',
            textAlign: 'left',
            letterSpacing: -1,
        },
        body: {
            fontSize: 14,
            lineHeight: 20 * 1.1,
            textAlign: 'left',
        },
        noteList: {
            marginTop: 7,
        },
        districtHeader: {
            color: textColor,
            fontSize: 22,
            textAlign: 'center',
            fontWeight: 'bold',
            textDecorationLine: 'underline',
            textTransform: 'uppercase'
        },
        locationBtn: {
            fontSize: 15,
            fontWeight: '900',
            textTransform: 'uppercase',
            letterSpacing: -1,
            color: '#0aabf0'
        },
        locationContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingTop: 5
        },
        headerContainer: {
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: convertHeight(10)
        }
    });

    return (
        <ScrollView>
            <StatusBar backgroundColor={backgroundColor} barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            <View style={styles.headerContainer}>
                <Text style={styles.districtHeader}>{t(`Districts:${districtName}`)}</Text>
            </View>

            {touristPlace[districtName]?.map(({ name, name_ML, name_HI, name_TA, note, note_ML, note_TA, note_HI, location, createdBy }, index) => {
                return (
                    <TouchableOpacity key={name} style={styles.cardContainer} activeOpacity={0.9}>
                        <View style={[styles.card, { backgroundColor: selectItemBgColor(index).bg }]}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={[styles.heading, { color: selectItemBgColor(index).color }]}>{index + 1}. </Text>
                                <Text style={[styles.heading, { color: selectItemBgColor(index).color, textDecorationLine: index === currentIndex ? 'underline' : null }]}>{
                                    i18n.language === 'en' ? name :
                                        i18n.language === 'ml' ? (name_ML ? name_ML : name) :
                                            i18n.language === 'hi' ? (name_HI ? name_HI : name) : (name_TA ? name_TA : name)
                                }</Text>
                            </View>
                            <Text style={[styles.locationContainer, {
                                justifyContent: 'flex-start', color: Colors.info, fontStyle: 'italic', fontSize: 10
                            }]}>{t('Touristplace:created_By')} <Text style={{ fontWeight: '500', textTransform: 'uppercase', fontStyle: 'italic', fontSize: 10 }}> : {createdBy ? createdBy : 'CHECKLIST'}</Text></Text>
                            <View style={styles.noteList}>
                                <Text key={note} style={[styles.body, { color: selectItemBgColor(index).color }]}>
                                    {
                                        i18n.language === 'en' ? note :
                                            i18n.language === 'ml' ? (note_ML ? note_ML : note) :
                                                i18n.language === 'hi' ? (note_HI ? note_HI : note) : (note_TA ? note_TA : note)
                                    }
                                </Text>

                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: createdBy ? 'space-between' : 'flex-end', paddingTop: 7 }}>
                                    {createdBy && <View style={{ flexDirection: 'row' }}>
                                        {/* <TouchableOpacity
                                            onPress={() => {}}
                                            style={[styles.locationContainer, { paddingRight: convertWidth(10) }]}>
                                            <Ionicons name="md-trash-bin-sharp" size={15} color={Colors.validation} style={{ paddingRight: 2 }} />
                                            <Text style={[styles.locationBtn, { color: Colors.validation }]}>{t('Common:delete')}</Text>
                                        </TouchableOpacity> */}
                                        <TouchableOpacity
                                            onPress={() => navigation.navigate(ROUTE_KEYS.CREATE_NEW_PLACE, { isEdit: true, districtName: districtName, itemData: {
                                                name, name_ML, name_HI, name_TA, note, note_ML, note_TA, note_HI, location
                                            } })}
                                            style={styles.locationContainer}>
                                            <AntDesign name="edit" size={15} color={Colors.green} style={{ paddingRight: 2 }} />
                                            <Text style={[styles.locationBtn, { color: Colors.green }]}>{t('Touristplace:edit')}</Text>
                                        </TouchableOpacity>
                                    </View>}

                                    {location &&
                                        <TouchableOpacity
                                            onPress={() => { locationCheckPermission(location); }}
                                            style={styles.locationContainer}>
                                            <Ionicons name="location" size={15} color={'#0aabf0'} style={{ paddingRight: 2 }} />
                                            <Text style={styles.locationBtn}>{t('Touristplace:view_location')}</Text>
                                        </TouchableOpacity>}
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                );
            })}

            <LocationAlertModal
                title={'Touristplace:grant_permissions'}
                message={'Touristplace:allow_blocked_permissions'}
                visible={locationAlertVisible}
                onClose={() => setLocationAlertVisible(false)}
                onConfirm={() => Linking.openSettings()} />
        </ScrollView>
    );
}