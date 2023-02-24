import * as React from 'react';
import { Image } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useTranslation } from "react-i18next";
import { useSelector } from 'react-redux';
// Custom Imports
import { ROUTE_KEYS } from './constants';
import {
  CheckItemListView, CheckListAddView, WriteUpAboutTripView, ListParticularCheckItem, WelcomeScreen,
  CheckItemHistoryView, FriendsAddView, SplitWiseAddView, SplitWiseListView, DashboardScreen,
  PostList, SettingsView
} from '../views';
import { convertHeight, convertWidth } from '../common/utils/dimentionUtils';
import AssetIconsPack from '../assets/IconProvide';
import Colors from '../common/Colors';

const { Navigator, Screen } = createStackNavigator();

export default function rootNavigation(props) {
  const { t } = useTranslation();
  const isDarkMode = useSelector(state => state?.settings?.isDarkMode);
  const blackToWhite = isDarkMode ? Colors.black : Colors.primary;
  const WhiteToblack = isDarkMode ? Colors.primary : Colors.black
  const rightLogoImage = () => (
    <Image style={{ height: convertHeight(30), width: convertWidth(35), marginRight: convertHeight(8) }} source={AssetIconsPack.icons.app_logo_side_image} />
  )

  return (
    <Navigator initialRouteName={props.props == null ? ROUTE_KEYS.WELCOME_SCREEN : ROUTE_KEYS.DASHBOARD_SCREEN}
    // screenOptions={{ headerShown: false, title: 'TRIP CHECKLIST',  }}
    >
      <Screen options={{ headerShown: false }} name={ROUTE_KEYS.WELCOME_SCREEN} component={WelcomeScreen} />
      <Screen options={{ headerShown: false }} name={ROUTE_KEYS.DASHBOARD_SCREEN} component={DashboardScreen} />
      <Screen options={{ title: t('Dashboard:app_name'), headerRight: () => rightLogoImage() }} name={ROUTE_KEYS.CHECK_ITEM_LIST} component={CheckItemListView} />
      <Screen options={{ title: 'ADD CHECKLIST ITEMS', headerRight: () => rightLogoImage() }} name={ROUTE_KEYS.CHECK_ITEM_ADD} component={CheckListAddView} />
      <Screen options={{ title: 'ADD CHECKLIST', headerRight: () => rightLogoImage() }} name={ROUTE_KEYS.WRITEUP_ABOUT_TRIP} component={WriteUpAboutTripView} />
      <Screen options={{ title: t('Dashboard:app_name'), headerRight: () => rightLogoImage() }} name={ROUTE_KEYS.LIST_PARTICULAR_CHECK_ITEM} component={ListParticularCheckItem} />
      <Screen options={{ title: t('History:history'), headerRight: () => rightLogoImage() }} name={ROUTE_KEYS.CHECK_ITEM_HISTORY_LIST} component={CheckItemHistoryView} />
      <Screen options={{ title: t('Splitwise:add_friends'), headerRight: () => rightLogoImage() }} name={ROUTE_KEYS.FRIENDS_ADD} component={FriendsAddView} />
      <Screen options={{ title: t('Dashboard:actions:money_splitter'), headerRight: () => rightLogoImage() }} name={ROUTE_KEYS.SPLIT_WISE_ADD} component={SplitWiseAddView} />
      <Screen options={{ title: t('Dashboard:actions:money_splitter'), headerRight: () => rightLogoImage() }} name={ROUTE_KEYS.SPLIT_WISE_LIST} component={SplitWiseListView} />
      <Screen options={{ title: 'POST', headerRight: () => rightLogoImage() }} name={ROUTE_KEYS.FETCH_POST} component={PostList} />
      <Screen options={{ title: t('Settings:setting'), headerRight: () => rightLogoImage(), 
        headerStyle: { backgroundColor: blackToWhite }, headerTitleStyle: { color: WhiteToblack }, 
        headerTintColor: WhiteToblack }} name={ROUTE_KEYS.SETTINGS} component={SettingsView} />
    </Navigator>
  );
}