import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, StatusBar, Modal } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { FloatingAction } from "react-native-floating-action";
import { useDispatch, useSelector } from 'react-redux';
// Custom Imports
import { ROUTE_KEYS } from '../../../navigation/constants';
import { FLOATING_ACTION } from '../../../common/Itemdata';
import { convertHeight, convertWidth } from '../../../common/utils/dimentionUtils';
import EN_IN from '../../../common/languages/en_IN';
import COLORS from '../../../common/Colors';
import AssetIconsPack from '../../../assets/IconProvide';
import { deleteAllChecklist, deleteChecklistById, fetchChecklists } from '../api/ChecklistApi';
import { selectAllChecklists } from '../checklistSlice';
import { AppLoader, CustomPopup, EmptyList, MainItemListCardView, List } from '../../../components';

export default function CheckItemListView(props) {
    const { navigation } = props;
    const isFocused = useIsFocused();
    const dispatch = useDispatch();

    const { checklists, status, error } = useSelector(selectAllChecklists);

    const [alertVisible, setAlertVisible] = useState(false)

    useEffect(() => {
        if (isFocused) {
            dispatch(fetchChecklists());
        }
    }, [isFocused, dispatch]);

    const removeAllItem = async () => { dispatch(deleteAllChecklist()) }
    const removeParticularItem = async (id) => {
        dispatch(deleteChecklistById({ id: id }))
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
        },
        loading: {
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            backgroundColor: '#FFFFFF'
        }
    });

    if (status === 'loading') {
        return (
            <Modal animationType='none' transparent={true} visible={true}>
                <View style={styles.loading}><AppLoader /></View>
            </Modal>
        )
    }

    if (status === 'failed') {
        return <Text style={{ color: 'black' }}>{error}</Text>;
    }

    return (
        <>
            <View style={{ flex: 1, backgroundColor: COLORS.primary }}>
                <StatusBar backgroundColor={COLORS.primary} barStyle='dark-content' />
                {checklists.length === 0 ?
                    <EmptyList lottieSrc={AssetIconsPack.icons.checklist_empty_icon} shownText={EN_IN.no_checklist} />
                    :
                    <List style={{ backgroundColor: COLORS.primary }} data={checklists} renderItem={renderItem} />}
            </View>

            <FloatingAction
                color='#ff7e61'
                actions={FLOATING_ACTION}
                onPressItem={name => { navigation.navigate(name) }} />

            <CustomPopup
                title={`Do you want to delete this item?`} message={'Please Confirm'}
                visible={alertVisible} onClose={() => setAlertVisible(false)}
                onConfirm={() => removeAllItem()} />

            {checklists.length > 1 && <TouchableOpacity style={styles.floatingRemoveBtn} onPress={() => { setAlertVisible(true) }}>
                <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>{EN_IN.remove_all_data}</Text>
            </TouchableOpacity>}
        </>
    )
}