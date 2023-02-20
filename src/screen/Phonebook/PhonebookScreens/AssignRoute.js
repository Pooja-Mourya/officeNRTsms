import {StyleSheet, Text, Alert, View, ScrollView} from 'react-native';
import React, {useState, useEffect} from 'react';
import DropDownComp from '../../../components/DropDownComp';
import {useSelector} from 'react-redux';
import Constants from '../../../constant/Constants';
import APIService from '../../../Services/APIService';
import CustomButton from '../../../components/CustomButton';
import TransparentLoader from '../../../components/TransparentLoader';

const AssignRoute = ({navigation}) => {
  const initialValues = {
    promotional_route: '',
    transaction_route: '',
    two_waysms_route: '',
    user_id: '',
    voice_sms_route: '',
  };
  const formFieldsKeys = {
    promotional_route: 'promotional_route',
    transaction_route: 'transaction_route',
    two_waysms_route: 'two_waysms_route',
    user_id: 'user_id',
    voice_sms_route: 'voice_sms_route',
  };

  const initialValidationObj = {
    [formFieldsKeys.promotional_route]: {
      title: 'Invalid promotional_route',
      invalid: false,
    },
    [formFieldsKeys.transaction_route]: {
      title: 'Invalid transaction_route',
      invalid: false,
    },
    [formFieldsKeys.two_waysms_route]: {
      title: 'Invalid two_waysms_route',
      invalid: false,
    },
    [formFieldsKeys.user_id]: {
      title: 'Invalid user_id',
      invalid: false,
    },
    [formFieldsKeys.voice_sms_route]: {
      title: 'Invalid voice_sms_route',
      invalid: false,
    },
  };

  const validation = () => {
    let isValid = true;
    let validationObj = {...initialValidationObj};
    if (formValues.user_id === '') {
      validationObj[formFieldsKeys.user_id].invalid = true;
      isValid = false;
    }
    if (formValues.transaction_route === '') {
      validationObj[formFieldsKeys.transaction_route].invalid = true;
      isValid = false;
    }
    if (formValues.promotional_route === '') {
      validationObj[formFieldsKeys.promotional_route].invalid = true;
      isValid = false;
    }
    setValidationObj(validationObj);
    return isValid;
  };
  const [userData, setUserData] = useState([]);
  const userLogin = useSelector(state => state.global_store.userLogin);
  const [validationObj, setValidationObj] = useState(initialValidationObj);
  const [formValues, setFormValues] = useState(initialValues);
  const [isLoading, setIsLoading] = useState(false);
  const [route, setRoute] = useState([]);

  useEffect(() => {
    getUsersData();
    getSecondaryRouteList();
  }, []);

  const getUsersData = async () => {
    let params = {
      page: 1,
      per_page_record: 10,
    };
    let url = Constants.apiEndPoints.users;
    let response = await APIService.postData(
      url,
      params,
      userLogin.access_token,
      null,
      'getUsersData',
    );
    if (!response.errorMsg) {
      setUserData(response?.data?.data?.data);
    } else {
      Alert.alert(Constants.danger, response.errorMsg);
    }
  };

  const getSecondaryRouteList = async () => {
    let params = {
      page: 1,
      per_page_record: 10,
    };
    let url = Constants.apiEndPoints.SecondaryRoutes;
    let response = await APIService.postData(
      url,
      params,
      userLogin.access_token,
      null,
      'getSecondaryRouteList',
    );
    if (!response.errorMsg) {
      setRoute(response?.data?.data?.data);
    } else {
      Alert.alert(Constants.danger, response.errorMsg);
    }
  };

  const assignRoute = async () => {
    setIsLoading(true);
    let params = {
      ...formValues,
    };
    let url = Constants.apiEndPoints.assignRoute;
    console.log(url, params);
    // return;
    let response = await APIService.postData(
      url,
      params,
      userLogin.access_token,
      null,
      'assignRoute',
    );
    if (!response.errorMsg) {
      setIsLoading(false); 
    navigation.goBack();
      Alert.alert(Constants.success, response?.data?.message);
    } else {
      setIsLoading(false);
      Alert.alert(Constants.danger, response.errorMsg);
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
      title="Assign Route"
      leftIcon="arrow-back"
      onPressLeftIcon={() => navigation.pop()}>
           <TransparentLoader isLoading={isLoading} />
      <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ 
        paddingBottom:100
      }}
      >
        <DropDownComp
          data={userData}
          validationObj={validationObj}
          uniqueKey={formFieldsKeys.user_id}
          onPressItem={item => {
            handleInputChange(formFieldsKeys.user_id, item.id);
            removeErrorTextForInputThatUserIsTyping(formFieldsKeys.user_id);
          }}
          keyToShowData={'name'}
          keyToCompareData={'id'}
          placeHolder={'Select User'}
          value={formValues.user_id}
        /> 
        <DropDownComp
          data={route}
          validationObj={validationObj}
          uniqueKey={formFieldsKeys.promotional_route}
          onPressItem={item => {
            handleInputChange(formFieldsKeys.promotional_route, item.id);
            removeErrorTextForInputThatUserIsTyping(
              formFieldsKeys.promotional_route,
            );
          }}
          keyToShowData={'sec_route_name'}
          keyToCompareData={'id'}
          placeHolder={'Promotional Route'}
          value={formValues.promotional_route}
        /> 
        <DropDownComp
          data={route}
          validationObj={validationObj}
          uniqueKey={formFieldsKeys.transaction_route}
          onPressItem={item => {
            handleInputChange(formFieldsKeys.transaction_route, item.id);
            removeErrorTextForInputThatUserIsTyping(
              formFieldsKeys.transaction_route,
            );
          }}
          keyToShowData={'sec_route_name'}
          keyToCompareData={'id'}
          placeHolder={'Transactional Route'}
          value={formValues.transaction_route}
        /> 
        <DropDownComp
          data={route}
          onPressItem={item => {
            handleInputChange(formFieldsKeys.two_waysms_route, item.id);
            removeErrorTextForInputThatUserIsTyping(
              formFieldsKeys.two_waysms_route,
            );
          }}
          keyToShowData={'sec_route_name'}
          keyToCompareData={'id'}
          placeHolder={'Two Way Sms Route'}
          value={formValues.two_waysms_route}
        />
        <DropDownComp
          data={route}
          onPressItem={item => {
            handleInputChange(formFieldsKeys.voice_sms_route, item.id);
            removeErrorTextForInputThatUserIsTyping(
              formFieldsKeys.voice_sms_route,
            );
          }}
          keyToShowData={'sec_route_name'}
          keyToCompareData={'id'}
          placeHolder={'Voice Sms Route'}
          value={formValues.voice_sms_route}
        />
        <CustomButton
          title="Assign"
          onPress={() => {
            if (validation()) {
              assignRoute();
            } else {
              Alert.alert(Constants.danger, 'Validation Error');
            }
          }}
        />
      </ScrollView>
    </BaseContainer>
  );
};

export default AssignRoute;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:  Constants.globalPadding,
    backgroundColor: 'white',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
});
