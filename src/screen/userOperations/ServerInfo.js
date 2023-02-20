import {StyleSheet, Text, View, Alert} from 'react-native';
import React, {useState, useEffect} from 'react';
import InputValidation from '../../components/InputValidation';
import BaseContainer from '../../components/BaseContainer';
import {useSelector} from 'react-redux';
import DropDownComp from '../../components/DropDownComp';
import APIService from '../../Services/APIService';
import Constants from '../../constant/Constants';
import CustomButton from '../../components/CustomButton';
import Colors from '../../assets/Colors';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const ServerInfo = ({navigation}) => {
  const formFieldsKeys = {
    notification_template_id: 'notification_template_id',
    dlt_template_id: 'dlt_template_id',
    message: 'message',
  };
  const initialValues = {
    [formFieldsKeys.notification_template_id]: '',
    [formFieldsKeys.dlt_template_id]: '',
    [formFieldsKeys.message]: '',
  };
  const initialValidationObj = {
    [formFieldsKeys.notification_template_id]: {
      invalid: false,
      title: 'Invalid notification template id',
    },
    [formFieldsKeys.dlt_template_id]: {
      invalid: false,
      title: 'Invalid dlt template id',
    },
    [formFieldsKeys.message]: {
      invalid: false,
      title: 'Invalid message',
    },
  };

  const userLogin = useSelector(state => state.global_store.userLogin);
  const [validationObj, setValidationObj] = useState({...initialValidationObj});
  const [formValues, setFormValues] = useState(initialValues);
  const [template, setTemplate] = useState([]);
  const [notification, setNotification] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (key, value) => {
    setFormValues({
      ...formValues,
      [key]: value,
    });
  };

  const validation = () => {
    let validationObjTemp = {...validationObj};
    let valid = true;
    if (!formValues?.[formFieldsKeys?.notification_template_id]) {
      validationObjTemp[
        formFieldsKeys?.notification_template_id
      ].invalid = true;
      valid = false;
      console.log(formFieldsKeys?.notification_template_id);
    }
    if (!formValues?.[formFieldsKeys?.dlt_template_id]) {
      validationObjTemp[formFieldsKeys?.dlt_template_id].invalid = true;
      valid = false;
      console.log(formFieldsKeys?.dlt_template_id);
    }
    if (!formValues?.[formFieldsKeys?.message]) {
      validationObjTemp[formFieldsKeys?.message].invalid = true;
      valid = false;
      console.log(formFieldsKeys?.message);
    }

    setValidationObj(validationObjTemp);
    return valid;
  };

  const removeErrorTextForInputThatUserIsTyping = uniqueKey => {
    let tempValidationObj = {...validationObj};
    tempValidationObj[uniqueKey] = initialValidationObj[uniqueKey];
    setValidationObj(tempValidationObj);
  };

  const SaveServerInfo = async () => {
    const params = {
      notification_template_id: formValues.notification_template_id?.id,
      dlt_template_id: formValues.dlt_template_id?.id,
      message: formValues.message,
    };
    const url = Constants.apiEndPoints.administrationInformingUserAboutServer;

    let response = await APIService.postData(
      url,
      params,
      userLogin.access_token,
      null,
      'SaveServerInfo',
    );

    if (!response.errorMsg) {
      //
      Alert.alert('recorded you data successfully');
    } else {
      Alert.alert(response.errorMsg);
    }
  };

  const ServerInfoTemplate = async () => {
    const params = {};
    const url = Constants.apiEndPoints.DltTemplateListing;
    let response = await APIService.postData(
      url,
      params,
      userLogin.access_token,
      null,
      'ServerInfoList',
    );
    if (!response.errorMsg) {
      setTemplate(response?.data?.data);
    } else {
      Alert.alert(response.errorMsg);
    }
  };

  const ServerInfoNotification = async () => {
    const url = Constants.apiEndPoints.administrationNotificationTemplates;
    let response = await APIService.postData(
      url,
      {},
      userLogin.access_token,
      null,
      'Notification_for',
    );

    if (!response.errorMsg) {
      setNotification(response?.data?.data);
      console.log('notification_for', response?.data?.data);
    } else {
      Alert.alert(response.errorMsg);
    }
  };

  useEffect(() => {
    ServerInfoNotification();
    ServerInfoTemplate();
  }, []);

  return (
    <BaseContainer
      onPressLeftIcon={() => navigation.goBack()}
      leftIcon="arrow-back"
      title="Server Info"
    >
      <TransparentLoader isLoading={isLoading} />

      <KeyboardAwareScrollView>
        <View style={styles.container}>
          <DropDownComp
            validationObj={validationObj}
            uniqueKey={formFieldsKeys.notification_template_id}
            data={notification}
            onPressItem={item => {
              handleInputChange(formFieldsKeys.dlt_template_id, item);
            }}
            keyToShowData="notification_for"
            keyToCompareData="id"
            placeHolder={'Notification'}
          />
          
          <DropDownComp
            data={template}
            validationObj={validationObj}
            uniqueKey={formFieldsKeys.dlt_template_id}
            onPressItem={item => {
              handleInputChange(formFieldsKeys.dlt_template_id, item);
            }}
            keyToShowData="template_name"
            keyToCompareData="id"
            placeHolder={'Dlt Template Id'}
          /> 
          <InputValidation
            style={{marginTop: 8}}
            validationObj={validationObj}
            uniqueKey={formFieldsKeys?.message}
            placeHolder={'message'}
            label={'message'}
            value={formValues?.[formFieldsKeys?.message] ?? ''}
            onChangeText={text => {
              removeErrorTextForInputThatUserIsTyping(formFieldsKeys.message);
              handleInputChange(formFieldsKeys?.message, text);
            }}
            inputStyle={{height: 90, marginTop: 5}}
            multiline={true}
          />
          <CustomButton
            title="Save"
            onPress={() => {
              if (validation()) {
                SaveServerInfo();
              }
            }}
          />
        </View>
      </KeyboardAwareScrollView>
    </BaseContainer>
  );
};

export default ServerInfo;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
});
