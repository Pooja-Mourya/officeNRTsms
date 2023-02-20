import { Text, View, StyleSheet, Alert, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { fonts } from '../../assets/Assets';
import InputValidation from '../../components/InputValidation';
import BaseContainer from '../../components/BaseContainer';
import { useSelector } from 'react-redux';
import DropDownComp from '../../components/DropDownComp';
import APIService from '../../Services/APIService';
import Constants from '../../constant/Constants';
import CustomButton from '../../components/CustomButton';
import { DataTable, Portal } from 'react-native-paper';
import { getProportionalFontSize } from '../../Services/CommonMethods';
import moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import TransparentLoader from '../../components/TransparentLoader';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const creditType = [
  {
    id: '1',
    title: 'Pending',
  },
  {
    id: '2',
    title: 'FAILED',
  },
  {
    id: '3',
    title: 'Accepted',
  },
  {
    id: '4',
    title: 'DELIVRD',
  },
];

const ResendCampaign = props => {
  const formFieldsKeys = {
    reschedule_type: 'reschedule_type',
    campaign_send_date_time: 'campaign_send_date_time',
    ratio_set: 'ratio_set',
    failed_ratio: 'failed_ratio',

    
  };
  const initialValues = {
    [formFieldsKeys.reschedule_type]: '',
    [formFieldsKeys.campaign_send_date_time]: '',
    [formFieldsKeys.ratio_set]: '',
    [formFieldsKeys.failed_ratio]: '',
  };

  const initialValidationObj = {
    [formFieldsKeys.reschedule_type]: {
      invalid: false,
      title: 'Invalid Reschedule Type',
    }, 
    [formFieldsKeys.ratio_set]: {
      invalid: false,
      title: 'Invalid Ratio Set',
    },
    [formFieldsKeys.failed_ratio]: {
      invalid: false,
      title: 'Invalid Failed Ratio',
    },
  };



  const userLogin = useSelector(state => state.global_store.userLogin);
  const [validationObj, setValidationObj] = useState({ ...initialValidationObj });
  const [formValues, setFormValues] = useState(initialValues);
  const [visible, setVisible] = useState(false);
  const [detailData, setDetailData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  let routeParm = props?.route?.params?.itemId ?? {};

  const validation = () => {
    let isValid = true;
    let validationObj = { ...initialValidationObj };
    if (formValues[formFieldsKeys.reschedule_type] == '') {
      isValid = false;
      validationObj[formFieldsKeys.reschedule_type].invalid = true; 
    }
    // if (userLogin?.userType == 0 || userLogin?.userType == 3) {
    //   if (formValues[formFieldsKeys.ratio_set] == '') {
    //     isValid = false;
    //     validationObj[formFieldsKeys.ratio_set].invalid = true;
    //   }
    //   if (formValues[formFieldsKeys.failed_ratio] == '') {
    //     isValid = false;
    //     validationObj[formFieldsKeys.failed_ratio].invalid = true;
    //   }
    // }
    setValidationObj(validationObj);
    return isValid;
  };


  const hideDatePicker = () => {
    setVisible(false);
  };

  const handleConfirm = date => {
    setFormValues({
      ...formValues,
      [formFieldsKeys.campaign_send_date_time]: moment(date).format(
        'YYYY-MM-DD HH:mm:ss',
      ),
    });
    hideDatePicker();
  };

  useEffect(() => {
    if (routeParm) {
      setDetailData({
        ...detailData,
        campaign: routeParm?.campaign,
        message: routeParm?.message,
        total_contacts: routeParm?.total_contacts,
        total_block_number: routeParm?.total_block_number,
        total_invalid_number: routeParm?.total_invalid_number,
        total_credit_deduct: routeParm?.total_credit_deduct,
        total_delivered: routeParm?.total_delivered,
        total_failed: routeParm?.total_failed,
      });
    }
  }, []);

  const resendCompaign = async () => {
    setIsLoading(true);
    let params = {
      reschedule_type: formValues.reschedule_type.title,
      campaign_send_date_time: formValues.campaign_send_date_time??'',
      send_sms_id: routeParm?.id,
    }; 
    if (userLogin?.userType === 0 || userLogin?.userType === 3) {
      params = {
        ...formValues,
        ...params,
      };
    }

    let url = Constants.apiEndPoints.repushCampaign;
    console.log('params', params);
    // return;
    let response = await APIService.postData(
      url,
      params,
      userLogin.access_token,
      null,
      'resendCompaign',
    );

    if (!response.errorMsg) {
      setIsLoading(false);
      setFormValues(initialValues);
      props.navigation.navigate('CampaignList');
      Alert.alert('Success', 'Campaign Resend Successfully');
    } else {
      setIsLoading(false);
      Alert.alert(Constants.danger, response.errorMsg ?? 'Something went wrong');
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
      onPressLeftIcon={() => props.navigation.goBack()}
      leftIcon="arrow-back"
      title="Resend Compaign">
      <TransparentLoader isLoading={isLoading} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 50,
        }}
        style={{
          flex: 1,
          backgroundColor: 'white',
          padding: Constants.globalPadding,
        }} >
        <View
          style={{
            paddingBottom: 100,
            marginTop: 10,
          }}>
          <View
            style={{
              marginTop: 10,
              marginBottom: 10,
            }}>
            <Text
              style={{
                fontSize: getProportionalFontSize(16),
                fontFamily: fonts.Proxima_Nova_Sbold,
                color: '#000',
              }}>
              Compaign : {detailData.campaign}
            </Text>
          </View>
          <Text style={{}}>Message : {detailData.message}</Text>
          <Text
            style={{
              fontSize: getProportionalFontSize(16),
              fontFamily: fonts.Proxima_Nova_Sbold,
              color: '#000',
              marginTop: 10,
              fontWeight: 'bold',
              marginBottom: 10,
            }}>
            Transaction
          </Text>
          <DataTable>
            <DataTable.Row>
              <AntDesign name="contacts" size={20} color="black" style={styles.iconStyle} />
              <DataTable.Cell>Contacts</DataTable.Cell>
              <DataTable.Cell numeric>
                {detailData.total_contacts}
              </DataTable.Cell>
            </DataTable.Row>

            <DataTable.Row>
              <AntDesign name="creditcard" size={20} color="black" style={styles.iconStyle} />
              <DataTable.Cell>Credit</DataTable.Cell>
              <DataTable.Cell numeric>
                {detailData.total_credit_deduct}
              </DataTable.Cell>
            </DataTable.Row>
            <DataTable.Row>
              <Entypo name="block" size={20} color="black" style={styles.iconStyle} />
              <DataTable.Cell>Block</DataTable.Cell>
              <DataTable.Cell numeric>
                {detailData.total_block_number}
              </DataTable.Cell>
            </DataTable.Row>
            <DataTable.Row>
              <MaterialCommunityIcons name="truck-delivery" size={20} color="black" style={styles.iconStyle} />
              <DataTable.Cell>Delivered</DataTable.Cell>
              <DataTable.Cell numeric>
                {detailData.total_delivered}
              </DataTable.Cell>
            </DataTable.Row>
            <DataTable.Row>
              <MaterialIcons name="sms-failed" size={20} color="black" style={styles.iconStyle} />
              <DataTable.Cell>Failed</DataTable.Cell>
              <DataTable.Cell numeric>{detailData.total_failed}</DataTable.Cell>
            </DataTable.Row>
          </DataTable>

          <DropDownComp
            data={creditType}
            validationObj={validationObj}
            uniqueKey={formFieldsKeys.reschedule_type}
            onPressItem={item => {
              handleInputChange(formFieldsKeys.reschedule_type, item);
              removeErrorTextForInputThatUserIsTyping(
                formFieldsKeys.reschedule_type,
              );
            }}
            keyToShowData="title"
            keyToCompareData="id"
            placeHolder={'Reschedule Type'}
            isSearch={'Search Reschedule Type ...'}
            value={formValues.reschedule_type.title}
          />
         
          <InputValidation 
            iconRight="calendar"
            placeHolder="Select Date"
            editable={false}
            label="Select Date"
            isIconTouchable={true}
            onPressIcon={() => setVisible(true)}
            value={formValues.campaign_send_date_time}
            onChangeText={text => {
              handleInputChange(formFieldsKeys.campaign_send_date_time, text);  

            }}
          />
          {(userLogin?.userType === 0 || userLogin?.userType === 3) && <>
            <InputValidation
              validationObj={validationObj}
              uniqueKey={formFieldsKeys.ratio_set}
              label="Ratio Set"
              placeHolder="Ratio Set"
              keyboardType="numeric"
              value={formValues.ratio_set}
              onChangeText={text => {
                handleInputChange(formFieldsKeys.ratio_set, text);
                removeErrorTextForInputThatUserIsTyping(formFieldsKeys.ratio_set);
              }}
            />
            <InputValidation
              validationObj={validationObj}
              uniqueKey={formFieldsKeys.failed_ratio}
              label="Failed Ratio"
              placeHolder="Failed Ratio"
              keyboardType="numeric"
              value={formValues.failed_ratio}
              onChangeText={text => {
                handleInputChange(formFieldsKeys.failed_ratio, text);
                removeErrorTextForInputThatUserIsTyping(
                  formFieldsKeys.failed_ratio,
                );
              }}
            /></>}

          <CustomButton
            title="Resend Campaign"
            onPress={() => {
              if (validation()) {
                resendCompaign();
              } else {
                Alert.alert('Error', 'Validation failed');
              }
            }}
          />
          <DateTimePickerModal
            isVisible={visible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />
        </View>
      </ScrollView>
    </BaseContainer>
  );
};

export default ResendCampaign;
const styles = StyleSheet.create({
  iconStyle: {
    marginRight: 10, marginTop: 10
  },
});
