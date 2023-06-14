import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { convertHeight } from '../common/utils/dimentionUtils';
import { useDispatch } from 'react-redux';
import { useTranslation } from "react-i18next";
import Colors from '../common/Colors';

const LocationAlertModal = ({ title, message, visible, onClose, onConfirm }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    return (
        <Modal animationType="fade" transparent={true} visible={visible}>
            <View style={styles.container}>
                <View style={styles.popupBox}>
                    <Text style={styles.title}>{t(title)}</Text>
                    <Text style={styles.message}>{t(message)}</Text>
                    <TouchableOpacity style={[styles.closeButton, { backgroundColor: Colors.info }]}
                        onPress={() => {
                            dispatch(onConfirm);
                            onClose();
                        }}>
                        <Text style={styles.closeText}>{t('Touristplace:open_settings')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    popupBox: {
        width: '80%',
        backgroundColor: Colors.primary,
        borderRadius: convertHeight(5),
        padding: convertHeight(15),
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: convertHeight(16),
        fontWeight: 'bold',
        color: Colors.black,
        textAlign: 'center'
    },
    message: {
        fontSize: convertHeight(12),
        textAlign: 'center',
        color: Colors.black,
        padding: convertHeight(5)
    },
    closeButton: {
        width: '47%',
        padding: convertHeight(8),
        marginTop: convertHeight(7),
        alignItems: 'center',
        borderRadius: 3
    },
    closeText: {
        color: Colors.black,
        fontWeight: 'bold',
    },
});

export default LocationAlertModal;
