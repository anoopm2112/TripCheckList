import React, { useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { List, Button } from '@ui-kitten/components';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import RBSheet from "react-native-raw-bottom-sheet";
// Custom Import
import COLORS from '../common/Colors';
import EN_IN from '../common/languages/en_IN';
import { convertHeight, convertWidth } from '../common/utils/dimentionUtils';
import { getAddedAmountArray } from '../common/utils/arrayObjectUtils';

export default function MainItemSplitWiseListCard(props) {
    const { item, spliupAmount, navigationToEdit, removeParticularItem } = props;
    const refRBSheet = useRef();

    const styles = StyleSheet.create({
        listItemContainer: {
            elevation: 5,
            backgroundColor: COLORS.primary,
            alignItems: 'center',
            height: convertHeight(50),
            borderBottomWidth: 2,
            borderBottomColor: COLORS.primary
        },
        editBtnContainer: {
            backgroundColor: 'green',
            height: '100%',
            width: '15%',
            justifyContent: 'center',
            alignItems: 'center'
        },
        deleteBtnContainer: {
            backgroundColor: 'red',
            height: '100%',
            width: '15%',
            justifyContent: 'center',
            alignItems: 'center'
        },
        label: {
            textAlign: 'center',
            fontWeight: 'bold',
            color: COLORS.black,
            fontSize: convertHeight(20)
        },
        labelContainer: {
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1
        },
        subItemContainer: {
            padding: convertHeight(5),
            margin: convertWidth(10),
            backgroundColor: COLORS.primary,
            elevation: 5,
            width: convertWidth(160),
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 5
        },
        bottomScroll: {
            fontSize: convertHeight(12),
            fontWeight: 'bold',
            padding: convertHeight(3),
            color: COLORS.black
        }
    });

    const renderItemSplitMembers = ({ item }) => {
        let balance = item.totalAmount;

        return (
            <TouchableOpacity activeOpacity={10} style={styles.subItemContainer}>
                <Text style={styles.bottomScroll}>{item.name} paid a total of</Text>
                <Text style={[styles.bottomScroll, { color: COLORS.black, fontSize: convertHeight(15) }]}>{item.paid} RS</Text>
                <Text style={{
                    fontSize: convertHeight(12), fontWeight: 'bold', padding: convertHeight(3),
                    color: Math.sign(balance) == 1 ? '#3CE911' : Math.sign(balance) == 0 ? COLORS.tertiary : COLORS.validation
                }}>{`${Math.sign(balance) == 1 ? 'Need' : 'Give Back'}`}</Text>
                <Text style={[styles.bottomScroll, { color: Math.sign(balance) == 1 ? '#3CE911' : Math.sign(balance) == 0 ? COLORS.tertiary : COLORS.validation, fontSize: convertHeight(18) }]}>{`${Math.abs(balance.toFixed())} rs`}</Text>
            </TouchableOpacity>
        )
    };

    const tryTodelete = (item) => {
        Alert.alert(
            "Do you want to delete this item?",
            "Please confirm",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "OK", onPress: () => removeParticularItem(item.id) }
            ]
        );
    }

    return (
        <>
            <View activeOpacity={0.3} style={[styles.listItemContainer, { flexDirection: 'row', }]}>
                <View style={styles.labelContainer}>
                    <Text style={{ fontSize: convertHeight(10), color: COLORS.black }}>Grand Total</Text>
                    <Text style={styles.label}>{item.totalAmount}</Text>
                </View>
                <View style={styles.labelContainer}>
                    <Text style={{ fontSize: convertHeight(10), color: COLORS.black }}>Members</Text>
                    <Text style={styles.label}>{item.members.length}</Text>
                </View>
                <TouchableOpacity style={[styles.editBtnContainer, { backgroundColor: COLORS.tertiary }]} onPress={() => { refRBSheet.current.open() }}>
                    <AntDesign name="eyeo" size={convertHeight(25)} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.editBtnContainer} onPress={() => navigationToEdit()}>
                    <AntDesign name="edit" size={convertHeight(25)} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteBtnContainer} onPress={() => tryTodelete(item)}>
                    <MaterialIcons name="delete" size={convertHeight(25)} color="white" />
                </TouchableOpacity>
            </View>
            <RBSheet height={convertHeight(320)} ref={refRBSheet} closeOnDragDown={true} closeOnPressMask={false}
                customStyles={{ draggableIcon: { backgroundColor: COLORS.black } }}>
                <List numColumns={2} data={getAddedAmountArray(item?.splitWiseListItems)} renderItem={({ item }) => renderItemSplitMembers({ item, spliupAmount })} />
                <Button style={{ margin: convertHeight(10) }} onPress={() => { refRBSheet.current.close() }}>{EN_IN.close}</Button>
            </RBSheet>
        </>
    )
}