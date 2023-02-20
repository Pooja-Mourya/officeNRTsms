import {StyleSheet, Text, View, TouchableOpacity, Alert} from 'react-native';
import React, {useState, useEffect} from 'react';
import {fonts} from '../../../assets/Assets';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Ionicons from 'react-native-vector-icons/Ionicons';
import InputValidation from '../../../components/InputValidation';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import APIService from '../../../Services/APIService';
import Constants from '../../../constant/Constants';
import {useSelector, useDispatch} from 'react-redux';
import CustomButton from '../../../components/CustomButton';
import BaseContainer from '../../../components/BaseContainer';
import TransparentLoader from '../../../components/TransparentLoader';
import {getProportionalFontSize} from '../../../Services/CommonMethods';
import Colors from '../../../assets/Colors';
import DropDownComp from '../../../components/DropDownComp';

const SenderId = props => {
  let {navigation} = props;
  let routeParm = props?.route?.params ?? {};

  const formFieldsKeys = {
    company_name: 'company_name',
    entity_id: 'entity_id',
    header_id: 'header_id',
    sender_id: 'sender_id',
    // status: 'status',
    user_id: 'user_id',
  };
  const initialValues = {
    [formFieldsKeys.company_name]: '',
    [formFieldsKeys.entity_id]: '',
    [formFieldsKeys.header_id]: '',
    [formFieldsKeys.sender_id]: '',
    // [formFieldsKeys.status]: '',
    [formFieldsKeys.user_id]: '',
  };
  const initialValidationObj = {
    [formFieldsKeys.company_name]: {
      invalid: false,
      title: 'Invalid Company Name',
    },
    [formFieldsKeys.entity_id]: {
      invalid: false,
      title: 'Invalid manager entity id',
    },
    [formFieldsKeys.header_id]: {
      invalid: false,
      title: 'Invalid Header id',
    },
    [formFieldsKeys.sender_id]: {
      invalid: false,
      title: 'max length 6',
    },
    // [formFieldsKeys.status]: {
    //   invalid: false,
    //   title: 'Invalid status',
    // },
    [formFieldsKeys.user_id]: {
      invalid: false,
      title: 'Invalid user id',
    },
  };

  const validation = () => {
    let isValid = true;
    let validationObjTemp = {...validationObj};
    for (let key in formFieldsKeys) {
      if (formFieldsKeys.hasOwnProperty(key)) {
        let value = formValues[key];
        if(userLogin?.userType==1||userLogin?.userType==2){
        if (value === '' && key !== formFieldsKeys.user_id) {
          validationObjTemp[formFieldsKeys[key]].invalid = true;
          isValid = false;
        }}else{
          if (value === '') {
            validationObjTemp[formFieldsKeys[key]].invalid = true;
            isValid = false;
          }
        }
      }
    } 
    setValidationObj(validationObjTemp);
    return isValid;
  };

  // REDUX hooks
  const userLogin = useSelector(state => state.global_store.userLogin);
  const [validationObj, setValidationObj] = useState({...initialValidationObj});
  const [formValues, setFormValues] = useState(initialValues);
  const [isLoading, setIsLoading] = useState(false);
  const [assignUserData, setAssignUserData] = useState([]);

  const removeErrorTextForInputThatUserIsTyping = uniqueKey => {
    let tempValidationObj = {...validationObj};
    tempValidationObj[uniqueKey] = initialValidationObj[uniqueKey];
    setValidationObj(tempValidationObj);
  };

  const AddManageSenderIdAPI = async () => {
    setIsLoading(true);
    let params = {
      user_id:  formValues?.user_id.id ?? userLogin?.id,
      company_name: formValues?.company_name,
      entity_id: formValues?.entity_id,
      sender_id: formValues?.sender_id,
      header_id: formValues?.header_id,
      //   status: formValues?.status ? '1' : '0',
    };
    let url = Constants.apiEndPoints.manageSenderId;
    console.log(url, params);
    // return;
    let response = await APIService.postData(
      url,
      params,
      userLogin.access_token,
      null,
      'AddManageSenderId',
    );
    if (!response.errorMsg) {
      setIsLoading(false);
      navigation.goBack();
      Alert.alert('Success', 'Sender Id Added Successfully');
    } else {
      setIsLoading(false);
      Alert.alert(
        Constants.danger,
        response.errorMsg ?? 'something went wrong',
      );
    }
  };

  const updateManageSenderIdData = async () => {
    setIsLoading(true);
    let url =
      Constants.apiEndPoints.manageSenderId + '/' + routeParm?.itemId?.id;
    let params = {
      user_id:  formValues?.user_id?? userLogin?.id,
      company_name: formValues?.company_name,
      entity_id: formValues?.entity_id,
      sender_id: formValues?.sender_id,
      header_id: formValues?.header_id,
    //   status: formValues?.status ? '1' : '0',
    };
    console.log(url, params);
    // return
    let response = await APIService.putData(
      url,
      params,
      userLogin.access_token,
      null,
      'manageSenderIdUpdate',
    );
    if (!response.errorMsg) {
      setIsLoading(false);
      navigation.navigate('SenderIdList');
      Alert.alert(Constants.success, 'Updated Successfully');
    } else {
      setIsLoading(false);
      Alert.alert(
        Constants.danger,
        response.errorMsg ?? 'Something went wrong',
      );
    }
  };

  const assignUserDataAPI = async () => {
    let params = {};
    let url = Constants.apiEndPoints.users;
    // console.log(url, params)
    let response = await APIService.postData(
      url,
      params,
      userLogin.access_token,
      null,
      'DltTemplateUsersAPI',
    );
    if (!response.errorMsg) {
      console.log('dltUserApi', JSON.stringify(response.data.data));
      setAssignUserData(response.data.data);
    } else {
      Alert.alert(response.errorMsg);
    }
  };
 

  useEffect(() => {
    if (routeParm?.itemId) {
      setFormValues({
        ...formValues,
        user_id: routeParm?.itemId.user_id ?? '',
        company_name: routeParm?.itemId?.company_name,
        entity_id: routeParm?.itemId?.entity_id,
        sender_id: routeParm?.itemId?.sender_id,
        header_id: routeParm?.itemId?.header_id,
      });
    }
    assignUserDataAPI();
  }, []);

  const handleInputChange = (key, value) => {
    setFormValues({
      ...formValues,
      [key]: value,
    });
  };

  return (
    <BaseContainer
      title={routeParm?.itemId ? 'Update Sender Id' : 'Add Sender Id'}
      leftIcon="arrow-back"
      onPressLeftIcon={() => navigation.goBack()}>
      <TransparentLoader isLoading={isLoading} />
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom:100}}
      >
        <View style={styles.SenderIdContainer}>
         {(userLogin?.userType==0||userLogin?.userType==3)&&(<DropDownComp
            data={assignUserData}
            validationObj={validationObj}
            uniqueKey={formFieldsKeys.user_id}
            onPressItem={item => {
              handleInputChange(formFieldsKeys.user_id, item);
              removeErrorTextForInputThatUserIsTyping(formFieldsKeys.user_id);
            }}
            value={formValues[formFieldsKeys.user_id]}
            keyToShowData="name"
            keyToCompareData="id"
            placeHolder="User" 
            isSearch={'Search user ...'}
          /> )} 
           
          <InputValidation
            validationObj={validationObj}
            uniqueKey={formFieldsKeys.company_name}
            placeHolder={'Company Name'}
            label={'Company Name'}
            value={formValues[formFieldsKeys.company_name]}
            onChangeText={text => {
              removeErrorTextForInputThatUserIsTyping(
                formFieldsKeys.company_name,
              );
              handleInputChange(formFieldsKeys.company_name, text);
            }}
          />
          <InputValidation
            validationObj={validationObj}
            uniqueKey={formFieldsKeys.entity_id}
            placeHolder={'Entity ID'}
            keyboardType="numeric"
            label={'Entity ID'}
            value={formValues[formFieldsKeys.entity_id]}
            onChangeText={text => {
              removeErrorTextForInputThatUserIsTyping(formFieldsKeys.entity_id);
              handleInputChange(formFieldsKeys.entity_id, text);
            }}
          />
          <InputValidation
            validationObj={validationObj}
            uniqueKey={formFieldsKeys.sender_id}
            placeHolder={'Sender ID'}
            keyboardType="numeric"
            label={'Sender ID'}
            maxLength={6}
            value={formValues[formFieldsKeys.sender_id]}
            onChangeText={text => {
              removeErrorTextForInputThatUserIsTyping(formFieldsKeys.sender_id);
              handleInputChange(formFieldsKeys.sender_id, text);
            }}
          />
          <InputValidation
            validationObj={validationObj}
            uniqueKey={formFieldsKeys.header_id}
            placeHolder={'Header ID'}
            keyboardType="numeric"
            label={'Header ID'}
            value={formValues[formFieldsKeys.header_id]}
            onChangeText={text => {
              removeErrorTextForInputThatUserIsTyping(formFieldsKeys.header_id);
              handleInputChange(formFieldsKeys.header_id, text);
            }}
          />
          {/*   <Text
            style={{
              fontSize: getProportionalFontSize(14),
              color: Colors.primary,
              marginTop: 10,
            }}>
            Status*
          </Text>
        <View style={styles.checkBoxView}>
            <BouncyCheckbox
              size={20}
              fillColor={'#ffaa33'}
              unfillColor={'white'}
              iconStyle={{borderColor: '#ffaa33'}}
              isChecked={formValues.status}
              onPress={value => {
                removeErrorTextForInputThatUserIsTyping(formFieldsKeys.status);
                handleInputChange(formFieldsKeys.status, value);
              }}
            />
            <Text style={styles.saveAsTemplate}>
              {' '}
              Status ({formValues?.status ? 'Active' : 'Inactive'})
            </Text>
          </View>
          {validationObj[formFieldsKeys.status].invalid && (
            <Text style={styles.errorText}>
              {validationObj[formFieldsKeys.status].title}
            </Text>
          )} */}

          <CustomButton
            onPress={() => {
              if (validation()) {
                if (routeParm?.itemId) {
                  updateManageSenderIdData();
                } else { 
                  AddManageSenderIdAPI();
                }
              } else {
                Alert.alert(Constants.danger,"Validation Failed");
              }
            }}
            title={routeParm?.itemId ? 'Update' : 'Add'}
          />
        </View>
      </KeyboardAwareScrollView>
    </BaseContainer>
  );
};

