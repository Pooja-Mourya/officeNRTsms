import {StyleSheet, Text, View, Alert, Linking} from 'react-native';
import React from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useState, useEffect, useRef} from 'react';
import DropDownComp from '../../components/DropDownComp';
import APIService from '../../Services/APIService';
import Constants from '../../constant/Constants';
import {useSelector} from 'react-redux'; 
import Fontisto from 'react-native-vector-icons/Fontisto';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import InputValidation from '../../components/InputValidation';
import Colors from '../../assets/Colors';
import {getProportionalFontSize} from '../../Services/CommonMethods';
import moment from 'moment';

const ExportByNumber = ({setNumberModal}) => {
  const userLogin = useSelector(state => state.global_store.userLogin);
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
      title: 'Invalid mobile',
    },
    [formFieldsKeys.from_date]: {
      invalid: false,
      title: 'Invalid from_date',
    },
    [formFieldsKeys.to_date]: {
      invalid: false,
      title: 'Invalid to date',
    },
    [formFieldsKeys.user_id]: {
      invalid: false,
      title: 'Invalid user',
    },
  };

  const validation = () => {
    let valid = true;
    let validationObj = {...initialValidationObj};
    for (let key in formValues) {
      if (formValues[key] === '') { 
        validationObj[key].invalid = true;
        valid = false;
      }
      else if (key === formFieldsKeys.mobile && formValues[key].length < 10) {
        validationObj[key].invalid = true;
        valid = false;
      } else if(key == formFieldsKeys.user_id && formValues[key] == ''){
        validationObj[key].invalid = true;
        valid = false;
      }  
      else if (key === formFieldsKeys.from_date && formValues[key] > formValues[formFieldsKeys.to_date]) {
        validationObj[key].invalid = true;
        valid = false;
      }else if (key === formFieldsKeys.to_date && formValues[key] < formValues[formFieldsKeys.from_date]) {
        validationObj[key].invalid = true;
        valid = false;
      } 
     }
    setValidationObj(validationObj);
    return valid;
  };



  const removeErrorTextForInputThatUserIsTyping = uniqueKey => {
    let tempValidationObj = {...validationObj};
    tempValidationObj[uniqueKey] = initialValidationObj[uniqueKey];
    setValidationObj(tempValidationObj);
  };

  const handleInputChange = (key, value) => {
    setFormValues({
      ...formValues,
      [key]: value,
    });
  };

  const [validationObj, setValidationObj] = useState({...initialValidationObj});
  const [formValues, setFormValues] = useState(initialValues);
  const [userData, setUserData] = useState([]); 
  const [visible, setVisible] = useState(false);
  const [visibleTo, setVisibleTo] = useState(false);

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
      setUserData(response.data.data);
    } else {
      Alert.alert(response.errorMsg);
    }
  };

  const reportExportByMobileAPI = async () => {
    let params = {
      ...formValues, 
    };
    let url = Constants.apiEndPoints.reportExportByMobile;
    console.log('url', url, params);
    // return
    let response = await APIService.postData(
      url,
      params,
      userLogin.access_token,
      null,
      'reportExportByMobileAPI',
    );
    if (!response.errorMsg) {
      setNumberModal(false); 
      Linking.openURL( `${Constants?.base_url2}${response.data?.data?.file_path}`); 
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

  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps="handled"
      style={{
        flex: 1,
        width: '100%',
        backgroundColor: Colors.white,
      }}
      showsVerticalScrollIndicator={false}>
      <DropDownComp
        validationObj={validationObj}
        uniqueKey={formFieldsKeys.user_id}
        data={userData}
        onPressItem={item => {
          handleInputChange(formFieldsKeys.user_id, item)
          removeErrorTextForInputThatUserIsTyping(formFieldsKeys.user_id);
        }}
        value={formValues?.user_id}
        keyToShowData="name"
        keyToCompareData="id"
        placeHolder="Select User"
        isSearch="Search User..."
        multiSelect={true}
      /> 

      <InputValidation
       editable={false}
        validationObj={validationObj}
        uniqueKey={formFieldsKeys.from_date}
        label={'From'}
        placeHolder="From"
        value={formValues[formFieldsKeys.from_date]}
        onChangeText={text => {
          removeErrorTextForInputThatUserIsTyping(formFieldsKeys.from_date);
          handleInputChange(formFieldsKeys.from_date, text);
        }} 
        iconRight={'calendar'}
        onPressIcon={()=> setVisible(true)}
      />
      <DateTimePickerModal
        isVisible={visible}
        mode="date"
        onConfirm={date => {
          setFormValues({
            ...formValues,
            [formFieldsKeys.from_date]: moment(date).format('YYYY-MM-DD'),
          }); 
          setVisible(false);
          removeErrorTextForInputThatUserIsTyping(formFieldsKeys.from_date);
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
          removeErrorTextForInputThatUserIsTyping(formFieldsKeys.to_date);
          handleInputChange(formFieldsKeys.to_date, text);
        }}
        iconRight={'calendar'}
        onPressIcon={()=> setVisibleTo(true)}
      />
      <DateTimePickerModal
        isVisible={visibleTo}
        mode="date"
        onConfirm={date => {
          setFormValues({
            ...formValues,
            [formFieldsKeys.to_date]: moment(date).format('YYYY-MM-DD'),
          }); 
          setVisibleTo(false);
          removeErrorTextForInputThatUserIsTyping(formFieldsKeys.to_date);
        }}
        onCancel={() => setVisibleTo(false)}
      />

      <InputValidation
        validationObj={validationObj}
        uniqueKey={formFieldsKeys.mobile}
        placeHolder={'+91 0755 180096'}
        label={'Mobile Number'}
        value={formValues[formFieldsKeys.mobile]}
        onChangeText={text => {
          removeErrorTextForInputThatUserIsTyping(formFieldsKeys.mobile);
          handleInputChange(formFieldsKeys.mobile, text);
        }}
        keyboardType={'numeric'}
        maxLength={10}
      />
      {formValues?.mobile?.length == /^[0]?[789]\d{9}$/ ? (
        <Text style={{color: 'red'}}>Invalid mobile number</Text>
      ) : null}

      <View style={styles.buttonView}>
        <CustomButton
          style={{width: '45%'}}
          titleStyle={{
            fontSize: getProportionalFontSize(14),
            lineHeight: 20,
          }}
          title="Clear"
          onPress={() => setFormValues(initialValues)}
        />
        <CustomButton
          style={{width: '45%'}}
          titleStyle={{
            fontSize: getProportionalFontSize(14),
            lineHeight: 20,
          }}
          title="Export"
          onPress={() => {
            if (validation()) {
              reportExportByMobileAPI();
            } else {
              Alert.alert('Please fill all required fields');
            }
          }}
        />
      </View>
    </KeyboardAwareScrollView>
  );
};

export default ExportByNumber;

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    fontSize: getProportionalFontSize(12),
    lineHeight: 20,
    marginTop: 5,
  },
  buttonView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
});
