import {StyleSheet, Text, View, TouchableOpacity, Alert} from 'react-native';
import React, {useState, useEffect} from 'react';
import {fonts} from '../../assets/Assets';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import InputValidation from '../../components/InputValidation';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import Constants from '../../constant/Constants';
import CustomButton from '../../components/CustomButton';
import DropDownComp from '../../components/DropDownComp';
import {getProportionalFontSize} from '../../Services/CommonMethods';
import Colors from '../../assets/Colors';

const statusCode = [
  {
    id: '1',
    code: 'Success',
  },
  {
    id: '2',
    code: 'Info',
  },
  {
    id: '3',
    code: 'Warning',
  },
  {
    id: '4',
    code: 'Error',
  },
  {
    id: '5',
    code: 'Danger',
  },
];

const TemplateFilter = props => {
  const {setModalVisible, setFilterData} = props;

  const formFieldsKeys = {
    notification_for: 'notification_for',
    mail_subject: 'mail_subject',
    mail_body: 'mail_body',
    notification_subject: 'notification_subject',
    notification_body: 'notification_body',
    custom_attributes: 'custom_attributes',
    save_to_database: 'save_to_database',
    status_code: 'status_code',
    route_path: 'route_path',
  };
  const initialValues = {
    [formFieldsKeys.notification_for]: '',
    [formFieldsKeys.mail_subject]: '',
    [formFieldsKeys.mail_body]: '',
    [formFieldsKeys.notification_subject]: '',
    [formFieldsKeys.notification_body]: '',
    [formFieldsKeys.custom_attributes]: '',
    [formFieldsKeys.save_to_database]: '',
    [formFieldsKeys.status_code]: '',
    [formFieldsKeys.route_path]: '',
  };
  const [formValues, setFormValues] = useState(initialValues);

  const handleInputChange = (key, value) => {
    setFormValues({
      ...formValues,
      [key]: value,
    });
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{paddingBottom: 30}} 
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      style={{ 
        flex: 1,
        backgroundColor: Colors.white,
        width: '100%',
      }}>
    
      <InputValidation
        placeHolder={'Notification For'}
        label={'Notification For'}
        value={formValues[formFieldsKeys.notification_for]}
        onChangeText={text => {
          handleInputChange(formFieldsKeys.notification_for, text);
        }}
      />
      <InputValidation
        placeHolder={'Mail Subject'}
        label={'Mail Subject'}
        value={formValues[formFieldsKeys.mail_subject]}
        onChangeText={text => {
          handleInputChange(formFieldsKeys.mail_subject, text);
        }}
      />
      <InputValidation
        placeHolder={'Mail body'}
        label={'Mail body'}
        value={formValues[formFieldsKeys.mail_body]}
        onChangeText={text => {
          handleInputChange(formFieldsKeys.mail_body, text);
        }}
      />
      <InputValidation
        placeHolder={'Notification Subject'}
        label={'Notification Subject'}
        value={formValues[formFieldsKeys.notification_subject]}
        onChangeText={text => {
          handleInputChange(formFieldsKeys.notification_subject, text);
        }}
      />
      <InputValidation
        placeHolder={'Notification Body'}
        label={'Notification Body'}
        value={formValues[formFieldsKeys.notification_body]}
        onChangeText={text => {
          handleInputChange(formFieldsKeys.notification_body, text);
        }}
      />
      <InputValidation
        placeHolder={'Route Path'}
        label={'Route Path(Link)'}
        value={formValues[formFieldsKeys.route_path]}
        onChangeText={text => {
          handleInputChange(formFieldsKeys.route_path, text);
        }}
      />
      <InputValidation
        placeHolder={'Custom Attribute'}
        label={'Custom Attribute'}
        value={formValues[formFieldsKeys.custom_attributes]}
        onChangeText={text => {
          handleInputChange(formFieldsKeys.custom_attributes, text);
        }}
      />
      <Text
        style={{
          fontFamily: fonts.robotoMedium,
          fontSize: getProportionalFontSize(15),
          color: Colors.primary,
        }}
      >
        Save to database*
      </Text>
      <View style={styles.checkBoxView}>
        <BouncyCheckbox
          size={20}
          fillColor={'#ffaa33'}
          unfillColor={'white'}
          iconStyle={{borderColor: '#ffaa33'}}
          isChecked={formValues?.save_to_database}
          onPress={value => {
            handleInputChange('save_to_database', value);
          }}
        />
        <Text style={styles.saveAsTemplate}>
          {' '}
          Save to database (
          {formValues?.save_to_database ? 'Active' : 'Inactive'})
        </Text>
      </View>
      <DropDownComp
        data={statusCode}
        onPressItem={item => handleInputChange('status_code', item)}
        keyToShowData="code"
        keyToCompareData="id"
        placeHolder="Status_code"
        isSearch="Search status_code..."
        onChangeText={text => {
          handleInputChange(formFieldsKeys.status_code, text);
        }}
      />

      <View style={styles.btnView}>
        <CustomButton
          onPress={() => {
            setFormValues(initialValues);
          }}
          title={'Clear Filter'}
          style={{
            width: '45%',
          }}
          titleStyle={{
            fontSize: getProportionalFontSize(14),
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
            fontSize: getProportionalFontSize(14),
            lineHeight: 20,
          }}
        />
      </View>
    </KeyboardAwareScrollView>
  );
};

export default TemplateFilter;

const styles = StyleSheet.create({
  checkBoxView: {
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ffaa33',
    borderRadius: 5,
    height: 55,
    padding: 10,
    width: '100%',
    marginTop: 5,
  },
  saveAsTemplate: {marginHorizontal: 20},
  btnView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});
