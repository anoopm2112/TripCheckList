import React from 'react';
import { View, StyleSheet, Modal, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
// Custom Imports
import { convertHeight } from '../../../common/utils/dimentionUtils';
import { darkModeColor } from '../../../common/utils/arrayObjectUtils';
import LocationMapView from '../../../components/LocationMapView';

const TouristLocationMapModal = ({ visible, onClose, onConfirm, myLocation, onGetLocation, values, currentPlaceLoc }) => {
    const isDarkMode = useSelector(state => state?.settings?.isDarkMode);
    const { backgroundFlipColor, textColor } = darkModeColor(isDarkMode);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            alignItems: 'center',
            justifyContent: 'center',
        },
        popupBox: {
            width: '95%',
            height: '95%',
            backgroundColor: backgroundFlipColor,
            borderRadius: convertHeight(5),
            padding: convertHeight(5),
            alignItems: 'center',
            justifyContent: 'center',
        }
    });

    return (
        <Modal animationType="fade" transparent={true} visible={visible}>
            <View style={styles.container}>
                <View style={styles.popupBox}>
                    <LocationMapView values={values} currentPlaceLoc={currentPlaceLoc}
                        onGetLocation={onGetLocation} myLocation={myLocation} locModal={true} 
                        onClose={onClose} onConfirm={onConfirm} />
                </View>
            </View>
        </Modal>
    );
};

export default TouristLocationMapModal;
