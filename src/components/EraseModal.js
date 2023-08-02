import React from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import { useSelector } from 'react-redux';
import { convertHeight } from '../common/utils/dimentionUtils';
import { ProgressWaveBar } from '../components';
import { darkModeColor } from '../common/utils/arrayObjectUtils';

const EraseModal = ({ visible, onClose }) => {
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
            width: '90%',
            height: '45%',
            backgroundColor: backgroundFlipColor,
            borderRadius: convertHeight(5),
            padding: convertHeight(15),
            alignItems: 'center',
            justifyContent: 'center',
        }
    });

    return (
        <Modal animationType="fade" transparent={true} visible={visible}>
            <View style={styles.container}>
                <View style={styles.popupBox}>
                    <ProgressWaveBar onClose={onClose}/>
                </View>
            </View>
        </Modal>
    );
};

export default EraseModal;
