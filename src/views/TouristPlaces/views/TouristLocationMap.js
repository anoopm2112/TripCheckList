import { View, StyleSheet } from 'react-native';
import React from 'react';
import Colors from '../../../common/Colors';
import LocationMapView from '../../../components/LocationMapView';

export default function TouristLocationMap(props) {
    const { myLocation, onGetLocation, values, currentPlaceLoc } = props.route.params;

    const styles = StyleSheet.create({
        mainContainer: {
            flex: 1,
            backgroundColor: Colors.primary
        }
    });

    return (
        <View style={styles.mainContainer}>
            <LocationMapView values={values} currentPlaceLoc={currentPlaceLoc}
                onGetLocation={onGetLocation} myLocation={myLocation} />
        </View>
    );
}