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

export default function CheckItemListView(props) {
    const { navigation } = props;
    const isFocused = useIsFocused();

    // State
    const [checkListTrip, setCheckListTrip] = useState([]);

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
            backgroundColor: COLORS.tertiary,
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
                    <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                        <Lottie source={require('../../assets/57997-travelers-find-location.json')} autoPlay loop
                            style={{ height: convertHeight(120) }} />
                        <Text style={styles.infoTxt}>{EN_IN.no_checklist}</Text>
                    </View>
                    :
                    <List style={{ backgroundColor: COLORS.primary }} data={checkListTrip} renderItem={renderItem} />}
            </View>

            <FloatingAction
                color='#ff7e61'
                actions={FLOATING_ACTION}
                onPressItem={name => { navigation.navigate(name) }} />

            {checkListTrip.length > 1 && <TouchableOpacity style={styles.floatingRemoveBtn} onPress={() => {
                Alert.alert(
                    "Do you want to delete this item?",
                    "Please confirm",
                    [
                        { text: "Cancel", onPress: () => console.log("Cancel Pressed"), style: "cancel" },
                        { text: "OK", onPress: () => clearAllData() }
                    ]
                );

            }}>
                <Text style={{ color: "white" }}>{EN_IN.remove_all_data}</Text>
            </TouchableOpacity>}
        </>
    )
}