import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Keyboard, Alert } from 'react-native';
import { Input, Button, List } from '@ui-kitten/components';
import Lottie from 'lottie-react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import "react-native-get-random-values";
import { v4 as uuidv4 } from 'uuid';
// Custom Imports
import { ROUTE_KEYS } from '../../navigation/constants';
import COLORS from '../../common/Colors';
import { convertHeight, convertWidth } from '../../common/utils/dimentionUtils';
import EN_IN from '../../common/languages/en_IN';
import { insertNewSplitWise } from '../../database/allSchemas';
import SubItemSplitWise from '../../components/SubItemSplitWise';

export default function FriendsAddView(props) {
  const { navigation } = props;
  const textInputRef = useRef();

  const youObj = {
    id: uuidv4(),
    name: 'You',
    expense: 0,
    type: '',
    paid: 0
  }

  const [value, setValue] = useState('');
  const [valTextInput, setValTextInput] = useState(false);
  const [localArrayData, setLocalArrayData] = useState([]);
  const [localSplitWiseItemsArrayData, setlocalSplitWiseItemsArrayData] = useState([youObj]);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

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
    } else {
      localArrayData.push(youObj);
      let splitShareArray = [{
        id: uuidv4(),
        foodType: "",
        data: localSplitWiseItemsArrayData
      }]
      const newSplitWise = {
        id: uuidv4(),
        creationDate: new Date(),
        members: localArrayData,
        totalAmount: 0,
        splitWiseListItems: splitShareArray
      }
      insertNewSplitWise(newSplitWise).then().catch((error) => {
        alert(error);
      });
      setLocalArrayData([]);
      navigation.navigate(ROUTE_KEYS.SPLIT_WISE_ADD, { item: newSplitWise });
    }
  }

  const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: COLORS.primary
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
        <Lottie source={require('../../assets/126331-add-friend.json')} autoPlay loop
          style={{ height: convertHeight(170), width: convertWidth(170) }} />
      </View>

      <View style={styles.addFrendsContainer}>
        <Input
          ref={textInputRef}
          placeholder={'Add Friends'}
          textStyle={{ height: convertHeight(35) }}
          onChangeText={nextValue => {
            setValue(nextValue);
            setValTextInput(false);
          }}
          accessoryRight={<TouchableOpacity onPress={() => { onHandleAddFriends() }}>
            <AntDesign name="plussquare" size={convertHeight(20)} color={COLORS.tertiary} />
          </TouchableOpacity>} />
      </View>
      {valTextInput && <Text style={styles.errortxt}>{'Please enter a friend to add'}</Text>}

      <List numColumns={2} data={localArrayData} renderItem={renderItem} style={{ padding: convertHeight(10), backgroundColor: COLORS.primary }} />

      {!isKeyboardVisible && <Button onPress={() => { onSubmitAddFriends() }} style={styles.submitBtn}>{EN_IN.submit}</Button>}
    </View>
  )
}