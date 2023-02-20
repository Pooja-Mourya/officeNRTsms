import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {fonts} from '../../assets/Assets';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import InputValidation from '../../components/InputValidation';
import BaseContainer from '../../components/BaseContainer';
import {useSelector} from 'react-redux';
import DropDownComp from '../../components/DropDownComp';
import APIService from '../../Services/APIService';
import Constants from '../../constant/Constants';
import CustomButton from '../../components/CustomButton';
import { version } from '@babel/core';
import TransparentLoader from '../../components/TransparentLoader';

const Priority = [
  {
    id: '1',
    action: 'queue_accept_to_deliverd',
  },
  {
    id: '2',
    action: 'History accept to delivered ',
  },
  {
    id: '3',
    action: 'Queue Pending to Failed',
  },
  {
    id: '4',
    action: 'History Pending to Failed',
  },
  {
    id: '5',
    action: 'Queue accept to Failed',
  },
  {
    id: '6',
    action: 'History accept to Failed',
  },
  {
    id: '7',
    action: 'History Pending to Delivered',
  },
  {
    id: '8',
    action: 'Queue Pending to Delivered',
  },
  {
    id: '9',
    action: 'Apply ratio',
  },
];

const ManageCampaign = props => {
  let routeParm = props.route.params.itemId; 
  const formFieldsKeys = {
    action_type: 'action_type',
    send_sms_id: 'send_sms_id',
    ratio_percent_to_delivered: 'ratio_percent_to_delivered',
  };
  const initialValues = {
    [formFieldsKeys.action_type]: '',
    [formFieldsKeys.send_sms_id]: '',
    [formFieldsKeys.ratio_percent_to_delivered]: '',
  };

  const initialValidationObj = {
    [formFieldsKeys.action_type]: {
      invalid: false,
      title: 'Please select action type',
    },
  };

  const validation = () => {
    let isValid = true;
    let validationObj = {...initialValidationObj};
    if (formValues[formFieldsKeys.action_type] == '') {
        isValid = false;
        validationObj[formFieldsKeys.action_type].invalid = true;
        }
        setValidationObj(validationObj);
    return isValid;

    
   
  };

 
  let {navigation} = props;

  const userLogin = useSelector(state => state.global_store.userLogin);
  const [validationObj, setValidationObj] = useState(initialValidationObj);
  const [formValues, setFormValues] = useState(initialValues);
  const [isLoading, setIsLoading] = useState(false);
 

  const administrationManageCampaignAPI = async () => {
    setIsLoading(true);
    const params = {
      action_type: formValues?.action_type?.action ?? '',
      send_sms_id:  routeParm?.sms_type ?? '',  
    };
    const url = Constants.apiEndPoints.administrationManageCampaign;
    let response = await APIService.postData(
      url,
      params,
      userLogin.access_token,
      null,
      'administrationManageCampaignAPI',
    );
    console.log(url, params);
    // return
    if (!response.errorMsg) {
        setIsLoading(false);
        Alert.alert('Success', response.message??'Manage Campaign Successfully');
        navigation.goBack();
       
    } else {
        setIsLoading(false);
        Alert.alert('Error', response.errorMsg);
      
    }
  };

 

  const removeErrorTextForInputThatUserIsTyping = key => {
    let temp = validationObj;
    temp[key].invalid = false;
    setValidationObj(temp);
  };
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
      title="Manage Campaign">
         <TransparentLoader isLoading={isLoading} />
      <View
        style={{
          flex: 1,
          backgroundColor: '#fff',
          padding: 10,
        }}>
        <DropDownComp
          data={Priority}
          validationObj={validationObj}
          uniqueKey={formFieldsKeys.action_type}
          onPressItem={item => { 
            handleInputChange(formFieldsKeys.action_type, item);
            removeErrorTextForInputThatUserIsTyping(formFieldsKeys.action_type);


          }}
          keyToShowData="action"
          value={formValues[formFieldsKeys?.toString(Priority)]}
          placeHolder={'Action Type'}
          isSearch={'Search Action Type ...'}
        />
       

        {/* {formValues?.action_type?.id == '9' ? (
          <InputValidation
            validationObj={validationObj}
            uniqueKey={formFieldsKeys.ratio_percent_to_delivered}
            inputStyle={{width: 300}}
            label={'apply ratio'}
            placeHolder="apply ratio"
            value={formValues[formFieldsKeys.ratio_percent_to_delivered]}
            onChangeText={text => {
              removeErrorTextForInputThatUserIsTyping(
                formFieldsKeys.ratio_percent_to_delivered,
              );
              handleInputChange(
                formFieldsKeys.ratio_percent_to_delivered,
                text,
              );
            }}
          />
        ) : null} */}
        <CustomButton
          title="Manage"
          onPress={() => {
            if(validation()){
            administrationManageCampaignAPI(); 
            }else{
                Alert.alert('Error', 'Please fill all the fields');
            }
          }}
        />
      </View>
    </BaseContainer>
  );
};

export default ManageCampaign;
const styles = StyleSheet.create({
    errorText: {
        color: 'red',
        fontSize: 12,
        marginLeft: 10,
        marginTop: 5,
    },


});
