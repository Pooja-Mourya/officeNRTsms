import {StyleSheet, View, TouchableOpacity, Alert, Image} from 'react-native';
import React, {useState} from 'react';
import BaseContainer from './../components/BaseContainer';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import InputValidation from './../components/InputValidation';
import APIService from '../Services/APIService';
import {useDispatch, useSelector} from 'react-redux';
import Constants from '../constant/Constants';
import {UserLoginAction} from '../redux/reduxSlicer'; 
import TransparentLoader from '../components/TransparentLoader'; 
import UploadAvtar from '../components/UploadAvtar';

const Editprofile = props => {
  const formFieldsKeys = {
    name: 'name',
    email: 'email',
    address: 'address',
    ContactNumber: 'ContactNumber',
    city: 'city',
    postalCode: 'postalCode',
    web: 'web',
    company: 'company',
    designation: 'designation',
    locktimeout: 'locktimeout',
    FileGeneration: 'FileGeneration',
    OrderNumberExcceds: 'OrderNumberExcceds',
    TaxPercentage: 'TaxPercentage',
    companyLogo: 'companyLogo',
  };

  const initialValues = {
    [formFieldsKeys.name]: '',
    [formFieldsKeys.email]: '',
    [formFieldsKeys.address]: '',
    [formFieldsKeys.ContactNumber]: '',
    [formFieldsKeys.city]: '',
    [formFieldsKeys.postalCode]: '',
    [formFieldsKeys.web]: '',
    [formFieldsKeys.company]: '',
    [formFieldsKeys.designation]: '',
    [formFieldsKeys.locktimeout]: '',
    [formFieldsKeys.FileGeneration]: '',
    [formFieldsKeys.OrderNumberExcceds]: '',
    [formFieldsKeys.TaxPercentage]: '',
    [formFieldsKeys.companyLogo]: '',
  };

  const initialValidationObj = {
    [formFieldsKeys.name]: {
      invalid: false,
      title: 'Invalid name',
    },
    [formFieldsKeys.email]: {
      invalid: false,
      title: 'Invalid email',
    },
    [formFieldsKeys.address]: {
      invalid: false,
      title: 'Invalid address',
    },
    [formFieldsKeys.ContactNumber]: {
      invalid: false,
      title: 'Invalid ContactNumber',
    },
    [formFieldsKeys.city]: {
      invalid: false,
      title: 'Invalid city',
    },
    [formFieldsKeys.postalCode]: {
      invalid: false,
      title: 'Invalid postalCode',
    },
    [formFieldsKeys.web]: {
      invalid: false,
      title: 'Invalid web',
    },
    [formFieldsKeys.company]: {
      invalid: false,
      title: 'Invalid company',
    },
    [formFieldsKeys.designation]: {
      invalid: false,
      title: 'Invalid designation',
    },
    [formFieldsKeys.locktimeout]: {
      invalid: false,
      title: 'Invalid locktimeout',
    },
    [formFieldsKeys.FileGeneration]: {
      invalid: false,
      title: 'Invalid FileGeneration',
    },
    [formFieldsKeys.OrderNumberExcceds]: {
      invalid: false,
      title: 'Invalid OrderNumberExcceds',
    },
    [formFieldsKeys.TaxPercentage]: {
      invalid: false,
      title: 'Invalid TaxPercentage',
    },
  };

  const dispatch = useDispatch();
  const UserLogin = useSelector(state => state?.global_store?.userLogin);
  const [isLoading, setIsLoading] = useState(false);
  const [validationObj, setValidationObj] = React.useState({
    ...initialValidationObj,
  });
  const [formFields, setFormFields] = React.useState(initialValues);
  const isEdit = props?.route?.params?.data; 

  React.useEffect(() => {
    if (isEdit) {
      setFormFields({
        ...formFields,
        [formFieldsKeys.name]: isEdit?.app_name,
        [formFieldsKeys.email]: isEdit?.contact_email,
        [formFieldsKeys.address]: isEdit?.contact_address,
        [formFieldsKeys.ContactNumber]: isEdit?.contact_number,
        [formFieldsKeys.FileGeneration]: isEdit?.file_gen_if_exceed + '',
        [formFieldsKeys.OrderNumberExcceds]: isEdit?.order_no_start + '',
        [formFieldsKeys.TaxPercentage]: isEdit?.tax_percentage,
        [formFieldsKeys.companyLogo]: isEdit?.app_logo,
      });
    } else {
      setFormFields({
        ...formFields,
        [formFieldsKeys.name]: UserLogin?.name,
        [formFieldsKeys.email]: UserLogin?.email,
        [formFieldsKeys.address]: UserLogin?.address,
        [formFieldsKeys.ContactNumber]: UserLogin?.mobile,
        [formFieldsKeys.city]: UserLogin?.city + '',
        [formFieldsKeys.postalCode]: UserLogin?.zipCode + '',
        [formFieldsKeys.companyLogo]: UserLogin?.companyLogo,
        [formFieldsKeys.web]: UserLogin?.websiteUrl,
        [formFieldsKeys.designation]: UserLogin?.designation,
        [formFieldsKeys.company]: UserLogin?.companyName,
        [formFieldsKeys.locktimeout]: UserLogin?.locktimeout,
      });
    }
  }, []);

  const validation = () => {
    let validationObjTemp = {...validationObj};
    let isValid = true;
    if (UserLogin?.userType == 0 || UserLogin?.userType == 3) {
      if (formFields[formFieldsKeys.name] === '') {
        validationObjTemp[formFieldsKeys.name].invalid = true;
        isValid = false;
      }
      if (formFields[formFieldsKeys.ContactNumber] === '') {
        validationObjTemp[formFieldsKeys.ContactNumber].invalid = true;
        isValid = false;
      }
      if (formFields[formFieldsKeys.FileGeneration] === '') {
        validationObjTemp[formFieldsKeys.FileGeneration].invalid = true;
        isValid = false;
      }
      if (formFields[formFieldsKeys.OrderNumberExcceds].length == 0) {
        validationObjTemp[formFieldsKeys.OrderNumberExcceds].invalid = true;
        isValid = false;
      }
      if (formFields[formFieldsKeys.TaxPercentage].length == 0) {
        validationObjTemp[formFieldsKeys.TaxPercentage].invalid = true;
        isValid = false;
      }
      if (formFields[formFieldsKeys.companyLogo].length == 0) {
        validationObjTemp[formFieldsKeys.companyLogo].invalid = true;
        isValid = false;
      }
      if (formFields[formFieldsKeys.email] === '') {
        validationObjTemp[formFieldsKeys.email].invalid = true;
        isValid = false;
      }
      if (formFields[formFieldsKeys.address] === '') {
        validationObjTemp[formFieldsKeys.address].invalid = true;
        isValid = false;
      }
    } else {
      if (formFields[formFieldsKeys.name] === '') {
        validationObjTemp[formFieldsKeys.name].invalid = true;
        isValid = false;
      }
      if (formFields[formFieldsKeys.address] === '') {
        validationObjTemp[formFieldsKeys.address].invalid = true;
        isValid = false;
      }
      if (formFields[formFieldsKeys.city] === '') {
        validationObjTemp[formFieldsKeys.city].invalid = true;
        isValid = false;
      }
      if (formFields[formFieldsKeys.postalCode] === '') {
        validationObjTemp[formFieldsKeys.postalCode].invalid = true;
        isValid = false;
      }
      if (formFields[formFieldsKeys.company] === '') {
        validationObjTemp[formFieldsKeys.company].invalid = true;
        isValid = false;
      }
      if (formFields[formFieldsKeys.web] === '') {
        validationObjTemp[formFieldsKeys.web].invalid = true;
        isValid = false;
      }
      if (formFields[formFieldsKeys.designation] === '') {
        validationObjTemp[formFieldsKeys.designation].invalid = true;
        isValid = false;
      }
      if (formFields[formFieldsKeys.companyLogo] === '') {
        validationObjTemp[formFieldsKeys.companyLogo].invalid = true;
        isValid = false;
      }
      if (formFields[formFieldsKeys.locktimeout] === '') {
        validationObjTemp[formFieldsKeys.locktimeout].invalid = true;
        isValid = false;
      }
      if (formFields[formFieldsKeys.ContactNumber] === '') {
        validationObjTemp[formFieldsKeys.ContactNumber].invalid = true;
        isValid = false;
      }
    }
    setValidationObj({...validationObjTemp});
    return isValid;
  };
 
  const UpdateProfile = async () => {
    setIsLoading(true);
    let params = {};
    if (UserLogin?.userType == 0 || UserLogin?.userType == 3) {
      params = {
        app_name: formFields[formFieldsKeys.name],
        app_logo: formFields?.[formFieldsKeys.companyLogo],
        contact_email: formFields?.[formFieldsKeys.email],
        contact_address: formFields?.[formFieldsKeys.address],
        contact_number: formFields?.[formFieldsKeys.ContactNumber],
        file_gen_if_exceed: formFields?.[formFieldsKeys.FileGeneration],
        order_no_start: formFields?.[formFieldsKeys.OrderNumberExcceds],
        tax_percentage: formFields?.[formFieldsKeys.TaxPercentage],
      };
    } else {
      params = {
        name: formFields?.[formFieldsKeys.name],
        address: formFields?.[formFieldsKeys.address],
        mobile: formFields?.[formFieldsKeys.ContactNumber],
        city: formFields?.[formFieldsKeys.city],
        zipCode: formFields?.[formFieldsKeys.postalCode],
        companyName: formFields?.[formFieldsKeys.company],
        websiteUrl: formFields?.[formFieldsKeys.web],
        designation: formFields?.[formFieldsKeys.designation],
        companyLogo: formFields?.[formFieldsKeys.companyLogo],
        locktimeout: formFields?.[formFieldsKeys.locktimeout],
      };
    }
    let url =
      UserLogin.userType == 0 || UserLogin.userType == 3
        ? Constants.apiEndPoints['administration/app-setting-update']
        : Constants.apiEndPoints['update-profile'];
    console.log('params', params, 'url', url);
    let response = await APIService.postData(
      url,
      params,
      UserLogin?.access_token,
      null,
      'UpdateProfile',
    );
    if (!response.errorMsg) {
      setIsLoading(false);
      let reduxData = {...UserLogin, ...response?.data?.data};
      dispatch(UserLoginAction(reduxData));
      props.navigation.goBack();
      Alert.alert(
        Constants.success,
        response?.data?.message ?? 'Profile updated successfully',
      );
    } else {
      setIsLoading(false);
      Alert.alert(
        Constants.danger,
        response.errorMsg ?? 'Something went wrong',
      );
    }
  };

  const handleInputChange = (key, value) => {
    setFormFields({...formFields, [key]: value});
  };
  const removeErrorTextForInputThatUserIsTyping = uniqueKey => {
    let tempValidationObj = {...validationObj};
    tempValidationObj[uniqueKey] = initialValidationObj[uniqueKey];
    setValidationObj(tempValidationObj);
  };
  return (
    <BaseContainer
      title="Edit Profile"
      leftIcon="arrow-back"
      onPressLeftIcon={() => props.navigation.goBack()}
    >
      <TransparentLoader isLoading={isLoading} />
      <KeyboardAwareScrollView
        style={styles.view}
        contentContainerStyle={{paddingBottom: 50}}
        keyboardShouldPersistTaps={'never'}
        showsVerticalScrollIndicator={false}
      >
       
          <UploadAvtar
          UserLogin={UserLogin}
          doc_key={formFieldsKeys.companyLogo}
          doc_value={formFields[formFieldsKeys.companyLogo]}
          handleInputChange={(a, b) => handleInputChange(a, b)}
          removeErrorTextForInputThatUserIsTyping={a =>
            removeErrorTextForInputThatUserIsTyping(a)
          }
        />

        {UserLogin.userType === 0 || UserLogin.userType === 3 ? (
          <>
            <InputValidation
              validationObj={validationObj}
              uniqueKey={formFieldsKeys?.name}
              value={formFields[formFieldsKeys.name]}
              placeHolder={'Name'}
              onChangeText={text => {
                removeErrorTextForInputThatUserIsTyping(formFieldsKeys.name);
                handleInputChange(formFieldsKeys.name, text);
              }}
              label={'Name'}
            />
            <InputValidation
              validationObj={validationObj}
              uniqueKey={formFieldsKeys?.email}
              value={formFields[formFieldsKeys.email]}
              placeHolder={'Email'}
              onChangeText={text => {
                removeErrorTextForInputThatUserIsTyping(formFieldsKeys.email);
                handleInputChange(formFieldsKeys.email, text);
              }}
              label={'Email'}
            />
            <InputValidation
              validationObj={validationObj}
              uniqueKey={formFieldsKeys?.ContactNumber}
              value={formFields[formFieldsKeys.ContactNumber]}
              placeHolder={'ContactNumber'}
              onChangeText={text => {
                removeErrorTextForInputThatUserIsTyping(
                  formFieldsKeys.ContactNumber,
                );
                handleInputChange(formFieldsKeys.ContactNumber, text);
              }}
              label={'ContactNumber'}
            />
            <InputValidation
              validationObj={validationObj}
              uniqueKey={formFieldsKeys?.address}
              value={formFields[formFieldsKeys.address]}
              placeHolder={'Address'}
              onChangeText={text => {
                removeErrorTextForInputThatUserIsTyping(formFieldsKeys.address);
                handleInputChange(formFieldsKeys.address, text);
              }}
              label={'Address'}
            />
            <InputValidation
              validationObj={validationObj}
              uniqueKey={formFieldsKeys?.FileGeneration}
              value={formFields[formFieldsKeys.FileGeneration]}
              placeHolder={'FileGeneration'}
              onChangeText={text => {
                removeErrorTextForInputThatUserIsTyping(
                  formFieldsKeys.FileGeneration,
                );
                handleInputChange(formFieldsKeys.FileGeneration, text);
              }}
              label={'FileGeneration'}
            />
            <InputValidation
              validationObj={validationObj}
              uniqueKey={formFieldsKeys?.OrderNumberExcceds}
              value={formFields[formFieldsKeys.OrderNumberExcceds]}
              placeHolder={'OrderNumberExcceds'}
              onChangeText={text => {
                removeErrorTextForInputThatUserIsTyping(
                  formFieldsKeys.OrderNumberExcceds,
                );
                handleInputChange(formFieldsKeys.OrderNumberExcceds, text);
              }}
              label={'OrderNumberExcceds'}
            />
            <InputValidation
              validationObj={validationObj}
              uniqueKey={formFieldsKeys?.TaxPercentage}
              value={formFields[formFieldsKeys?.TaxPercentage]}
              placeHolder={'TaxPercentage'}
              onChangeText={text => {
                removeErrorTextForInputThatUserIsTyping(
                  formFieldsKeys.TaxPercentage,
                );
                handleInputChange(formFieldsKeys.TaxPercentage, text);
              }}
              label={'TaxPercentage'}
            />
          </>
        ) : (
          <>
            <InputValidation
              validationObj={validationObj}
              uniqueKey={formFieldsKeys?.name}
              value={formFields[formFieldsKeys.name]}
              placeHolder={'Name'}
              onChangeText={text => {
                removeErrorTextForInputThatUserIsTyping(formFieldsKeys.name);
                handleInputChange(formFieldsKeys.name, text);
              }}
              label={'Name'}
            />
            <InputValidation
              validationObj={validationObj}
              multiline={true}
              uniqueKey={formFieldsKeys?.address}
              value={formFields[formFieldsKeys.address]}
              placeHolder={'Address'}
              onChangeText={text => {
                removeErrorTextForInputThatUserIsTyping(formFieldsKeys.address);
                handleInputChange(formFieldsKeys.address, text);
              }}
              label={'Address'}
            />
            <InputValidation
              validationObj={validationObj}
              uniqueKey={formFieldsKeys?.ContactNumber}
              value={formFields[formFieldsKeys.ContactNumber]}
              placeHolder={'ContactNumber'}
              onChangeText={text => {
                removeErrorTextForInputThatUserIsTyping(
                  formFieldsKeys.ContactNumber,
                );
                handleInputChange(formFieldsKeys.ContactNumber, text);
              }}
              label={'ContactNumber'}
            />
            <InputValidation
              validationObj={validationObj}
              uniqueKey={formFieldsKeys?.city}
              value={formFields[formFieldsKeys.city]}
              placeHolder={'City'}
              onChangeText={text => {
                removeErrorTextForInputThatUserIsTyping(formFieldsKeys.city);
                handleInputChange(formFieldsKeys.city, text);
              }}
              label={'City'}
            />
            <InputValidation
              validationObj={validationObj}
              uniqueKey={formFieldsKeys?.postalCode}
              value={formFields[formFieldsKeys.postalCode]}
              placeHolder={'PostalCode'}
              onChangeText={text => {
                removeErrorTextForInputThatUserIsTyping(
                  formFieldsKeys.postalCode,
                );
                handleInputChange(formFieldsKeys.postalCode, text);
              }}
              label={'PostalCode'}
            />
            <InputValidation
              validationObj={validationObj}
              uniqueKey={formFieldsKeys?.web}
              value={formFields[formFieldsKeys.web]}
              placeHolder={'Web Url'}
              onChangeText={text => {
                removeErrorTextForInputThatUserIsTyping(formFieldsKeys.web);
                handleInputChange(formFieldsKeys.web, text);
              }}
              label={'Web Url'}
            />
            <InputValidation
              validationObj={validationObj}
              uniqueKey={formFieldsKeys?.company}
              value={formFields[formFieldsKeys.company]}
              placeHolder={'Company Name'}
              onChangeText={text => {
                removeErrorTextForInputThatUserIsTyping(formFieldsKeys.company);
                handleInputChange(formFieldsKeys.company, text);
              }}
              label={'Company Name'}
            />
            <InputValidation
              validationObj={validationObj}
              uniqueKey={formFieldsKeys?.designation}
              value={formFields[formFieldsKeys.designation]}
              placeHolder={'Designation'}
              onChangeText={text => {
                removeErrorTextForInputThatUserIsTyping(
                  formFieldsKeys.designation,
                );
                handleInputChange(formFieldsKeys.designation, text);
              }}
              label={'Designation'}
            />
            <InputValidation
              validationObj={validationObj}
              uniqueKey={formFieldsKeys?.locktimeout}
              value={formFields[formFieldsKeys.locktimeout]}
              placeHolder={'Locktimeout'}
              onChangeText={text => {
                removeErrorTextForInputThatUserIsTyping(
                  formFieldsKeys.locktimeout,
                );
                handleInputChange(formFieldsKeys.locktimeout, text);
              }}
              label={'Locktimeout'}
            />
          </>
        )}

        <CustomButton
          onPress={() => {
            if (validation()) {
              UpdateProfile();
            } else {
              Alert.alert(Constants.danger, 'Validation Error');
            }
          }}
          title={'Update'}
        />
 
      </KeyboardAwareScrollView>
    </BaseContainer>
  );
};
export default Editprofile;

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: 'white',
    padding: Constants.globalPadding,
  },
  imageView: {
    textAlign: 'center',
    borderWidth: 1,
    width: 80,
    height: 80,
    borderRadius: 70,
    position: 'relative',
  },
  touchAbleStyle: {
    position: 'absolute',
    left: 60,
    top: 40,
    backgroundColor: 'white',
    borderRadius: 20,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
