import { PermissionsAndroid, Platform } from 'react-native';
import { check, RESULTS, PERMISSIONS, requestMultiple } from 'react-native-permissions';

export const locationPermissionCheck = async () => {
    let checkStatus;
    checkStatus = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
    if (checkStatus) {
        return checkStatus;
    }
}

export const locationPermissionRequest = async () => {
    let requestStatus;
    if (Platform.OS === 'android') {
        requestStatus = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
    } else if (Platform.OS === 'ios') {
        requestStatus = await requestMultiple([PERMISSIONS.IOS.LOCATION_WHEN_IN_USE, PERMISSIONS.IOS.LOCATION_ALWAYS]);
    }
    return requestStatus;
}