import React, { useState, useRef, useEffect, useContext } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, Platform, PermissionsAndroid, Linking, StatusBar, ScrollView,
    Modal
} from 'react-native';
import { useTranslation } from "react-i18next";
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { RESULTS } from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
import { useSelector, useDispatch } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
// Custom Imports
import { convertHeight, convertWidth } from '../../../common/utils/dimentionUtils';
import Colors from '../../../common/Colors';
import { ROUTE_KEYS } from '../../../navigation/constants';
import { locationPermissionCheck, locationPermissionRequest } from '../../../common/utils/permissionUtils';
import LocationAlertModal from '../../../components/LocationAlertModal';
import { darkModeColor } from '../../../common/utils/arrayObjectUtils';
import { deletePlaceById, fetchPlaces } from '../api/TouristPlacesApi';
import { selectAllTouristPlace } from '../placeSlice';
import { AppLoader, CustomPopup, EmptyList, NetworkErrorView } from '../../../components';
import AssetIconsPack from '../../../assets/IconProvide';
import { Context as AuthContext } from '../../../context/AuthContext';

export default function AllPlaceList(props) {
    const { navigation } = props;
    const { districtName } = props.route.params;

    const isFocused = useIsFocused();
    const dispatch = useDispatch();
    const { state } = useContext(AuthContext);
    const [currentIndex, setCurrentIndex] = useState(null);
    const [userLocation, setUserLocation] = useState(undefined);
    const [accessLocation, setAccessLocation] = useState(true);
    const [permissionStatus, setPermissionStatus] = useState('');
    const [locationAlertVisible, setLocationAlertVisible] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);

    const { touristPlaces, status, error } = useSelector(selectAllTouristPlace);
    const isDarkMode = useSelector(state => state?.settings?.isDarkMode);
    const { backgroundColor, textColor } = darkModeColor(isDarkMode);
    const ref = useRef();
    const { i18n, t } = useTranslation();

    useEffect(() => {
        if (isFocused) {
            dispatch(fetchPlaces(districtName));
        }
    }, [isFocused]);

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

    const deleteHandler = async (placeId) => {
        await dispatch(deletePlaceById({ id: placeId }));
        dispatch(fetchPlaces(districtName));
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
            fontSize: convertHeight(14),
            textAlign: 'center',
            fontWeight: 'bold',
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
        },
        loading: {
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            backgroundColor: '#FFFFFF'
        }
    });

    if (status === 'loading') {
        return (
            <Modal animationType='none' transparent={true} visible={true}>
                <View style={styles.loading}><AppLoader /></View>
            </Modal>
        );
    }

    if (status === 'failed') {
        return (
            <NetworkErrorView onAction={() => dispatch(fetchPlaces(districtName))} />
        );
    }

    return (
        <ScrollView>
            <StatusBar backgroundColor={backgroundColor} barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            {touristPlaces?.length === 0 ?
                <View style={[styles.container, { alignItems: 'center', paddingTop: convertHeight(25) }]}>
                    <EmptyList lottieSrc={AssetIconsPack.icons.tourist_icon} shownText={'checklist:info'} />
                </View>
                :
                <View>
                    {touristPlaces?.map(({ name, name_ML, name_HI, name_TA, note, note_ML, note_TA, note_HI, location, createdBy, _id }, index) => {
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
                                    }]}>{t('Touristplace:created_By')}<Text style={{ fontWeight: '500', textTransform: 'uppercase', fontStyle: 'italic', fontSize: 10 }}> {(createdBy === state?.userName) ? 'You' : createdBy}</Text></Text>
                                    <View style={styles.noteList}>
                                        <Text key={note} style={[styles.body, { color: selectItemBgColor(index).color }]}>
                                            {
                                                i18n.language === 'en' ? note :
                                                    i18n.language === 'ml' ? (note_ML ? note_ML : note) :
                                                        i18n.language === 'hi' ? (note_HI ? note_HI : note) : (note_TA ? note_TA : note)
                                            }
                                        </Text>

                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: createdBy ? 'space-between' : 'flex-end', paddingTop: 7 }}>
                                            {(createdBy === state?.userName) && <View style={{ flexDirection: 'row' }}>
                                                <TouchableOpacity onPress={() => setAlertVisible(true)}
                                                    style={[styles.locationContainer, { paddingRight: convertWidth(10) }]}>
                                                    <Ionicons name="md-trash-bin-sharp" size={15} color={Colors.validation} style={{ paddingRight: 2 }} />
                                                    <Text style={[styles.locationBtn, { color: Colors.validation }]}>{t('Common:delete')}</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    onPress={() => navigation.navigate(ROUTE_KEYS.CREATE_NEW_PLACE, {
                                                        isEdit: true, districtName: districtName, itemData: {
                                                            name, name_ML, name_HI, name_TA, note, note_ML, note_TA, note_HI, location, placeId: _id
                                                        }
                                                    })}
                                                    style={styles.locationContainer}>
                                                    <AntDesign name="edit" size={15} color={Colors.lightGreen} style={{ paddingRight: 2 }} />
                                                    <Text style={[styles.locationBtn, { color: Colors.lightGreen }]}>{t('Touristplace:edit')}</Text>
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
                                <CustomPopup
                                    title={'Common:deleteItem'} message={'Common:please_confirm'}
                                    visible={alertVisible} onClose={() => setAlertVisible(false)}
                                    onConfirm={() => deleteHandler(_id)}
                                />
                            </TouchableOpacity>
                        );
                    })}
                </View>
            }

            <LocationAlertModal
                title={'Touristplace:grant_permissions'}
                message={'Touristplace:allow_blocked_permissions'}
                visible={locationAlertVisible}
                onClose={() => setLocationAlertVisible(false)}
                onConfirm={() => Linking.openSettings()} />
        </ScrollView>
    );
}