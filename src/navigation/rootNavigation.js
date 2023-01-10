import * as React from 'react';
import { Image } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
// Custom Imports
import { ROUTE_KEYS } from './constants';
import { 
  CheckItemListView, CheckListAddView, WriteUpAboutTripView, ListParticularCheckItem, WelcomeScreen, 
  CheckItemHistoryView, FriendsAddView, SplitWiseAddView, SplitWiseListView
} from '../views';
import { convertHeight, convertWidth } from '../common/utils/dimentionUtils';

const { Navigator, Screen } = createStackNavigator();

export default function rootNavigation(props) {

  const rightLogoImage = () => (
    <Image style={{ height: convertHeight(30), width: convertWidth(35), marginRight: convertHeight(8) }} source={require('../assets/side_logo.jpg')} />
  )

  return (
    <Navigator initialRouteName={props.props == null ? ROUTE_KEYS.WELCOME_SCREEN : ROUTE_KEYS.CHECK_ITEM_LIST}
    // screenOptions={{ headerShown: false, title: 'TRIP CHECKLIST',  }}
    >
      <Screen options={{ headerShown: false }} name={ROUTE_KEYS.WELCOME_SCREEN} component={WelcomeScreen} />
      <Screen options={{ title: 'TRIP CHECKLIST', headerRight: () => rightLogoImage(), headerLeft: false }} name={ROUTE_KEYS.CHECK_ITEM_LIST} component={CheckItemListView} />
      <Screen options={{ title: 'ADD CHECKLIST ITEMS', headerRight: () => rightLogoImage() }} name={ROUTE_KEYS.CHECK_ITEM_ADD} component={CheckListAddView} />
      <Screen options={{ title: 'ADD CHECKLIST', headerRight: () => rightLogoImage() }} name={ROUTE_KEYS.WRITEUP_ABOUT_TRIP} component={WriteUpAboutTripView} />
      <Screen options={{ title: 'TRIP CHECKLIST', headerRight: () => rightLogoImage() }} name={ROUTE_KEYS.LIST_PARTICULAR_CHECK_ITEM} component={ListParticularCheckItem} />
      <Screen options={{ title: 'TRIP HISTORY', headerRight: () => rightLogoImage() }} name={ROUTE_KEYS.CHECK_ITEM_HISTORY_LIST} component={CheckItemHistoryView} />
      <Screen options={{ title: 'ADD FRIENDS', headerRight: () => rightLogoImage() }} name={ROUTE_KEYS.FRIENDS_ADD} component={FriendsAddView} />
      <Screen options={{ title: 'ADD SPLITWISE', headerRight: () => rightLogoImage() }} name={ROUTE_KEYS.SPLIT_WISE_ADD} component={SplitWiseAddView} />
      <Screen options={{ title: 'SPLITWISE', headerRight: () => rightLogoImage() }} name={ROUTE_KEYS.SPLIT_WISE_LIST} component={SplitWiseListView} />
    </Navigator>
  );
}