import {StyleSheet, Text, View, Alert} from 'react-native';
import React, {useState, useEffect} from 'react';
import {fonts} from '../../assets/Assets';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import InputValidation from '../../components/InputValidation';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import APIService from '../../Services/APIService';
import Constants from '../../constant/Constants';
import {useSelector} from 'react-redux';
import CustomButton from '../../components/CustomButton';
import BaseContainer from '../../components/BaseContainer';
import DropDownComp from '../../components/DropDownComp';
import {getProportionalFontSize} from '../../Services/CommonMethods';
import Colors from '../../assets/Colors';
import TransparentLoader from '../../components/TransparentLoader';
import {checkUrlFormat} from '../../Services/CommonMethods';

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

const TemplateForm = props => {
  let {navigation} = props;
  let routeParm = props?.route?.params?.itemId;

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
  //initialValidationObj[formFieldsKeys.user].invalid
  const initialValidationObj = {
    [formFieldsKeys.notification_for]: {
      invalid: false,
      title: 'Invalid notification_for',
    },
    [formFieldsKeys.mail_subject]: {
      invalid: false,
      title: 'Invalid mail_subject',
    },
    [formFieldsKeys.mail_body]: {
      invalid: false,
      title: 'Invalid mail_body',
    },
    [formFieldsKeys.notification_subject]: {
      invalid: false,
      title: 'Invalid notification_subject',
    },
    [formFieldsKeys.notification_body]: {
      invalid: false,
      title: 'Invalid notification_body',
    },
    [formFieldsKeys.custom_attributes]: {
      invalid: false,
      title: 'Invalid custom_attributes',
    },
    [formFieldsKeys.save_to_database]: {
      invalid: false,
      title: 'Invalid save_to_database',
    },
    [formFieldsKeys.status_code]: {
      invalid: false,
      title: 'Invalid status_code',
    },
    [formFieldsKeys.route_path]: {
      invalid: false,
      title: 'Invalid route path',
    },
  };

  const validation = () => {
    let isValid = true;
    let validationObj = {...initialValidationObj};
    for (let key in validationObj) {
      if (formValues[key] === '') {
        validationObj[key].invalid = true;
        isValid = false;
      }
      if (key === formFieldsKeys.route_path) {
        if (!checkUrlFormat(formValues[key])) {
          validationObj[key].invalid = true;
          isValid = false;
        }
      }
    }
    setValidationObj(validationObj);
    return isValid;
  };
  // REDUX hooks
  const userLogin = useSelector(state => state.global_store.userLogin);
  const [validationObj, setValidationObj] = useState(initialValidationObj);
  const [formValues, setFormValues] = useState(initialValues);
  const [isLoading, setIsLoading] = useState(false);

  const AddadministrationNotificationTemplatesAPI = async () => {
    setIsLoading(true);
    let params = {
      ...formValues,
      status_code: formValues?.status_code?.code.toLowerCase(),
      save_to_database: formValues.save_to_database ? '1' : '0',
    };
    let url = Constants?.apiEndPoints?.administrationNotificationTemplate;
    // return
    let response = await APIService.postData(
      url,
      params,
      userLogin.access_token,
      null,
      'AddadministrationNotificationTemplatesAPI',
    );
    if (!response.errorMsg) {
      setIsLoading(false);
      navigation.goBack();
      Alert.alert(
        Constants.success,
        response?.data?.message ?? 'Template added successfully',
      );
    } else {
      setIsLoading(false);
      Alert.alert(
        Constants.danger,
        response.errorMsg ?? 'Something went wrong',
      );
    }
  };

  const updateAddAdministrationNotificationTemplatesData = async () => {
    setIsLoading(true);
    let params = {
      status_code: formValues?.status_code?.code
        ? formValues?.status_code?.code.toLowerCase()
        : '',
      save_to_database: formValues?.save_to_database ? '1' : '0',
      custom_attributes: formValues?.custom_attributes ?? '',
      mail_body: formValues?.mail_body ?? '',
      mail_subject: formValues?.mail_subject ?? '',
      notification_body: formValues?.notification_body ?? '',
      notification_for: formValues?.notification_for ?? '',
      notification_subject: formValues?.notification_subject ?? '',
      route_path: formValues?.route_path ?? '',
    };
    let url =
      Constants.apiEndPoints.administrationNotificationTemplate +
      '/' +
      routeParm.id;
    // return
    let response = await APIService.putData(
      url,
      params,
      userLogin.access_token,
      null,
      'updateAddAdministrationNotificationTemplatesData',
    );
    if (!response.errorMsg) {
      setIsLoading(false);
      navigation.goBack();
      Alert.alert(
        'Success',
        response?.data?.message ?? 'Template updated successfully',
      );
    } else {
      setIsLoading(false);
      Alert.alert(
        Constants.danger,
        response.errorMsg ?? 'Something went wrong',
      );
    }
  };

  useEffect(() => {
    if (routeParm) {
      setFormValues({
        ...routeParm,
        status_code: routeParm?.status_code,
        save_to_database: routeParm.save_to_database === 1 ? true : false,
      });
    }
  }, [routeParm]);

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
      onPressLeftIcon={() => navigation.goBack()}
      leftIcon="arrow-back"
      title={routeParm ? 'Edit Template' : 'Add Template'}>
      <TransparentLoader isLoading={isLoading} />
      <KeyboardAwareScrollView>
        <View style={styles.modalView}>
          <InputValidation
            validationObj={validationObj}
            uniqueKey={formFieldsKeys.notification_for}
            placeHolder={'Notification For'}
            label={'Notification For'}
            value={formValues?.notification_for}
            onChangeText={text => {
              handleInputChange(formFieldsKeys.notification_for, text);
              removeErrorTextForInputThatUserIsTyping(
                formFieldsKeys.notification_for,
              );
            }}
          />
          <InputValidation
            validationObj={validationObj}
            uniqueKey={formFieldsKeys.mail_subject}
            placeHolder={'Mail Subject'}
            label={'Mail Subject'}
            value={formValues?.mail_subject}
            onChangeText={text => {
              handleInputChange(formFieldsKeys.mail_subject, text);
              removeErrorTextForInputThatUserIsTyping(
                formFieldsKeys.mail_subject,
              );
            }}
          />

          <InputValidation
            validationObj={validationObj}
            uniqueKey={formFieldsKeys.mail_body}
            placeHolder={'Mail body'}
            label={'Mail body'}
            value={formValues?.mail_body}
            onChangeText={text => {
              handleInputChange(formFieldsKeys.mail_body, text);
              removeErrorTextForInputThatUserIsTyping(formFieldsKeys.mail_body);
            }}
          />

          <InputValidation
            validationObj={validationObj}
            uniqueKey={formFieldsKeys.notification_subject}
            placeHolder={'Notification Subject'}
            label={'Notification Subject'}
            value={formValues?.notification_subject}
            onChangeText={text => {
              handleInputChange(formFieldsKeys.notification_subject, text);
              removeErrorTextForInputThatUserIsTyping(
                formFieldsKeys.notification_subject,
              );
            }}
          />
          <InputValidation
            validationObj={validationObj}
            uniqueKey={formFieldsKeys.notification_body}
            placeHolder={'Notification Body'}
            label={'Notification Body'}
            value={formValues?.notification_body}
            onChangeText={text => {
              handleInputChange(formFieldsKeys.notification_body, text);
              removeErrorTextForInputThatUserIsTyping(
                formFieldsKeys.notification_body,
              );
            }}
          />
          <InputValidation
            validationObj={validationObj}
            uniqueKey={formFieldsKeys.route_path}
            placeHolder={'Route Path'}
            label={'Route Path(Link)'}
            value={formValues?.route_path}
            onChangeText={text => {
              handleInputChange(formFieldsKeys.route_path, text);
              removeErrorTextForInputThatUserIsTyping(
                formFieldsKeys.route_path,
              );
            }}
          />
          <InputValidation
            validationObj={validationObj}
            uniqueKey={formFieldsKeys.custom_attributes}
            placeHolder={'Custom Attribute'}
            label={'Custom Attribute'}
            value={formValues?.custom_attributes}
            onChangeText={text => {
              handleInputChange(formFieldsKeys.custom_attributes, text);
              removeErrorTextForInputThatUserIsTyping(
                formFieldsKeys.custom_attributes,
              );
            }}
          />
          <Text style={styles.saveTextStyle}>Save to Database*</Text>
          <View
            style={{
              ...styles.mainView,
              borderColor: validationObj?.save_to_database?.invalid
                ? Colors.red
                : Colors.primary,
            }}>
            <View style={styles.checkBoxView}>
              <BouncyCheckbox
                size={20}
                disableBuiltInState={routeParm ? true : false}
                fillColor={'#ffaa33'}
                unfillColor={'white'}
                iconStyle={{borderColor:validationObj?.save_to_database?.invalid? Colors.red:Colors.darkgreen}}
                isChecked={formValues.save_to_database}
                onPress={value => {
                  handleInputChange(formFieldsKeys.save_to_database, value);
                  removeErrorTextForInputThatUserIsTyping(
                    formFieldsKeys.save_to_database,
                  );
                }}
              />
              <Text
                style={{
                  fontSize: getProportionalFontSize(15),
                }}>
                Save to database ({formValues?.save_to_database ? 'Yes' : 'No'})
              </Text>
            </View>
          </View>
          {validationObj?.save_to_database?.invalid && (
            <Text style={styles.errorText}>
              {validationObj?.save_to_database?.title}
            </Text>
          )}
          <DropDownComp
            data={statusCode}
            validationObj={validationObj}
            uniqueKey={formFieldsKeys.status_code}
            onPressItem={item => {
              handleInputChange(formFieldsKeys.status_code, item);
              removeErrorTextForInputThatUserIsTyping(
                formFieldsKeys.status_code,
              );
            }}
            keyToShowData="code"
            keyToCompareData="id"
            placeHolder="Status_code"
            isSearch="Search status_code..."
            onChangeText={text => {
              setFormValues({
                ...formValues,
                status_code: text,
              });
            }}
            value={formValues?.status_code}
          />
          <CustomButton
            onPress={() => {
              if (validation()) {
                if (routeParm) {
                  updateAddAdministrationNotificationTemplatesData();
                } else {
                  AddadministrationNotificationTemplatesAPI();
                }
              } else {
                Alert.alert('Validation Failed', 'Please fill all the fields');
              }
            }}
            title={routeParm ? 'Update' : 'Add'}
          />
        </View>
      </KeyboardAwareScrollView>
    </BaseContainer>
  );
};

export default TemplateForm;

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    fontSize: getProportionalFontSize(12),
  },
  modalView: {
    flex: 1,
    padding: Constants.globalPadding,
    backgroundColor: 'white',
  },
  checkBoxView: {flexDirection: 'row', alignItems: 'center', padding: 8},
  saveTextStyle: {
    fontFamily: fonts.robotoMedium,
    fontSize: getProportionalFontSize(15),
    color: Colors.darkPrimary,
  },
  mainView: {
    borderWidth: 1,
    borderRadius: 5,
    height: 55,
    justifyContent: 'center',
    padding: 8,
  },
});
