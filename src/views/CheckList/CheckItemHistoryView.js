import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, StatusBar } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { List } from '@ui-kitten/components';
import Lottie from 'lottie-react-native';
// Custom Imports
import { ROUTE_KEYS } from '../../navigation/constants';
import { queryHistoryCompletedCheckList } from '../../database/allSchemas';
import MainItemListCardView from '../../components/MainItemListCardView';
import { convertHeight, convertWidth } from '../../common/utils/dimentionUtils';
import EN_IN from '../../common/languages/en_IN';
import COLORS from '../../common/Colors';
import AssetIconsPack from '../../assets/IconProvide';

export default function CheckItemHistoryView(props) {

    const { navigation } = props;
    const isFocused = useIsFocused();

    // State
    const [checkListTrip, setCheckListTrip] = useState([]);

    useEffect(() => {
        if (isFocused) {
            getMyStringValue();
        }
    }, [isFocused]);

    const getMyStringValue = async () => {
        try {
            queryHistoryCompletedCheckList().then((checkListTrip) => {
                setCheckListTrip(checkListTrip);
            }).catch((error) => {
                setCheckListTrip([]);
            });
        } catch (e) {
        }
    }

    const renderItem = ({ item }) => {

        const navigationToNext = () => {
            navigation.navigate(ROUTE_KEYS.LIST_PARTICULAR_CHECK_ITEM, { item, history: true })
        }

        const navigationToEdit = () => {
            navigation.navigate(ROUTE_KEYS.CHECK_ITEM_ADD, { item, editMode: true })
        }

        return (
            <MainItemListCardView
                item={item}
                history={true}
                navigationToNext={navigationToNext}
                navigationToEdit={navigationToEdit}
            />
        )
    };

    const styles = StyleSheet.create({
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
                        <Lottie source={AssetIconsPack.icons.checklist_history_icon} autoPlay loop style={{ height: convertHeight(120) }} />
                        <Text style={styles.infoTxt}>{EN_IN.no_checklist}</Text>
                    </View>
                    :
                    <List style={{ backgroundColor: COLORS.primary }} data={checkListTrip} renderItem={renderItem} />}
            </View>
        </>
    )
}