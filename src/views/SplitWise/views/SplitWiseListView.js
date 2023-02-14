import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, StatusBar, Modal } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
// Custom Import
import COLORS from '../../../common/Colors';
import EN_IN from '../../../common/languages/en_IN';
import AssetIconsPack from '../../../assets/IconProvide';
import { AppLoader, CustomPopup, EmptyList, MainItemSplitWiseListCard, List } from '../../../components';
import { convertHeight, convertWidth } from '../../../common/utils/dimentionUtils';
import { ROUTE_KEYS } from '../../../navigation/constants';
import { deleteAllSplitWise, deleteSplitWiseById, fetchSplitwises } from '../api/SplitWiseApi';
import { selectAllSplitwises } from '../splitwiseSlice';

export default function SplitWiseListView(props) {
  const { navigation } = props;

  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  const { splitwises, status, error } = useSelector(selectAllSplitwises);

  const [alertVisible, setAlertVisible] = useState(false);

  useEffect(() => {
    if (isFocused) {
      dispatch(fetchSplitwises());
    }
  }, [isFocused, dispatch]);

  const removeParticularItem = async (id) => {
    dispatch(deleteSplitWiseById({ id: id }))
  }

  const renderItem = ({ item }) => {
    let spliupAmount = item.totalAmount / (item.members.length);
    const navigationToEdit = () => { navigation.navigate(ROUTE_KEYS.SPLIT_WISE_ADD, { item: item }) }

    return (
      <>
        <MainItemSplitWiseListCard
          navigationToEdit={navigationToEdit} removeParticularItem={removeParticularItem}
          item={item} spliupAmount={spliupAmount} />
      </>
    )
  };

  const deleteAllSplitWiseItems = () => { setAlertVisible(true) }
  const removeAllItem = async () => { dispatch(deleteAllSplitWise()) }

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
      <View style={{ flex: 1 }}>
        <StatusBar backgroundColor={COLORS.primary} barStyle='dark-content' />
        {splitwises?.length === 0 ?
          <EmptyList lottieSrc={AssetIconsPack.icons.splitwise_empty_icon} shownText={EN_IN.no_splitWise} />
          :
          <>
            <Text style={[styles.infoTxt, { fontSize: convertHeight(10), paddingVertical: convertHeight(7), fontWeight: 'bold' }]}>To access more actions, swipe the card in either direction.</Text>
            <List data={splitwises} renderItem={renderItem} />
          </>
        }
      </View>

      <TouchableOpacity style={[styles.floatingBtn, { right: convertWidth(20), backgroundColor: COLORS.tertiary }]} onPress={() => { navigation.navigate(ROUTE_KEYS.FRIENDS_ADD) }}>
        <Text style={{ color: "white", fontWeight: 'bold' }}>{EN_IN.add_split_up}</Text>
      </TouchableOpacity>
      {splitwises?.length > 1 &&
        <TouchableOpacity style={[styles.floatingBtn, { left: convertWidth(20), backgroundColor: COLORS.validation }]} onPress={() => deleteAllSplitWiseItems()}>
          <Text style={{ color: "white", fontWeight: 'bold' }}>{EN_IN.remove_all_split_up}</Text>
        </TouchableOpacity>
      }
      <CustomPopup
        title={'Do you want to delete all item?'} message={'Please Confirm'}
        visible={alertVisible} onClose={() => setAlertVisible(false)}
        onConfirm={() => removeAllItem()} />
    </>
  )
}