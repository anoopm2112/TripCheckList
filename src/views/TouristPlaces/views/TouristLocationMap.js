import { View, StyleSheet } from 'react-native';
import React from 'react';
import { useSelector } from 'react-redux';
import Colors from '../../../common/Colors';
import LocationMapView from '../../../components/LocationMapView';
import { darkModeColor } from '../../../common/utils/arrayObjectUtils';

export default function TouristLocationMap(props) {
    const { myLocation, onGetLocation, values, currentPlaceLoc } = props.route.params;

    const isDarkMode = useSelector(state => state?.settings?.isDarkMode);
    const { backgroundColor } = darkModeColor(isDarkMode);

    const styles = StyleSheet.create({
        mainContainer: {
            flex: 1,
            backgroundColor: backgroundColor
        }
    });

    return (
        <View style={styles.mainContainer}>
            <LocationMapView values={values} currentPlaceLoc={currentPlaceLoc}
                onGetLocation={onGetLocation} myLocation={myLocation} />
        </View>
    );
}