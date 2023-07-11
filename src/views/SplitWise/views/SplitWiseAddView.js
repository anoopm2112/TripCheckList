import { View, Text, TouchableOpacity, Keyboard, LogBox, Animated, Image } from 'react-native';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import * as Animatable from 'react-native-animatable';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import RBSheet from "react-native-raw-bottom-sheet";
import "react-native-get-random-values";
import { v4 as uuidv4 } from 'uuid';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import { useTranslation } from "react-i18next";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
// Other files
import { splitWiseDataItem, splitWiseDataItemMal, splitWiseDataItemTamil, splitWiseDataItemHindi } from '../../../common/Itemdata';
import { ROUTE_KEYS } from '../../../navigation/constants';
import { deleteNoteById, fetchNotes, updateSplitwise } from '../../../views/SplitWise/api/SplitWiseApi';
import { convertHeight, convertWidth } from '../../../common/utils/dimentionUtils';
import COLORS from '../../../common/Colors';
import { htmltable, onHandleCreatePdf } from '../../../common/pdfView';
import { styles } from '../splitwiseStyles';
import { selectAllSplitwises } from '../splitwiseSlice';
import {
    SubItemSplitWise, NoteModal, InvoiceModal, IndexPath, Select, SelectItem, List, Input, PaidByModal, CustomSelect
} from '../../../components';
import { calculateTotalAmount, darkModeColor } from '../../../common/utils/arrayObjectUtils';
import AssetIconsPack from '../../../assets/IconProvide';
import Colors from '../../../common/Colors';

