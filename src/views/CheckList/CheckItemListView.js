import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, StatusBar, Alert } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { List } from '@ui-kitten/components';
import { FloatingAction } from "react-native-floating-action";
import Lottie from 'lottie-react-native';
// Custom Imports
import { ROUTE_KEYS } from '../../navigation/constants';
import { FLOATING_ACTION } from '../../common/Itemdata';
import { queryAllCheckList, deleteAllCheckList, deleteCheckList } from '../../database/allSchemas';
import MainItemListCardView from '../../components/MainItemListCardView';
import { convertHeight, convertWidth } from '../../common/utils/dimentionUtils';
import EN_IN from '../../common/languages/en_IN';
import COLORS from '../../common/Colors';
import AssetIconsPack from '../../assets/IconProvide';
import EmptyList from '../../components/EmptyList';
import CustomPopup from '../../components/CustomPopup';

export default function CheckItemListView(props) {
    const { navigation } = props;
    const isFocused = useIsFocused();

    // State
    const [checkListTrip, setCheckListTrip] = useState([]);
    const [alertVisible, setAlertVisible] = useState(false)

    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);

    useEffect(() => {
        if (isFocused) {
            getMyStringValue();
        }
    }, [isFocused]);

    const getMyStringValue = async () => {
        try {
            queryAllCheckList().then((checkListTrip) => {
                setCheckListTrip(checkListTrip);
            }).catch((error) => {
                setCheckListTrip([]);
            });
        } catch (e) {
        }
    }

    const clearAllData = async () => {
        deleteAllCheckList().then(() => {
            setCheckListTrip([])
        }).catch((error) => {
            setCheckListTrip([]);
        });
    }

    const renderItem = ({ item }) => {

        const navigationToNext = () => {
            navigation.navigate(ROUTE_KEYS.LIST_PARTICULAR_CHECK_ITEM, { item })
        }

        const navigationToEdit = () => {
            navigation.navigate(ROUTE_KEYS.CHECK_ITEM_ADD, { item, editMode: true })
        }

        return (
            <MainItemListCardView
                item={item}
                removeParticularItem={removeParticularItem}
                navigationToNext={navigationToNext}
                navigationToEdit={navigationToEdit}
            />
        )
    };

    const removeParticularItem = async (id) => {
        deleteCheckList(id).then(() => {
            setCheckListTrip(checkListTrip);
            forceUpdate()
        }).catch((error) => {
            // Error Handling
        });
    }

    const styles = StyleSheet.create({
        floatingRemoveBtn: {
            alignItems: 'center',
            justifyContent: 'center',
            padding: convertWidth(10),
            position: 'absolute',
            bottom: convertHeight(30),
            left: convertWidth(20),
            backgroundColor: COLORS.validation,
            borderRadius: 5,
        },
        infoTxt: {
            color: COLORS.info,
            fontStyle: 'italic',
            paddingHorizontal: convertWidth(30),
            textAlign: 'center'
        }
    });

    return (
        <>
            <View style={{ flex: 1, backgroundColor: COLORS.primary }}>
                <StatusBar backgroundColor={COLORS.primary} barStyle='dark-content' />
                {checkListTrip.length === 0 ?
                    <EmptyList lottieSrc={AssetIconsPack.icons.checklist_empty_icon} shownText={EN_IN.no_checklist} />
                    :
                    <List style={{ backgroundColor: COLORS.primary }} data={checkListTrip} renderItem={renderItem} />}
            </View>

            <FloatingAction
                color='#ff7e61'
                actions={FLOATING_ACTION}
                onPressItem={name => { navigation.navigate(name) }} />

            <CustomPopup
                title={`Do you want to delete this item?`} message={'Please Confirm'}
                visible={alertVisible} onClose={() => setAlertVisible(false)}
                onConfirm={() => clearAllData()} />

            {checkListTrip.length > 1 && <TouchableOpacity style={styles.floatingRemoveBtn} onPress={() => { setAlertVisible(true) }}>
                <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>{EN_IN.remove_all_data}</Text>
            </TouchableOpacity>}
        </>
    )
}