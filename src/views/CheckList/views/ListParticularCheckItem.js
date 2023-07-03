import { View, StyleSheet, TouchableOpacity, Text, Modal, Image } from 'react-native';
import React, { useState, useRef } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RBSheet from "react-native-raw-bottom-sheet";
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";
// Custom Imports
import { updateChecklist } from '../api/ChecklistApi';
import { ROUTE_KEYS } from '../../../navigation/constants';
import { SubItemListCardView, List, CheckBox, Button } from '../../../components';
import { convertHeight, convertWidth } from '../../../common/utils/dimentionUtils';
import COLORS from '../../../common/Colors';
import { darkModeColor } from '../../../common/utils/arrayObjectUtils';

export default function ListParticularCheckItem(props) {
    const { navigation } = props;
    const { item, history } = props.route.params;

    const refRBSheet = useRef();
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const isDarkMode = useSelector(state => state?.settings?.isDarkMode);
    const { backgroundColor, textColor } = darkModeColor(isDarkMode);

    // State
    const [checklistItemData, setChecklistItemData] = useState(item.checkListItems);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalmageItem, setModalmageItem] = useState();
    const [check, setCheck] = useState(false);
    const [missingItem, setMissingItem] = useState();
    const [bottomDrawer, setBottomDrawer] = useState(false);

    const renderItem = ({ item, index }) => {
        return (
            <View style={{ paddingRight: index === checklistItemData.length - 1 ? convertWidth(25) : 0 }}>
                {!history ? <SubItemListCardView
                    item={item}
                    index={index}
                    checkItem={checkItem}
                    onModalOpenFun={onModalOpenFun}
                /> :
                    <SubItemListCardView
                        item={item}
                        index={index}
                        onModalOpenFun={onModalOpenFun}
                    />}
            </View>
        )
    };

    const onModalOpenFun = (image) => {
        if (image) {
            setModalmageItem(image);
            setModalVisible(!modalVisible);
        }
    }

    const checkItem = (item, index) => {
        return (
            <CheckBox
                style={{ paddingRight: convertWidth(10) }}
                checked={item.checked}
                onChange={() => onCheck(item.id, index)}>
            </CheckBox>
        )
    }

    const onCheck = (id) => {
        let clonedArray = JSON.parse(JSON.stringify(checklistItemData))
        const data = clonedArray;
        const index = data.findIndex(x => x.id === id);
        data[index].checked = !data[index].checked
        setChecklistItemData(data);

        if (bottomDrawer) {
            let clonedArrayMissingItem = JSON.parse(JSON.stringify(missingItem))
            const missingData = clonedArrayMissingItem;
            const missingIndex = missingData.findIndex(x => x.id === id);
            missingData[missingIndex].checked = !missingData[missingIndex].checked
            setMissingItem(missingData);
        }
    }

    const onFinalSubmit = () => {
        const results = checklistItemData.filter(x => x.checked === false);
        if (results.length > 0 && !check) {
            setMissingItem(results);
            setBottomDrawer(true);
            refRBSheet.current.open()
        } else {
            const newCheckList = {
                id: item.id,
                creationDate: item.creationDate,
                title: item.title,
                isCompleted: true,
                ReminderTime: item.ReminderTime,
                checkListItems: checklistItemData
            }

            dispatch(updateChecklist(newCheckList))
            navigation.navigate(ROUTE_KEYS.CHECK_ITEM_LIST);
        }
    }

    const styles = StyleSheet.create({
        modalOpenStyle: {
            position: 'absolute',
            bottom: convertHeight(20),
            zIndex: 1000,
            borderWidth: 2,
            borderRadius: convertHeight(30),
            borderColor: backgroundColor,
            backgroundColor: backgroundColor,
            alignContent: 'center'
        },
        drawerItemContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: isDarkMode ? '#2E2E2E' : COLORS.primary
        },
        drawerItemTxt: {
            color: COLORS.validation,
            textAlign: 'center',
            width: convertWidth(250)
        }
    });

    return (
        <>
            <View style={{ flex: 1, margin: convertHeight(8) }}>
                <List style={{ backgroundColor: backgroundColor }} numColumns={2} data={checklistItemData} renderItem={renderItem} />
                {!history && <Button style={{ margin: convertHeight(10) }} onPress={() => onFinalSubmit()}>{t('Common:submit')}</Button>}
            </View>

            <Modal
                animationType="fade"
                transparent={false}
                visible={modalVisible}>
                <View style={styles.centeredView}>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => setModalVisible(!modalVisible)} style={styles.modalOpenStyle}>
                            <Ionicons name="close" size={convertHeight(30)} color={COLORS.black} />
                        </TouchableOpacity>
                        <Image style={{ height: '100%', width: '100%' }} resizeMode='stretch' source={{ uri: modalmageItem }} />
                    </View>
                </View>
            </Modal>

            <RBSheet
                height={convertHeight(320)}
                ref={refRBSheet}
                closeOnDragDown={true}
                customStyles={{ draggableIcon: { backgroundColor: textColor }, container: { backgroundColor: isDarkMode ? '#2E2E2E' : COLORS.primary } }}>
                <List horizontal data={missingItem} renderItem={renderItem} style={{ padding: convertHeight(10), backgroundColor: backgroundColor }} />

                {checklistItemData.filter(x => x.checked === false).length > 0 &&
                    <View style={styles.drawerItemContainer}>
                        <Text style={styles.drawerItemTxt}>{checklistItemData.filter(x => x.checked === false).length} {t('checklist:item_missing')}</Text>
                        <CheckBox
                            style={{ paddingLeft: convertWidth(10) }}
                            checked={check} onChange={() => setCheck(!check)}>
                        </CheckBox>
                    </View>
                }

                <View style={{ backgroundColor: isDarkMode ? '#2E2E2E' : COLORS.primary }}>
                    <Button style={{ margin: convertHeight(10) }}
                        onPress={() => {
                            setBottomDrawer(false);
                            refRBSheet.current.close()
                        }}>{t('Common:close')}</Button>
                </View>
            </RBSheet>
        </>
    )
}