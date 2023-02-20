import {StyleSheet, Text, View, Alert} from 'react-native';
import React, {useState, useEffect} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import InputValidation from '../../components/InputValidation';
import {useSelector} from 'react-redux';
import DropDownComp from '../../components/DropDownComp';
import APIService from '../../Services/APIService';
import Constants from '../../constant/Constants';
import CustomButton from '../../components/CustomButton';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Colors from '../../assets/Colors';
import {getProportionalFontSize} from '../../Services/CommonMethods';

const message = [
  {
    id: '1',
    message: 'English',
  },
  {
    id: '2',
    message: 'Unicode',
  },
];

const sms = [
  {
    id: '1',
    sms: 'Normal SMS',
  },
  {
    id: '2',
    sms: 'Customer SMS',
  },
];

const DeliveryFilter = props => {
  const {setFilterParams, setModalVisible} = props;

  const formFieldsKeys = {
    campaign: 'campaign',
    dlt_templete_id: 'dlt_templete_id',
    sender_id: 'sender_id',
    sms_type: 'sms_type',
    message_type: 'message_type',
    from_date: 'from_date',
    to_date: 'to_date',
    user_id: 'user_id',
    status: 'status',
  };
  const initialValues = {
    [formFieldsKeys.campaign]: '',
    [formFieldsKeys.dlt_templete_id]: '',
    [formFieldsKeys.sender_id]: '',
    [formFieldsKeys.sms_type]: '',
    [formFieldsKeys.message_type]: '',
    [formFieldsKeys.from_date]: '',
    [formFieldsKeys.to_date]: '',
    [formFieldsKeys.user_id]: '',
    [formFieldsKeys.status]: '',
  };

  const userLogin = useSelector(state => state.global_store.userLogin);
  const [formValues, setFormValues] = useState(initialValues);
  const [userData, setUserData] = useState([]);
  const [senderId, setSenderId] = useState([]);
  const [visible, setVisible] = useState(false); 
  const [visibleTo, setVisibleTo] = useState(false); 
  const [error, setError] = useState(false);

  const handleInputChange = (key, value) => {
    setFormValues({
      ...formValues,
      [key]: value,
    });
  };

  const UserAPI = async () => {
    let url = Constants.apiEndPoints.users;
    let response = await APIService.postData(
      url,
      {},
      userLogin.access_token,
      null,
      'UserAPI',
    );
    if (!response.errorMsg) {
      setUserData(response.data.data);
    } else {
      Alert.alert(Constants.danger, response.errorMsg);
    }
  };

  const TemplateIdAPI = async () => {
    let url = Constants.apiEndPoints.DltTemplateListing;
    let response = await APIService.postData(
      url,
      {},
      userLogin.access_token,
      null,
      'DltTemplateIdAPI',
    );
    if (!response.errorMsg) {
      setSenderId(response.data.data);
    } else {
      Alert.alert(Constants.danger, response.errorMsg);
    }
  };

  useEffect(() => {
    UserAPI();
    TemplateIdAPI();
  }, []);

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
        onPressItem={item => handleInputChange(formFieldsKeys.user_id, item.id)}
        value={formValues?.[formFieldsKeys?.user_id?.id]}
        keyToShowData="name"
        keyToCompareData="id"
        placeHolder="Select User"
        isSearch="Search User..."
      />
      <InputValidation
        placeHolder={'Campaign'}
        label={'Campaign'}
        value={formValues?.[formFieldsKeys?.campaign] ?? ''}
        onChangeText={text => handleInputChange(formFieldsKeys?.campaign, text)}
      />

      <InputValidation
        editable={false}
        label={'From'}
        placeHolder="From"
        value={formValues[formFieldsKeys.from_date]}
        onChangeText={text => handleInputChange(formFieldsKeys.from_date, text)}
        iconRight={'calendar'}
        onPressIcon={() => setVisible(true)}
      />
      {
        error && <Text style={styles.error}>Invalid Form date</Text>
      }

      <DateTimePickerModal
        isVisible={visible}
        mode="date"
        onConfirm={date => {
          setFormValues({
            ...formValues,
            [formFieldsKeys.from_date]: moment(date).format('YYYY-MM-DD'),
          }); 
          setVisible(false);
        }}
        onCancel={() => setVisible(false)}
      />

      <InputValidation
        editable={false}
        label={'To'}
        placeHolder="To"
        value={formValues[formFieldsKeys.to_date]}
        onChangeText={text => handleInputChange(formFieldsKeys.to_date, text)}
        iconRight={'calendar'}
        onPressIcon={() => setVisibleTo(true)}
      />
        {
        error && <Text style={styles.error}>Invalid To date</Text>
      }

      <DateTimePickerModal
        isVisible={visibleTo}
        mode="date"
        onConfirm={date => {
          setFormValues({
            ...formValues,
            [formFieldsKeys.to_date]: moment(date).format('YYYY-MM-DD'),
          }); 
          setVisibleTo(false);
        }}
        onCancel={() => setVisibleTo(false)}
      />

      <DropDownComp
        data={senderId}
        value={formValues?.[formFieldsKeys?.sender_id?.id]}
        onPressItem={item => handleInputChange('dlt_templete_id', item)}
        keyToShowData="dlt_template_id"
        keyToCompareData="id"
        placeHolder={'Dlt Template Id'}
        isSearch={'Search Dlt Template Id ...'}
      />

      <InputValidation
        placeHolder={'Sender Id'}
        label={'Sender Id'}
        value={formValues?.[formFieldsKeys?.sender_id] ?? ''}
        onChangeText={text =>
          handleInputChange(formFieldsKeys?.sender_id, text)
        }
      />

      <DropDownComp
        data={message}
        value={formValues?.[formFieldsKeys?.message] ?? ''}
        onPressItem={item =>
          handleInputChange(formFieldsKeys?.message_type, item)
        }
        keyToShowData="message"
        keyToCompareData="id"
        placeHolder={'Message Type'}
        isSearch={'Search Message Type ...'}
      />

      <DropDownComp
        data={sms}
        value={formValues?.[formFieldsKeys?.sms_type] ?? ''}
        onPressItem={item => handleInputChange(formFieldsKeys?.sms_type, item)}
        keyToShowData="sms"
        keyToCompareData="id"
        placeHolder={'Sms Type'}
        isSearch={'Search Sms Type ...'}
      />
      <Text
        style={{
          fontSize: getProportionalFontSize(15),
          color: Colors.darkPrimary,
        }}>
        Status*
      </Text>
      <View style={styles.stsStyle}>
        <View style={styles.status}>
          <BouncyCheckbox
            size={20}
            fillColor={'#ffaa33'}
            unfillColor={'white'}
            iconStyle={{borderColor: '#ffaa33'}}
            isChecked={formValues?.status}
            onPress={value => handleInputChange(formFieldsKeys?.status, value)}
          />
          <Text>Status ({formValues?.status ? 'Active' : 'Inactive'})</Text>
        </View>
      </View>
      <View style={styles.buttonView}>
        <CustomButton
          style={{width: '45%'}}
          titleStyle={{
            fontSize: getProportionalFontSize(14),
            lineHeight: 20,
          }}
          title="Clear Filter"
          onPress={() => setFormValues(initialValues)}
        />
        <CustomButton
          style={{width: '45%'}}
          titleStyle={{
            fontSize: getProportionalFontSize(14),
            lineHeight: 20,
          }}
          title="Apply Filter"
          onPress={() => {
            if (
              formValues?.[formFieldsKeys.from_date] >
                formValues?.[formFieldsKeys.to_date] &&
              formValues?.[formFieldsKeys.to_date] <
                formValues?.[formFieldsKeys.from_date]
            ) {
              setError(true)
              Alert.alert(Constants.danger, 'Date is not valid');
            } else {
              setFilterParams(formValues);
              setModalVisible(false);
            }
          }}
        />
      </View>
    </KeyboardAwareScrollView>
  );
};

export default DeliveryFilter;

const styles = StyleSheet.create({
  status: {
    flexDirection: 'row',
  },
  buttonView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,

  },
  stsStyle: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 5,
    padding: 10,
    height: 60,
    justifyContent: 'center',
  },
});
