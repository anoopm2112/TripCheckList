import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Keyboard } from 'react-native';
import Lottie from 'lottie-react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import "react-native-get-random-values";
import { v4 as uuidv4 } from 'uuid';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";
import { useIsFocused } from '@react-navigation/native';
// Custom Imports
import { ROUTE_KEYS } from '../../../navigation/constants';
import COLORS from '../../../common/Colors';
import { convertHeight, convertWidth } from '../../../common/utils/dimentionUtils';
import { addNewSplitwises } from '../api/SplitWiseApi';
import AssetIconsPack from '../../../assets/IconProvide';
import { SubItemSplitWise, List, Input, Button, AnimatedText } from '../../../components';
import { darkModeColor } from '../../../common/utils/arrayObjectUtils';
import Colors from '../../../common/Colors';
import { Context as AuthContext } from '../../../context/AuthContext';

export default function FriendsAddView(props) {
  const { navigation } = props;
  const textInputRef = useRef();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const isFocused = useIsFocused();
  const { state } = useContext(AuthContext);

  const isDarkMode = useSelector(state => state?.settings?.isDarkMode);
  const { backgroundColor, textColor } = darkModeColor(isDarkMode);

  const youObj = {
    id: uuidv4(),
    name: 'You',
    expense: 0,
    type: '',
    paid: 0
  }

  const [value, setValue] = useState('');
  const [valTextInput, setValTextInput] = useState(false);
  const [splitTitleValue, setSplitTitleValue] = useState('');
  const [splitTitleValTextInput, setSplitTitleValTextInput] = useState(false);
  const [localArrayData, setLocalArrayData] = useState([]);
  const [localSplitWiseItemsArrayData, setlocalSplitWiseItemsArrayData] = useState([youObj]);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [lottieAnimation, setLottieAnimation] = useState(true);

  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);

  useEffect(() => {
    if (isFocused) {
      setLottieAnimation(false);
    }
  }, [isFocused, lottieAnimation]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => { setKeyboardVisible(true) });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => { setKeyboardVisible(false) });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const renderItem = ({ item, index }) => (
    <SubItemSplitWise item={item} deleteItem={deleteItem} />
  );

  const onHandleAddFriends = () => {
    if (value == '') {
      setValTextInput(true);
    } else {
      textInputRef.current.clear();
      setValue('');
      let arrayObject = {
        id: uuidv4(),
        name: value,
        expense: 0,
        type: '',
        paid: 0
      }
      let itemForSplitWise = {
        id: uuidv4(),
        name: value,
        expense: 0,
        type: '',
        paid: 0
      }
      localSplitWiseItemsArrayData.push(itemForSplitWise);
      setlocalSplitWiseItemsArrayData(localSplitWiseItemsArrayData);
      localArrayData.push(arrayObject);
      setLocalArrayData(localArrayData);
      forceUpdate();
    }
  }

  const deleteItem = (id) => {
    let delArray = localArrayData.filter(function (e) { return e.id !== id });
    let delSplitUpArray = localSplitWiseItemsArrayData.filter(function (e) { return e.id !== id });
    setLocalArrayData(delArray);
    setlocalSplitWiseItemsArrayData(delSplitUpArray);
    forceUpdate();
  }

  const onSubmitAddFriends = () => {
    if (localArrayData.length <= 0) {
      setValTextInput(true);
    } else if (splitTitleValue === '') {
      setSplitTitleValTextInput(true);
    } else {
      localArrayData.push(youObj);
      let splitShareArray = [{
        id: uuidv4(),
        foodType: "",
        creationDate: new Date().toISOString(),
        data: localSplitWiseItemsArrayData
      }]
      const newSplitWise = {
        id: uuidv4(),
        creationDate: new Date().toISOString(),
        splitTitle: splitTitleValue,
        members: localArrayData,
        totalAmount: 0,
        splitWiseListItems: splitShareArray,
        notes: [],
        userId: state?.userToken
      }
      dispatch(addNewSplitwises(newSplitWise));
      setLocalArrayData([]);
      navigation.navigate(ROUTE_KEYS.SPLIT_WISE_ADD, { item: newSplitWise });
    }
  }

  const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: backgroundColor
    },
    subContainer: {
      justifyContent: 'center',
      alignItems: 'center'
    },
    errortxt: {
      color: COLORS.validation,
      fontStyle: 'italic',
      textAlign: 'center'
    },
    addFrendsContainer: {
      paddingHorizontal: convertWidth(18),
    },
    submitBtn: {
      backgroundColor: COLORS.secondary,
      borderColor: COLORS.secondary,
      margin: convertHeight(10)
    }
  });

  return (
    <View style={styles.mainContainer}>
      <View style={styles.subContainer}>
        <Lottie source={AssetIconsPack.icons.add_friends_icon} autoPlay loop={lottieAnimation}
          style={{ height: convertHeight(170), width: convertWidth(170) }} />
      </View>

      <View style={styles.addFrendsContainer}>
        <Input
          placeholder={t('Splitwise:input_placeholder')}
          textStyle={{ height: convertHeight(35), color: textColor }}
          onChangeText={nextValue => {
            setSplitTitleValue(nextValue);
            setSplitTitleValTextInput(false);
          }}
          style={{ 
            paddingBottom: splitTitleValTextInput ? convertHeight(0): convertHeight(10),
            backgroundColor: isDarkMode ? '#333333' : '#f5f5f5' 
          }}  
        />
      </View>
      {splitTitleValTextInput && <Text style={[styles.errortxt, { paddingBottom: convertHeight(10) }]}>{t('Splitwise:input_val')}</Text>}

      <View style={styles.addFrendsContainer}>
        <Input
          ref={textInputRef}
          placeholder={t('Splitwise:add_friends')}
          textStyle={{ height: convertHeight(35), color: textColor }}
          onChangeText={nextValue => {
            setValue(nextValue);
            setValTextInput(false);
          }}
          style={{ backgroundColor: isDarkMode ? '#333333' : '#f5f5f5' }}
          accessoryRight={<TouchableOpacity onPress={() => { onHandleAddFriends() }}>
            <AntDesign name="plussquare" size={convertHeight(20)} color={COLORS.tertiary} />
          </TouchableOpacity>} />
      </View>
      {valTextInput && <Text style={styles.errortxt}>{t('Splitwise:validation_add_friends')}</Text>}
  
      {
        localArrayData.length > 0 ?
          <List numColumns={2} data={localArrayData} renderItem={renderItem} style={{ padding: convertHeight(6), backgroundColor: backgroundColor }} />
          :
          <View style={{ color: Colors.info, paddingTop: 20, textAlign: 'center', flex: 1 }}>
            <AnimatedText label={'Splitwise:add_friend_info'} />
          </View>
      }
      {!isKeyboardVisible && <Button onPress={() => { onSubmitAddFriends() }} style={styles.submitBtn}>{t('Common:submit')}</Button>}
    </View>
  )
}