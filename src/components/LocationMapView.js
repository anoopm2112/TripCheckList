import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Linking } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import Lottie from 'lottie-react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNetInfo } from "@react-native-community/netinfo";
// Custom Imports
import { convertHeight, convertWidth } from '../common/utils/dimentionUtils';
import Colors from '../common/Colors';
import { calculateTravelTime, getDistance } from '../common/utils/arrayObjectUtils';
import AssetIconsPack from '../assets/IconProvide';
import AnimatedText from './AnimatedText';
import { t } from 'i18next';

const LocationMapView = (props) => {
    // const [latitude, setLatitude] = useState(props.myLocation.coords.latitude);
    // const [longitude, setLongitude] = useState(props.myLocation.coords.longitude);
    const [latitude, setLatitude] = useState(Number(props?.currentPlaceLoc?.lat));
    const [longitude, setLongitude] = useState(Number(props?.currentPlaceLoc?.long));
    const [marginBottom, setMarginBottom] = useState(1);
    const [mapTypeView, setMapType] = useState(false);
    const mapViewRef = useRef();
    const netInfo = useNetInfo();

    function getCoordinates() {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${props?.currentPlaceLoc?.lat},${props?.currentPlaceLoc?.long}&travelmode=driving`;
        // const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;
        Linking.openURL(url);
    }

    const gotToMyLocation = () => {
        Geolocation.getCurrentPosition((coords) => {
            setLatitude(coords.coords.latitude);
            setLongitude(coords.coords.longitude);
            mapViewRef.current.animateCamera({
                center: {
                    latitude: coords.coords.latitude, longitude: coords.coords.longitude
                }
            });
        }, (error) => { }, {
            enableHighAccuracy: true, maximumAge: 0
        });
    };

    const styles = StyleSheet.create({
        map: {
            width: '100%',
            height: convertHeight(500)
        },
        buttonContainer: {
            alignItems: 'center',
            justifyContent: 'center',
            height: convertHeight(42)
        },
        textStyle: {
            color: Colors.primary,
            fontWeight: '800'
        },
        myLocationIcon: {
            width: convertWidth(45),
            height: convertHeight(40),
            backgroundColor: Colors.primary,
            position: "absolute",
            justifyContent: 'center',
            alignItems: 'center',
            top: convertHeight(8),
            right: convertWidth(10),
            borderRadius: 5,
            elevation: 5
        },
        layerIcon: {
            width: convertWidth(45),
            height: convertHeight(40),
            backgroundColor: Colors.primary,
            position: "absolute",
            justifyContent: 'center',
            alignItems: 'center',
            top: convertHeight(8),
            right: convertWidth(60),
            borderRadius: 5,
            elevation: 5
        },
        bottomCardViewContainer: {
            marginVertical: 10,
            marginHorizontal: 20,
            backgroundColor: Colors.primary,
            height: convertHeight(40),
            borderRadius: 5,
            elevation: 2
        },
        cardViewItemContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
        }
    });

    const distanceKm = getDistance(props.myLocation.coords.latitude, props.myLocation.coords.longitude, props?.currentPlaceLoc?.lat, props?.currentPlaceLoc?.long);
    const hourTime = calculateTravelTime(distanceKm);

    return (
        <View style={{ flex: 1 }}>
            {netInfo && netInfo.isInternetReachable ?
                <View>
                    <View>
                        <MapView
                            mapType={mapTypeView ? 'satellite' : 'standard'}
                            provider={PROVIDER_GOOGLE}
                            ref={ref => mapViewRef.current = ref}
                            style={[styles.map, { paddingBottom: marginBottom }]}
                            initialCamera={{
                                center: {
                                    latitude, longitude
                                }, heading: 0, pitch: 0, zoom: 16, altitude: 0
                            }}
                            showsUserLocation={true}
                            showsMyLocationButton={true}
                            onPress={(e) => {
                                setLatitude(e.nativeEvent.coordinate.latitude);
                                setLongitude(e.nativeEvent.coordinate.longitude);
                            }}
                            onMapReady={() => {
                                setMarginBottom(0);
                            }}>
                            <Marker
                                coordinate={{ latitude: latitude, longitude: longitude }}
                                title={''} description={''} />
                        </MapView>

                        <TouchableOpacity activeOpacity={0.5} onPress={() => gotToMyLocation()}
                            style={styles.myLocationIcon}>
                            <MaterialIcons name="my-location" size={convertHeight(24)} color={Colors.black} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => { setMapType(!mapTypeView); }} style={styles.layerIcon}>
                            <MaterialIcons name="layers" size={convertHeight(24)} color={Colors.black} />
                        </TouchableOpacity>
                    </View>

                    <View style={{ paddingTop: convertHeight(10) }}>
                        <AnimatedText label={'Touristplace:viewgmaploc'} />
                    </View>

                    <TouchableOpacity activeOpacity={0.8} onPress={() => getCoordinates()} style={styles.bottomCardViewContainer}>
                        <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-around' }}>

                            <View style={styles.cardViewItemContainer}>
                                <MaterialIcons name="location-pin" size={18} color={Colors.green} />
                                <Text style={{ color: Colors.black, fontWeight: '500' }}>{distanceKm} {t('Touristplace:km')}</Text>
                            </View>
                            <FontAwesome5 name="directions" size={24} color={Colors.tertiary} />
                            <View style={styles.cardViewItemContainer}>
                                <Ionicons name="time-sharp" size={18} color={Colors.secondary} />
                                <Text style={{ color: Colors.black, fontWeight: '500', paddingLeft: 2 }}>
                                    {
                                        hourTime.hours !== 0 ?
                                            `${hourTime.hours}:${hourTime.minutes} ${t('Touristplace:min')}`
                                            :
                                            `${hourTime.minutes} ${t('Touristplace:min')}`
                                    }
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
                :
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.primary }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Lottie source={AssetIconsPack.icons.no_internet_location_icon} autoPlay loop style={{ height: convertHeight(120) }} />
                        <TouchableOpacity activeOpacity={0.8}
                            // onPress={() => getCoordinates()}
                            style={[styles.bottomCardViewContainer, { width: convertWidth(300) }]}>
                            <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-around' }}>
                                <View style={styles.cardViewItemContainer}>
                                    <MaterialIcons name="location-pin" size={18} color={Colors.green} />
                                    <Text style={{ color: Colors.black, fontWeight: '500' }}>{distanceKm} {t('Touristplace:km')}</Text>
                                </View>
                                <FontAwesome5 name="directions" size={24} color={Colors.tertiary} />
                                <View style={styles.cardViewItemContainer}>
                                    <MaterialIcons name="access-time" size={18} color={Colors.secondary} />
                                    <Text style={{ color: Colors.black, fontWeight: '500', paddingLeft: 2 }}>
                                        {
                                            hourTime.hours !== 0 ?
                                                `${hourTime.hours}:${hourTime.minutes} ${t('Touristplace:min')}`
                                                :
                                                `${hourTime.minutes} ${t('Touristplace:min')}`
                                        }
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <AnimatedText label={'Touristplace:youAreOffline'} />
                    </View>
                </View>}
        </View>
    );
};
export default LocationMapView;






