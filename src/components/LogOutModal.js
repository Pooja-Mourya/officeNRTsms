import {StyleSheet, Text, View, Alert} from 'react-native';
import React, {useState} from 'react';
import {getProportionalFontSize} from '../Services/CommonMethods';
import Colors from '../assets/Colors';
import Constants from '../constant/Constants';
import APIService from '../Services/APIService';
import {useSelector} from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Assets from '../assets/Assets';
import ProgressLoader from './ProgressLoader';
import CustomButton from './CustomButton';

const LogOutModal = props => {
  // redux hooks
  const UserLogin = useSelector(state => state.global_store.userLogin);
  // hooks
  const [isLoading, setIsLoading] = useState(props.isLoggingOut ? false : true);
  const logoutAPI = async () => {
    setIsLoading(true);
    let url = Constants.apiEndPoints.logout;
    let params = {};
    let response = await APIService.postData(
      url,
      params,
      UserLogin.access_token,
      null,
      'logout....Api',
    );
    if (!response.errorMsg) {
      props.logout ? props.logout() : null;
    } else {
      setIsLoading(false);
      Alert.alert(Constants.danger, response.errorMsg);
    }
  };

  if (isLoading)
    return (
      <ProgressLoader
        onActivityIndicator={true}
        onActivityIndicatorStyle={{flex: 1}}
      />
    );

  return (
    <View style={styles.mainView}>
      <View style={styles.secOneView}>
        <Text style={styles.titleStyle}>{''}</Text>
        <MaterialCommunityIcons
          onPress={() => {
            props.onRequestClose ? props.onRequestClose() : null;
          }}
          name="close-circle"
          size={getProportionalFontSize(25)}
          color={Colors.primary}
          style={styles.iconStyle}
        />
      </View>
      <Text style={styles.headingStyle}>{'log_out'}</Text>

      <View style={styles.btnViewStyle}>
        <CustomButton
          onPress={() => {
            logoutAPI();
          }}
          title={'yes'}
          style={{width: '45%'}}
        />
        <CustomButton
          onPress={() => {
            props.onRequestClose ? props.onRequestClose() : null;
          }}
          title={'no'}
          style={{width: '45%'}}
        />
      </View>
    </View>
  );
};

export default LogOutModal;

const styles = StyleSheet.create({
  titleStyle: {
    flex: 1,
    textAlign: 'right',
    fontSize: getProportionalFontSize(18),
    color: Colors.primary,
    fontFamily: Assets.fonts.bold,
  },
  headingStyle: {
    fontSize: getProportionalFontSize(20),
    color: Colors.primary,
    fontFamily: Assets.fonts.robotoBold,
    textAlign: 'center',
  },
  mainView: {flex: 1, paddingTop: 5},
  secOneView: {flexDirection: 'row', alignItems: 'center'},
  iconStyle: {flex: 0.5, textAlign: 'right'},
  btnViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});
