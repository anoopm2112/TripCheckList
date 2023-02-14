import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { convertHeight } from '../common/utils/dimentionUtils';
import { useDispatch } from 'react-redux';

const CustomPopup = ({ title, message, visible, onClose, onConfirm }) => {
    const dispatch = useDispatch()
    return (
        <Modal animationType="fade" transparent={true} visible={visible}>
            <View style={styles.container}>
                <View style={styles.popupBox}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                        <TouchableOpacity style={[styles.closeButton, { backgroundColor: 'green' }]}
                            onPress={() => {
                                dispatch(onConfirm)
                                onClose()
                            }}>
                            <Text style={styles.closeText}>Yes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.closeButton, { backgroundColor: 'red' }]}
                            onPress={onClose}>
                            <Text style={styles.closeText}>No</Text>
                        </TouchableOpacity>
                    </View>
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
        backgroundColor: 'white',
        borderRadius: convertHeight(5),
        padding: convertHeight(15),
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: convertHeight(16),
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center'
    },
    message: {
        fontSize: convertHeight(12),
        textAlign: 'center',
        color: '#000',
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
        color: 'white',
        fontWeight: 'bold',
    },
});

export default CustomPopup;
