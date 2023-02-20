import {StyleSheet, Text, View, Alert, Linking} from 'react-native';
import React from 'react';
import {useState} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import DropDownComp from '../../components/DropDownComp';
import Constants from '../../constant/Constants';
import APIService from '../../Services/APIService';
import {useEffect} from 'react';
import {useSelector} from 'react-redux';
import DateTimePickerModal from 'react-native-modal-datetime-picker'; 
import InputValidation from '../../components/InputValidation';
import CustomButton from '../../components/CustomButton';
import {getProportionalFontSize} from '../../Services/CommonMethods';
import moment from 'moment';

const ExportBySenderId = ({setSenderIdModal}) => {
  const userLogin = useSelector(state => state.global_store.userLogin);
  const formFieldsKeys = {
    sender_id: 'sender_id',
    from_date: 'from_date',
    to_date: 'to_date',
  };

  const initialValues = {
    [formFieldsKeys.sender_id]: '',
    [formFieldsKeys.from_date]: '',
    [formFieldsKeys.to_date]: '',
  };

  const initialValidationObj = {
    [formFieldsKeys.sender_id]: {
      invalid: false,
      title: 'Invalid sender id',
    },
    [formFieldsKeys.from_date]: {
      invalid: false,
      title: 'Invalid from date',
    },
    [formFieldsKeys.to_date]: {
      invalid: false,
      title: 'Invalid to date',
    },
  };

  const validation = () => {
    let valid = true;
    let validationObj = {...initialValidationObj};
    for (let key in formValues) {
      if (formValues[key] === '') {
        validationObj[key].invalid = true;
        valid = false;
      }else if (key === formFieldsKeys.from_date && formValues[key] > formValues[formFieldsKeys.to_date]) {
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

  const [userSenderIdData, setUserSenderIdData] = useState([]);
  const [validationObj, setValidationObj] = useState(initialValidationObj);
  const [formValues, setFormValues] = useState(initialValues);
  const [visible, setVisible] = useState(false);
  const [visibleTo, setVisibleTo] = useState(false);

  const DltTemplateManageSenderIdAPI = async () => {
    let url = Constants.apiEndPoints.ManageSenderId;
    let response = await APIService.postData(
      url,
      {},
      userLogin.access_token,
      null,
      'DltTemplateManageSenderIdAPI',
    );
    // return
    if (!response.errorMsg) {
      setUserSenderIdData(response.data.data);
    } else {
      Alert.alert(response.errorMsg);
    }
  };

  const reportExportBySenderIdAPI = async () => {
    const params = {...formValues};
    const url = Constants.apiEndPoints.reportExportBySenderId;
    console.log('url', url, params);
    // return
    let response = await APIService.postData(
      url,
      params,
      userLogin.access_token,
      null,
      'reportExportBySenderId',
    );
    if (!response.errorMsg) {
      setSenderIdModal(false);
      Linking.openURL(
        `${Constants?.base_url2}${response.data?.data?.file_path}`,
      );
    } else {
      setSenderIdModal(false);
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

  useEffect(() => {
    DltTemplateManageSenderIdAPI();
  }, []);

  console.log('formValues', formValues);

  return (
    <KeyboardAwareScrollView
      style={{flex: 1, backgroundColor: 'white', width: '100%'}}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}>
      <DropDownComp
        validationObj={validationObj}
        uniqueKey={formFieldsKeys.sender_id}
        data={userSenderIdData}
        onPressItem={item => {
          handleInputChange('sender_id', item.sender_id);
          removeErrorTextForInputThatUserIsTyping('sender_id');
        }}
        value={formValues?.sender_id}
        keyToShowData="sender_id"
        keyToCompareData="id"
        placeHolder="Sender Id"
        isSearch="Search Sender Id ..."
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
          removeErrorTextForInputThatUserIsTyping(formFieldsKeys.from_date);
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
          handleInputChange(formFieldsKeys.to_date, text); 
          removeErrorTextForInputThatUserIsTyping(formFieldsKeys.to_date);
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
          setVisibleTo(false);
          removeErrorTextForInputThatUserIsTyping(formFieldsKeys.to_date);
        }}
        onCancel={() => setVisibleTo(false)}
      />

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
              reportExportBySenderIdAPI();
            } else {
              Alert.alert('Please fill all required fields');
            }
          }}
        />
      </View>
    </KeyboardAwareScrollView>
  );
};

export default ExportBySenderId;

const styles = StyleSheet.create({
  buttonView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    fontSize: getProportionalFontSize(12),
    lineHeight: 20,
    marginTop: 5,
  },
});
