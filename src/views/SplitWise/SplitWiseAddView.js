import { View, Text, StyleSheet, TouchableOpacity, Keyboard } from 'react-native';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { IndexPath, Select, SelectItem, Button, List, Input } from '@ui-kitten/components';
import * as Animatable from 'react-native-animatable';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import RBSheet from "react-native-raw-bottom-sheet";
import "react-native-get-random-values";
import { v4 as uuidv4 } from 'uuid';
// Other files
import { splitWiseDataItem } from '../../common/Itemdata';
import { ROUTE_KEYS } from '../../navigation/constants';
import { updateSplitWiseList } from '../../database/allSchemas';
import { convertHeight, convertWidth } from '../../common/utils/dimentionUtils';
import EN_IN from '../../common/languages/en_IN';
import COLORS from '../../common/Colors';
import SubItemSplitWise from '../../components/SubItemSplitWise';
// import { totalAmountFromArrayObj } from '../../common/utils/arrayObjectUtils';

export default function CheckListAddView(props) {
    const { navigation } = props;
    const { item } = props.route.params;

    const refRBSheet = useRef();

    const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0));
    const [localArrayData, setLocalArrayData] = useState(item.members ? JSON.parse(JSON.stringify(item.members)) : []);
    const [localSplitWiseAddArrayData, setLocalSplitWiseAddArrayData] = useState(item.splitWiseListItems ? JSON.parse(JSON.stringify(item.splitWiseListItems)) : []);
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    const [value, setValue] = useState('');
    const [amount, setAmount] = useState(0);
    const [valAmount, setValAmount] = useState(false);
    const [valTextInput, setValTextInput] = useState(false);
    const [whoPaid, setWhoPaid] = useState(false);
    const [valWhoPaid, setValWhoPaid] = useState(false);

    const [showEquallySplit, setShowEquallySplit] = useState(false);

    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => { setKeyboardVisible(true) });
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => { setKeyboardVisible(false) });

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);

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
        } else {
            // Add paid rate to array
            let newArr1;
            if (showEquallySplit) {
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
                splitWiseListItems: localSplitWiseAddArrayData.concat(splitShareArray)
            }

            updateSplitWiseList(newSplitWise).then().catch((error) => {
                alert(error);
            });
            setLocalArrayData([]);

            navigation.navigate(ROUTE_KEYS.SPLIT_WISE_LIST);
        }
    }

    // Add whole data to local DB (Realm)
    // const onRealmAdding = () => {
    //     if (amount == '') {
    //         setValAmount(true)
    //     } else if (whoPaid) {
    //         setValWhoPaid(true);
    //     } else {
    //         let amountAdded = amountAdded = parseInt(item.totalAmount) + parseInt(amount);
    //         const newSplitWise = {
    //             id: item.id,
    //             creationDate: item.creationDate,
    //             type: selectedIndex == 4 ? value : displayValue,
    //             totalAmount: amountAdded,
    //             members: item.members,
    //             splitWiseListItems: localSplitWiseAddArrayData
    //         }

    //         updateSplitWiseList(newSplitWise).then().catch((error) => {
    //             alert(error);
    //         });
    //         setLocalArrayData([]);

    //         navigation.navigate(ROUTE_KEYS.SPLIT_WISE_LIST);
    //     }
    // }

    const sum_values = () => {
        var sum = 0;
        for (var i = 0; i < localArrayData.length; i++) {
            sum += parseInt(localArrayData[i].expense, 10);
        }
        setAmount(sum)
    }

    // Split Up Components
    const renderItem = ({ item, index }) => (<SubItemSplitWise item={item} index={index} onSubmitCheckList={onSubmitCheckList} />);
    const renderItemPayed = ({ item }) => {
        let foodCategory = item.foodType;
        return (
            <View>
                <Text style={{ color: COLORS.black, textAlign: 'center' }}>{foodCategory}</Text>
                <List data={item.data.filter(obj => obj.type != '')} renderItem={renderParticularSpendItem} style={{ backgroundColor: COLORS.primary }} />
            </View>
        )
    }
    const renderParticularSpendItem = ({ item }) => {
        return (
            <TouchableOpacity activeOpacity={10} style={styles.particularRBSheetItem}>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ color: COLORS.tertiary }}>{item.name} </Text>
                    {item.paid != 0 && <Text style={{ color: COLORS.tertiary }}>Paid {item.paid}</Text>}
                </View>
                <Text style={{ color: COLORS.secondary }}>Expense {item.expense}</Text>
            </TouchableOpacity>
        )
    }
    const renderItemNotEquallySplit = ({ item, index }) => (
        <View style={styles.txtInputContainer}>
            <Text style={styles.txtNameContainer}>{item.name}</Text>
            <Text style={{ color: COLORS.black, paddingHorizontal: convertWidth(5), flex: 0.2 }}>:</Text>
            <Input
                style={{ flex: 1.5, borderColor: COLORS.secondary }}
                key={index}
                placeholder={'Split Amount '}
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

    const styles = StyleSheet.create({
        mainContainer: {
            flex: 1,
            padding: convertHeight(8),
            backgroundColor: COLORS.primary
        },
        counterContainer: {
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: convertHeight(12)
        },
        addTask: {
            backgroundColor: 'green',
            borderColor: 'green',
            width: '48%'
        },
        listItemContainer: {
            elevation: 5,
            backgroundColor: COLORS.primary,
            borderRadius: 5,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: convertWidth(10),
            height: convertHeight(32),
            flexDirection: 'row'
        },
        paidByYou: {
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            padding: convertHeight(10)
        },
        errortxt: {
            color: COLORS.validation,
            fontStyle: 'italic',
            textAlign: 'center',
            paddingVertical: convertHeight(3)
        },
        txtInputContainer: {
            paddingVertical: 5, flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
        },
        txtNameContainer: {
            color: COLORS.black,
            flex: 0.5,
            textAlign: 'center'
        },
        paidByTitle: {
            color: COLORS.black, padding: convertHeight(7), textAlign: 'center',
            fontWeight: 'bold', fontSize: convertHeight(16), color: COLORS.secondary,
            textDecorationLine: 'underline'
        },
        particularRBSheetItem: {
            padding: convertHeight(5),
            justifyContent: 'center',
            alignItems: 'center',
            borderColor: COLORS.black,
            borderWidth: 1
        }
    });

    return (
        <KeyboardAwareScrollView style={{ backgroundColor: COLORS.primary }}>
            <View style={styles.mainContainer}>
                <Select
                    style={{ marginBottom: convertHeight(5) }}
                    placeholder='Default'
                    value={displayValue}
                    selectedIndex={selectedIndex}
                    onSelect={index => setSelectedIndex(index)}>
                    {splitWiseDataItem.map(renderOption)}
                </Select>
                {selectedIndex == 4 && <View style={{ paddingTop: convertHeight(5) }}>
                    <Input placeholder='Other Item' value={value} onChangeText={nextValue => { setValue(nextValue), setValTextInput(false) }} />
                </View>}

                <View>
                    <View style={styles.paidByYou}>
                        <Text style={{ color: COLORS.black }}>Equally, Split the Amount?</Text>
                        <TouchableOpacity style={[styles.listItemContainer, { width: convertWidth(80), backgroundColor: !showEquallySplit ? COLORS.tertiary : COLORS.secondary }]}
                            onPress={() => { setShowEquallySplit(!showEquallySplit) }}>
                            <Text style={{ color: COLORS.primary }}>{!showEquallySplit ? 'Yes' : 'No'}</Text>
                        </TouchableOpacity>
                    </View>
                    {!showEquallySplit &&
                        <Animatable.View animation={'fadeInLeft'}>
                            <List data={localArrayData} style={{ backgroundColor: COLORS.primary }} renderItem={renderItemNotEquallySplit} />
                        </Animatable.View>
                    }
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
                        <View style={{ backgroundColor: COLORS.primary }}>
                            <RBSheet height={convertHeight(320)} ref={refRBSheet} closeOnDragDown={true} closeOnPressMask={false}
                                customStyles={{ draggableIcon: { backgroundColor: COLORS.black } }}>
                                <List horizontal data={JSON.parse(JSON.stringify(item.splitWiseListItems))} renderItem={renderItemPayed} style={{ backgroundColor: COLORS.primary, margin: 10 }} />
                                <Button style={{ margin: convertHeight(10) }} onPress={() => { refRBSheet.current.close() }}>{EN_IN.close}</Button>
                            </RBSheet>
                        </View>

                        {item.splitWiseListItems.length > 1 &&
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Button style={{ backgroundColor: COLORS.tertiary, borderColor: COLORS.tertiary, marginVertical: convertHeight(12), width: convertWidth(160) }} onPress={() => { refRBSheet.current.open() }}>{'VIEW EXPENSE'}</Button>
                                {/* <Button style={{ backgroundColor: COLORS.secondary, borderColor: COLORS.secondary, marginVertical: convertHeight(12), width: convertWidth(160) }} onPress={() => onRealmAdding()}>{EN_IN.submit}</Button> */}
                            </View>}
                    </>}
            </View>
        </KeyboardAwareScrollView>
    )
}