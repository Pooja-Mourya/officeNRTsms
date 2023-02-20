import { StyleSheet, Text, View, Alert, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import InputValidation from '../../components/InputValidation';
import APIService from '../../Services/APIService';
import Constants from '../../constant/Constants';
import { useSelector } from 'react-redux';
import CustomButton from '../../components/CustomButton';
import { fonts } from '../../assets/Assets';
import Colors from '../../assets/Colors';
import DropDownComp from '../../components/DropDownComp';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { getProportionalFontSize } from '../../Services/CommonMethods'; 

const CampaignFilter = props => {   
  const { setModalVisible, setFilterData } = props;
  const formFieldsKeys = {
    user_id: 'user_id',
    campaign: 'campaign',
    status: 'status',
    dlt_template_id: "dlt_template_id",
    message_type: 'message_type',
    sender_id: "sender_id",
    sms_type: "sms_type",
  };
  const initialValues = {
    [formFieldsKeys.user_id]: '',
    [formFieldsKeys.campaign]: '',
    [formFieldsKeys.status]: '',
    [formFieldsKeys.dlt_template_id]: '',
    [formFieldsKeys.message_type]: '',
    [formFieldsKeys.sender_id]: '',
    [formFieldsKeys.sms_type]: '',
  };


  const userLogin = useSelector(state => state.global_store.userLogin); 
  const [userData, setUserData] = useState([]);
  const [dltTemplate, setDltTemplate] = useState([]) 
  const [formValues, setFormValues] = useState(initialValues);
 

 
  const CampaignUserData = async () => {
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
      setUserData(response.data.data);
    } else {
      Alert.alert(Constants.danger, response.errorMsg ?? 'Something went wrong');
    }
  };
  const DltTemplateId = async () => {
    let params = {
      page: 1,
      per_page_record: 10,
    };
    let url = Constants.apiEndPoints.DltTemplateListing;
    // console.log(url, params)
    let response = await APIService.postData(
      url,
      params,
      userLogin.access_token,
      null,
      'DltTemplateUsersAPI',
    );
    if (!response.errorMsg) {
      setDltTemplate(response.data.data?.data);
    } else {
      Alert.alert(Constants.danger, response.errorMsg ?? 'Something went wrong');
    }
  };

 
  useEffect(() => { 
    CampaignUserData();
    DltTemplateId();
  }, []);

  const handleInputChange = (key, value) => {
    setFormValues({
      ...formValues,
      [key]: value,
    });
  };
 

  return (
    <ScrollView
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
            handleInputChange('user_id', item.id);
          }}
          keyToShowData="name"
          keyToCompareData="id"
          placeHolder="User"
          isSearch="Search User..."
        /> 
        <DropDownComp
          data={dltTemplate}
          value={formValues.dlt_template_id}
          onPressItem={item => {
            handleInputChange('dlt_template_id', item.template_name);
          }}
          keyToShowData="dlt_template_id"
          keyToCompareData="id"
          placeHolder="Dlt Template"
          isSearch="Search User..."
        />
       
        <DropDownComp
          data={[
            { id: 1, name: 'English' },
            { id: 2, name: 'Unicode' },
          ]}
          value={formValues.message_type}
          onPressItem={item => {
            handleInputChange('message_type', item.id);

          }}
          keyToShowData="name"
          keyToCompareData="id"
          placeHolder="Message Type"
        />
        <DropDownComp
          data={[
            { id: 1, name: 'Normal SMS' },
            { id: 2, name: 'Custom SMS' },
          ]}
          value={formValues.sms_type}
          onPressItem={item => {
            handleInputChange('sms_type', item.id);

          }}
          keyToShowData="name"
          keyToCompareData="id"
          placeHolder="Sms Type"
        />
           <InputValidation
          placeHolder={'Company Name'}
          label={'Company Name'}
          value={formValues[formFieldsKeys.campaign]}
          onChangeText={text => {
            handleInputChange(formFieldsKeys.campaign, text);
          }}
        />
         <InputValidation
          placeHolder={'Sender Id'} 
          keyboardType="numeric"
          label={'Sender Id'}
          value={formValues[formFieldsKeys.sender_id]}
          onChangeText={text => {
            handleInputChange(formFieldsKeys.sender_id, text);

          }}
        />
        <Text
          style={{
            fontSize: getProportionalFontSize(14),
            fontFamily: fonts.regular,
            color: Colors.primary,
            marginTop: 5,

          }}
        >Status*</Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: Colors.primary,
            borderRadius: 5,
            padding: 10,
            width: '100%',
            height: 55,

          }}>
          <BouncyCheckbox
            size={20}
            fillColor={'#ffaa33'}
            unfillColor={'white'}
            iconStyle={{ borderColor: '#ffaa33' }}
            isChecked={formValues?.status}
            onPress={value => {
              handleInputChange(formFieldsKeys.status, value); 
            }}
          />
          <Text
            style={{
              fontSize: getProportionalFontSize(14),
              fontFamily: fonts.regular,
              color: Colors.black,
              alignItems: 'flex-start',
              marginRight: '50%',
              marginTop: 5,
            }}>
            Status ({formValues?.status ? 'Active' : 'Inactive'})
          </Text>
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
      </ScrollView> 
  );
};

export default CampaignFilter;
const styles = StyleSheet.create({
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
});
