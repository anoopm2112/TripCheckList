import { View, Text, StyleSheet, PermissionsAndroid, TouchableOpacity } from 'react-native';
import React, { useState, useCallback } from 'react';
import { launchCamera } from 'react-native-image-picker';
import PushNotification from "react-native-push-notification";
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";
// Other files
import { dataItem, dataItemML, dataItemHI, dataItemTA } from '../../../common/Itemdata';
import { ROUTE_KEYS } from '../../../navigation/constants';
import { addNewChecklists, updateChecklist } from '../api/ChecklistApi';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SubItemListCardView, IndexPath, Select, SelectItem, Button, List, Tooltip, Input } from '../../../components';
import { convertHeight, convertWidth } from '../../../common/utils/dimentionUtils';
import COLORS from '../../../common/Colors';
import { darkModeColor } from '../../../common/utils/arrayObjectUtils';

export default function CheckListAddView(props) {
    const { navigation } = props;
    const { textData, ReminderTime, editMode, item } = props.route.params;

    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    const isDarkMode = useSelector(state => state?.settings?.isDarkMode);
    const { backgroundColor, textColor } = darkModeColor(isDarkMode);

    // State
    const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0));
    const [counter, setCounter] = useState(1);
    const [localArrayData, setLocalArrayData] = useState(item ? JSON.parse(JSON.stringify(item.checkListItems)) : []);
    const [itemImage, setItemImage] = useState('');

    const [toolTipVisible, setToolTipVisible] = useState(false);
    const [value, setValue] = useState('');
    const [valTextInput, setValTextInput] = useState(false);

    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);

    const renderOption = (title) => (
        <SelectItem title={title} />
    );

    const displayValue =
        // dataItem[selectedIndex.row];
        i18n.language === 'en' ? dataItem[selectedIndex.row] :
            i18n.language === 'ml' ? dataItemML[selectedIndex.row] :
                i18n.language === 'hi' ? dataItemHI[selectedIndex.row] : dataItemTA[selectedIndex.row];

    onSubmitCheckList = async () => {
        let checkListObj = {
            id: Math.floor(Date.now() / 1000),
            item: selectedIndex == 4 ? value : displayValue,
            counter: counter,
            image: itemImage,
            checked: false
        };
        localArrayData.push(checkListObj);
        setLocalArrayData(localArrayData);
        setCounter(1);
        forceUpdate();
        setItemImage('');
    };

    const onRealmAdding = () => {
        // Realm Adding

        if (editMode) {
            console.log("edit");
            const newCheckList = {
                id: item.id,
                creationDate: item.creationDate,
                title: item.title,
                isCompleted: false,
                ReminderTime: item.ReminderTime,
                checkListItems: localArrayData
            };
            dispatch(updateChecklist(newCheckList));
        } else {
            const newCheckList = {
                id: Math.floor(Date.now() / 1000),
                creationDate: new Date(),
                title: textData,
                isCompleted: false,
                ReminderTime: ReminderTime,
                checkListItems: localArrayData
            };
            dispatch(addNewChecklists(newCheckList));
            setLocalArrayData([]);

            // Push Notification Scheduling
            PushNotification.localNotificationSchedule({
                channelId: "test-channel",
                title: "Reminder!!!",
                message: `Time to Return. Pack you bag, Its ${moment.utc(ReminderTime, "YYYY-MM-DD HH").local().format('DD-MM-YYYY h:mm A')}. Hurry Up!`,
                date: new Date(ReminderTime),
                allowWhileIdle: true,
            });
        }

        navigation.navigate(ROUTE_KEYS.CHECK_ITEM_LIST);
    };

    const renderItemAccessory = (id) => (
        <TouchableOpacity style={{ paddingRight: 5 }} onPress={() => deleteItem(id)}>
            <MaterialIcons name="delete" size={24} color="red" />
        </TouchableOpacity>
    );

    const deleteItem = (id) => {
        let delArray = localArrayData.filter(function (e) {
            return e.id !== id;
        });
        setLocalArrayData(delArray);
    };

    const renderItem = ({ item, index }) => {
        return (
            <View style={{ paddingTop: convertHeight(5) }}>
                <SubItemListCardView
                    item={item}
                    index={index}
                    renderItemAccessory={renderItemAccessory}
                />
            </View>
        );
    };

    let options = {
        // saveToPhotos: true,
        mediaType: 'photo'
    };

    const openCamera = async () => {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            const result = await launchCamera(options);
            setItemImage(result.assets[0].uri);
        }
        setToolTipVisible(true);
    };

    const reduceCounterFun = () => {
        if (counter > 1) {
            setCounter(counter - 1);
        }
    };

    const renderToggleButton = () => (
        <Button accessoryRight={<MaterialIcons name="add-task" size={convertHeight(16)} color={COLORS.primary} />} 
            style={styles.addTask}
            onPress={() => {
                setToolTipVisible(false);
                onSubmitCheckList();
            }}>{t('checklist:add_item_to_list')}</Button>
    );

    const styles = StyleSheet.create({
        mainContainer: {
            flex: 1,
            margin: convertHeight(8)
        },
        counterContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: convertHeight(12)
        },
        addTask: {
            backgroundColor: COLORS.lightGreen,
            borderColor: COLORS.lightGreen,
            width: convertWidth(150)
        }
    });

    return (
        <View style={styles.mainContainer}>
            <View>
                <Select
                    style={styles.select}
                    placeholder='Default'
                    value={displayValue}
                    selectedIndex={selectedIndex}
                    onSelect={index => setSelectedIndex(index)}>
                    {
                        i18n.language === 'en' ? dataItem.map(renderOption) :
                            i18n.language === 'ml' ? dataItemML.map(renderOption) :
                                i18n.language === 'hi' ? dataItemHI.map(renderOption) : dataItemTA.map(renderOption)
                    }
                </Select>

                {selectedIndex == 4 && <View>
                    <Input
                        placeholder='Other Item'
                        value={value}
                        textStyle={{ color: textColor }}
                        style={{ 
                            paddingTop: convertHeight(10),
                            backgroundColor: isDarkMode ? '#333333' : '#f5f5f5' 
                        }}
                        onChangeText={nextValue => {
                            setValue(nextValue);
                            setValTextInput(false);
                        }} />
                </View>}

                <View style={styles.counterContainer}>
                    <Button style={{ backgroundColor: backgroundColor, borderColor: COLORS.validation }}
                        accessoryRight={<MaterialIcons name="remove-circle" size={20} color={COLORS.validation} />}
                        appearance='outline'
                        onPress={() => reduceCounterFun()}>
                    </Button>
                    <Text style={{ fontWeight: 'bold', color: textColor }}>{counter} {displayValue}</Text>
                    <Button style={{ backgroundColor: backgroundColor, borderColor: COLORS.lightGreen }}
                        accessoryRight={<MaterialIcons name="add-circle" size={convertHeight(16)} color="green" />}
                        appearance='outline'
                        onPress={() => setCounter(counter + 1)}>
                    </Button>
                    <Button appearance='outline' onPress={() => setCounter(0)}>{t('Common:reset')}</Button>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button
                        accessoryRight={<MaterialIcons name="photo-camera" size={convertHeight(16)} color={COLORS.primary} />}
                        style={{ backgroundColor: 'orange', borderColor: 'orange', width: convertWidth(180) }}
                        onPress={() => openCamera()}>
                        {t('checklist:take_picture')}
                    </Button>
                    {/* <Button accessoryRight={<MaterialIcons name="add-task" size={22} color="white" />} style={{ backgroundColor: 'green', borderColor: 'green', width: '48%' }} onPress={() => onSubmitCheckList()}>Add Item To List</Button> */}
                    <Tooltip
                        anchor={renderToggleButton}
                        visible={toolTipVisible}
                        placement={'top'}
                        onBackdropPress={() => setToolTipVisible(false)}>
                        {t('checklist:add_item_to_list')}
                    </Tooltip>
                </View>
            </View>
            <List style={{ backgroundColor: backgroundColor }} numColumns={2} data={localArrayData} renderItem={renderItem} />

            <View style={{ padding: convertHeight(10) }}>
                <Button disabled={localArrayData.length === 0} style={{ backgroundColor: COLORS.secondary, borderColor: COLORS.secondary }} onPress={() => onRealmAdding()}>{t('Common:submit')}</Button>
            </View>
        </View>
    );
}