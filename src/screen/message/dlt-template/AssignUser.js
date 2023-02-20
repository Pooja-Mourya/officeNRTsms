import {StyleSheet, Text, View, Alert} from 'react-native';
import React, {useState, useEffect} from 'react';
import BaseContainer from '../../../components/BaseContainer';
import APIService from '../../../Services/APIService';
import Constants from '../../../constant/Constants';
import {useSelector, useDispatch} from 'react-redux';
import CustomButton from '../../../components/CustomButton';
import DropDownComp from '../../../components/DropDownComp';
import TransparentLoader from '../../../components/TransparentLoader';

const AssignUser = props => {
  let {navigation} = props;
  const formFieldsKeys = {
    user_ids: 'user_ids',
    dlt_template_ids: 'dlt_template_ids',
  };
  const initialValues = {
    [formFieldsKeys.user_ids]: [],
    [formFieldsKeys.dlt_template_ids]: [],
  };
  const initialValidationObj = {
    [formFieldsKeys.user_ids]: {
      invalid: false,
      title: ' Invalid user_ids',
    },
    [formFieldsKeys.dlt_template_ids]: {
      invalid: false,
      title: ' Invalid dlt_template_ids',
    },
  };

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

  // REDUX hooks
  const userLogin = useSelector(state => state.global_store.userLogin);
  const [assignUserData, setAssignUserData] = useState([]);
  const [userDltTemplateIdData, setUserDltTemplateIdData] = useState([]);
  const [formValues, setFormValues] = useState(initialValues);
  const [validationObj, setValidationObj] = useState({...initialValidationObj});
  const [isLoading, setIsLoading] = useState(false);

  const dltTemplatesAssignToUsersAPI = async () => {
    setIsLoading(true);
    let params = {
      dlt_template_ids:  formValues.dlt_template_ids,
      user_ids:  formValues.user_ids,
  
    };
    let url = Constants.apiEndPoints.dltTemplatesAssignToUsers;
    console.log(params, url);
    // return
    let response = await APIService.postData(
      url,
      params,
      userLogin.access_token,
      null,
      'dltTemplatesAssignToUsersAPI',
    );
    if (!response.errorMsg) {
        setIsLoading(false);
      props.navigation.pop();
      Alert.alert('Success', 'Dlt Template Assigned Successfully');
    } else {
        setIsLoading(false);
      Alert.alert(Constants.danger,  response.errorMsg??'Something went wrong');
    }
  };



  useEffect(() => {
    const assignUserDataAPI = async () => {
        let params = {};
        let url = Constants.apiEndPoints.users;
        console.log(url, params);
        let response = await APIService.postData(
          url,
          params,
          userLogin.access_token,
          null,
          'DltTemplateUsersAPI',
        );
        if (!response.errorMsg) { 
          setAssignUserData(response.data.data);
        } else {
          Alert.alert(response.errorMsg);
        }
      };
    
      const userDltTemplateIdDataAPI = async () => {
        let params = {};
        let url = Constants.apiEndPoints.DltTemplateListing;
        console.log(url, params);
        let response = await APIService.postData(
          url,
          params,
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
    assignUserDataAPI();
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
      onPressLeftIcon={() => {
        navigation.pop();
      }}
      leftIcon="arrow-back"
      title="Assign User">
      <TransparentLoader isLoading={isLoading} />
      <View
        style={{
          flex: 1,
          backgroundColor: '#F5FCFF',
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
          uniqueKey={formFieldsKeys.dlt_template_ids}
          onPressItem={item => {
            handleInputChange(formFieldsKeys.dlt_template_ids, item);
            removeErrorTextForInputThatUserIsTyping(
              formFieldsKeys.dlt_template_ids,
            );
          }} 
          keyToShowData="template_name"
          keyToCompareData="id"
          placeHolder="Dlt Template Ids"
          multiSelect={true}
          isSearch={'Search Template Ids'}
        />
       
        <CustomButton 
          title="Submit"
          onPress={() => { 
              if (validation()) { 
                dltTemplatesAssignToUsersAPI();
              } else {
                Alert.alert(Constants.danger,'Validation Error');
              }
            
          }}
        />
      </View>
    </BaseContainer>
  );
};

export default AssignUser;

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
});