export default SenderId;

const styles = StyleSheet.create({
  SenderIdContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  inputContainer: {
    // flex: 1,
    justifyContent: 'space-between',
    marginHorizontal: 20,
    flexDirection: 'row',
    marginTop: 20,
    elevation: 12,
    backgroundColor: '#fff5e6',
    padding: 10,
    width: 300,
  },
  creditBtn: {
    width: '45%',
    fontFamily: fonts.bold,
    backgroundColor: '#ffaa33',
    marginHorizontal: 20,
    // top: 10,
    // l,opacity;[.p]
    marginVertical: 20,
    padding: 10,
    fontSize: 20,
    color: 'white',
    borderRadius: 50,
  },
  modalView: {
    margin: 15,
    backgroundColor: 'white',
    borderRadius: 20,
    // padding: 35,
    // alignItems: "center",
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    padding: 6,
  },

  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  button: {
    padding: 10,
    elevation: 2,
    backgroundColor: '#ffad33',
    borderRadius: 5,
  },
  checkBoxView: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ffaa33',
    borderRadius: 5,
    paddingVertical: 17,
  },
  saveAsTemplate: {marginHorizontal: 20},
  errorText: {
    color: Colors.red,
    fontSize: getProportionalFontSize(14),
    marginTop: 5,
  },
});
