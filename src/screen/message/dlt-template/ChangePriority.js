import {StyleSheet, Text, View, Alert, ScrollView} from 'react-native';
import React, {useState, useEffect} from 'react';
import BaseContainer from '../../../components/BaseContainer';
import APIService from '../../../Services/APIService';
import Constants from '../../../constant/Constants';
import {useSelector, useDispatch} from 'react-redux';
import CustomButton from '../../../components/CustomButton';
import DropDownComp from '../../../components/DropDownComp';

const Priority = [
  {
    id: '0',
    title: 'Normal',
  },
  {
    id: '1',
    title: 'Medium',
  },
  {
    id: '2',
    title: 'Heigh',
  },
  {
    id: '3',
    title: 'Instant(OTP)',
  },
];

const ChangePriority = props => {
  let {navigation} = props;
  const formFieldsKeys = {
    dlt_template_ids: 'dlt_template_ids',
    priority: 'priority',
  };
  const initialValues = {
    [formFieldsKeys.dlt_template_ids]: '',
    [formFieldsKeys.priority]: '',
  };

  const initialValidationObj = {
    [formFieldsKeys.dlt_template_ids]: {
      invalid: false,
      title: 'Invalid dlt_template_ids',
    },
    [formFieldsKeys.priority]: {
      invalid: false,
      title: 'Invalid priority',
    },
  };

  const validation = () => { 
    let validationObj = {...initialValidationObj};
    let valid = true;
    if (formValues[formFieldsKeys.dlt_template_ids] === '') {
      validationObj[formFieldsKeys.dlt_template_ids].invalid = true;
      valid = false;
    }
    if (formValues[formFieldsKeys.priority] === '') {
      validationObj[formFieldsKeys.priority].invalid = true;
      valid = false;
    }
    setValidationObj(validationObj);
    return valid;
    
  };

  // REDUX hooks
  const userLogin = useSelector(state => state.global_store.userLogin);
  const [validationObj, setValidationObj] = useState({...initialValidationObj});
  const [userDltTemplateIdData, setUserDltTemplateIdData] = useState([]);
  const [formValues, setFormValues] = useState(initialValues); 
  const [isLoading, setIsLoading] = useState(false);

  const administrationChangeDltTemplatePriorityAPI = async () => {
    setIsLoading(true);
    let params = {
      dlt_template_ids: formValues.dlt_template_ids,
      priority: formValues.priority.id, 
    };

    let url = Constants.apiEndPoints.administrationChangeDltTemplatePriority;
    // return
    let response = await APIService.postData(
      url,
      params,
      userLogin.access_token,
      null,
      'administrationChangeDltTemplatePriorityAPI',
    );
    if (!response.errorMsg) {
      setIsLoading(false);
      navigation.goBack();
      Alert.alert('Success', response.message??'Priority changed successfully');
    } else {
      setIsLoading(false);
      Alert.alert('Error', response.errorMsg??'Something went wrong');
    }
  };

  const userDltTemplateIdDataAPI = async () => {
    let url = Constants.apiEndPoints.DltTemplateListing;
    let response = await APIService.postData(
      url,
      {},
      userLogin.access_token,
      null,
      'DltTemplateListingAPI',
    );
    if (!response.errorMsg) {
      setUserDltTemplateIdData(response.data.data);
    } else {
      Alert.alert(response.errorMsg);
    }
  };
 

  useEffect(() => {
    userDltTemplateIdDataAPI();
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
      onPressLeftIcon={() => navigation.goBack()}
      leftIcon="arrow-back"
      title="Change Priority">
        <TransparentLoader isLoading={isLoading} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100,
          padding:Constants.globalPadding, 
        }}> 
          <DropDownComp
            multiSelect={true}
            validationObj={validationObj}
            uniqueKey={formFieldsKeys.dlt_template_ids}
            data={userDltTemplateIdData} 
            onPressItem={item => {
              handleInputChange(formFieldsKeys.dlt_template_ids, item); 
              removeErrorTextForInputThatUserIsTyping(
                formFieldsKeys.dlt_template_ids,
              );
              
            }}
            keyToShowData="template_name"
            keyToCompareData="dlt_template_id"
            placeHolder="DLT Template Id"
            isSearch="Search Priority..."
          /> 
           
          <DropDownComp
            data={Priority ?? []}
            validationObj={validationObj}
            uniqueKey={formFieldsKeys.priority}
            onPressItem={item => {
              handleInputChange(formFieldsKeys.priority, item); 
              removeErrorTextForInputThatUserIsTyping(
                formFieldsKeys.priority,
              );

            }}
            keyToShowData="title"
            placeHolder="Select Priority"
            isSearch="Search Priority..."
          />
          
        
          <CustomButton
            onPress={() => {
              if (validation()) {
                administrationChangeDltTemplatePriorityAPI();
              }else{
                Alert.alert("Validation Error", "Please fill all the fields")
              }
              
            }}
            title={'Change Priority'}
          /> 
      </ScrollView>
    </BaseContainer>
  );
};

export default ChangePriority;

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    fontSize: 12,
    marginLeft: 10,
  },
});
