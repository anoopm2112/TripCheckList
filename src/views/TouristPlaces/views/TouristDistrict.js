import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, PermissionsAndroid, Linking } from 'react-native';
import { useTranslation } from "react-i18next";
import { Transition, Transitioning } from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RESULTS } from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
// Custom Imports
import TouristPlaces from '../../../common/data/TouristPlaces.json';
import { convertHeight, convertWidth } from '../../../common/utils/dimentionUtils';
import Colors from '../../../common/Colors';
import { ROUTE_KEYS } from '../../../navigation/constants';
import { locationPermissionCheck, locationPermissionRequest } from '../../../common/utils/permissionUtils';
import LocationAlertModal from '../../../components/LocationAlertModal';

const transition = (
    <Transition.Together>
        <Transition.In type='fade' durationMs={200} />
        <Transition.Change />
        <Transition.Out type='fade' durationMs={200} />
    </Transition.Together>
);

export default function TouristDistrict(props) {
    const { navigation } = props;
    const { districtName } = props.route.params;

    const [currentIndex, setCurrentIndex] = useState(null);
    const [userLocation, setUserLocation] = useState(undefined);
    const [accessLocation, setAccessLocation] = useState(true);
    const [permissionStatus, setPermissionStatus] = useState('');
    const [locationAlertVisible, setLocationAlertVisible] = useState(false);

    const ref = useRef();
    const { i18n, t } = useTranslation();

    function selectItemBgColor(index) {
        const items = [
            { bg: Colors.tertiary, color: Colors.primary },
            { bg: Colors.primary, color: '#3F5B98' }
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
            backgroundColor: '#fff',
            justifyContent: 'center',
        },
        cardContainer: {
            flexGrow: 1,
        },
        card: {
            flexGrow: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },
        heading: {
            fontSize: 18,
            fontWeight: '900',
            textTransform: 'uppercase',
            textAlign: 'center',
            letterSpacing: -1,
        },
        body: {
            fontSize: 16,
            lineHeight: 20 * 1.4,
            textAlign: 'center',
            padding: 5
        },
        noteList: {
            marginTop: 10,
        },
        districtHeader: {
            color: Colors.black,
            fontSize: 22,
            textAlign: 'center',
            fontWeight: 'bold',
            paddingBottom: convertHeight(15),
            textDecorationLine: 'underline',
            textTransform: 'uppercase'
        },
        locationBtn: {
            fontSize: 15,
            fontWeight: '900',
            textTransform: 'uppercase',
            letterSpacing: -1,
            color: Colors.green
        },
        locationContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
        }
    });

    return (
        <Transitioning.View
            ref={ref}
            transition={transition}
            style={styles.container}>
            <Text style={styles.districtHeader}>{t(`Districts:${districtName}`)}</Text>

            {TouristPlaces[districtName].map(({ name, name_ML, name_HI, name_TA, note, note_ML, note_TA, note_HI, location }, index) => {
                return (
                    <TouchableOpacity
                        key={name}
                        onPress={() => {
                            ref.current.animateNextTransition();
                            setCurrentIndex(index === currentIndex ? null : index);
                        }}
                        style={styles.cardContainer}
                        activeOpacity={0.9}
                    >
                        <View style={[styles.card, { backgroundColor: selectItemBgColor(index).bg }]}>
                            <Text style={[styles.heading, { color: selectItemBgColor(index).color, textDecorationLine: index === currentIndex ? 'underline' : null }]}>{
                                i18n.language === 'en' ? name :
                                    i18n.language === 'ml' ? name_ML :
                                        i18n.language === 'hi' ? name_HI : name_TA
                            }</Text>
                            {index === currentIndex && (
                                <View style={styles.noteList}>
                                    <Text key={note} style={[styles.body, { color: selectItemBgColor(index).color }]}>
                                        {
                                            i18n.language === 'en' ? note :
                                                i18n.language === 'ml' ? note_ML :
                                                    i18n.language === 'hi' ? note_HI : note_TA
                                        }
                                    </Text>
                                    {location &&
                                        <TouchableOpacity
                                            onPress={() => { locationCheckPermission(location); }}
                                            style={styles.locationContainer}>
                                            <Ionicons name="location" size={15} color={Colors.green} style={{ paddingRight: 2 }} />
                                            <Text style={styles.locationBtn}>{t('Touristplace:view_location')}</Text>
                                        </TouchableOpacity>}
                                </View>
                            )}
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
        </Transitioning.View>
    );
}