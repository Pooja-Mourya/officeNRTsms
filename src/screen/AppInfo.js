import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import BaseContainer from '../components/BaseContainer';
import Constants from '../constant/Constants';
import APIService from '../Services/APIService';
import {useDispatch, useSelector} from 'react-redux';
import {UserLoginAction} from '../redux/reduxSlicer';
import {Checkbox} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import {Divider} from 'react-native-paper';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Feather from 'react-native-vector-icons/Feather';
import {getProportionalFontSize} from '../Services/CommonMethods';
import InputValidation from '../components/InputValidation';
import CustomButton from '../components/CustomButton';
import moment from 'moment';
import Colors from '../assets/Colors';
import { fonts } from '../assets/Assets';

const AppInfo = props => {
  const [touch, setTouch] = React.useState(false);
  const [data, setData] = React.useState();
  const [isData, setIsdata] = React.useState();
  const [change, setChange] = React.useState('');
  const [load, setLoad] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const dispatch = useDispatch();
  const UserLogin = useSelector(state => state?.global_store?.userLogin);

  const AppKey = async () => {
    let url = Constants.apiEndPoints['user-change-api-key'];
    let response = await APIService.getData(
      url,
      UserLogin.access_token,
      null,
      'AppKey',
    );
    if (!response.errorMsg) {
      setData(response?.data?.data);
    } else {
      console.log('error', response.errorMsg);
    }
  };

  React.useEffect(() => {
    AppKey();
    IPListing();
  }, []);

  const IPListing = async () => {
    let url = Constants.apiEndPoints['ip-white-list-for-apis'];
    let response = await APIService.postData(
      url,
      {},
      UserLogin.access_token,
      null,
      'IPListing',
    );
    if (!response.errorMsg) {
      setIsdata(response?.data?.data);
    } else {
      console.log('error', response.errorMsg);
    }
  };

  const AddIP = async () => {
    setLoad(true);
    let url = Constants.apiEndPoints['ip-white-list-for-api'];
    let response = await APIService.postData(
      url,
      {ip_address: change},
      UserLogin.access_token,
      null,
      'AddIP',
    );
    if (!response.errorMsg) {
      setLoad(false);
      Alert.alert(
        Constants.success,
        response.data.message ?? 'IP Added Successfully',
      );
    } else {
      setLoad(false);
      Alert.alert(
        Constants.danger,
        response.errorMsg ?? 'Something went wrong',
      );
    }
  };

  const BoxSecurity = async () => {
    setIsLoading(true);
    let params = {is_enabled_api_ip_security: 1};

    let url = Constants.apiEndPoints['enable-additional-security'];

    let response = await APIService.postData(
      url,
      params,
      UserLogin.access_token,
      null,
      'add api key',
    );
    if (!response.errorMsg) {
      let reduxData = {...UserLogin, ...response?.data?.data};
      dispatch(UserLoginAction(reduxData));
      setIsLoading(false);
    } else {
      setIsLoading(false);
      console.log('error', response.errorMsg);
    }
  };

  const Delete = async id => {
    let url = Constants.apiEndPoints['ip-white-list-for-api'] + '/' + id;
    let response = await APIService.deleteData(
      url,
      UserLogin.access_token,
      null,
      'delete api key',
    );
    if (!response.errorMsg) {
      IPListing();
      Alert.alert(
        Constants.success,
        response?.data?.message ?? 'IP Deleted Successfully',
      );
    } else {
      Alert.alert(
        Constants.danger,
        response.errorMsg ?? 'Something went wrong',
      );
    }
  };

  return (
    <BaseContainer
      title="App Key"
      leftIcon="arrow-back"
      onPressLeftIcon={() => props.navigation.goBack()}
    >
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 20}}
      >
        <View style={styles.container}>
          <View style={styles.section}>
            <View style={styles.check}>
              <Text style={styles.Text}>Api Keys</Text>
              <TouchableOpacity style={styles.refresh} onPress={() => AppKey()}>
                <Feather name="refresh-ccw" size={15} color="#fff" />
              </TouchableOpacity>
            </View>

            <Text style={styles.view}>App Key</Text>
            <View style={styles.viewstyle}>
              <Text
                style={styles.text}
                selectable={true}
                selectionColor={Colors.green}
              >
                {data?.app_key}
              </Text>
            </View>

            <Divider style={styles.divider} />
            <Text style={styles.view}>App Secret</Text>
            <View style={styles.viewstyle}>
              <Text
                style={styles.text}
                selectable={true}
                selectionColor={Colors.green}
              >
                {data?.app_secret}
              </Text>
            </View>
          </View>
          <View style={styles.section}>
            <View style={styles.check}>
              <Text style={styles.Text}>Enable additional security</Text>
              {isLoading ? (
                <ActivityIndicator size={20} color="blue" />
              ) : (
                <Checkbox
                  status={touch ? 'checked' : 'unchecked'}
                  onPress={() => {
                    setTouch(!touch);
                    BoxSecurity();
                  }}
                />
              )}
            </View>
            <Divider style={styles.divider} />
            <Text style={styles.text}>
              System will accepts requests only from allowed IPs, and all other
              requests from any random IPs will be discarded
            </Text>
          </View>

          {touch ? (
            <View
              style={{
                padding: 12,
                width: '100%',
              }}
            >
              <InputValidation
                label="Add IP Address"
                value={change}
                onChangeText={text => setChange(text)}
                placeHolder="Enter IP Address"
              />
              {load ? (
                <ActivityIndicator size={30} color="blue" />
              ) : (
                <CustomButton
                  onPress={() => {
                    if (change.length > 0) {
                      AddIP();
                      IPListing();
                      setChange('');
                    } else {
                      Alert.alert(Constants.danger, 'Please enter IP');
                    }
                  }}
                  title={'+ Add New IP'}
                />
              )}

              <View
                style={{
                  marginTop: 20,
                }}
              >
                <View style={styles.click}>
                  <Text style={styles.head}>#</Text>
                  <Text style={styles.head}>IP ADDRESS</Text>
                  <Text style={styles.head}>CREATED AT</Text>
                  <Text style={styles.head}>ACTION</Text>
                </View>
                {Array.isArray(isData) && isData.length > 0 ? (
                  isData.map((Element, index) => {
                    const dateTime = moment(Element.created_at).format('LLL');
                    return (
                      <View
                        key={Element.id}
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-around',
                        }}
                      >
                        <Text style={styles.tableStyle}>
                          {index + 1}
                        </Text>
                        <Text style={styles.tableStyle}>
                          {Element.ip_address}
                        </Text>
                        <Text style={styles.tableStyle}>
                          {dateTime}
                        </Text>
                        <TouchableOpacity
                          onPress={() => {
                            Alert.alert(
                              'Confirm',
                              'Are you sure you want to delete',
                              [
                                {
                                  text: 'Cancel',
                                  onPress: () => console.log('Cancel Pressed'),
                                  style: 'cancel',
                                },
                                {text: 'OK', onPress: () => Delete(Element.id)},
                              ],
                            );
                          }}
                          style={styles.delete}
                        >
                          <MaterialCommunityIcons
                            name="delete"
                            size={25}
                            color="red"
                          />
                        </TouchableOpacity>
                      </View>
                    );
                  })
                ) : (
                  <View style={styles.centerView}>
                    <Text style={styles.noText}>No Data Found</Text>
                  </View>
                )}
              </View>
            </View>
          ) : null}
        </View>
      </KeyboardAwareScrollView>
    </BaseContainer>
  );
};

