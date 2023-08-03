import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, StatusBar, Modal, TouchableOpacity } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { List } from '@ui-kitten/components';
import Lottie from 'lottie-react-native';
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from 'react-redux';
import NetInfo from '@react-native-community/netinfo';
import Ionicons from 'react-native-vector-icons/Ionicons';
// Custom Imports
import { ROUTE_KEYS } from '../../../navigation/constants';
import { queryHistoryCompletedCheckList } from '../../../database/allSchemas';
import MainItemListCardView from '../../../components/MainItemListCardView';
import { convertHeight, convertWidth } from '../../../common/utils/dimentionUtils';
import COLORS from '../../../common/Colors';
import AssetIconsPack from '../../../assets/IconProvide';
import { darkModeColor } from '../../../common/utils/arrayObjectUtils';
import { getAllChecklistHistory } from '../api/ChecklistApi';
import { selectAllChecklists } from '../checklistSlice';
import { AppLoader, NetworkErrorView } from '../../../components';

export default function CheckItemHistoryView(props) {

    const { navigation } = props;
    const isFocused = useIsFocused();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const netInfo = NetInfo.useNetInfo();
    const isDarkMode = useSelector(state => state?.settings?.isDarkMode);
    const { checklists, status, error } = useSelector(selectAllChecklists);

    useEffect(() => {
        if (isFocused) {
            dispatch(getAllChecklistHistory());
        }
    }, [isFocused, dispatch, netInfo.isConnected]);

    const renderItem = ({ item }) => {

        const navigationToNext = () => {
            navigation.navigate(ROUTE_KEYS.LIST_PARTICULAR_CHECK_ITEM, { item, history: true });
        };

        const navigationToEdit = () => {
            navigation.navigate(ROUTE_KEYS.CHECK_ITEM_ADD, { item, editMode: true });
        };

        return (
            <MainItemListCardView
                item={item}
                history={true}
                navigationToNext={navigationToNext}
                navigationToEdit={navigationToEdit}
            />
        );
    };

    const { backgroundColor, textColor } = darkModeColor(isDarkMode);

    const styles = StyleSheet.create({
        infoTxt: {
            color: COLORS.info,
            fontStyle: 'italic',
            paddingHorizontal: convertWidth(30),
            textAlign: 'center'
        },
        loading: {
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            backgroundColor: isDarkMode ? COLORS.black : '#4F4F4F'
        },
        buttonViewContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#e5ffb2',
            borderRadius: 5,
            padding: convertWidth(10),
            elevation: 3,
            margin: convertHeight(10),
        },
        reloadText: { 
            color: COLORS.black, 
            paddingRight: convertWidth(7), 
            textTransform: 'uppercase',
            fontWeight: '500'
        }
    });

    if (status === 'loading') {
        return (
            <Modal animationType='fade' transparent={true} visible={true}>
                <StatusBar backgroundColor={isDarkMode ? COLORS.black : '#4F4F4F'} />
                <View style={styles.loading}><AppLoader /></View>
            </Modal>
        );
    }

    if (status === 'failed') {
        return (
            <NetworkErrorView onAction={() => dispatch(getAllChecklistHistory())} />
        );
    }

    return (
        <>
            <View style={{ flex: 1, backgroundColor: backgroundColor }}>
                <StatusBar backgroundColor={backgroundColor} barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
                {checklists?.length === 0 ?
                    <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                        <Lottie source={AssetIconsPack.icons.checklist_history_icon} autoPlay loop style={{ height: convertHeight(120) }} />
                        <Text style={styles.infoTxt}>{t('checklist:info')}</Text>
                    </View>
                    :
                    <List style={{ backgroundColor: backgroundColor }} data={checklists} renderItem={renderItem} />}
            </View>
        </>
    );
}