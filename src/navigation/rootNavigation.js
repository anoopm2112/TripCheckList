import * as React from 'react';
import { Image } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useTranslation } from "react-i18next";
import { useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
// Custom Imports
import { ROUTE_KEYS } from './constants';
import {
  CheckItemListView, CheckListAddView, WriteUpAboutTripView, ListParticularCheckItem, WelcomeScreen,
  CheckItemHistoryView, FriendsAddView, SplitWiseAddView, SplitWiseListView, DashboardScreen,
  SettingsView, TouristPlaceList, TouristDistrict, TouristStateList, TouristLocationMap,
  CostPlanner, AboutUs, ContactUsView, HelpView, VideoModal, CreateNewPlaces, AllPlaceList, SplashScreen,
  SyncLocalToServer
} from '../views';
import { convertHeight, convertWidth } from '../common/utils/dimentionUtils';
import AssetIconsPack from '../assets/IconProvide';
import Colors from '../common/Colors';
import i18next from 'i18next';
import { Context as AuthContext } from '../context/AuthContext';

const { Navigator, Screen } = createStackNavigator();

export default function rootNavigation(props) {
  const { t } = useTranslation();
  const { state } = React.useContext(AuthContext);
  const isDarkMode = useSelector(state => state?.settings?.isDarkMode);
  const blackToWhite = isDarkMode ? Colors.black : Colors.primary;
  const WhiteToblack = isDarkMode ? Colors.primary : Colors.black;
  const rightLogoImage = () => (
    <Image style={{ height: convertHeight(30), width: convertWidth(35), marginRight: convertHeight(8) }} source={AssetIconsPack.icons.app_logo_side_image} />
  );

  const getScreenOptions = ({ title }) => {
    return {
      title: title,
      headerRight: () => rightLogoImage(),
      headerStyle: { backgroundColor: blackToWhite },
      headerTitleStyle: {
        color: WhiteToblack,
        textTransform: 'uppercase',
        fontSize:
          (i18next.language === 'ml' || i18next.language === 'ta') ?
            convertHeight(11) : convertHeight(15)
      },
      headerTintColor: WhiteToblack,
      headerShadowVisible: false
    };
  };

  return (
    <NavigationContainer theme={{ colors: { background: isDarkMode ? Colors.black : Colors.primary } }}>
      <Navigator>
        {state?.userToken == "" ? (
          <>
            <Screen options={{ headerShown: false }} name={ROUTE_KEYS.SPLASH_SCREEN} component={SplashScreen} />
            <Screen options={{ headerShown: false }} name={ROUTE_KEYS.WELCOME_SCREEN} component={WelcomeScreen} />
          </>
        ) : (
          <>
            <Screen options={{ headerShown: false }} name={ROUTE_KEYS.DASHBOARD_SCREEN} component={DashboardScreen} />
            <Screen options={getScreenOptions({ title: t('Dashboard:app_name') })} name={ROUTE_KEYS.CHECK_ITEM_LIST} component={CheckItemListView} />
            <Screen options={getScreenOptions({ title: t('checklist:header:Add_Checklist_Items') })} name={ROUTE_KEYS.CHECK_ITEM_ADD} component={CheckListAddView} />
            <Screen options={getScreenOptions({ title: t('checklist:header:Add_Checklist') })} name={ROUTE_KEYS.WRITEUP_ABOUT_TRIP} component={WriteUpAboutTripView} />
            <Screen options={getScreenOptions({ title: t('Dashboard:app_name') })} name={ROUTE_KEYS.LIST_PARTICULAR_CHECK_ITEM} component={ListParticularCheckItem} />
            <Screen options={getScreenOptions({ title: t('History:history') })} name={ROUTE_KEYS.CHECK_ITEM_HISTORY_LIST} component={CheckItemHistoryView} />
            <Screen options={getScreenOptions({ title: t('Splitwise:add_friends') })} name={ROUTE_KEYS.FRIENDS_ADD} component={FriendsAddView} />
            <Screen options={getScreenOptions({ title: t('Dashboard:actions:money_splitter') })} name={ROUTE_KEYS.SPLIT_WISE_ADD} component={SplitWiseAddView} />
            <Screen options={getScreenOptions({ title: t('Dashboard:actions:money_splitter') })} name={ROUTE_KEYS.SPLIT_WISE_LIST} component={SplitWiseListView} />
            <Screen options={getScreenOptions({ title: t('Settings:setting') })} name={ROUTE_KEYS.SETTINGS} component={SettingsView} />
            <Screen options={getScreenOptions({ title: t('Dashboard:actions:tourist_places') })} name={ROUTE_KEYS.TOURIST_PLACE} component={TouristPlaceList} />
            <Screen options={getScreenOptions({ title: t('Touristplace:district') })} name={ROUTE_KEYS.TOURIST_DISTRICT} component={TouristDistrict} />
            <Screen options={getScreenOptions({ title: t('Touristplace:state') })} name={ROUTE_KEYS.TOURIST_STATES} component={TouristStateList} />
            <Screen options={getScreenOptions({ title: t('Touristplace:map') })} name={ROUTE_KEYS.TOURIST_LOCATION} component={TouristLocationMap} />
            <Screen options={getScreenOptions({ title: t('CostPlanner:costPlanner') })} name={ROUTE_KEYS.COST_PLANNER} component={CostPlanner} />
            <Screen options={{ headerShown: false }} name={ROUTE_KEYS.ABOUT_US} component={AboutUs} />
            <Screen options={getScreenOptions({ title: t('ContactUs:contactUs') })} name={ROUTE_KEYS.CONTACT_US} component={ContactUsView} />
            <Screen options={getScreenOptions({ title: t('Help:takeTour') })} name={ROUTE_KEYS.HELP_VIEW} component={HelpView} />
            <Screen options={{ headerShown: false }} name={ROUTE_KEYS.VIDEO_VIEW} component={VideoModal} />
            <Screen options={getScreenOptions({ title: t('Touristplace:add_new_place') })} name={ROUTE_KEYS.CREATE_NEW_PLACE} component={CreateNewPlaces} />
            <Screen options={getScreenOptions({ title: t('Touristplace:list_all_place') })} name={ROUTE_KEYS.ALL_PLACE_LIST} component={AllPlaceList} />
            <Screen options={getScreenOptions({ title: t('Settings:local_data_sync') })} name={ROUTE_KEYS.SYNC_LOCAL_SERVER} component={SyncLocalToServer} />
          </>
        )}
      </Navigator>
    </NavigationContainer>
  );
}