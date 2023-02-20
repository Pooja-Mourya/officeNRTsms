import {
  StyleSheet,
  Text,
  View,
  Modal,
  FlatList,
  Alert,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {fonts} from '../../assets/Assets';
import BaseContainer from '../../components/BaseContainer';
import APIService from '../../Services/APIService';
import Constants from '../../constant/Constants';
import {useSelector} from 'react-redux';
import EmptyList from '../../components/EmptyList';
import {FAB, Portal} from 'react-native-paper';
import ExportBySenderId from './ExportBySenderId';
import ExportByNumber from './ExportByNumber';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Colors from '../../assets/Colors';
import moment from 'moment';
import InputValidation from '../../components/InputValidation';
import DropDownComp from '../../components/DropDownComp';
import ListingCard from '../../components/ListingCard';
import {getProportionalFontSize} from '../../Services/CommonMethods';

const MobileReport = ({navigation}) => {
  const formFieldsKeys = {
    mobile: 'mobile',
    from_date: 'from_date',
    to_date: 'to_date',
    user_id: 'user_id',
  };

  const initialValues = {
    [formFieldsKeys.mobile]: '',
    [formFieldsKeys.from_date]: '',
    [formFieldsKeys.to_date]: '',
    [formFieldsKeys.user_id]: '',
  };

  const initialValidationObj = {
    [formFieldsKeys.mobile]: {
      invalid: false,
      title: 'Invalid mobile number',
    },
    [formFieldsKeys.from_date]: {
      invalid: false,
      title: 'Invalid from date',
    },
    [formFieldsKeys.to_date]: {
      invalid: false,
      title: 'Invalid to date',
    },
    [formFieldsKeys.user_id]: {
      invalid: false,
      title: 'Invalid user id',
    },
  };

  const validation = () => {
    let valid = true;
    let validationObj = {...initialValidationObj};
    if(formValues[formFieldsKeys.mobile] === ''|| formValues[formFieldsKeys.mobile].length < 10){
      validationObj[formFieldsKeys.mobile].invalid = true;
      valid = false;
    }
    if(formValues[formFieldsKeys.user_id] === '' || formValues[formFieldsKeys.user_id].length<1) {
      validationObj[formFieldsKeys.user_id].invalid = true;
      valid = false;
    }
    if(formValues?.from_date && formValues?.to_date){
      if(formValues.from_date > formValues.to_date || formValues.to_date < formValues.from_date) {
        validationObj[formFieldsKeys.from_date].invalid = true;
        validationObj[formFieldsKeys.to_date].invalid = true;
        valid = false;
      } 
    }

    setValidationObj(validationObj);
    return valid;
  };

  const [formValues, setFormValues] = useState(initialValues);
  const [listData, setListData] = useState([]);
  const [senderIdModal, setSenderIdModal] = useState(false);
  const [numberModal, setNumberModal] = useState(false);
  const [openFAB, setOpenFAB] = useState(false);
  const [userData, setUserData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [visibleTo, setVisibleTo] = useState(false);
  const userLogin = useSelector(state => state.global_store.userLogin);
  const [iniitialModal, setIniitialModal] = useState(true);
  const [validationObj, setValidationObj] = useState(initialValidationObj);

  const reportByMobileAPI = async () => {
    let params = {
      ...formValues, 
    };
    let url = Constants.apiEndPoints.reportByMobile;
    console.log('params', params, 'URL', url);
    // return
    let response = await APIService.postData(
      url,
      params,
      userLogin.access_token,
      null,
      'reportByMobileAPI',
    );
    if (!response.errorMsg) {
      setIniitialModal(false);
      setListData(response?.data?.data);
      setFormValues(initialValues);
      listData.length == 0 && Alert.alert('Ops!', 'No Data Found');
    } else {
      Alert.alert(
        Constants.danger,
        response.errorMsg ?? Constants.somethingWentWrong,
      );
    }
  };

  useEffect(() => {
    UserTemplateAPI();
  }, []);

  const UserTemplateAPI = async () => {
    let url = Constants.apiEndPoints.users;
    let response = await APIService.postData(
      url,
      {},
      userLogin.access_token,
      null,
      'DltTemplateUsersAPI',
    );
    if (!response.errorMsg) {
      setUserData(response?.data?.data);
    } else {
      Alert.alert(
        Constants.danger,
        response.errorMsg ?? Constants.somethingWentWrong,
      );
    }
  };

  const handleInputChange = (key, value) => {
    setFormValues({
      ...formValues,
      [key]: value,
    });
  };
  const removeErrorTextForInputThatUserIsTyping = key => {
    let temp = validationObj;
    temp[key].invalid = false;
    setValidationObj(temp);
  };

  return (
    <BaseContainer
      title="Mobile Report List"
      leftIcon="arrow-back"
      onPressLeftIcon={() => navigation.goBack()}
      rightIcon="filter-list"
      onPressRightIcon={() => setIniitialModal(true)}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={iniitialModal}
        onRequestClose={() => setIniitialModal(false)}>
        <View style={styles.modalStyle2}>
          <View style={styles.modalStyle}>
            <AntDesign
              name="close"
              size={20}
              color={'#000'}
              style={styles.closeIcon}
              onPress={() => setIniitialModal(false)}
            />
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: 10,
              }}
              style={{width: '100%'}}>
              {userLogin?.userType !== 2 && (
                <DropDownComp
                  validationObj={validationObj}
                  uniqueKey={formFieldsKeys.user_id}
                  data={userData}
                  value={formValues[formFieldsKeys.user_id]}
                  onPressItem={item => {
                    handleInputChange(formFieldsKeys.user_id, item);   
                    removeErrorTextForInputThatUserIsTyping(
                      formFieldsKeys.user_id,
                    );
                  }}
                  keyToShowData="username"
                  keyToCompareData="id"
                  placeHolder="Select User"
                  isSearch="Search User..."
                  multiSelect={true}
                />
              )}

              <InputValidation
                validationObj={validationObj}
                uniqueKey={formFieldsKeys.mobile}
                maxLength={10}
                placeHolder={'Mobile Number'}
                label={'Mobile Number'}
                value={formValues[formFieldsKeys.mobile]}
                onChangeText={text => {
                  handleInputChange(formFieldsKeys.mobile, text);
                  removeErrorTextForInputThatUserIsTyping(
                    formFieldsKeys.mobile,
                  );
                }}
                keyboardType={'numeric'}
              />
              <InputValidation
                editable={false}
                validationObj={validationObj}
                uniqueKey={formFieldsKeys.from_date}
                label={'From'}
                placeHolder="From"
                value={formValues[formFieldsKeys.from_date]}
                onChangeText={text => {
                  handleInputChange(formFieldsKeys.from_date, text);
                  removeErrorTextForInputThatUserIsTyping(
                    formFieldsKeys.from_date,
                  );
                }}
                iconRight={'calendar'}
                onPressIcon={() => setVisible(true)}
              />
              <DateTimePickerModal
                isVisible={visible}
                mode="date"
                onConfirm={date => {
                  setFormValues({
                    ...formValues,
                    [formFieldsKeys.from_date]:
                      moment(date).format('YYYY-MM-DD'),
                  });
                  removeErrorTextForInputThatUserIsTyping(
                    formFieldsKeys.from_date,
                  );
                  setVisible(false);
                }}
                onCancel={() => setVisible(false)}
              />
              <InputValidation
                editable={false}
                validationObj={validationObj}
                uniqueKey={formFieldsKeys.to_date}
                label={'To'}
                placeHolder="To"
                value={formValues[formFieldsKeys.to_date]}
                onChangeText={text => {
                  handleInputChange(formFieldsKeys.to_date, text);
                  removeErrorTextForInputThatUserIsTyping(
                    formFieldsKeys.to_date,
                  );
                }}
                iconRight={'calendar'}
                onPressIcon={() => setVisibleTo(true)}
              />
              <DateTimePickerModal
                isVisible={visibleTo}
                mode="date"
                onConfirm={date => {
                  setFormValues({
                    ...formValues,
                    [formFieldsKeys.to_date]: moment(date).format('YYYY-MM-DD'),
                  });
                  removeErrorTextForInputThatUserIsTyping(formFieldsKeys.to_date);
                  setVisibleTo(false);
                }}
                onCancel={() => setVisibleTo(false)}
              />
              <View style={styles.buttonView}>
                <CustomButton
                  style={{width: '45%'}}
                  titleStyle={styles.buttonTitle}
                  title="Clear Filter"
                  onPress={() => setFormValues(initialValues)}
                />
                <CustomButton
                  style={{width: '45%'}}
                  titleStyle={styles.buttonTitle}
                  title="Apply Filter"
                  onPress={() => {
                    if (validation()) {
                      reportByMobileAPI();
                    } else {
                      Alert.alert(Constants.danger, 'Validation Error');
                    }
                  }}
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <FlatList
        data={listData}
        renderItem={({item, index}) => (
          <View key={index}>
            <ListingCard
              title={item.UserName ?? 'N/A'}
              subTitle={item.mobile ?? 'N/A'}
              showSecondaryTitle={true}
              cardLabels={item?.Status}
              CreditInfo={item?.UsedCredit ?? 'N/A'}
            />
          </View>
        )}
        ListEmptyComponent={<EmptyList />}
        contentContainerStyle={{
          paddingBottom: 200,
          padding: Constants.globalPadding,
        }}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
      />

      <FAB.Group
        style={{marginBottom: 58}}
        actions={[
          {
            icon: 'file-export',
            label: 'Export By Sender Id',
            onPress: () => setSenderIdModal(true),
          },
          {
            icon: 'file-export',
            label: 'Export By Number',
            onPress: () => setNumberModal(true),
          },
        ]}
        fabStyle={{backgroundColor: Colors.primary}}
        open={openFAB}
        icon={openFAB ? 'close' : 'calendar-export'}
        color={Colors.white}
        onStateChange={open => {
          if (openFAB) setOpenFAB(false);
          else setOpenFAB(true);
        }}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={senderIdModal}
        onRequestClose={() => setSenderIdModal(false)}>
        <View style={styles.modalStyle2}>
          <View style={styles.modalStyle}>
            <AntDesign
              name="close"
              size={20}
              color={'#000'}
              style={styles.closeIcon}
              onPress={() => setSenderIdModal(false)}
            />
            <ExportBySenderId setSenderIdModal={setSenderIdModal} />
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={numberModal}
        onRequestClose={() => setNumberModal(false)}>
        <View style={styles.modalStyle2}>
          <View style={styles.modalStyle}>
            <AntDesign
              name="close"
              size={20}
              color={'#000'}
              style={styles.closeIcon}
              onPress={() => setNumberModal(false)}
            />

            <ExportByNumber
              numberModal={numberModal}
              setNumberModal={setNumberModal}
            />
          </View>
        </View>
      </Modal>
    </BaseContainer>
  );
};

export default MobileReport;

const styles = StyleSheet.create({
  cartContainer: {
    backgroundColor: '#fff5e6',
    elevation: 8,
    borderRadius: 10,
    margin: 10,
  },
  buttonTitle: {
    fontSize: getProportionalFontSize(14),
    lineHeight: 20,
  },
  headerText: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 8,
  },
  buttonView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  modalStyle: {
    width: '90%',
    height: '60%',
    borderRadius: 20,
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerTextStyle: {
    fontFamily: fonts.bold,
    fontWeight: '900',
  },
  useHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 8,
    padding: 10,
    fontFamily: fonts.medium,
    color: '#995c00',
  },

  userTextStyle: {
    fontFamily: fonts.semiBold,
  },
  closeIcon: {
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 50,
    padding: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: "center",
    marginVertical: 20,
    // padding: 10
  },
  modalView: {
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 22,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 100,
    marginTop: '20%',
  },
  modalStyle2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: '100%',
    height: '100%',
  },
  detailTextStyle: {
    color: Colors.black,
    backgroundColor: Colors.cardColor,
    marginTop: 10,
    padding: 8,
    fontFamily: fonts.regular,
    marginLeft: 20,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 8,
  },
});