export default function CheckListAddView(props) {
    const [animation] = useState(new Animated.Value(1));
    const { navigation } = props;
    const { item } = props.route.params;
    const { notes, status, error } = useSelector(selectAllSplitwises);
    const isFocuesd = useIsFocused();
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    const isDarkMode = useSelector(state => state?.settings?.isDarkMode);
    const { backgroundColor, textColor } = darkModeColor(isDarkMode);
    const refRBPaidBySheet = useRef();

    const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0));
    const [localArrayData, setLocalArrayData] = useState(item.members ? JSON.parse(JSON.stringify(item.members)) : []);
    const [localSplitWiseAddArrayData, setLocalSplitWiseAddArrayData] = useState(item.splitWiseListItems ? JSON.parse(JSON.stringify(item.splitWiseListItems)) : []);
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    const [value, setValue] = useState('');
    const [amount, setAmount] = useState(0);
    const [valAmount, setValAmount] = useState(false);
    const [valSelectFoodType, setValSelectFoodType] = useState(false);
    const [valTextInput, setValTextInput] = useState(false);
    const [whoPaid, setWhoPaid] = useState(false);
    const [valWhoPaid, setValWhoPaid] = useState(false);

    const [showEquallySplit, setShowEquallySplit] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);
    const [paidByModalVisible, setPaidByModalVisible] = useState(false);
    const [noteValue, setNoteValue] = useState('');
    const [viewType, setViewType] = useState(false);

    const [generateBillLocation, setGenerateBillLocation] = useState('');
    const [pdfModalVisible, setPdfModalVisible] = useState(false);

    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);
    const [payedIndex, setPayedIndex] = useState();

    useEffect(() => {
        LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => { setKeyboardVisible(true); });
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => { setKeyboardVisible(false); });

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);

    useEffect(() => {
        const GetParticularSplitWiseNoteList = async () => {
            dispatch(fetchNotes({ id: item.id }));
        };
        GetParticularSplitWiseNoteList(item.id);
    }, [isFocuesd, modalVisible, dispatch]);

    const visibleItem = showEquallySplit || false;
    const [showView, setShowView] = useState(visibleItem);
    const viewAnimation = useRef(null);

    useEffect(() => {
        const Animation = async () => {
            if (visibleItem) {
                setShowView(true);
                if (viewAnimation.current)
                    await viewAnimation.current.fadeInLeft(2000);
            } else {
                if (viewAnimation.current)
                    await viewAnimation.current.fadeOutRight(1000);
                setShowView(false);
            }
        };
        Animation();
    }, [visibleItem, viewAnimation]);

    // DropDown Options
    const renderOption = (title) => (
        <SelectItem title={title} />
    );

    const displayValue =
        i18n.language === 'en' ? splitWiseDataItem[selectedIndex.row] :
            i18n.language === 'ml' ? splitWiseDataItemMal[selectedIndex.row] :
                i18n.language === 'hi' ? splitWiseDataItemHindi[selectedIndex.row] : splitWiseDataItemTamil[selectedIndex.row];

    // PaidBy handle Functions
    onSubmitCheckList = async (name, index) => {
        setWhoPaid(false);
        if (amount == '') {
            setValAmount(true);
        } else if (displayValue === 'Select your food category') {
            setValSelectFoodType(true);
        } else {
            // Add paid rate to array
            let newArr1;
            if (!showEquallySplit) {
                let splitAmount = amount / item.members.length;
                for (i = 0; i < localArrayData.length; i++) {
                    if (localArrayData[i].name == name) {
                        localArrayData[i].paid = parseInt(amount);
                    }
                    localArrayData[i].expense = parseInt(splitAmount);
                    localArrayData[i].id = uuidv4() + i;
                    localArrayData[i].type = selectedIndex == 4 ? value : displayValue;
                }
                newArr1 = localArrayData;
            } else {
                newArr1 = localArrayData.map(v => ({ ...v, paid: v.name == name ? parseInt(amount) : 0 }));
            }

            let splitShareArray = [{
                id: uuidv4(),
                foodType: selectedIndex == 4 ? value : displayValue,
                creationDate: new Date(),
                data: newArr1
            }];

            // setLocalSplitWiseAddArrayData(localSplitWiseAddArrayData.concat(splitShareArray));
            // Add whole data to local DB (Realm)
            let amountAdded = amountAdded = parseInt(item.totalAmount) + parseInt(amount);
            const newSplitWise = {
                id: item.id,
                creationDate: item.creationDate,
                type: selectedIndex == 4 ? value : displayValue,
                totalAmount: amountAdded,
                members: item.members,
                splitWiseListItems: localSplitWiseAddArrayData.concat(splitShareArray),
                notes: item.notes
            };

            dispatch(updateSplitwise(newSplitWise));
            setLocalArrayData([]);

            navigation.navigate(ROUTE_KEYS.SPLIT_WISE_LIST);
        }
    };

    const sum_values = async () => {
        const totalAmount = await calculateTotalAmount(localArrayData);
        setAmount(totalAmount);
    };

    // Split Up Components
    const renderItem = ({ item, index }) => (<SubItemSplitWise item={item} index={index} onSubmitCheckList={onSubmitCheckList} />);

    const renderItemNotEquallySplit = ({ item, index }) => (
        <View style={styles.txtInputContainer}>
            <Text style={[styles.txtNameContainer, { color: textColor }]}>{item.name}</Text>
            <Text style={{ color: textColor, paddingHorizontal: convertWidth(5), flex: 0.2 }}>:</Text>
            <Input
                style={{ flex: 1.5, borderColor: COLORS.secondary, backgroundColor: isDarkMode ? '#333333' : '#f5f5f5' }}
                key={index}
                placeholder={t('Splitwise:split_amount')}
                value={localArrayData[index].expense}
                keyboardType='number-pad'
                textStyle={{ color: textColor }}
                onChangeText={val => {
                    let newArray = [...localArrayData];
                    newArray[index].id = uuidv4();
                    newArray[index].expense = parseInt(val);
                    newArray[index].type = selectedIndex == 4 ? value : displayValue;
                    setLocalArrayData(newArray);
                    sum_values();
                    setValAmount(false);
                }}
            />
        </View>
    );

    const deleteNote = (id) => {
        dispatch(deleteNoteById({ id: id }));
    };

    const handleNotes = () => {
        setNoteValue('');
        let noteClonedArray = JSON.parse(JSON.stringify(item.notes));
        let noteData = { id: uuidv4(), note: noteValue, creationDate: new Date() };
        noteClonedArray.push(noteData);
        const newSplitWise = {
            id: item.id,
            creationDate: item.creationDate,
            totalAmount: item.totalAmount,
            members: item.members,
            splitWiseListItems: item.splitWiseListItems,
            notes: noteClonedArray
        };

        dispatch(updateSplitwise(newSplitWise));

        forceUpdate();
        setModalVisible(false);
    };

    const createPDF = async () => {
        const resultData = await htmltable(item.splitWiseListItems);
        const file = await onHandleCreatePdf(resultData);
        setGenerateBillLocation(file.filePath);
        setPdfModalVisible(true);
    };

    const renderItemPaidBy = ({ item, index }) => {
        return (
            <TouchableOpacity activeOpacity={10} style={[styles.subItemContainer, { backgroundColor: backgroundColor }]}>
                <Image source={AssetIconsPack.icons.avatar} style={{ height: convertHeight(45), width: convertHeight(45) }} />
                <Text numberOfLines={1} style={[styles.bottomScroll, { color: textColor, textTransform: 'uppercase' }]}>{item.name}</Text>
                <TouchableOpacity onPress={() => {
                    setPayedIndex(index);
                    setTimeout(() => {
                        refRBPaidBySheet.current.close();
                        onSubmitCheckList(item.name, index);
                    }, 500);
                }} activeOpacity={0.8} style={[styles.addBtn, { backgroundColor: textColor }]}>
                    {
                        index === payedIndex ?
                            <MaterialIcons name="check" size={24} color={backgroundColor} />
                            :
                            <MaterialIcons name="add" size={24} color={backgroundColor} />
                    }
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };

    return (
        <KeyboardAwareScrollView style={{ backgroundColor: backgroundColor }}>
            <View style={[styles.mainContainer, { backgroundColor: backgroundColor }]}>
                <Select
                    placeholder='Default'
                    value={displayValue}
                    selectedIndex={selectedIndex}
                    onSelect={index => {
                        setSelectedIndex(index);
                        setValSelectFoodType('');
                    }}>
                    {
                        // i18n.language === 'en' ? splitWiseDataItem.map(renderOption) : splitWiseDataItemMal.map(renderOption)
                        i18n.language === 'en' ? splitWiseDataItem.map(renderOption) :
                            i18n.language === 'ml' ? splitWiseDataItemMal.map(renderOption) :
                                i18n.language === 'hi' ? splitWiseDataItemHindi.map(renderOption) : splitWiseDataItemTamil.map(renderOption)
                    }
                </Select>
                {selectedIndex == 5 && <View style={{ paddingTop: convertHeight(5) }}>
                    <Input placeholder={t('Common:other_item')} value={value} onChangeText={nextValue => { setValue(nextValue), setValTextInput(false); }} />
                </View>}
                {valSelectFoodType && <Animatable.Text animation={'fadeInLeft'} style={styles.errortxt}>{t('Splitwise:select_food_category')}</Animatable.Text>}

                <View>
                    <View style={styles.paidByYou}>
                        <Text style={{ color: textColor }}>{t('Splitwise:equally_split')}</Text>
                        <TouchableOpacity style={[styles.listItemContainer, { width: convertWidth(80), backgroundColor: showEquallySplit ? COLORS.tertiary : COLORS.secondary }]}
                            onPress={() => { setShowEquallySplit(!showEquallySplit); }}>
                            <Text style={{ color: COLORS.primary }}>{showEquallySplit ? t('Common:yes') : t('Common:no')}</Text>
                        </TouchableOpacity>
                    </View>
                    <Animatable.View ref={viewAnimation} animation={'fadeInLeft'}>
                        {showView &&
                            localArrayData?.map((item, index) => { return renderItemNotEquallySplit({ item, index }); })
                        }
                    </Animatable.View>
                </View>

                <View style={styles.txtInputContainer}>
                    <Text style={[styles.txtNameContainer, { fontWeight: 'bold', color: textColor }]}>{t('Splitwise:total')}</Text>
                    <Text style={{ color: textColor, paddingHorizontal: convertWidth(5), flex: 0.2 }}>:</Text>
                    <View style={{ flex: 1.5, borderColor: COLORS.tertiary }}>
                        <Input
                            style={{ flex: 1.5, borderColor: COLORS.tertiary, backgroundColor: isDarkMode ? '#333333' : '#f5f5f5' }}
                            value={amount ? amount.toString() : ''}
                            placeholder={t('Splitwise:total_amount')}
                            keyboardType='number-pad'
                            textStyle={{ color: textColor }}
                            onChangeText={nextValue => {
                                setAmount(nextValue);
                                setValAmount(false);
                                setWhoPaid(true);
                            }}
                        />
                        {valAmount && <Animatable.Text animation={'fadeInLeft'} style={styles.errortxt}>{'Please enter total amount'}</Animatable.Text>}
                    </View>
                </View>

                <View style={[styles.buttonRow, { justifyContent: 'space-between' }]}>
                    <View>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => {
                            if (displayValue === 'Select your food category') {
                                setValSelectFoodType(true);
                            } else {
                                // setPaidByModalVisible(true);
                                refRBPaidBySheet.current.open();
                            }
                        }} style={[styles.buttonViewContainer, { backgroundColor: '#eb6471' }]}>
                            <Text style={[styles.textBtnSplit, { color: Colors.primary }]}>{t('Splitwise:paid_by')}</Text>
                            <Image source={AssetIconsPack.icons.payment_icon} style={styles.button} />
                        </TouchableOpacity>

                    </View>

                    <View>
                        <TouchableOpacity activeOpacity={0.8}
                            onPress={() => { setViewType(true), setModalVisible(true); }}
                            style={[styles.buttonViewContainer, { backgroundColor: '#eecc60' }]}>
                            <Text style={[styles.textBtnSplit, { color: Colors.primary }]}>{t('Splitwise:add_notes')}</Text>
                            <Image source={AssetIconsPack.icons.notepad_icon} style={styles.button} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={[styles.buttonRow, { justifyContent: item?.notes?.length > 0 ? 'space-between' : 'center' }]}>
                    {item?.notes?.length > 0 &&
                        <View>
                            <TouchableOpacity activeOpacity={0.8}
                                onPress={() => {
                                    if (item?.notes?.length > 0) {
                                        setViewType(false), setModalVisible(true);
                                    }
                                }} style={[styles.buttonViewContainer, { backgroundColor: '#eecc60' }]}>
                                <Text style={[styles.textBtnSplit, { color: Colors.primary }]}>{t('Splitwise:view_notes')}</Text>
                                <Image source={AssetIconsPack.icons.notebook_icon} style={styles.button} />
                            </TouchableOpacity>
                        </View>
                    }

                    {item.splitWiseListItems.length > 1 &&
                        <View>
                            <TouchableOpacity activeOpacity={0.8}
                                onPress={() => {
                                    if (item.splitWiseListItems.length > 1) {
                                        createPDF();
                                    }
                                }} style={[styles.buttonViewContainer, { backgroundColor: '#5cb09f' }]}>
                                <Text style={[styles.textBtnSplit, { color: Colors.primary }]}>{t('Splitwise:view_invoice')}</Text>
                                <Image source={AssetIconsPack.icons.report_icon} style={styles.button} />
                            </TouchableOpacity>
                        </View>
                    }
                </View>

                <NoteModal
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    value={noteValue}
                    setNoteValue={(value) => setNoteValue(value)}
                    submitFun={() => handleNotes()}
                    viewType={viewType}
                    notesItem={notes}
                    deleteNote={(id) => deleteNote(id)}
                />

                <PaidByModal
                    visible={paidByModalVisible}
                    onClose={() => setPaidByModalVisible(false)}
                    value={localArrayData}
                    onSubmitCheckList={(name, index) => onSubmitCheckList(name, index)}
                />

                <RBSheet
                    height={convertHeight(197)} ref={refRBPaidBySheet} closeOnDragDown={true}
                    customStyles={{
                        draggableIcon: { backgroundColor: textColor },
                        container: { backgroundColor: isDarkMode ? '#2c2c2e' : Colors.primary }
                    }}>
                    <View>
                        <Text style={{ color: textColor, fontWeight: 'bold', textAlign: 'center' }}>{t('PaidBy:payer')}</Text>
                        <List horizontal data={localArrayData} renderItem={renderItemPaidBy} style={{ padding: convertHeight(10), backgroundColor: isDarkMode ? '#2c2c2e' : Colors.primary }} />
                    </View>
                </RBSheet>

                <InvoiceModal
                    pdfModalVisible={pdfModalVisible}
                    onClose={() => setPdfModalVisible(false)}
                    generateBillLocation={generateBillLocation}
                />
            </View>
        </KeyboardAwareScrollView>
    );
}