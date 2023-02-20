import {Text, View, Alert} from 'react-native';
import React, {useState, useEffect} from 'react';
import {fonts} from '../../../assets/Assets';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import InputValidation from '../../../components/InputValidation';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import APIService from '../../../Services/APIService';
import Constants from '../../../constant/Constants';
import {useSelector} from 'react-redux';
import CustomButton from '../../../components/CustomButton';
import DropDownComp from '../../../components/DropDownComp';
import {getProportionalFontSize} from '../../../Services/CommonMethods';
import Colors from '../../../assets/Colors';

const SenderFilter = props => {
  const {setModalVisible, setFilterData} = props;
  const formFieldsKeys = {
    company_name: 'company_name',
    entity_id: 'entity_id',
    header_id: 'header_id',
    sender_id: 'sender_id',
    status: 'status',
    user_id: 'user_id',
  };
  const initialValues = { 
    [formFieldsKeys.company_name]: '',
    [formFieldsKeys.entity_id]: '',
    [formFieldsKeys.header_id]: '',
    [formFieldsKeys.sender_id]: '',
    [formFieldsKeys.status]: '',
    [formFieldsKeys.user_id]: '',

  };

  const userLogin = useSelector(state => state.global_store.userLogin);
  // useState hooks
  const [formValues, setFormValues] = useState(initialValues);
  const [userData, setUserData] = useState([]);

  const SenderUserTemplateAPI = async () => {
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
      // console.log("dltUserApi", JSON.stringify(response.data.data))
      setUserData(response.data.data);
    } else {
      Alert.alert(response.errorMsg);
    }
  };

  const manageSenderIds = async () => {
    let params = {
      sender_id: '123457',
    };
    let url = Constants.apiEndPoints.manageSenderIds;
    // console.log(url, params)
    let response = await APIService.postData(
      url,
      params,
      userLogin.access_token,
      null,
      'manageSenderIds',
    );
    // console.log(response)
    if (!response.errorMsg) {
      console.log('manageSenderIds', JSON.stringify(response.data.data));
    } else {
      Alert.alert(response.errorMsg);
    }
  };
  useEffect(() => {
    manageSenderIds();
    SenderUserTemplateAPI();
  }, []);

  const handleInputChange = (key, value) => {
    setFormValues({
      ...formValues,
      [key]: value,
    });
  };

  return (
    <KeyboardAwareScrollView 
      keyboardShouldPersistTaps="handled" 
      style={{flex: 1, backgroundColor: Colors.white,width:'100%'}}
      showsVerticalScrollIndicator={false}>
      <DropDownComp
        data={userData}
        value={formValues.user_id}
        onPressItem={item => { 
          handleInputChange(formFieldsKeys.user_id, item.id); 
        }}
        keyToShowData="name"
        keyToCompareData="id"
        placeHolder="User"
        isSearch="Search User..."
      />

      <InputValidation
        placeHolder={'Company Name'}
        label={'Company Name'}
        value={formValues[formFieldsKeys.company_name]}
        onChangeText={text => { 
          handleInputChange(formFieldsKeys.company_name, text);  
        }}
      />
      <InputValidation
        placeHolder={'Sender Id'}
        label={'Sender Id'}
        value={formValues[formFieldsKeys.sender_id]}
        onChangeText={text => { 
          handleInputChange(formFieldsKeys.sender_id, text);  
        }}
      />
      <InputValidation
        placeHolder={'Header Id'}
        label={'Header Id'}
        value={formValues[formFieldsKeys.header_id]}
        onChangeText={text => { 
          handleInputChange(formFieldsKeys.header_id, text);  
        }}
      />
      <InputValidation
        placeHolder={'Entity Id'}
        label={'Entity Id'}
        value={formValues[formFieldsKeys.entity_id]}
        onChangeText={text => { 
          handleInputChange(formFieldsKeys.entity_id, text);  
        }}
      />
      <Text
        style={{
          fontSize: getProportionalFontSize(16),
          fontFamily: fonts.regular,
          color: Colors.primary,
        }}>
        Status*
      </Text>

      <View
        style={{
          borderWidth: 1,
          borderColor: Colors.primary,
          paddingHorizontal: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
          borderRadius: 5,
          alignItems: 'center',
          width: '100%',
          height: 55,
        }}>
        <BouncyCheckbox
          size={20}
          fillColor={'#ffaa33'}
          unfillColor={'white'}
          iconStyle={{borderColor: '#ffaa33'}}
          isChecked={formValues?.status}
          onPress={value => { 
            handleInputChange(formFieldsKeys.status, value);  
          }}
        />
        <Text
          style={{
            fontSize:  getProportionalFontSize(16), 
            alignItems: 'flex-start',
            position: 'absolute',
            left: 30,
          }}>
          {' '}
          Status ({formValues?.status ? 'Active' : 'Inactive'})
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between', 
        }}> 
        <CustomButton
          onPress={() => {
            setFormValues(initialValues);
          }}
          title={'Clear Filter'}
          style={{
            width: '45%', 
          }}
          titleStyle={{
            fontSize:getProportionalFontSize(14),
            lineHeight: 20,
          }}
        />
         <CustomButton
          onPress={() => {
            setFilterData(formValues);
            setModalVisible(false);
          }}
          title={'Apply Filter'}
          style={{
            width: '45%', 
          }}
          titleStyle={{
            fontSize:getProportionalFontSize(14),
            lineHeight: 20,
          }}
        />
      </View>
    </KeyboardAwareScrollView>
  );
};

export default SenderFilter;
