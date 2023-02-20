import {Alert, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import BaseContainer from '../../../components/BaseContainer';
import DropDownComp from '../../../components/DropDownComp';
import InputValidation from '../../../components/InputValidation';
import CustomButton from '../../../components/CustomButton';
import Constants from '../../../constant/Constants';
import APIService from '../../../Services/APIService';
import {useSelector} from 'react-redux';
import UploadAvtar from '../../../components/UploadAvtar';
import {
  checkEmailFormat,
  checkMobileNumberFormat,
  checkPasswordFormat,
  checkZipCodeFormat,
  getProportionalFontSize,
  checkUrlFormat,
} from '../../../Services/CommonMethods';
import {RadioButton} from 'react-native-paper';
import Assets from '../../../assets/Assets';
import Colors from '../../../assets/Colors';
import TransparentLoader from '../../../components/TransparentLoader';
 
const DATA = [
  {
    id: 0,
    name: 'Admin',
  },
  {
    id: 1,
    name: 'Reseller',
  },
  {
    id: 2,
    name: 'Client',
  },
  {
    id: 3,
    name: 'Employee',
  },
];

const UserAddFrom = props => {
  
  const formFieldsKeys = {
    address: 'address',
    authority_type: 'authority_type',
    city: 'city',
    companyName: 'companyName',
    designation: 'designation',
    email: 'email',
    locktimeout: 'locktimeout',
    mobile: 'mobile',
    name: 'name',
    password: 'password',
    userType: 'userType',
    username: 'username',
    websiteUrl: 'websiteUrl',
    zipCode: 'zipCode',
    companyLogo: 'companyLogo',
  };
  const initialValues = {
    [formFieldsKeys.address]: '',
    [formFieldsKeys.authority_type]: '',
    [formFieldsKeys.city]: '',
    [formFieldsKeys.companyName]: '',
    [formFieldsKeys.designation]: '',
    [formFieldsKeys.email]: '',
    [formFieldsKeys.locktimeout]: '',
    [formFieldsKeys.mobile]: '',
    [formFieldsKeys.name]: '',
    [formFieldsKeys.password]: '',
    [formFieldsKeys.userType]: '',
    [formFieldsKeys.username]: '',
    [formFieldsKeys.websiteUrl]: '',
    [formFieldsKeys.zipCode]: '',
    [formFieldsKeys.companyLogo]: '',
  };

  const initialValidationObj = {
    [formFieldsKeys.address]: {
      title: 'invalid address',
      invalid: false,
    },
    [formFieldsKeys.authority_type]: {
      title: 'invalid authority_type',
      invalid: false,
    },
    [formFieldsKeys.city]: {
      title: 'invalid city',
      invalid: false,
    },
    [formFieldsKeys.companyName]: {
      title: 'invalid companyName',
      invalid: false,
    },
    [formFieldsKeys.designation]: {
      title: 'invalid designation',
      invalid: false,
    },
    [formFieldsKeys.email]: {
      title: 'invalid email',
      invalid: false,
    },
    [formFieldsKeys.locktimeout]: {
      title: 'invalid locktimeout',
      invalid: false,
    },
    [formFieldsKeys.mobile]: {
      title: 'invalid mobile',
      invalid: false,
    },
    [formFieldsKeys.name]: {
      title: 'invalid name',
      invalid: false,
    },
    [formFieldsKeys.password]: {
      title: 'invalid password',
      invalid: false,
    },
    [formFieldsKeys.userType]: {
      title: 'invalid userType',
      invalid: false,
    },
    [formFieldsKeys.username]: {
      title: 'invalid username',
      invalid: false,
    },
    [formFieldsKeys.websiteUrl]: {
      title: 'invalid websiteUrl',
      invalid: false,
    },
    [formFieldsKeys.zipCode]: {
      title: 'invalid zipCode',
      invalid: false,
    },
    [formFieldsKeys.companyLogo]: {
      title: 'invalid companyLogo',
      invalid: false,
    },
  };

  const validation = () => {
    let isValid = true;
    let validationObj = {...initialValidationObj};
    for (let key in formValues) {
      if (formValues[key] == '' && key != formFieldsKeys.companyLogo) {
        if (isEdit&&key==formFieldsKeys.password) {
          continue;
        } else {
          isValid = false; 
          validationObj[key].invalid = true;
        }
      } else if (key === formFieldsKeys.email) {
        if (!checkEmailFormat(formValues[key])) {
          isValid = false;
          validationObj[key].invalid = true;
          validationObj[key].title = 'Invalid email format';
        }
      } else if (key === formFieldsKeys.mobile) {
        if (!checkMobileNumberFormat(formValues[key])) {
          isValid = false;
          validationObj[key].invalid = true;
          validationObj[key].title = 'Invalid mobile number format';
        }
      } else if (key === formFieldsKeys.password) {
        if (formValues[key].length < 6) {
          isValid = false;

          validationObj[key].invalid = true;
          validationObj[key].title = 'Password must be 6 characters long';
        }
      } else if (key === formFieldsKeys.zipCode) {
        if (!checkZipCodeFormat(formValues[key])) {
          isValid = false;

          validationObj[key].invalid = true;
          validationObj[key].title = 'Invalid zip code format';
        }
      } else if (key === formFieldsKeys.websiteUrl) {
        if (!checkUrlFormat(formValues[key])) { 
          isValid = false;
          validationObj[key].invalid = true;
          validationObj[key].title = 'Invalid url format';
        }
      }else if(key === formFieldsKeys.userType){
        if(formValues[key].name=='Admin'){ 
          isValid = false;
          validationObj[key].invalid = true;
          validationObj[key].title = 'You can not create admin';
        }
      }
    }
    setValidationObj(validationObj);
    return isValid;
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

  const [validationObj, setValidationObj] = useState(initialValidationObj);
  const [formValues, setFormValues] = useState(initialValues);
  const userLogin = useSelector(state => state.global_store.userLogin);
  const [checked, setChecked] = useState();
  const [isLoading, setIsLoading] = useState(false);
  let isEdit = props.route.params.user;
  
  useEffect(() => {
    if (isEdit) {
      let newObj = {...formValues};
      for (let key in formValues) {
        if (isEdit[key]) {
          newObj[key] = isEdit[key];
          setChecked(isEdit.authority_type);
        }
      }
      DATA.map((item, index) => {
        if (item.id === isEdit.userType) {
          newObj['userType'] = item;
        }
      });
      setFormValues({...newObj});
    }
  }, [isEdit]);

  const addUser = async id => {
    setIsLoading(true);
    let params = {
      ...formValues,
      userType: formValues.userType.id,      
    };
    if(id){
      delete params.password;
    }
    let url = '';
    if (id) {
      url = Constants.apiEndPoints['user'] + '/' + id;
    } else {
      url = Constants.apiEndPoints['user'];
    }
    // return
    let response = '';

    if (id) {
      response = await APIService.putData(
        url,
        params,
        userLogin.access_token,
        null,
        'editUser',
      );
    } else {
      response = await APIService.postData(
        url,
        params,
        userLogin.access_token,
        null,
        'addUser',
      );
    }
 

    if (!response.errorMsg) {
      setIsLoading(false);
      id
        ? Alert.alert(Constants.success,response?.data.message??'User Updated Successfully')
        : Alert.alert(Constants.success,response?.data.message??'User Added Successfully');
      props.navigation.goBack();
    } else {
      setIsLoading(false);
      Alert.alert(Constants.danger, response.errorMsg);
    }
  };

  const handleSubmit = () => {
    if (validation()) { 
      addUser(isEdit?.id??null);
    } else {
      Alert.alert(Constants.danger,'validation failed');
    }
  };
 

  return (
    <BaseContainer
      title={isEdit ? 'Edit User' : 'Add User'}
      leftIcon="arrow-back"
      onPressLeftIcon={() => props.navigation.pop()}>
        <TransparentLoader isLoading={isLoading} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'space-between',
          paddingBottom: 100,
          marginHorizontal: 14,
        }}>
        <DropDownComp
          data={DATA}
          uniqueKey={formFieldsKeys.userType}
          validationObj={validationObj}
          onPressItem={item => {
            handleInputChange(formFieldsKeys.userType, item)
            removeErrorTextForInputThatUserIsTyping(formFieldsKeys.userType);
          }}
          keyToShowData="name"
          keyToCompareData="id"
          placeHolder="Select User Type"
          label="User Type"
          value={formValues[formFieldsKeys.userType]?.name}
        />
        

        <InputValidation
          label="Name"
          value={formValues[formFieldsKeys.name]}
          placeHolder="Enter Name"
          uniqueKey={formFieldsKeys.name}
          validationObj={validationObj}
          onChangeText={value => {
            handleInputChange(formFieldsKeys.name, value);
            removeErrorTextForInputThatUserIsTyping(formFieldsKeys.name);
          }}
        />
        <InputValidation
          label="Email"
          value={formValues[formFieldsKeys.email]}
          placeHolder="Enter Email"
          validationObj={validationObj}
          uniqueKey={formFieldsKeys.email}
          onChangeText={value => {
            handleInputChange(formFieldsKeys.email, value);
            removeErrorTextForInputThatUserIsTyping(formFieldsKeys.email);
          }}
        />
        <InputValidation
          label="Mobile"
          value={formValues[formFieldsKeys.mobile]}
          placeHolder="Enter Mobile"
          maxLength={10}
          validationObj={validationObj}
          keyboardType="numeric"
          uniqueKey={formFieldsKeys.mobile}
          onChangeText={value => {
            handleInputChange(formFieldsKeys.mobile, value);
            removeErrorTextForInputThatUserIsTyping(formFieldsKeys.mobile);
          }}
        />
        <InputValidation
          label="Username"
          value={formValues[formFieldsKeys.username]}
          placeHolder="Enter Username"
          validationObj={validationObj}
          uniqueKey={formFieldsKeys.username}
          onChangeText={value => {
            handleInputChange(formFieldsKeys.username, value);

            removeErrorTextForInputThatUserIsTyping(formFieldsKeys.username);
          }}
        />
        {!isEdit && (
          <InputValidation
            label="Password"
            value={formValues[formFieldsKeys.password]}
            placeHolder="Enter Password"
            validationObj={validationObj}
            uniqueKey={formFieldsKeys.password}
            onChangeText={value => {
              handleInputChange(formFieldsKeys.password, value);
              removeErrorTextForInputThatUserIsTyping(formFieldsKeys.password);
            }}
          />
        )}
        <InputValidation
          label="Address"
          value={formValues[formFieldsKeys.address]}
          placeHolder="Enter Address"
          validationObj={validationObj}
          uniqueKey={formFieldsKeys.address}
          onChangeText={value => {
            handleInputChange(formFieldsKeys.address, value);

            removeErrorTextForInputThatUserIsTyping(formFieldsKeys.address);
          }}
        />
        <InputValidation
          label="City"
          value={formValues[formFieldsKeys.city]}
          placeHolder="Enter City"
          validationObj={validationObj}
          uniqueKey={formFieldsKeys.city}
          onChangeText={value => {
            handleInputChange(formFieldsKeys.city, value);
            removeErrorTextForInputThatUserIsTyping(formFieldsKeys.city);
          }}
        />
        <InputValidation
          label="Zip Code"
          uniqueKey={formFieldsKeys.zipCode}
          validationObj={validationObj}
          value={formValues[formFieldsKeys.zipCode]}
          keyboardType="numeric"
          maxLength={6}
          placeHolder="Enter Zip Code"
          onChangeText={value => {
            handleInputChange(formFieldsKeys.zipCode, value);
            removeErrorTextForInputThatUserIsTyping(formFieldsKeys.zipCode);
          }}
        />
        <InputValidation
          label="Website Url"
          uniqueKey={formFieldsKeys.websiteUrl}
          validationObj={validationObj}
          value={formValues[formFieldsKeys.websiteUrl]}
          placeHolder="Enter Website Url"
          onChangeText={value => {
            handleInputChange(formFieldsKeys.websiteUrl, value);
            removeErrorTextForInputThatUserIsTyping(formFieldsKeys.websiteUrl);
          }}
        />
        <InputValidation
          label="Designation"
          uniqueKey={formFieldsKeys.designation}
          validationObj={validationObj}
          value={formValues[formFieldsKeys.designation]}
          placeHolder="Enter Designation"
          onChangeText={value => {
            handleInputChange(formFieldsKeys.designation, value);
            removeErrorTextForInputThatUserIsTyping(formFieldsKeys.designation);
          }}
        />
        <InputValidation
          label="Company Name"
          uniqueKey={formFieldsKeys.companyName}
          validationObj={validationObj}
          value={formValues[formFieldsKeys.companyName]}
          placeHolder="Enter Company Name"
          onChangeText={value => {
            handleInputChange(formFieldsKeys.companyName, value);
            removeErrorTextForInputThatUserIsTyping(formFieldsKeys.companyName);
          }}
        />
        <Text
          style={{
            fontSize: getProportionalFontSize(14),
            color: Colors.primary,
          }}>
          Authority Type*
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginVertical: 10,
            borderWidth: 1,
            borderColor:validationObj[formFieldsKeys.authority_type].invalid?Colors.red:Colors.primary,
            borderRadius: 5,
            height: 55,
            paddingRight: 5,
          }}>
          <RadioButton
            value="1"
            status={checked === '1' ? 'checked' : 'unchecked'}
            onPress={() => {
              setChecked('1');
              handleInputChange(formFieldsKeys.authority_type, '1');
              removeErrorTextForInputThatUserIsTyping(
                formFieldsKeys.authority_type,
              );
            }}
          />
          <Text
            style={{
              fontSize: getProportionalFontSize(15),
              fontFamily: Assets.fonts.medium,
              right: 10,
            }}>
            On Delivered
          </Text>

          <RadioButton
            value="2"
            status={checked === '2' ? 'checked' : 'unchecked'}
            onPress={() => {
              setChecked('2');
              handleInputChange(formFieldsKeys.authority_type, '2');
              removeErrorTextForInputThatUserIsTyping(
                formFieldsKeys.authority_type,
              );
            }}
          />
          <Text
            style={{
              fontSize: getProportionalFontSize(15),
              fontFamily: Assets.fonts.medium,
              right: 10,
            }}>
            On Submission
          </Text>
        </View>
        {validationObj[formFieldsKeys.authority_type].invalid && (
          <Text
            style={{
              color: Colors.red,
              fontSize: getProportionalFontSize(12),
              fontFamily: Assets.fonts.medium,
            }}>
            Invalid Authority Type
          </Text>
        )}
        <InputValidation
          label="Locktimeout"
          uniqueKey={formFieldsKeys.locktimeout}
          validationObj={validationObj}
          value={formValues[formFieldsKeys.locktimeout]}
          placeHolder="Enter Locktimeout"
          keyboardType="numeric"
          onChangeText={value => {
            handleInputChange(formFieldsKeys.locktimeout, value);
            removeErrorTextForInputThatUserIsTyping(formFieldsKeys.locktimeout);
          }}
        />
        <UploadAvtar
          UserLogin={userLogin}
          doc_key={formFieldsKeys.companyLogo}
          doc_value={formValues[formFieldsKeys.companyLogo]}
          handleInputChange={(a, b) => handleInputChange(a, b)}
          removeErrorTextForInputThatUserIsTyping={a =>
            removeErrorTextForInputThatUserIsTyping(a)
          }
        />
        <CustomButton title="Submit" onPress={handleSubmit} />
      </ScrollView>
    </BaseContainer>
  );
};

export default UserAddFrom;

const styles = StyleSheet.create({});
