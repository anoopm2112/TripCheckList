import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, StatusBar, Alert } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { List } from '@ui-kitten/components';
import Lottie from 'lottie-react-native';
import _ from 'lodash';
// Custom Import
import COLORS from '../../common/Colors';
import EN_IN from '../../common/languages/en_IN';
import { convertHeight, convertWidth } from '../../common/utils/dimentionUtils';
import { ROUTE_KEYS } from '../../navigation/constants';
import { queryAllSplitWiseList, deleteAllSplitWiseList, deleteSplitWiseList } from '../../database/allSchemas';
import MainItemSplitWiseListCard from '../../components/MainItemSplitWiseListCard';

export default function SplitWiseListView(props) {
  const { navigation } = props;
  const isFocused = useIsFocused();

  // State
  const [splitWiseListTrip, setSplitWiseListTrip] = useState([]);

  // Force Update State
  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);

  useEffect(() => {
    if (isFocused) {
      getMyStringValue();
    }
  }, [isFocused]);

  const getMyStringValue = async () => {
    try {
      queryAllSplitWiseList().then((checkSplitWiseListTrip) => {
        setSplitWiseListTrip(checkSplitWiseListTrip);
      }).catch((error) => {
        setSplitWiseListTrip([]);
      });
    } catch (e) {
    }
  }

  const removeParticularItem = async (id) => {
    deleteSplitWiseList(id).then(() => {
      setSplitWiseListTrip(splitWiseListTrip);
      forceUpdate()
    }).catch((error) => {
      // Error Handling
    });
  }

  const renderItem = ({ item }) => {
    let spliupAmount = item.totalAmount / (item.members.length);
    const navigationToEdit = () => { navigation.navigate(ROUTE_KEYS.SPLIT_WISE_ADD, { item: item }) }

    return (
      <>
        <MainItemSplitWiseListCard
          navigationToEdit={navigationToEdit}
          removeParticularItem={removeParticularItem}
          item={item}
          spliupAmount={spliupAmount} />
      </>
    )
  };

  const deleteAllSplitWiseItems = () => {
    deleteAllSplitWiseList().then(() => {
      setSplitWiseListTrip([])
    }).catch((error) => {
      setSplitWiseListTrip([]);
    });
  }

  const styles = StyleSheet.create({
    floatingBtn: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: convertWidth(10),
      position: 'absolute',
      bottom: convertHeight(30),
      borderRadius: 5,
      elevation: 4
    },
    infoTxt: {
      color: COLORS.info,
      fontStyle: 'italic',
      paddingHorizontal: convertWidth(30),
      textAlign: 'center'
    },
  });

  return (
    <>
      <View style={{ flex: 1 }}>
        <StatusBar backgroundColor={COLORS.primary} barStyle='dark-content' />
        {splitWiseListTrip.length === 0 ?
          <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, backgroundColor: COLORS.primary }}>
            <Lottie source={require('../../assets/92520-money-hand.json')} autoPlay loop
              style={{ height: convertHeight(120) }} />
            <Text style={styles.infoTxt}>{EN_IN.no_splitWise}</Text>
          </View>
          :
          <List data={splitWiseListTrip} renderItem={renderItem} />}
      </View>

      <TouchableOpacity style={[styles.floatingBtn, { right: convertWidth(20), backgroundColor: COLORS.tertiary }]} onPress={() => { navigation.navigate(ROUTE_KEYS.FRIENDS_ADD) }}>
        <Text style={{ color: "white", fontWeight: 'bold' }}>{EN_IN.add_split_up}</Text>
      </TouchableOpacity>
      {splitWiseListTrip.length > 1 && <TouchableOpacity style={[styles.floatingBtn, { left: convertWidth(20), backgroundColor: COLORS.validation }]} onPress={() => {
        Alert.alert(
          "Do you want to delete this item?",
          "Please confirm",
          [
            { text: "Cancel", onPress: () => console.log("Cancel Pressed"), style: "cancel" },
            { text: "OK", onPress: () => deleteAllSplitWiseItems() }
          ]
        );
      }}>
        <Text style={{ color: "white", fontWeight: 'bold' }}>{EN_IN.remove_all_split_up}</Text>
      </TouchableOpacity>}
    </>
  )
}