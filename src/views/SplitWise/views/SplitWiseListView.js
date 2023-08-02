import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, StatusBar, Modal } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { useTranslation } from "react-i18next";
// Custom Import
import COLORS from '../../../common/Colors';
import AssetIconsPack from '../../../assets/IconProvide';
import { 
  AppLoader, CustomPopup, EmptyList, MainItemSplitWiseListCard, List, AnimatedText, NetworkErrorView
} from '../../../components';
import { convertHeight, convertWidth } from '../../../common/utils/dimentionUtils';
import { ROUTE_KEYS } from '../../../navigation/constants';
import { deleteAllSplitWise, deleteSplitWiseById, fetchSplitwises } from '../api/SplitWiseApi';
import { selectAllSplitwises } from '../splitwiseSlice';
import { darkModeColor } from '../../../common/utils/arrayObjectUtils';
import { Context as AuthContext } from '../../../context/AuthContext';

export default function SplitWiseListView(props) {
  const { navigation } = props;

  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { state } = useContext(AuthContext);

  const isDarkMode = useSelector(state => state?.settings?.isDarkMode);
  const { backgroundColor, textColor } = darkModeColor(isDarkMode);

  const { splitwises, status, error } = useSelector(selectAllSplitwises);

  const [alertVisible, setAlertVisible] = useState(false);

  useEffect(() => {
    if (isFocused) {
      dispatch(fetchSplitwises({ userId: state?.userToken }));
    }
  }, [isFocused, dispatch]);

  const removeParticularItem = async ({ id, item }) => {
    dispatch(deleteSplitWiseById({ id: id, splitwiseId: item._id }));
    dispatch(fetchSplitwises({ userId: state?.userToken }));
  }

  const renderItem = ({ item }) => {
    let spliupAmount = item.totalAmount / (item.members.length);
    const navigationToEdit = () => { navigation.navigate(ROUTE_KEYS.SPLIT_WISE_ADD, { item: item }) }

    return (
      <>
        <MainItemSplitWiseListCard
          navigationToEdit={navigationToEdit} 
          removeParticularItem={({ id, item }) => removeParticularItem({ id, item })}
          item={item} spliupAmount={spliupAmount} />
      </>
    )
  };

  const deleteAllSplitWiseItems = () => { setAlertVisible(true) }
  const removeAllItem = async () => {
    dispatch(deleteAllSplitWise());
    dispatch(fetchSplitwises({ userId: state?.userToken }));
  }

  const styles = StyleSheet.create({
    floatingBtn: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: convertWidth(10),
      position: 'absolute',
      bottom: convertHeight(30),
      borderRadius: 5,
      elevation: 4,
      width: convertWidth(150)
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
    return (
      <NetworkErrorView onAction={() => dispatch(fetchSplitwises({ userId: state?.userToken }))} />
    )
  }

  return (
    <>
      <View style={{ flex: 1 }}>
        <StatusBar backgroundColor={backgroundColor} barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        {splitwises?.length === 0 ?
          <EmptyList lottieSrc={isDarkMode ? AssetIconsPack.icons.money_hand_dark : AssetIconsPack.icons.splitwise_empty_icon} shownText={'Splitwise:split_info'} />
          :
          <>
            <AnimatedText label={'Splitwise:splitlist_info'}/>
            <List style={{ backgroundColor: backgroundColor }} data={splitwises} renderItem={renderItem} />
          </>
        }
      </View>

      <TouchableOpacity style={[styles.floatingBtn, { right: convertWidth(20), backgroundColor: COLORS.tertiary }]} onPress={() => { navigation.navigate(ROUTE_KEYS.FRIENDS_ADD) }}>
        <Text style={{ color: "white", fontWeight: 'bold' }}>{t('Splitwise:add_new_split')}</Text>
      </TouchableOpacity>
      {splitwises?.length > 1 &&
        <TouchableOpacity style={[styles.floatingBtn, { left: convertWidth(20), backgroundColor: COLORS.validation }]} onPress={() => deleteAllSplitWiseItems()}>
          <Text style={{ color: "white", fontWeight: 'bold' }}>{t('Splitwise:remove_all_data')}</Text>
        </TouchableOpacity>
      }
      <CustomPopup
        title={'Common:deleteAllItem'} message={'Common:please_confirm'}
        visible={alertVisible} onClose={() => setAlertVisible(false)}
        onConfirm={() => removeAllItem()} />
    </>
  )
}