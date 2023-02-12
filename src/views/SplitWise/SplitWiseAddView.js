import { View, Text, TouchableOpacity, Keyboard, LogBox } from 'react-native';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { IndexPath, Select, SelectItem, Button, List, Input } from '@ui-kitten/components';
import * as Animatable from 'react-native-animatable';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import "react-native-get-random-values";
import { v4 as uuidv4 } from 'uuid';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
// Other files
import { splitWiseDataItem } from '../../common/Itemdata';
import { ROUTE_KEYS } from '../../navigation/constants';
import { deleteNoteList, queryGetNoteList, updateSplitWiseList } from '../../database/allSchemas';
import { convertHeight, convertWidth } from '../../common/utils/dimentionUtils';
import COLORS from '../../common/Colors';
import SubItemSplitWise from '../../components/SubItemSplitWise';
import NoteModal from '../../components/NoteModal';
import { htmltable } from '../../common/pdfView';
import InvoiceModal from '../../components/InvoiceModal';
import { styles } from './SplitWiseStyle';

export default function CheckListAddView(props) {
    const { navigation } = props;
    const { item } = props.route.params;

    const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0));
    const [localArrayData, setLocalArrayData] = useState(item.members ? JSON.parse(JSON.stringify(item.members)) : []);
    const [localSplitWiseAddArrayData, setLocalSplitWiseAddArrayData] = useState(item.splitWiseListItems ? JSON.parse(JSON.stringify(item.splitWiseListItems)) : []);
    const [noteArray, setNoteArray] = useState([]);
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
    const [noteValue, setNoteValue] = useState('');
    const [viewType, setViewType] = useState(false);

    const [generateBillLocation, setGenerateBillLocation] = useState('');
    const [pdfModalVisible, setPdfModalVisible] = useState(false);

    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);

    useEffect(() => {
        LogBox.ignoreLogs(["VirtualizedLists should never be nested"])
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => { setKeyboardVisible(true) });
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => { setKeyboardVisible(false) });

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);

    useEffect(() => {
        const GetParticularSplitWiseNoteList = async () => {
            queryGetNoteList(item.id).then((SplitWiseNoteList) => {
                setNoteArray(JSON.parse(JSON.stringify(SplitWiseNoteList)));
            }).catch((error) => {
                setNoteArray([]);
            });
        }
        GetParticularSplitWiseNoteList(item.id);
    }, [modalVisible]);

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
                setShowView(false)
            }
        }
        Animation();
    }, [visibleItem, viewAnimation]);

    // DropDown Options
    const renderOption = (title) => (
        <SelectItem title={title} />
    );

    const displayValue = splitWiseDataItem[selectedIndex.row];

    // PaidBy handle Functions
    onSubmitCheckList = async (name, index) => {
        setWhoPaid(false);
        if (amount == '') {
            setValAmount(true)
        } else if (displayValue === 'Select your food category') {
            setValSelectFoodType(true)
        } else {
            // Add paid rate to array
            let newArr1;
            if (!showEquallySplit) {
                let splitAmount = amount / item.members.length;
                for (i = 0; i < localArrayData.length; i++) {
                    if (localArrayData[i].name == name) {
                        localArrayData[i].paid = parseInt(amount);
                    }
                    localArrayData[i].expense = parseInt(splitAmount)
                    localArrayData[i].id = uuidv4() + i;
                    localArrayData[i].type = selectedIndex == 4 ? value : displayValue
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
            }

            updateSplitWiseList(newSplitWise).then().catch((error) => {
                alert(error);
            });
            setLocalArrayData([]);

            navigation.navigate(ROUTE_KEYS.SPLIT_WISE_LIST);
        }
    }

    const sum_values = () => {
        var sum = 0;
        for (var i = 0; i < localArrayData.length; i++) {
            sum += parseInt(localArrayData[i].expense, 10);
        }
        setAmount(sum)
    }

    // Split Up Components
    const renderItem = ({ item, index }) => (<SubItemSplitWise item={item} index={index} onSubmitCheckList={onSubmitCheckList} />);

    const renderItemNotEquallySplit = ({ item, index }) => (
        <View style={styles.txtInputContainer}>
            <Text style={styles.txtNameContainer}>{item.name}</Text>
            <Text style={{ color: COLORS.black, paddingHorizontal: convertWidth(5), flex: 0.2 }}>:</Text>
            <Input
                style={{ flex: 1.5, borderColor: COLORS.secondary }}
                key={index}
                placeholder={'Split Amount'}
                value={localArrayData[index].expense}
                keyboardType='number-pad'
                onChangeText={val => {
                    let newArray = [...localArrayData];
                    newArray[index].id = uuidv4()
                    newArray[index].expense = parseInt(val)
                    newArray[index].type = selectedIndex == 4 ? value : displayValue
                    setLocalArrayData(newArray);
                    sum_values()
                    setValAmount(false)
                }}
            />
        </View>
    );

    const deleteNote = (id) => {
        deleteNoteList(id).then(() => {
            queryGetNoteList(item.id).then((SplitWiseNoteList) => {
                setNoteArray(JSON.parse(JSON.stringify(SplitWiseNoteList)));
            }).catch((error) => {
                setNoteArray([]);
            });
        }).catch((error) => {
            // Error Handling
        });
    }

    const handleNotes = () => {
        setNoteValue('');
        let noteClonedArray = JSON.parse(JSON.stringify(item.notes))
        let noteData = { id: uuidv4(), note: noteValue, creationDate: new Date() }
        noteClonedArray.push(noteData);
        const newSplitWise = {
            id: item.id,
            creationDate: item.creationDate,
            totalAmount: item.totalAmount,
            members: item.members,
            splitWiseListItems: item.splitWiseListItems,
            notes: noteClonedArray
        }

        updateSplitWiseList(newSplitWise).then().catch((error) => {
            alert(error);
        });

        forceUpdate();
        setModalVisible(false);
    }

    const createPDF = async () => {
        const resultData = await htmltable(item.splitWiseListItems);

        let options = {
            html: resultData,
            fileName: 'test',
            // directory: 'Documents',
            base64: true
        };

        let file = await RNHTMLtoPDF.convert(options);
        setGenerateBillLocation(file.filePath);
        setPdfModalVisible(true);
    }



    return (
        <KeyboardAwareScrollView style={{ backgroundColor: COLORS.primary }}>
            <View style={styles.mainContainer}>
                <Select
                    style={{ marginBottom: convertHeight(5) }}
                    placeholder='Default'
                    value={displayValue}
                    selectedIndex={selectedIndex}
                    onSelect={index => {
                        setSelectedIndex(index)
                        setValSelectFoodType('')
                    }}>
                    {splitWiseDataItem.map(renderOption)}
                </Select>
                {selectedIndex == 4 && <View style={{ paddingTop: convertHeight(5) }}>
                    <Input placeholder='Other Item' value={value} onChangeText={nextValue => { setValue(nextValue), setValTextInput(false) }} />
                </View>}
                {valSelectFoodType && <Animatable.Text animation={'fadeInLeft'} style={styles.errortxt}>{'Please select your food category'}</Animatable.Text>}

                <View>
                    <View style={styles.paidByYou}>
                        <Text style={{ color: COLORS.black }}>Equally, Split the Amount?</Text>
                        <TouchableOpacity style={[styles.listItemContainer, { width: convertWidth(80), backgroundColor: showEquallySplit ? COLORS.tertiary : COLORS.secondary }]}
                            onPress={() => { setShowEquallySplit(!showEquallySplit) }}>
                            <Text style={{ color: COLORS.primary }}>{showEquallySplit ? 'Yes' : 'No'}</Text>
                        </TouchableOpacity>
                    </View>
                    <Animatable.View ref={viewAnimation} animation={'fadeInLeft'}>
                        {showView &&
                            localArrayData?.map((item, index) => { return renderItemNotEquallySplit({item, index}) })
                        }
                    </Animatable.View>
                </View>

                <View style={styles.txtInputContainer}>
                    <Text style={[styles.txtNameContainer, { fontWeight: 'bold' }]}>TOTAL</Text>
                    <Text style={{ color: COLORS.black, paddingHorizontal: convertWidth(5), flex: 0.2 }}>:</Text>
                    <View style={{ flex: 1.5, borderColor: COLORS.tertiary }}>
                        <Input
                            style={{ flex: 1.5, borderColor: COLORS.tertiary }}
                            value={amount ? amount.toString() : ''}
                            placeholder={'Total Amount'}
                            keyboardType='number-pad'
                            onChangeText={nextValue => {
                                setAmount(nextValue)
                                setValAmount(false)
                                setWhoPaid(true);
                            }}
                        />
                        {valAmount && <Animatable.Text animation={'fadeInLeft'} style={styles.errortxt}>{'Please enter total amount'}</Animatable.Text>}
                    </View>
                </View>

                <View>
                    <Text style={styles.paidByTitle}>PAID BY</Text>
                    <List style={{ backgroundColor: COLORS.primary }} numColumns={2} data={localArrayData} renderItem={renderItem} />
                    {valWhoPaid && <Text style={styles.errortxt}>{'Please select person who paid the amount'}</Text>}
                </View>

                {!isKeyboardVisible &&
                    <>
                        {item.splitWiseListItems.length > 1 &&
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <TouchableOpacity style={[styles.addNoteBtn, { width: convertWidth(190), backgroundColor: COLORS.tertiary }]}
                                    onPress={() => { createPDF() }}>
                                    <Text style={{ color: COLORS.primary }}>{'Generate & View Invoice'}</Text>
                                </TouchableOpacity>
                            </View>
                        }

                        <View style={{ flexDirection: 'row', justifyContent: item?.notes?.length > 0 ? 'space-between' : 'center' }}>
                            <TouchableOpacity style={[styles.addNoteBtn, { backgroundColor: COLORS.tertiary }]}
                                onPress={() => { setViewType(true), setModalVisible(true) }}>
                                <Text style={{ color: COLORS.primary }}>{'Add Notes'}</Text>
                            </TouchableOpacity>

                            {item?.notes?.length > 0 &&
                                <TouchableOpacity style={[styles.addNoteBtn, { backgroundColor: COLORS.secondary }]}
                                    onPress={() => { setViewType(false), setModalVisible(true) }}>
                                    <Text style={{ color: COLORS.primary }}>{'VIEW NOTES'}</Text>
                                </TouchableOpacity>
                            }
                        </View>
                    </>}

                <NoteModal
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    value={noteValue}
                    setNoteValue={(value) => setNoteValue(value)}
                    submitFun={() => handleNotes()}
                    viewType={viewType}
                    notesItem={noteArray}
                    deleteNote={(id) => deleteNote(id)}
                />

                <InvoiceModal
                    pdfModalVisible={pdfModalVisible}
                    onClose={() => setPdfModalVisible(false)}
                    generateBillLocation={generateBillLocation}
                />
            </View>
        </KeyboardAwareScrollView>
    )
}