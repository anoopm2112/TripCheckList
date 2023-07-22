import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import NetInfo from '@react-native-community/netinfo';
// Custom Imports
import { convertHeight } from '../../../common/utils/dimentionUtils';
import { darkModeColor } from '../../../common/utils/arrayObjectUtils';
import Colors from '../../../common/Colors';
import { queryAllCheckList } from '../../../database/allSchemas';
import { addNewChecklists, deleteAllChecklist } from '../api/ChecklistApi';

const SyncPopUp = ({ visible, onClose, onConfirm }) => {
    const isDarkMode = useSelector(state => state?.settings?.isDarkMode);
    const { backgroundFlipColor, textColor } = darkModeColor(isDarkMode);
    const isFocused = useIsFocused();
    const dispatch = useDispatch();
    const netInfo = NetInfo.useNetInfo();
    const [syncItem, setSyncItem] = useState(0);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        const syncOperation = async () => {
            const response = await queryAllCheckList();
            const responseData = JSON.parse(JSON.stringify(response));
            setSyncItem(responseData?.length);
            if (responseData.length > 0) {
                for (let i = 0; i < responseData.length; i++) {
                    setSending(true);
                    const responseItem = responseData[i];
                    await dispatch(addNewChecklists(responseItem));
                    setSending(false);
                    onConfirm();
                }
            }
        }
        if (netInfo.isConnected) {
            syncOperation();
        }
    }, [isFocused]);

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
        },
        circleView: {
            justifyContent: 'center',
            alignItems: 'center'
        },
        textBasic: { 
            color: Colors.black, 
            fontSize: 15, 
            paddingTop: convertHeight(15), 
            letterSpacing: 1 
        }
    });

    return (
        <Modal animationType="fade" transparent={true} visible={visible}>
            <View style={styles.container}>
                <View style={styles.popupBox}>
                    <View style={styles.circleView}>
                        <MaterialCommunityIcons name={`numeric-${syncItem}-box-multiple`} size={convertHeight(45)} color="black" />
                        <Text style={styles.textBasic} onPress={() => onClose()}>{sending ? 'Auto Sync is processing...' : 'completed'}</Text>
                        <TouchableOpacity onPress={() => onClose()}>
                            <Text style={styles.textBasic}>Done</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default SyncPopUp;
