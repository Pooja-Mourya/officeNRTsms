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
// import { DltTemplateListAPI } from './DltTemplateList';
import DropDownComp from '../../../components/DropDownComp';
import TransparentLoader from '../../../components/TransparentLoader';
import Colors from '../../../assets/Colors';
import {getProportionalFontSize} from '../../../Services/CommonMethods';

const AddDltTemplate = props => {
  let {navigation} = props;
  let routeParm = props?.route?.params ?? {};

  const formFieldsKeys = {
    user: 'user',
    per_page_record: 'per_page_record',
    manage_sender_id: 'manage_sender_id',
    template_name: 'template_name',
    dlt_template_id: 'dlt_template_id',
    sender_id: 'sender_id',
    header_id: 'header_id',
    is_unicode: 'is_unicode',
    dlt_message: 'dlt_message',
    status: 'status',
    entity_id: 'entity_id',
    // "user": "user",
  };
  const initialValues = {
    [formFieldsKeys.user]: '',
    [formFieldsKeys.manage_sender_id]: '',
    [formFieldsKeys.template_name]: '',
    [formFieldsKeys.dlt_template_id]: '',
    [formFieldsKeys.sender_id]: '',
    [formFieldsKeys.is_unicode]: '',
    [formFieldsKeys.dlt_message]: '',
    [formFieldsKeys.status]: false,
  };
  //initialValidationObj[formFieldsKeys.user].invalid
  const initialValidationObj = {
    [formFieldsKeys.user]: {
      invalid: false,
      title: 'Invalid user',
    },
    [formFieldsKeys.header_id]: {
      invalid: false,
      title: 'Invalid manager sender id',
    },
    [formFieldsKeys.entity_id]: {
      invalid: false,
      title: 'Invalid manager entity id',
    },
    [formFieldsKeys.manage_sender_id]: {
      invalid: false,
      title: 'Invalid manager sender id',
    },
    [formFieldsKeys.template_name]: {
      invalid: false,
      title: 'Invalid template name',
    },
    [formFieldsKeys.dlt_template_id]: {
      invalid: false,
      title: 'Invalid dlt template id',
    },
    [formFieldsKeys.sender_id]: {
      invalid: false,
      title: 'Invalid sender id , min length more then six',
    },
    [formFieldsKeys.is_unicode]: {
      invalid: false,
      title: 'Invalid is unicode',
    },
    [formFieldsKeys.dlt_message]: {
      invalid: false,
      title: 'Invalid dlt message',
    },
    [formFieldsKeys.status]: {
      invalid: false,
      title: 'Invalid status',
    },
  };

  const validation = () => {
    let isValid = true;
    let validationObjTemp = {...validationObj};
    for (let [key, value] of Object.entries(validationObjTemp)) {
      if (key === formFieldsKeys.sender_id) {
        if (formValues[key].length < 6) {
          value.invalid = true;
          isValid = false;
        }
      } else if (key === formFieldsKeys.status) {
        value.invalid = false;
      } else if (key === formFieldsKeys.is_unicode) {
        value.invalid = false;
      } else if (formValues[key] === '') {
        validationObjTemp[key].invalid = true;
        isValid = false;
      }
    }
    setValidationObj(validationObjTemp);
    return isValid;
  };
  // REDUX hooks
  const userLogin = useSelector(state => state.global_store.userLogin);
  // console.log('userLogin', userLogin)
  // useState hooks
  const [validationObj, setValidationObj] = useState({...initialValidationObj});
  const [formValues, setFormValues] = useState(initialValues);
  const [userData, setUserData] = useState([]);
  const [userSenderIdData, setUserSenderIdData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const removeErrorTextForInputThatUserIsTyping = uniqueKey => {
    let tempValidationObj = {...validationObj};
    tempValidationObj[uniqueKey] = initialValidationObj[uniqueKey];
    setValidationObj(tempValidationObj);
  };

  const DltUserTemplateAPI = async () => {
    let url = Constants.apiEndPoints.users;
    let response = await APIService.postData(
      url,
      {},
      userLogin.access_token,
      null,
      'DltTemplateUsersAPI',
    );
    if (!response.errorMsg) {
      setUserData(response.data.data);
    } else {
      Alert.alert(response.errorMsg);
    }
  };
  const DltTemplateManageSenderIdAPI = async id => {
    let url = Constants.apiEndPoints.ManageSenderId;
    let response = await APIService.postData(
      url,
      {user_id: id},
      userLogin.access_token,
      null,
      'DltTemplateManageSenderIdAPI',
    );
    if (!response.errorMsg) {
      setUserSenderIdData(response.data.data);
    } else {
      Alert.alert(
        Constants.danger,
        response.errorMsg ?? 'Something went wrong',
      );
    }
  };

  const AddDltTemplateAPI = async () => {
    setIsLoading(true);
    let params = {
      user_id: formValues?.user?.id,
      manage_sender_id: formValues?.manage_sender_id.id,
      template_name: formValues?.template_name,
      dlt_template_id: formValues?.dlt_template_id,
      entity_id: formValues?.entity_id,
      sender_id: formValues?.sender_id,
      header_id: formValues?.header_id,
      is_unicode: formValues?.is_unicode ? '1' : '0',
      dlt_message: formValues?.dlt_message,
      status: formValues?.status ? '1' : '0',
    };
    let url = Constants.apiEndPoints.DltTemplate;
    // console.log(url, params)
    let response = await APIService.postData(
      url,
      params,
      userLogin.access_token,
      null,
      'AddDltTemplateAPI',
    );
    console.log('params', params);
    // return
    if (!response.errorMsg) {
      setIsLoading(false);
      Alert.alert(
        Constants.success,
        response.data.message ?? 'Dlt Template added successfully',
      );
      navigation.navigate('DltTemplateList');
    } else {
      setIsLoading(false);
      Alert.alert(
        Constants.danger,
        response.errorMsg ?? 'Something went wrong',
      );
    }
  };
 

  const updateDltTemplateData = async () => {
    setIsLoading(true);
    let params = {
      user_id: formValues?.user?.id,
      manage_sender_id: formValues?.manage_sender_id,
      template_name: formValues?.template_name,
      dlt_template_id: formValues?.dlt_template_id,
      entity_id: formValues?.entity_id,
      sender_id: formValues?.sender_id,
      header_id: formValues?.header_id,
      is_unicode: formValues?.is_unicode ? '1' : '0',
      dlt_message: formValues?.dlt_message,
      status: formValues?.status ? '1' : '0',
    };
    let url = Constants.apiEndPoints.DltTemplate + `/${routeParm?.item?.id}`;
    // console.log(params,'prams')
    //    return
    let response = await APIService.putData(
      url,
      params,
      userLogin.access_token,
      null,
      'updateDltTemplateData',
    );
    if (!response.errorMsg) {
      setIsLoading(false);
      navigation.navigate('DltTemplateList');
      Alert.alert(
        Constants.success,
        response.data.message ?? 'Data Updated Successfully',
      );
    } else {
      setIsLoading(false);
      Alert.alert(
        Constants.danger,
        response.errorMsg ?? 'Something went wrong',
      );
    }
  };

  useEffect(() => {
    if (routeParm?.item) {
      setFormValues({
        ...formValues,
        user: routeParm?.item?.user,
        manage_sender_id: routeParm?.item?.manage_sender_id,
        template_name: routeParm?.item.template_name,
        dlt_template_id: routeParm?.item.dlt_template_id,
        entity_id: routeParm?.item.entity_id,
        sender_id: routeParm?.item.sender_id,
        header_id: routeParm?.item.header_id,
        dlt_message: routeParm?.item.dlt_message,
        is_unicode: routeParm?.item.is_unicode == '1' ? true : false,
        status: routeParm?.item.status == '1' ? true : false,
      });
    }
    DltUserTemplateAPI();
  }, []);

  const handleInputChange = (key, value) => {
    setFormValues({
      ...formValues,
      [key]: value,
    });
  };

  return (
    <BaseContainer
      onPressLeftIcon={() => navigation.goBack()}
      leftIcon="arrow-back"
      title={routeParm?.item ? 'Update Dlt Template' : 'Create Dlt Template'}>
      <TransparentLoader isLoading={isLoading} />
      <KeyboardAwareScrollView
        contentContainerStyle={{paddingBottom: 20}}
        style={{
          flex: 1,
          backgroundColor: Colors.white,
          padding: Constants.globalPadding,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <DropDownComp
            validationObj={validationObj}
            uniqueKey={formFieldsKeys.user}
          value={formValues?.user?.id}
          data={userData}
          onPressItem={item => { 
            handleInputChange(formFieldsKeys.user, item);
            DltTemplateManageSenderIdAPI(item.id);
            removeErrorTextForInputThatUserIsTyping(formFieldsKeys.user);
          }}
          keyToShowData="name"
          keyToCompareData="id"
          placeHolder="User"
          isSearch="Search User..."
        />
        {/* {validationObj[formFieldsKeys.user].invalid && (
          <Text style={styles.errorText}>User is required</Text>
        )} */}

        <DropDownComp
          value={formValues?.manage_sender_id}
          validationObj={validationObj}
            uniqueKey={formFieldsKeys.manage_sender_id}
          data={userSenderIdData}
          onPressItem={item => {
            handleInputChange(formFieldsKeys.manage_sender_id, item);
            removeErrorTextForInputThatUserIsTyping(
              formFieldsKeys.manage_sender_id,
            );
          }}
          keyToShowData="sender_id"
          keyToCompareData="id"
          placeHolder="Manage Sender Id"
          isSearch="Search Sender Id ..."
        />
        {/* {validationObj[formFieldsKeys.manage_sender_id].invalid && (
          <Text style={styles.errorText}>Manage Sender Id is required</Text>
        )} */}

        <InputValidation
          validationObj={validationObj}
          uniqueKey={formFieldsKeys.template_name}
          placeHolder={'Template Name'}
          label={'Template Name'}
          value={formValues[formFieldsKeys.template_name]}
          onChangeText={text => {
            removeErrorTextForInputThatUserIsTyping(
              formFieldsKeys.template_name,
            );
            handleInputChange(formFieldsKeys.template_name, text);
          }}
        />
        <InputValidation
          validationObj={validationObj}
          uniqueKey={formFieldsKeys.dlt_template_id}
          placeHolder={'Dlt Template ID'}
          label={'Dlt Template ID'}
          value={formValues[formFieldsKeys.dlt_template_id]}
          onChangeText={text => {
            removeErrorTextForInputThatUserIsTyping(
              formFieldsKeys.dlt_template_id,
            );
            handleInputChange(formFieldsKeys.dlt_template_id, text);
          }}
          keyboardType="numeric"
        />
        <InputValidation
          validationObj={validationObj}
          uniqueKey={formFieldsKeys.entity_id}
          placeHolder={'Entity ID'}
          label={'Entity ID'}
          value={formValues[formFieldsKeys.entity_id]}
          onChangeText={text => {
            removeErrorTextForInputThatUserIsTyping(formFieldsKeys.entity_id);
            handleInputChange(formFieldsKeys.entity_id, text);
          }}
          keyboardType="numeric"
        />
        <InputValidation
          validationObj={validationObj}
          uniqueKey={formFieldsKeys.sender_id}
          maxLength={6}
          placeHolder={'Sender ID'}
          label={'Sender ID'}
          value={formValues[formFieldsKeys.sender_id]}
          onChangeText={text => {
            removeErrorTextForInputThatUserIsTyping(formFieldsKeys.sender_id);
            handleInputChange(formFieldsKeys.sender_id, text);
          }}
          keyboardType="numeric"
        />

        <InputValidation
          validationObj={validationObj}
          uniqueKey={formFieldsKeys.header_id}
          placeHolder={'Header ID'}
          label={'Header ID'}
          value={formValues[formFieldsKeys.header_id]}
          onChangeText={text => {
            removeErrorTextForInputThatUserIsTyping(formFieldsKeys.header_id);
            handleInputChange(formFieldsKeys.header_id, text);
          }}
          keyboardType="numeric"
        />
        <Text style={styles.label}>Unicode*</Text>
        <View
          style={[
            styles.mainView,
            {
              borderWidth: 1,
              borderColor: '#ffad33',
              paddingVertical: 10,
              paddingHorizontal: 10,
            },
          ]}>
          <View style={styles.checkBoxView}>
            <BouncyCheckbox
              size={20}
              fillColor={'#ffaa33'}
              unfillColor={'white'}
              iconStyle={{borderColor: '#ffaa33'}}
              bounceEffect={0.8}
              isChecked={formValues?.is_unicode}
            //   disableBuiltInState={routeParm?.item?.is_unicode ? true : false}
              onPress={value => {
                handleInputChange('is_unicode', value);
              }}
            />
            <Text style={styles.saveAsTemplate}>
              {' '}
              Unicode ({formValues?.is_unicode ? 'Yes' : 'No'})
            </Text>
          </View>
        </View>
        <InputValidation
          validationObj={validationObj}
          uniqueKey={formFieldsKeys.dlt_message}
          placeHolder={'DLT Message'}
          label={'DLT Message'}
          value={formValues[formFieldsKeys.dlt_message]}
          onChangeText={text => {
            removeErrorTextForInputThatUserIsTyping(formFieldsKeys.dlt_message);
            handleInputChange(formFieldsKeys.dlt_message, text);
          }}
          multiline={true}
          inputStyle={{height: 90}}
        />
        <Text style={styles.label}>Status*</Text>
        <View
          style={[
            styles.mainView,
            {
              borderWidth: 1,
              borderColor: '#ffad33',
              paddingVertical: 10,
              paddingHorizontal: 10,
            },
          ]}>
          <View style={styles.checkBoxView}>
            <BouncyCheckbox
              size={20}
              fillColor={'#ffaa33'}
              unfillColor={'white'}
            //   disableBuiltInState={  routeParm?.item?.status == '1' ? true : false}
              iconStyle={{borderColor: '#ffaa33'}}
              bounceEffect={0.8}
              isChecked={formValues?.status}
              onPress={value => {
                handleInputChange('status', value);
              }}
            />
            <Text style={styles.saveAsTemplate}>
              {' '}
              Status ({formValues?.status ? 'Active' : 'Inactive'})
            </Text>
          </View>
        </View>

        <CustomButton 
          style={{
            ...styles.button,
            marginBottom: 100,
          }}
          onPress={() => {
            if (validation()) {
              if (routeParm?.item) {
                updateDltTemplateData();
              } else {
                AddDltTemplateAPI();
              }
            } else { 
                Alert.alert(Constants.danger, 'Please fill all required fields');
            }
          }}
          title={
            routeParm?.item ? 'Update Dlt Template' : 'Create Dlt Template'
          }
        />
      </KeyboardAwareScrollView>
    </BaseContainer>
  );
};

export default AddDltTemplate;

const styles = StyleSheet.create({
  label: {
    fontFamily: fonts.robotoMedium,
    fontSize: getProportionalFontSize(15),
    color: Colors.primary,
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
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  mainView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
    borderRadius: 5,
    // marginHorizontal: 20,
    // margin: 20
    // flex: 1,
  },
  button: {
    padding: 10,
    elevation: 2,
    backgroundColor: '#ffad33',
    borderRadius: 5,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginLeft: 10,
  },
  checkBoxView: {flexDirection: 'row', alignItems: 'center', padding: 8},
  saveAsTemplate: {marginHorizontal: 20},
});
