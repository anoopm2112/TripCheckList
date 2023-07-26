import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Linking } from 'react-native';
import { Input } from '@ui-kitten/components';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';
import Lottie from 'lottie-react-native';
import { RESULTS } from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
// Custom Imports
import Colors from '../../../common/Colors';
import { convertHeight, convertWidth } from '../../../common/utils/dimentionUtils';
import { darkModeColor } from '../../../common/utils/arrayObjectUtils';
import AssetIconsPack from '../../../assets/IconProvide';
import { ROUTE_KEYS } from '../../../navigation/constants';
import TouristLocationMapModal from './TouristLocationMapModal';
import { locationPermissionCheck, locationPermissionRequest } from '../../../common/utils/permissionUtils';
import LocationAlertModal from '../../../components/LocationAlertModal';
import { createPlaces, updatePlaces } from '../api/TouristPlacesApi';
import { Context as AuthContext } from '../../../context/AuthContext';

export default function CreateNewPlaces(props) {
    const { navigation } = props;
    const { districtName, isEdit, itemData } = props.route.params;
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { state } = useContext(AuthContext);
    const isDarkMode = useSelector(state => state?.settings?.isDarkMode);
    const { backgroundColor, textBrownColor } = darkModeColor(isDarkMode);

    const [touristLocationMapModalVisible, setTouristLocationMapModalVisible] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(null);
    const [userLocation, setUserLocation] = useState(undefined);
    const [accessLocation, setAccessLocation] = useState(true);
    const [permissionStatus, setPermissionStatus] = useState('');
    const [locationAlertVisible, setLocationAlertVisible] = useState(false);
    const [currentCoords, setCurrentCoords] = useState('');
    const [coordinateValue, setCoordinateValue] = useState('');

    const validationSchema = yup.object().shape({
        place_name: yup.string().required('Touristplace:enter_place_name'),
        place_note: yup.string().required('Touristplace:enter_place_note'),
    });

    const handleSubmit = async (values, { resetForm }) => {
        // Define the new name and note
        let place_array = {
            name: values.place_name,
            note: values.place_note,
            location: coordinateValue ? coordinateValue : itemData.location,
            name_TA: "",
            name_ML: "",
            name_HI: "",
            note_TA: "",
            note_ML: "",
            note_HI: ""
        };

        if (isEdit) {
            place_array.id = itemData.placeId;
            dispatch(updatePlaces(place_array));
        } else {
            place_array.createdBy = state?.userName;
            place_array.district = districtName;
            dispatch(createPlaces(place_array));
        }
        navigation.navigate(ROUTE_KEYS.TOURIST_DISTRICT, { districtName: districtName });
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            paddingHorizontal: convertHeight(20)
        },
        input: {
            width: '100%',
            textAlign: 'left',
            backgroundColor: isDarkMode ? '#333333' : '#f5f5f5'
        },
        label: {
            paddingTop: convertHeight(15),
            paddingBottom: convertHeight(8),
            color: textBrownColor,
            fontWeight: '500',
        },
        errortxt: {
            color: Colors.validation,
            fontStyle: 'italic',
            textAlign: 'center',
            paddingTop: convertHeight(5)
        },
        btnContainer: {
            padding: convertHeight(8),
            borderRadius: 5,
            justifyContent: 'space-between',
            alignItems: 'center',
            elevation: 2,
            marginTop: 20,
            flexDirection: 'row',
            alignSelf: 'flex-end',
        },
        textBtn: {
            color: Colors.primary,
            fontWeight: '500',
            paddingVertical: convertHeight(3)
        },
        LocBtnContainer: {
            paddingVertical: convertHeight(6),
            paddingHorizontal: convertHeight(15),
            borderRadius: 5,
            justifyContent: 'space-between',
            alignItems: 'center',
            elevation: 2,
            flexDirection: 'row'
        },
    });

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
            setCurrentCoords(coords);
            setTouristLocationMapModalVisible(true);
        }, (error) => {
            setAccessLocation(false);
        }, { enableHighAccuracy: true, maximumAge: 0 });
    };

    const locationData = {
        "long": "76.586948", "lat": "8.881333"
    };

    return (
        <Formik
            initialValues={{
                place_name: isEdit ? itemData.name : '', 
                // place_name_HI: isEdit ? itemData.name_HI : '', place_name_ML: isEdit ? itemData.name_ML : '', place_name_TA: isEdit ? itemData.name_TA : '',
                place_note: isEdit ? itemData.note : '', 
                // place_note_HI: isEdit ? itemData.note_HI : '', place_note_ML: isEdit ? itemData.note_ML : '', place_note_TA: isEdit ? itemData.note_TA : ''
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}>
            {({ handleChange, handleSubmit, values, errors, touched }) => (
                <KeyboardAwareScrollView style={{ backgroundColor: backgroundColor }}>
                    <View style={styles.container}>
                        <View style={{ alignItems: 'center' }}>
                            <Lottie source={AssetIconsPack.icons.location_pin_lottie} autoPlay loop={false}
                                style={{ height: convertHeight(170), width: convertWidth(170) }} />
                        </View>

                        {/* <TouchableOpacity onPress={() => setShowAllLangInput(!showAllLangInput)}
                            style={{ paddingTop: 10, flexDirection: 'row', alignItems: 'center' }}>
                            <AntDesign name={showAllLangInput ? "upcircle" : "downcircle"} size={24} color={Colors.tertiary} style={{ paddingRight: 7 }} />
                            <Text style={{ color: Colors.tertiary, fontStyle: 'italic' }}>
                                Click here to translate to other languages. Such as Malayalam, Tamil, Hindi (Not Mandatory)
                            </Text>
                        </TouchableOpacity> */}

                        <Text style={styles.label}>{t('Touristplace:location')}</Text>
                        <TouchableOpacity onPress={() => locationCheckPermission()} activeOpacity={0.5}
                            style={[styles.LocBtnContainer, { backgroundColor: Colors.tertiary }]}>
                            <Text style={[styles.textBtn, { textTransform: 'uppercase' }]}>{t('Touristplace:place_google_location')}</Text>
                            <MaterialIcons name="my-location" size={22} style={{ paddingLeft: convertWidth(5) }} color={Colors.primary} />
                        </TouchableOpacity>

                        <Text style={styles.label}>{t('Touristplace:place_name')}</Text>
                        <Input
                            placeholder={t('Touristplace:enter_place_name')}
                            value={values.place_name}
                            onChangeText={handleChange('place_name')}
                            status={errors.place_name ? 'danger' : ''}
                            textStyle={{ color: textBrownColor }}
                            multiline
                            disabled={isEdit}
                            style={[styles.input, { backgroundColor: isEdit ? Colors.info : '#f5f5f5' }]}
                            accessoryRight={
                                <TouchableOpacity>
                                    <MaterialIcons name="place" size={convertHeight(20)} color={textBrownColor} />
                                </TouchableOpacity>
                            }
                        />
                        {touched.place_name && errors.place_name && <Animatable.Text animation={'fadeInLeft'} style={styles.errortxt}>{t(errors.place_name)}</Animatable.Text>}

                        {/* {showAllLangInput &&
                            <View>
                                <Text style={styles.label}>{t('Touristplace:place_name')} {'(HINDI)'}</Text>
                                <Input
                                    placeholder={t('Touristplace:enter_place_name')}
                                    value={values.place_name_HI}
                                    onChangeText={handleChange('place_name_HI')}
                                    textStyle={{ color: textBrownColor }}
                                    multiline
                                    style={styles.input}
                                    accessoryRight={
                                        <TouchableOpacity>
                                            <MaterialIcons name="place" size={convertHeight(20)} color={textBrownColor} />
                                        </TouchableOpacity>
                                    }
                                />

                                <Text style={styles.label}>{t('Touristplace:place_name')} {'(MALAYALAM)'}</Text>
                                <Input
                                    placeholder={t('Touristplace:enter_place_name')}
                                    value={values.place_name_ML}
                                    onChangeText={handleChange('place_name_ML')}
                                    textStyle={{ color: textBrownColor }}
                                    multiline
                                    style={styles.input}
                                    accessoryRight={
                                        <TouchableOpacity>
                                            <MaterialIcons name="place" size={convertHeight(20)} color={textBrownColor} />
                                        </TouchableOpacity>
                                    }
                                />

                                <Text style={styles.label}>{t('Touristplace:place_name')} {'(TAMIL)'}</Text>
                                <Input
                                    placeholder={t('Touristplace:enter_place_name')}
                                    value={values.place_name_TA}
                                    onChangeText={handleChange('place_name_TA')}
                                    textStyle={{ color: textBrownColor }}
                                    multiline
                                    style={styles.input}
                                    accessoryRight={
                                        <TouchableOpacity>
                                            <MaterialIcons name="place" size={convertHeight(20)} color={textBrownColor} />
                                        </TouchableOpacity>
                                    }
                                />
                            </View>} */}

                        <Text style={styles.label}>{t('Touristplace:place_note')}</Text>
                        <Input
                            placeholder={t('Touristplace:enter_place_note')}
                            value={values.place_note}
                            onChangeText={handleChange('place_note')}
                            status={errors.place_note ? 'danger' : ''}
                            textStyle={{ color: textBrownColor }}
                            multiline
                            maxLength={500}
                            style={[styles.input, { maxHeight: 200 }]}
                            numberOfLines={5}
                            accessoryRight={
                                <TouchableOpacity>
                                    <MaterialIcons name="notes" size={convertHeight(20)} color={textBrownColor} />
                                </TouchableOpacity>
                            }
                        />
                        {touched.place_note && errors.place_note && <Animatable.Text animation={'fadeInLeft'} style={styles.errortxt}>{t(errors.place_note)}</Animatable.Text>}

                        {/* {showAllLangInput &&
                            <View>
                                <Text style={styles.label}>{t('Touristplace:place_note')} {'(HINDI)'}</Text>
                                <Input
                                    placeholder={t('Touristplace:enter_place_note')}
                                    value={values.place_note_HI}
                                    onChangeText={handleChange('place_note_HI')}
                                    textStyle={{ color: textBrownColor }}
                                    multiline
                                    maxLength={500}
                                    style={[styles.input, { maxHeight: 200 }]}
                                    numberOfLines={5}
                                    accessoryRight={
                                        <TouchableOpacity>
                                            <MaterialIcons name="notes" size={convertHeight(20)} color={textBrownColor} />
                                        </TouchableOpacity>
                                    }
                                />

                                <Text style={styles.label}>{t('Touristplace:place_note')}  {'(MALAYALAM)'}</Text>
                                <Input
                                    placeholder={t('Touristplace:enter_place_note')}
                                    value={values.place_note_ML}
                                    onChangeText={handleChange('place_note_ML')}
                                    textStyle={{ color: textBrownColor }}
                                    multiline
                                    maxLength={500}
                                    style={[styles.input, { maxHeight: 200 }]}
                                    numberOfLines={5}
                                    accessoryRight={
                                        <TouchableOpacity>
                                            <MaterialIcons name="notes" size={convertHeight(20)} color={textBrownColor} />
                                        </TouchableOpacity>
                                    }
                                />

                                <Text style={styles.label}>{t('Touristplace:place_note')}  {'(TAMIL)'}</Text>
                                <Input
                                    placeholder={t('Touristplace:enter_place_note')}
                                    value={values.place_note_TA}
                                    onChangeText={handleChange('place_note_TA')}
                                    textStyle={{ color: textBrownColor }}
                                    multiline
                                    maxLength={500}
                                    style={[styles.input, { maxHeight: 200 }]}
                                    numberOfLines={5}
                                    accessoryRight={
                                        <TouchableOpacity>
                                            <MaterialIcons name="notes" size={convertHeight(20)} color={textBrownColor} />
                                        </TouchableOpacity>
                                    }
                                />
                            </View>} */}

                        <TouchableOpacity onPress={handleSubmit} activeOpacity={0.5}
                            style={[styles.btnContainer, { backgroundColor: Colors.secondary }]}>
                            <Text style={[styles.textBtn, { textTransform: 'uppercase' }]}>{isEdit ? t('Touristplace:update_place') : t('Touristplace:add_place')}</Text>
                            <MaterialIcons name="place" size={24} style={{ paddingLeft: convertWidth(5) }} color={Colors.primary} />
                        </TouchableOpacity>
                    </View>

                    <TouristLocationMapModal
                        visible={touristLocationMapModalVisible}
                        onClose={() => { setTouristLocationMapModalVisible(false); }}
                        myLocation={currentCoords}
                        values={''} onGetLocation={''}
                        currentPlaceLoc={locationData}
                        onConfirm={(value) => setCoordinateValue(value)} />

                    <LocationAlertModal
                        title={'Touristplace:grant_permissions'}
                        message={'Touristplace:allow_blocked_permissions'}
                        visible={locationAlertVisible}
                        onClose={() => setLocationAlertVisible(false)}
                        onConfirm={() => Linking.openSettings()} />
                </KeyboardAwareScrollView>
            )}
        </Formik>
    );
}

{/* <Text style={styles.label}>{'Email'}</Text>
<Input
    placeholder={'Enter Your Email'}
    value={values.email}
    onChangeText={handleChange('email')}
    status={errors.email ? 'danger' : ''}
    textStyle={{ color: textBrownColor }}
    style={styles.input}
    accessoryRight={
        <TouchableOpacity>
            <MaterialIcons name="email" size={convertHeight(20)} color={textBrownColor} />
        </TouchableOpacity>
    }
/>
{touched.email && errors.email && <Animatable.Text animation={'fadeInLeft'} style={styles.errortxt}>{errors.email}</Animatable.Text>} */}
