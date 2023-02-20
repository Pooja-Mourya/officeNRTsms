import {StyleSheet, Text, View, Alert, ScrollView} from 'react-native';
import React, {useState, useEffect} from 'react';
import BaseContainer from '../../../components/BaseContainer';
import APIService from '../../../Services/APIService';
import Constants from '../../../constant/Constants';
import {useSelector} from 'react-redux';
import CustomButton from '../../../components/CustomButton';
import DropDownComp from '../../../components/DropDownComp';
import TransparentLoader from '../../../components/TransparentLoader';
import Colors from '../../../assets/Colors';

const AssignSenderId = props => {
  let {navigation} = props;
  const formFieldsKeys = {
    user_ids: 'user_ids',
    sender_ids: 'sender_ids',
  };
  const initialValues = {
    [formFieldsKeys.user_ids]: [],
    [formFieldsKeys.sender_ids]: [],
  };
  const initialValidationObj = {
    [formFieldsKeys.user_ids]: {
      invalid: false,
      title: ' Invalid user_ids',
    },
    [formFieldsKeys.sender_ids]: {
      invalid: false,
      title: ' Invalid sender_ids',
    },
  };

  const userLogin = useSelector(state => state.global_store.userLogin);
  const [assignUserData, setAssignUserData] = useState([]);
  const [userDltTemplateIdData, setUserDltTemplateIdData] = useState([]);
  const [formValues, setFormValues] = useState(initialValues);
  const [validationObj, setValidationObj] = useState({...initialValidationObj});
  const [isLoading, setIsLoading] = useState(false);

  const validation = () => {
    let validationObj = {...initialValidationObj};
    let isValid = true;
    for (let key in formFieldsKeys) {
      if (formFieldsKeys.hasOwnProperty(key)) {
        if (Array.isArray(formValues[key]) && formValues[key].length === 0) {
          validationObj[formFieldsKeys[key]].invalid = true;
          isValid = false;
        }
      }
    }
    setValidationObj(validationObj);
    return isValid;

  };

  const assignSenderIdAPI = async () => {
    setIsLoading(true)
    let params = {
      user_ids: formValues?.user_ids,
      sender_ids: formValues?.sender_ids,
    };
    let url = Constants.apiEndPoints.assignSenderId;
    console.log('sender_ids', url, params);
    // return;
    let response = await APIService.postData(
      url,
      params,
      userLogin.access_token,
      null,
      'assignSenderId',
    );
    if (!response.errorMsg) {
      setIsLoading(false);
      props.navigation.goBack();
      Alert.alert(Constants.success, 'SenderId assigned successfully');
    } else {
      setIsLoading(false);
      Alert.alert(
        Constants.danger,
        response.errorMsg ?? 'Something went wrong',
      );
    }
  };
  useEffect(() => {
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

    const getManageSenderIdsList = async () => {
      let params = {};
      let url = Constants.apiEndPoints.ManageSenderId;
      // console.log(url, params)
      let response = await APIService.postData(
        url,
        params,
        userLogin.access_token,
        null,
        'getManageSenderIdsList',
      );
      console.log(
        'getManageSenderIdsList',
        JSON.stringify(response?.data?.data),
      );
      if (!response.errorMsg) {
        // console.log("dlt template", JSON.stringify(response))

        setUserDltTemplateIdData(response.data.data);
      } else {
        Alert.alert(response.errorMsg);
      }
    };
    assignUserDataAPI();
    getManageSenderIdsList();
  }, []);

  const handleInputChange = (key, value) => {
    setFormValues({
      ...formValues,
      [key]: value,
    });
  };

  const removeErrorTextForInputThatUserIsTyping = key => {
    let validationObj = {...initialValidationObj};
    validationObj[key].invalid = false;
    setValidationObj(validationObj);
  };
  return (
    <BaseContainer
      onPressLeftIcon={() =>  navigation.goBack()}
      leftIcon="arrow-back"
      title="Assign Sender Id">
      <TransparentLoader isLoading={isLoading} />
      <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{flexGrow: 1}}>
      <View
        style={{
          flex: 1,
          backgroundColor: '#fff',
          padding: 10,
        }}>
        <DropDownComp
          data={assignUserData}
          validationObj={validationObj}
          uniqueKey={formFieldsKeys.user_ids}
          onPressItem={item => {
            handleInputChange(formFieldsKeys.user_ids, item);
            removeErrorTextForInputThatUserIsTyping(formFieldsKeys.user_ids);
          }}
          keyToShowData="name"
          keyToCompareData="id"
          placeHolder="User Id"
          multiSelect={true}
          isSearch={'Search user ...'}
        /> 

        <DropDownComp
          data={userDltTemplateIdData}
          validationObj={validationObj}
          uniqueKey={formFieldsKeys.sender_ids}
          onPressItem={item => {
            handleInputChange(formFieldsKeys.sender_ids, item);
            removeErrorTextForInputThatUserIsTyping(formFieldsKeys.sender_ids);
          }}
          keyToShowData="sender_id"
          keyToCompareData="id"
          placeHolder="Sender Id"
          multiSelect={true}
          isSearch={'Search Sender Id'}
        /> 
        <CustomButton
          onPress={() => {
            if (validation()) {
              assignSenderIdAPI();
            } else {
              Alert.alert('Validation failed1');
            }
          }}
          title={'Assign Sender Id'}
        />
      </View>
      </ScrollView>

    </BaseContainer>
  );
};

export default AssignSenderId;

const styles = StyleSheet.create({ });