export default AppInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  noText: {
    fontSize: getProportionalFontSize(16),
    color: '#f50505',
  },
  section: {
    width: '95%',
    height: undefined,
    backgroundColor: '#fff',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 5,
    shadowOpacity: 0.9,
    marginHorizontal: 16,
    padding: 10,
    marginVertical: 16,
  },

  Text: {
    fontSize: getProportionalFontSize(16),
    color: '#000',
    padding: 10,
    fontWeight: '500',
    right: 10,
    fontFamily:fonts.semiBold
  },
  check: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },

  view: {
    fontSize: getProportionalFontSize(15),
    color: Colors.black,
    fontWeight: '400', 
    fontFamily:fonts.mediumItalic

  },
  viewstyle: {
    flexDirection: 'row',
    marginTop: 7,
    alignItems: 'center',
    justifyContent: 'space-between',
    left: 10,
  },
  text: {
    fontSize: getProportionalFontSize(13),
    color:  Colors.black,
    fontWeight: '400',
    padding: 5,
    fontFamily:fonts.regular

  },
  divider: {
    width: '100%',
    height: 2,
    margin: 5,
  },
  click: {
    backgroundColor: 'lightgrey',
    width: '100%',
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  refresh: {
    backgroundColor: '#FFAD33',
    width: 30,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  delete: {
    width: 30,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 7.5,
    borderRadius: 5,
  },
  head: {
    fontSize: getProportionalFontSize(14),
    color: '#000', 
    fontFamily:fonts.semiBold

  },
  centerView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  tableStyle: {fontSize: getProportionalFontSize(14), color: '#000', margin: 10},
});
