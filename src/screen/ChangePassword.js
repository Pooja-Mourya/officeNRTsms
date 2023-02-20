import {StyleSheet, Text, View, ActivityIndicator, Alert} from 'react-native';
import React,{useEffect,useState} from 'react';

import InputValidation from '../components/InputValidation';

import BaseContainer from '../components/BaseContainer';
import {img, fonts} from '../assets/Assets'; 
import Constants from '../constant/Constants';
import {useDispatch, useSelector} from 'react-redux'; 
import APIService from '../Services/APIService';
import {UserLoginAction} from '../redux/reduxSlicer';
import TransparentLoader from '../components/TransparentLoader';

const ChangePassword = (props) => {
  const formFieldsKeys = {
    CurrectPassword: 'CurrectPassword',
    NewPassword: 'NewPassword',
    RetypeNewPassword: 'RetypeNewPassword',
  };

  const initialValues = {
    [formFieldsKeys.CurrectPassword]: '',
    [formFieldsKeys.NewPassword]: '',
    [formFieldsKeys.RetypeNewPassword]: '',
  };
  const initialValidationObj = {
    [formFieldsKeys.CurrectPassword]: {
      invalid: false,
      title: 'Invalid CurrectPassword',
    },
    [formFieldsKeys.NewPassword]: {
      invalid: false,
      title: 'Invalid NewPassword',
    },
    [formFieldsKeys.RetypeNewPassword]: {
      invalid: false,
      title: 'Invalid RetypeNewPassword',
    },
  };

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = React.useState(false);
  const UserLogin = useSelector(state => state?.global_store?.userLogin);
  const [validationObj, setValidationObj] = React.useState({
    ...initialValidationObj,
  });
  const [formFields, setFormFields] = React.useState(initialValues);
  const [passwordVisibility, setPasswordVisibility] = useState(true);

  let isChangePassword =  props.route.params.user;

  const validation = () => {
    let validationObjTemp = {...validationObj};
    let isValid = true;
    if (!formFields?.[formFieldsKeys.CurrectPassword]&&!isChangePassword) { 
        validationObjTemp.CurrectPassword.invalid = true;
        isValid = false;
       
    }  
    if (!formFields?.[formFieldsKeys.NewPassword]) {
      validationObjTemp.NewPassword.invalid = true;
      isValid = false;
    } else if (formFields?.[formFieldsKeys.NewPassword].length < 6) {
      validationObjTemp.NewPassword.invalid = true;
      validationObjTemp.NewPassword.title = 'min 6 characters password';
      isValid = false;
    }

    if (
      formFields?.[formFieldsKeys.NewPassword] !=
      formFields?.[formFieldsKeys.RetypeNewPassword]
    ) {
      validationObjTemp.RetypeNewPassword.invalid = true;
      validationObjTemp.RetypeNewPassword.title = 'Password Mismatch';
      isValid = false;
    }
    setValidationObj(validationObjTemp);
    return isValid;
  };

  const handleInputChange = (key, value) => {
    setFormFields({...formFields, [key]: value});
  };
  const removeErrorTextForInputThatUserIsTyping = uniqueKey => {
    let tempValidationObj = {...validationObj};
    tempValidationObj[uniqueKey] = initialValidationObj[uniqueKey];
    setValidationObj(tempValidationObj);
  }; 

  const UpdatePassword = async () => {
    setIsLoading(true);
    let params = {
      old_password: formFields?.[formFieldsKeys.CurrectPassword],
      password: formFields?.[formFieldsKeys.NewPassword],
      password_confirmation: formFields?.[formFieldsKeys.RetypeNewPassword],
    };
    let url = '';
    if (UserLogin.userType == 0||UserLogin.userType == 3) {
      url = Constants.apiEndPoints['change-password'];
    } else{
      url = Constants.apiEndPoints['update-self-password'];
    }
    console.log(url, params);
    // return
    let response = await APIService.postData(
      url,
      params,
      UserLogin.access_token,
      null,
      '',
    );
    if (!response.errorMsg) {
      setIsLoading(false); 
      let reduxData = {...UserLogin, ...response?.data?.data};
      dispatch(UserLoginAction(reduxData));   
      props.navigation.goBack();
      Alert.alert(Constants.success, response?.data.message??'Password Updated Successfully');
    } else {
      setIsLoading(false);
      Alert.alert(Constants.danger, response.errorMsg??'Something went wrong');
    }
  };



  const resetPwd = async() => {
    setIsLoading(true);
    let params = {
      password: formFields?.[formFieldsKeys.NewPassword],
      password_confirmation: formFields?.[formFieldsKeys.RetypeNewPassword],
      user_id: isChangePassword,
    };
    let url = Constants.apiEndPoints.resetPwd;
    console.log(url, params);
    // return
    let response = await APIService.postData(
      url,
      params,
      UserLogin.access_token,
      null,
      '',
    );
    if (!response.errorMsg) {
      setIsLoading(false);  
      setFormFields(initialValues);
      props.navigation.goBack();
      Alert.alert(Constants.success, response?.data.message??'Password Updated Successfully');
    } else {
      setIsLoading(false);
      Alert.alert(Constants.danger, response.errorMsg??'Something went wrong');
    }
    }
 
  return (
    <BaseContainer
      title="ChangePassword"
      leftIcon="arrow-back"
      onPressLeftIcon={() => props.navigation.goBack()}  
    > 
    <TransparentLoader isLoading={isLoading} />
        <View style={styles.view}>
        {!isChangePassword&& <InputValidation
            validationObj={validationObj}
            uniqueKey={formFieldsKeys?.CurrectPassword}
            value={formFields[formFieldsKeys.CurrectPassword]}
            placeHolder={'CurrectPassword'}
            onChangeText={text => {
              removeErrorTextForInputThatUserIsTyping(
                formFieldsKeys.CurrectPassword,
              );
              handleInputChange(formFieldsKeys.CurrectPassword, text);
            }}
            label={'CurrectPassword'}
            style={{marginTop: Constants.formFieldTopMargin}}
          />}

          <InputValidation
            validationObj={validationObj}
            uniqueKey={formFieldsKeys?.NewPassword}
            value={formFields[formFieldsKeys.NewPassword]}
            placeHolder={'NewPassword'}
            onChangeText={text => {
              removeErrorTextForInputThatUserIsTyping(
                formFieldsKeys.NewPassword,
              );
              handleInputChange(formFieldsKeys.NewPassword, text);
            }}
            label={'NewPassword'}
            style={{marginTop: Constants.formFieldTopMargin}}
            secureTextEntry={passwordVisibility} 
            isIconRightTouchable={true}
            onPressIcon={() => setPasswordVisibility(!passwordVisibility)}
            iconRight={passwordVisibility ? 'eye' : "eye-off"}
          />
          <InputValidation
            validationObj={validationObj}
            uniqueKey={formFieldsKeys?.RetypeNewPassword}
            value={formFields[formFieldsKeys.RetypeNewPassword]}
            placeHolder={'RetypeNewPassword'}
            onChangeText={text => {
              removeErrorTextForInputThatUserIsTyping(
                formFieldsKeys.RetypeNewPassword,
              );
              handleInputChange(formFieldsKeys.RetypeNewPassword, text);
            }}
            label={'RetypeNewPassword'}
            style={{marginTop: Constants.formFieldTopMargin}}
          />

          <CustomButton
            style={{
              ...styles.nextButton,
            }}
            onPress={() => {
              if (validation()) { 
                if(isChangePassword){
                  resetPwd()
                }else{
                  UpdatePassword()
                }   
              } else {
                setIsLoading(false);
                alert('validation failed');
              }
            }}
            title={'Save Change'}
          />
        </View> 
    </BaseContainer>
  )
}

export default ChangePassword;

const styles = StyleSheet.create({
  view: { 
    marginHorizontal: 16,
    paddingVertical: 10,
  },
  inputTxt: {
    // marginBottom: 1,
    color: 'rgba(0,0,0,0.9)',
    fontFamily: fonts.medium,
  },
});
