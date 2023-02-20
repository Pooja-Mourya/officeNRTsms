import { StyleSheet, Text, View, Alert } from 'react-native';
import React, { useState, useEffect } from 'react'; 
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import InputValidation from '../../../components/InputValidation';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import APIService from '../../../Services/APIService';
import Constants from '../../../constant/Constants';
import { useSelector, useDispatch } from 'react-redux';
import CustomButton from '../../../components/CustomButton';
import DropDownComp from '../../../components/DropDownComp';
import { getProportionalFontSize } from '../../../Services/CommonMethods';
import Colors from '../../../assets/Colors';

const DltFilterTemplate = props => {
  const { setModalVisible, setFilterData } = props;
  const formFieldsKeys = {
    dlt_template_id: 'dlt_template_id',
    header_id: 'header_id',
    manage_sender_id: 'manage_sender_id',
    sender_id: 'sender_id',
    status: 'status',
    template_name: 'template_name',
    unicode: 'unicode',
    user_id: 'user_id',
  };
  const initialValues = {
    [formFieldsKeys.dlt_template_id]: '',
    [formFieldsKeys.header_id]: '',
    [formFieldsKeys.manage_sender_id]: '',
    [formFieldsKeys.sender_id]: '',
    [formFieldsKeys.status]: '',
    [formFieldsKeys.template_name]: '',
    [formFieldsKeys.unicode]: '',
    [formFieldsKeys.user_id]: '',


  };

  // REDUX hooks 
  const userLogin = useSelector(state => state.global_store.userLogin);
  // useState hooks
  const [formValues, setFormValues] = useState(initialValues);
  const [userData, setUserData] = useState([]);
  const [senderIdData, setSenderIdData] = useState([]);
  const [dltTemplateData, setDltTemplateData] = useState([]); 


  const DltUserTemplateAPI = async () => {
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

  const DltTemplateManageSenderIdAPI = async () => { 
    let url = Constants.apiEndPoints.ManageSenderId;
    // console.log(url, params)
    let response = await APIService.postData(
      url,
      {},
      userLogin.access_token,
      null,
      'DltTemplateManageSenderIdAPI',
    );
    // console.log(response)
    if (!response.errorMsg) {
      setSenderIdData(response.data.data); 
    } else {
      Alert.alert(Constants.danger, response.errorMsg??'Something went wrong');
    }
  };

  const DltTemplateListAPI = async () => { 
    let url = Constants.apiEndPoints.DltTemplateListing;
    // return
    let response = await APIService.postData(
      url,
      {},
      userLogin.access_token,
      null,
      'DltTemplateListAPI',
    );

    if (!response.errorMsg) { 
      setDltTemplateData(response.data.data);
    } else { 
      Alert.alert(Constants.danger, response.errorMsg);
    }
  };


  useEffect(() => {
    DltTemplateListAPI();
    DltTemplateManageSenderIdAPI();
    DltUserTemplateAPI();
  }, []);

  const handleInputChange = (key, value) => {
    setFormValues({
      ...formValues,
      [key]: value,
    });
  }; 
  return (
    <KeyboardAwareScrollView
      style={{
        flex: 1,
        width: '100%',
        backgroundColor: Colors.white,
      }}
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
        placeHolder={'Template Name'}
        label={'Template Name'}
        value={formValues[formFieldsKeys.template_name]}
        onChangeText={text => {
          handleInputChange(formFieldsKeys.template_name, text);

        }}
      />
      <InputValidation
        placeHolder={'Header ID'}
        label={'Header ID'}
        value={formValues[formFieldsKeys.header_id]}
        onChangeText={text => {
          handleInputChange(formFieldsKeys.header_id, text);


        }}
        keyboardType="numeric"
      /> 
        <DropDownComp
        data={dltTemplateData}
        value={formValues[formFieldsKeys.dlt_template_id]}
        onPressItem={item => {  
          handleInputChange(formFieldsKeys.dlt_template_id, item.dlt_template_id);
         }}
        keyToShowData="dlt_template_id"
        keyToCompareData="id"
        placeHolder="Dlt Template Id"
        isSearch="Search User..."
      />
        <DropDownComp
        data={senderIdData}
        value={formValues[formFieldsKeys.sender_id]}
        onPressItem={item => { 
          handleInputChange(formFieldsKeys.sender_id, item.sender_id);
        }}
        keyToShowData="sender_id"
        keyToCompareData="id"
        placeHolder="Sender ID"
        isSearch="Search User..."
      />
      <DropDownComp
        value={formValues[formFieldsKeys.unicode]}
        data={[
          { id: '1', name: 'Yes' },
          { id: 'no', name: 'No' },
        ]}
        onPressItem={item => {
          handleInputChange(formFieldsKeys.unicode, item.id);
        }}
        keyToShowData="name"
        keyToCompareData="id"
        placeHolder="Unicode"
      />
      <Text style={styles.label}>Status*</Text>
      <View style={styles.checkBoxView}>
        <BouncyCheckbox
          size={20}
          fillColor={'#ffaa33'}
          unfillColor={'white'}
          iconStyle={{ borderColor: '#ffaa33' }}
          isChecked={formValues?.status}
          onPress={value => {
            handleInputChange('status', value);
          }}
        />
        <Text>Status ({formValues?.status ? 'Active' : 'Inactive'})</Text>
      </View>
      <View style={styles.buttonView}>
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

export default DltFilterTemplate;

const styles = StyleSheet.create({
  checkBoxView: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderWidth: 1,
    borderColor: '#ffad33',
    borderRadius: 5,
    height: 55,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 10,
  },
  buttonView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  label: {
    fontSize: getProportionalFontSize(15),
    color: Colors.primary,
  },
});
