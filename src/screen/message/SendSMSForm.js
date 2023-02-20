import {StyleSheet, Text, TouchableOpacity, View, Alert} from 'react-native';
import React, {useState, useEffect} from 'react';
import BaseContainer from '../../components/BaseContainer';
import Colors from '../../assets/Colors';
import Constants from '../../constant/Constants';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {getProportionalFontSize} from '../../Services/CommonMethods';
import {fonts} from '../../assets/Assets';
import InputValidation from '../../components/InputValidation';
import {useSelector, useDispatch} from 'react-redux';
import CustomButton from '../../components/CustomButton';
import APIService from '../../Services/APIService';
import DropDownComp from '../../components/DropDownComp';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import Assets from '../../assets/Assets';
import PickerAndLocationServices from '../../Services/PickerAndLocationServices';
import {FAB, Portal, Modal} from 'react-native-paper';
import FileUploadingAnimation from '../../components/FileUploadingAnimation';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import AlertComp from '../../components/AlertCom';
import TransparentLoader from '../../components/TransparentLoader';
import * as Papa from 'papaparse';
 

const SendSMSForm = props => {
  // Immutable Variables
  const formFieldsKeys = {
    user: 'user',
    campaign: 'campaign',
    sender_id: 'sender_id',
    secondary_route: 'secondary_route',
    dlt_template: 'dlt_template',
    route_type: 'route_type',
    sms_type: 'sms_type',
    message: 'message',
    same_as_template: 'same_as_template',
    campaign_send_date_time: 'campaign_send_date_time',
    is_flash: 'is_flash',
    priority: 'priority',
    mobile_numbers: 'mobile_numbers',
    contact_group: 'contact_group',
    file_path: 'file_path',
    file_mobile_field_name: 'file_mobile_field_name',
    ratio_set: 'ratio_set',
    failed_ratio_set: 'failed_ratio_set',
    is_schedule: 'is_schedule',
  };
  const initialValues = {
    [formFieldsKeys.user]: '',
    [formFieldsKeys.campaign]: '',
    [formFieldsKeys.sender_id]: '',
    [formFieldsKeys.secondary_route]: '',
    [formFieldsKeys.dlt_template]: '',
    [formFieldsKeys.route_type]: '',
    [formFieldsKeys.sms_type]: '1',
    [formFieldsKeys.message]: '',
    [formFieldsKeys.same_as_template]: '',
    [formFieldsKeys.campaign_send_date_time]: '',
    [formFieldsKeys.is_flash]: '',
    [formFieldsKeys.priority]: '',
    [formFieldsKeys.mobile_numbers]: '',
    [formFieldsKeys.contact_group]: [],
    [formFieldsKeys.file_path]: '',
    [formFieldsKeys.file_mobile_field_name]: '',
    [formFieldsKeys.ratio_set]: '',
    [formFieldsKeys.failed_ratio_set]: '',
    [formFieldsKeys?.is_schedule]: false,
  };
  const initialValidationObj = {
    [formFieldsKeys.user]: {
      invalid: false,
      title: 'Invalid user',
    },
    [formFieldsKeys.campaign]: {
      invalid: false,
      title: 'Invalid campaign',
    },
    [formFieldsKeys.secondary_route]: {
      invalid: false,
      title: 'Invalid secondary_route',
    },
    [formFieldsKeys.dlt_template]: {
      invalid: false,
      title: 'Invalid dlt_template',
    },
    [formFieldsKeys.route_type]: {
      invalid: false,
      title: 'Invalid route_type',
    },
    [formFieldsKeys.sms_type]: {
      invalid: false,
      title: 'Invalid sms_type',
    },
    [formFieldsKeys.message]: {
      invalid: false,
      title: 'Invalid message',
    },
    [formFieldsKeys.same_as_template]: {
      invalid: false,
      title: 'Invalid same_as_template',
    },
    [formFieldsKeys.campaign_send_date_time]: {
      invalid: false,
      title: 'Invalid campaign_send_date_time',
    },
    [formFieldsKeys.mobile_numbers]: {
      invalid: false,
      title: 'Invalid mobile_numbers',
    },
    [formFieldsKeys.contact_group]: {
      invalid: false,
      title: 'Invalid contact_group',
    },
    [formFieldsKeys.file_path]: {
      invalid: false,
      title: 'Invalid file_path',
    },
    [formFieldsKeys.file_mobile_field_name]: {
      invalid: false,
      title: 'Invalid file_mobile_field_name',
    },
  };

  const validation = () => {
    let isValid = true;
    let validationObj = {...initialValidationObj};
    if (
      formFields[formFieldsKeys.user] == '' &&
      (UserLogin?.userType == 0 || UserLogin?.userType == 3)
    ) {
      validationObj[formFieldsKeys.user].invalid = true;
      isValid = false;
    }
    if (formFields[formFieldsKeys.campaign] == '') {
      validationObj[formFieldsKeys.campaign].invalid = true;
      isValid = false;
    }
    if (
      formFields[formFieldsKeys.secondary_route] == '' &&
      (UserLogin?.userType == 0 || UserLogin?.userType == 3)
    ) {
      validationObj[formFieldsKeys.secondary_route].invalid = true;
      isValid = false;
    }
    if (formFields[formFieldsKeys.dlt_template] == '') {
      validationObj[formFieldsKeys.dlt_template].invalid = true;
      isValid = false;
    }
    if (
      formFields[formFieldsKeys.file_path] && 
      formFields?.[formFieldsKeys.file_mobile_field_name] == ''  
    ) {

      validationObj[formFieldsKeys.file_mobile_field_name].invalid = true;
      isValid = false;
    }
    if (
      formFields[formFieldsKeys.file_path] == '' &&
      formFields[formFieldsKeys.contact_group] == '' &&
      formFields[formFieldsKeys.mobile_numbers] == ''
    ) {
      Alert.alert(
        Constants.danger,
        'Please select atleast one contact group or mobile number or upload file',
      );
    }
    if (formFields[formFieldsKeys.message] == '') {
      validationObj[formFieldsKeys.message].invalid = true;
      isValid = false;
    }
    setValidationObj(validationObj);
    return isValid;
  };

  // REDUX hooks
  const UserLogin = useSelector(state => state.global_store.userLogin);
  // useState hooks
  const [isIncorrectFormate, setIsIncorrectFormate] = React.useState(true);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [modalKey, setModalKey] = React.useState('');
  const [headerOptions, setHeaderOptions] = useState('TR');
  const [validationObj, setValidationObj] = React.useState({
    ...initialValidationObj,
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [formFields, setFormFields] = React.useState(initialValues);
  const [DltListData, setDltListData] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [secondaryRouteList, setSecondaryRouteList] = useState([]);
  const [contactGroup, setContactGroup] = useState([]);
  const [count, setCount] = useState({
    contact: 0,
    cvs: 0,
    groups: 0,
    messageText: 0,
    message: 0,
  });
  const [csvArr, setCsvArr] = useState([]);
  const [mobile_number_field_from_file, set_mobile_number_field_from_file] =
    useState([]);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const handleConfirm = date => {
    setFormFields({
      ...formFields,
      [formFieldsKeys.campaign_send_date_time]: date,
    });
    hideDatePicker();
  };

  const [fileSelected, setFileSelected] = useState(false);
  async function getUserList() {
    let params = {};
    let url = Constants.apiEndPoints.users_for_ddl;
    let response = await APIService.postData(
      url,
      params,
      UserLogin.access_token,
      null,
      'users_for_ddl',
    );
    if (!response.errorMsg) {
      setUsersList(response.data.data);
    } else {
      Alert.alert(response.errorMsg);
    }
  }

  async function getSecondaryRouteList() {
    let params = {};
    let url = Constants.apiEndPoints.SecondaryRoutes;
    let response = await APIService.postData(
      url,
      params,
      UserLogin.access_token,
      null,
      'DltSecondaryRouteListAPI',
    );
    if (!response.errorMsg) {
      setSecondaryRouteList(response?.data?.data);
    } else {
      Alert.alert(response.errorMsg);
    }
  }
  async function getDltTemplatesList(id) {
    let user_id = '';
    if (id) {
      user_id = id;
    } else {
      user_id = UserLogin?.id;
    }
    let url = Constants.apiEndPoints.DltTemplateListing;
    let response = await APIService.postData(
      url,
      {user_id: user_id},
      UserLogin.access_token,
      null,
      'DltTemplateListingAPI',
    );
    if (!response.errorMsg) {
      setDltListData(response.data.data);
    } else {
      Alert.alert(
        Constants.danger,
        response.errorMsg ?? 'Something went wrong',
      );
    }
  }
  async function getContactGroupsList() {
    let params = {};
    let url = Constants.apiEndPoints.contact_groups;
    let response = await APIService.postData(
      url,
      params,
      UserLogin.access_token,
      null,
      'getContactGroupsList',
    );
    if (!response.errorMsg) {
      setContactGroup(response.data.data);
    } else {
      Alert.alert(response.errorMsg);
    }
  }

  useEffect(() => {
    if (UserLogin?.userType == 0 || UserLogin?.userType == 3) {
      getUserList();
      getSecondaryRouteList();
    } else {
      getDltTemplatesList();
    }
    getContactGroupsList();
  }, []);
  async function sendSmsFunction() {
    setIsLoading(true);
    if (formFields?.[formFieldsKeys?.contact_group]?.length > 0) {
      formFields[formFieldsKeys?.contact_group].map((obj, i) => {
        contactGroup.push(obj.id);
      });
    }
    let params = {
      user_id: UserLogin.id,
      campaign: formFields?.[formFieldsKeys?.campaign] ?? '',
      dlt_template_id: formFields?.[formFieldsKeys?.dlt_template]?.id ?? '',
      route_type: headerOptions == 'TR' ? 1 : 2,
      sms_type: formFields?.[formFieldsKeys?.sms_type] ?? '',
      message: formFields?.[formFieldsKeys?.message] ?? '',
      same_as_template: formFields?.[formFieldsKeys?.same_as_template] ?? false,
      campaign_send_date_time:
        formFields[formFieldsKeys.campaign_send_date_time] ?? '',
      is_flash: formFields?.[formFieldsKeys?.same_as_template] ? 1 : 0,
      priority: formFields?.[formFieldsKeys?.priority] ? 1 : 0,
      mobile_numbers: formFields?.[formFieldsKeys?.mobile_numbers] ?? '',
      contact_group_ids: formFields?.[formFieldsKeys?.contact_group] ?? '', //contactGroupIds,
      file_path: formFields?.[formFieldsKeys?.file_path] ?? '',
      file_mobile_field_name:
        formFields?.[formFieldsKeys?.file_mobile_field_name]?.name ?? '',
      ratio_set: formFields?.[formFieldsKeys?.ratio_set] ?? '',
      failed_ratio: formFields?.[formFieldsKeys?.failed_ratio_set] ?? '',
      schedule: formFields?.[formFieldsKeys?.is_schedule] ?? '',
    };
    if (UserLogin?.userType == 0 || UserLogin?.userType == 3) {
      params = {
        ...params,
        secondary_route_id:
          formFields?.[formFieldsKeys?.secondary_route]?.id ?? null,
        user_id: formFields?.[formFieldsKeys?.user]?.id,
      };
    }
    let url = Constants.apiEndPoints?.['send-sms'];
    // return;
    let response = await APIService.postData(
      url,
      params,
      UserLogin.access_token,
      null,
      'send-sms-api',
    );
    if (!response.errorMsg) {
      setIsLoading(false);
      setFormFields(initialValues);
      setModalKey('send');
      setIsModalVisible(true);
      // props.navigation.navigate('CampaignList');
    } else {
      setIsLoading(false);
      Alert.alert(
        Constants.danger,
        response.errorMsg ?? 'Something went wrong',
      );
    }
  }

  const getCount = (key, item) => {
    if (key == 'contact') {
      if (formFields[formFieldsKeys.mobile_numbers]?.trim() != '') {
        if (formFields[formFieldsKeys.mobile_numbers]?.length == 0) {
          setCount({...count, contact: 0});
        }
        let arrLength =
          formFields[formFieldsKeys.mobile_numbers]?.split(' ')?.length;
        setCount({...count, contact: arrLength});
      }
    }
    if (key == 'group') {
      setCount({...count, groups: item.length});
    }
    if (key == 'message') {
      let flag = false;
      if (item.length % Constants.maxLengthForMsg == 0) {
        flag = true;
      }
      if (flag) {
        let temp = Math.round(item.length / Constants.maxLengthForMsg);
        setCount({...count, messageText: item.length, message: temp});
      } else {
        setCount({...count, messageText: item.length});
      }
    }
    if (key == 'csvContact') {
      setCount({...count, cvs: item.length});
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

  // helper methods
  async function open_document_picker() {
    let docRes = await PickerAndLocationServices.OpenDocumentPicker(false);
    if (!docRes) return;
    else imageOrDocumentResponseHandler(docRes);
  }
  const uploadFile = async attachmentArr => {
    let res = await APIService.uploadFile(
      Constants.apiEndPoints.uploadDoc,
      attachmentArr,
      UserLogin.access_token,
      'CSV_',
      'no_multiple',
      'csv Attachment',
    );

    // return
    if (res.errorMsg) {
      setIsModalVisible(false);
      Alert.alert(Constants.danger, res.errorMsg);
    } else {
      // read csv file path by papa parse
      let file = attachmentArr[0].uri;
      const res1 = await fetch(file);
      const text = await res1.text();
      const result = Papa.parse(text, {header: false});
      const csvData = result.data;
      // set csv data in state
      let newArr = [];
      for (let i = 0; i < 3; i++) {
        newArr.push(csvData[i]);
      }
      setCsvArr(newArr);
      getCount('csvContact', csvData);
      set_mobile_number_field_from_file(
        csvData[0].map((item, index) => {
          return {name: item, id: index};
        }),
      );

      setIsModalVisible(false);
      Alert.alert(
        Constants.success,
        Constants.labels.message_uploaded_successfully,
      );
      return res?.data?.data?.file_name;
    }
  };

  const imageOrDocumentResponseHandler = async response => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
      Alert.alert(
        Constants.danger,
        Constants.labels.message_something_went_wrong,
      );
    } else if (response.customButton) {
      console.log('User tapped custom button: ', response.customButton);
    } else {
      //  this.setState({ avatarSource: response, imagePathText: response.type });
      if (Array.isArray(response) && response.length > 0) {
        // console.log('image res......if.', response);
        if (response[0]?.type != 'text/comma-separated-values') {
          setIsIncorrectFormate(true);
          setModalKey('');
          setIsModalVisible(true);
          setFileSelected(false);
          return;
        } else {
          setIsIncorrectFormate(false);
        }
        setFileSelected(true);
        setModalKey('');
        setIsModalVisible(true);
        let uploaded_doc_arr = await uploadFile(response);
        if (uploaded_doc_arr) {
          handleInputChange(formFieldsKeys.file_path, uploaded_doc_arr);
        }
      } else if (response?.assets) {
        if (response?.type != 'text/comma-separated-values') {
          setIsIncorrectFormate(true);
          return;
        } else {
          setIsIncorrectFormate(false);
        }
        // CSVToJSON(response?.uri)
        setModalKey('');
        setIsModalVisible(true);
        // return;
        let uploaded_doc_arr = await uploadFile(response?.assets);
        if (!uploaded_doc_arr) return;
        uploaded_doc_arr.map(obj => {
          obj['uploaded_doc_url'] = obj.file_name;
          obj['uri'] = obj.file_name;
          obj['type'] = 'image';
        });

        let tempDocArr = [...formFields.documents];
        tempDocArr = tempDocArr.concat(uploaded_doc_arr);
        console.log('tempDocArr', tempDocArr);
        // handleInputChange(formFieldsKeys.documents, tempDocArr)
        console.log('tempdocarr------', tempDocArr);
      }
    }
  };

  const onRequestClose = () => {
    setIsModalVisible(false);
  };

  return (
    <BaseContainer
      onPressLeftIcon={() => props.navigation.goBack()}
      leftIcon="arrow-back"
      title={props.route.name}>
      <TransparentLoader isLoading={isLoading} />
      <KeyboardAwareScrollView
        contentContainerStyle={{
          backgroundColor: Colors.white,
          padding: Constants.globalPadding,
          paddingBottom: 100,
        }}
        keyboardShouldPersistTaps="handled">
        <Portal>
          <Modal
            animationType="slide"
            transparent={true}
            style={{}}
            visible={isModalVisible}
            onRequestClose={onRequestClose}>
            {modalKey == 'send' ? (
              <AlertComp
                botton_type=""
                title="SUCCESS"
                message="Campaign started successfully"
                onRequestClose={onRequestClose}
              />
            ) : (
              <FileUploadingAnimation
                isIncorrectFormate={isIncorrectFormate}
                onRequestClose={onRequestClose}
                isLoading={isLoading}
                open_document_picker={open_document_picker}
              />
            )}
          </Modal>
        </Portal>

        <View style={styles.headerOptionContainer}>
          <TouchableOpacity
            onPress={() => setHeaderOptions('TR')}
            style={{
              ...styles.headerOption,
              backgroundColor:
                headerOptions == 'TR' ? Colors.primary : Colors.transparent,
            }}>
            <Text
              style={{
                ...styles.headerOptionText,
                color: headerOptions == 'TR' ? Colors.white : Colors.primary,
              }}>
              Transactional
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setHeaderOptions('PR')}
            style={{
              ...styles.headerOption,
              backgroundColor:
                headerOptions == 'PR' ? Colors.primary : Colors.transparent,
            }}>
            <Text
              style={{
                ...styles.headerOptionText,
                color: headerOptions == 'PR' ? Colors.white : Colors.primary,
              }}>
              Promotional
            </Text>
          </TouchableOpacity>
        </View>
        {/* user */}
        {(UserLogin?.userType == 0 || UserLogin?.userType == 3) && (
          <DropDownComp
            validationObj={validationObj}
            uniqueKey={formFieldsKeys.user}
            data={usersList ?? []}
            onPressItem={item => {
              handleInputChange(formFieldsKeys.user, item);
              removeErrorTextForInputThatUserIsTyping(formFieldsKeys.user);
              getDltTemplatesList(item.id);
            }}
            keyToShowData={'name'}
            keyToCompareData={'id'}
            placeHolder={'Select User'}
            value={formFields?.[formFieldsKeys.user]?.name ?? null}
          />
        )}
        {/* dlt template */}
        <DropDownComp
          validationObj={validationObj}
          uniqueKey={formFieldsKeys.dlt_template}
          data={DltListData ?? []}
          onPressItem={item => { 
            setFormFields({
              ...formFields,
              [formFieldsKeys.dlt_template]: item,
              [formFieldsKeys.sender_id]: item?.sender_id,
              [formFieldsKeys.message]: item?.dlt_message,
            });
            removeErrorTextForInputThatUserIsTyping(
              formFieldsKeys.dlt_template,
            );
          }}
          keyToShowData={'template_name'}
          keyToCompareData={'id'}
          placeHolder={'Select DLT Template'}
          value={
            formFields?.[formFieldsKeys.dlt_template]?.template_name ?? null
          }
        />

        {/* Campaign Name */}
        <InputValidation
          uniqueKey={formFieldsKeys.campaign}
          validationObj={validationObj}
          value={formFields[formFieldsKeys.campaign]}
          placeHolder={'Campaign Name'}
          label={'Campaign Name'}
          onChangeText={text => {
            removeErrorTextForInputThatUserIsTyping(formFieldsKeys.campaign);
            handleInputChange(formFieldsKeys.campaign, text);
          }}
          style={{marginTop: Constants.formFieldTopMargin}}
        />

        {/* Sender ID */}
        <InputValidation
          value={formFields[formFieldsKeys.sender_id]}
          placeHolder={'Sender ID'}
          onChangeText={text => {
            removeErrorTextForInputThatUserIsTyping(formFieldsKeys.sender_id);
            handleInputChange(formFieldsKeys.sender_id, text);
          }}
          label={'Sender ID'}
          style={{marginTop: Constants.formFieldTopMargin}}
        />

        {/*Secondary-route-name */}
        {(UserLogin?.userType == 0 || UserLogin?.userType == 3) && (
          <DropDownComp
            validationObj={validationObj}
            uniqueKey={formFieldsKeys.secondary_route}
            data={Array.isArray(secondaryRouteList) ? secondaryRouteList : []}
            onPressItem={item => {
              handleInputChange(formFieldsKeys.secondary_route, item);
              removeErrorTextForInputThatUserIsTyping(
                formFieldsKeys.secondary_route,
              );
            }}
            keyToShowData={'sec_route_name'}
            keyToCompareData={'id'}
            placeHolder={'Secondary Route Name'}
            value={formFields?.[formFieldsKeys.user]?.sec_route_name}
          />
        )}

        {/* Contact groups */}
        <DropDownComp 
          multiSelect={true}
          data={contactGroup ?? []}
          onPressItem={item => {
            handleInputChange(formFieldsKeys.contact_group, item);
            removeErrorTextForInputThatUserIsTyping(
              formFieldsKeys.contact_group,
            );
            getCount('group', item);
          }}
          keyToShowData={'group_name'}
          keyToCompareData={'id'}
          placeHolder={'Select Phone Groups'}
          value={formFields?.[formFieldsKeys.contact_group] ?? []}
        />
        <Text style={styles.approxCountStyle}>
          {count.groups} Groups Contacts (*Approx)
        </Text>

        {/* message type  */}
        <Text
          style={{
            ...styles.headingTitleStyle,
            color: Colors.darkPrimary,
            marginTop: 15,
          }}>
          {'Select Message Type' + '*'}
        </Text>
        <View
          style={{
            ...styles.headerOptionContainer,
            backgroundColor: Colors.transparent,
            borderWidth: 1,
            height: 50,
            borderRadius: 10,
          }}>
          <TouchableOpacity
            onPress={() =>
              setFormFields({...formFields, [formFieldsKeys.sms_type]: '1'})
            }
            style={{
              ...styles.headerOption,
              height: 50,
              borderRadius: 10,
              backgroundColor:
                formFields[formFieldsKeys.sms_type] == '1'
                  ? Colors.lightPrimary
                  : Colors.transparent,
            }}>
            <Text
              style={{
                ...styles.headerOptionText,
                color:
                  formFields[formFieldsKeys.sms_type] == '1'
                    ? Colors.primary
                    : Colors.gray,
              }}>
              Normal
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              setFormFields({...formFields, [formFieldsKeys.sms_type]: '2'})
            }
            style={{
              ...styles.headerOption,
              height: 50,
              borderRadius: 10,
              backgroundColor:
                formFields[formFieldsKeys.sms_type] == '2'
                  ? Colors.lightPrimary
                  : Colors.transparent,
            }}>
            <Text
              style={{
                ...styles.headerOptionText,
                color:
                  formFields[formFieldsKeys.sms_type] == '2'
                    ? Colors.primary
                    : Colors.gray,
              }}>
              Custom
            </Text>
          </TouchableOpacity>
        </View>

        {/* Mobile Number */}
        <InputValidation
          value={formFields[formFieldsKeys.mobile_numbers]}
          placeHolder={'Mobile Number'}
          onChangeText={text => {
            removeErrorTextForInputThatUserIsTyping(
              formFieldsKeys.mobile_numbers,
            );
            handleInputChange(
              formFieldsKeys.mobile_numbers,
              text.replace(/[^\d \n]/g, ''),
            );
            getCount('contact', text);
          }}
          label={'Mobile Number'}
          style={{marginTop: Constants.formFieldTopMargin}}
          iconRight={'upload'}
          onPressIcon={() => open_document_picker()}
          isIconTouchable={true}
          multiline={true}
          inputStyle={{
            ...styles.inputStyle,
            maxHeight: 110,
            minHeight: 110,
            textAlignVertical: 'top',
            paddingTop: 10,
            paddingBottom: 10,
            paddingLeft: 10,
            paddingRight: 10,
          }}
        />

        <Text style={styles.approxCountStyle}>
          {count.contact} Contacts, {count.groups} Groups{' '}
          {count.cvs ? count.cvs - 1 : count.cvs} CSV Contacts (*Approx)
        </Text>

        {fileSelected ? (
          <View
            style={{
              borderWidth: 1,
              borderColor: Colors.lightPrimary,
              marginTop: 15,
            }}>
            {Array.isArray(csvArr)
              ? csvArr &&
                csvArr?.map((arr, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: 'row',
                      paddingHorizontal: 15,
                      paddingVertical: 3,
                      backgroundColor:
                        index % 2 == 0
                          ? index == 0
                            ? Colors.ultraLightPrimary
                            : Colors.ultraLightProPrimary
                          : Colors.white,
                    }}>
                    {arr.map((item, i) => (
                      <Text
                        key={i}
                        style={{
                          width: `${100 / arr.length}%`,
                          fontSize: getProportionalFontSize(10),
                          paddingLeft: i == 0 ? 0 : 3,
                          fontFamily:
                            index == 0
                              ? Assets.fonts.medium
                              : Assets.fonts.regular,
                        }}>
                        {item}
                      </Text>
                    ))}
                  </View>
                ))
              : null}
          </View>
        ) : null}

        {fileSelected && (
          <DropDownComp
            validationObj={validationObj}
            uniqueKey={formFieldsKeys.file_mobile_field_name}
            data={mobile_number_field_from_file ?? []}
            onPressItem={item => {
              handleInputChange(formFieldsKeys.file_mobile_field_name, item);
              removeErrorTextForInputThatUserIsTyping(
                formFieldsKeys.file_mobile_field_name,
              );
            }}
            keyToShowData={'name'}
            keyToCompareData={'id'}
            placeHolder={'Select mobile number from column'}
            value={
              formFields?.[formFieldsKeys.file_mobile_field_name]?.name ?? null
            }
            label={'Select mobile number from column'}
          />
        )} 
        {/* {fileSelected ? (
            <DropDownComp
              data={mobile_number_field_from_file ?? []}
              onPressItem={item => { 
                handleInputChange(
                  formFieldsKeys.message,
                  `${formFields[formFieldsKeys.message]} {{${item.name}}}`,
                );
              }}
              keyToShowData={'name'}
              keyToCompareData={'id'}
              placeHolder={'Insert A dynamic Value'}
              value={'Insert A dynamic Value'}
              label={false}
              dropDownContainer={styles.dropDownContainer}
              inputTextStyle={{
                fontSize: getProportionalFontSize(14),
              }}
            />
          ) : null} */}
        {/* Message ( English ) */}
        <InputValidation
          validationObj={validationObj}
          uniqueKey={formFieldsKeys.message}
          value={formFields[formFieldsKeys.message]}
          placeHolder={'Message ( English )'}
          onChangeText={text => {
            handleInputChange(formFieldsKeys.message, text);
            removeErrorTextForInputThatUserIsTyping(formFieldsKeys.message);
            getCount('message', text);
          }}
          label={'Message ( English )'}
          style={{marginTop: Constants.formFieldTopMargin}}
          multiline={true}
          inputStyle={{...styles.inputStyle, height: 110}}
        />
        <Text style={styles.approxCountStyle}>
          ( {count.messageText}/{count.message} )
        </Text>
        {/* set ratio */}
        {UserLogin?.userType == 0 ? (
          <InputValidation
            value={formFields[formFieldsKeys.ratio_set]}
            placeHolder={'Ratio Set'}
            onChangeText={text => {
              removeErrorTextForInputThatUserIsTyping(formFieldsKeys.ratio_set);
              handleInputChange(formFieldsKeys.ratio_set, text);
            }}
            label={'Ratio Set'}
            style={{marginTop: Constants.formFieldTopMargin}}
          />
        ) : null}
        {/* set failed ratio */}
        {UserLogin?.userType == 0 || UserLogin?.userType == 3 ? (
          <InputValidation
            value={formFields[formFieldsKeys.failed_ratio_set]}
            placeHolder={'Failed Ratio'}
            onChangeText={text => {
              removeErrorTextForInputThatUserIsTyping(
                formFieldsKeys.failed_ratio_set,
              );
              handleInputChange(formFieldsKeys.failed_ratio_set, text);
            }}
            label={'Failed Ratio'}
            style={{marginTop: Constants.formFieldTopMargin}}
          />
        ) : null}
        {/* {UserLogin?.userType == 0 ? (
          <View style={styles.checkBoxView}>
            <BouncyCheckbox
              size={20}
              fillColor={Colors.primary}
              unfillColor={Colors.white}
              iconStyle={{borderColor: Colors.primary}}
              isChecked={formFields[formFieldsKeys.priority]}
              onPress={value => {
                handleInputChange([formFieldsKeys.priority], value);
                console.log(
                  'formFields[formFieldsKeys.priority]',
                  formFields[formFieldsKeys.priority],
                );
              }}
            />
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.saveAsTemplate}>
                {'priority'} (
                {formFields[formFieldsKeys.priority] ? 'High' : 'Normal'})
              </Text>
            </View>
          </View>
        ) : null} */}
        {/* {
                    UserLogin?.userType == 0
                        ?  */}
        <View style={styles.checkBoxView}>
          <BouncyCheckbox
            size={20}
            fillColor={Colors.primary}
            unfillColor={Colors.white}
            iconStyle={{borderColor: Colors.primary}}
            isChecked={formFields[formFieldsKeys.is_flash]}
            onPress={value => {
              handleInputChange([formFieldsKeys.is_flash], value);
            }}
          />
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.saveAsTemplate}>{'Send as a Flash SMS'}</Text>
          </View>
        </View>
        {/* : null
                } */}

        <View style={styles.checkBoxView}>
          <BouncyCheckbox
            size={20}
            fillColor={Colors.primary}
            unfillColor={Colors.white}
            iconStyle={{borderColor: Colors.primary}}
            isChecked={formFields[formFieldsKeys.same_as_template]}
            onPress={value => {
              handleInputChange([formFieldsKeys.same_as_template], value);
            }}
          />
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.saveAsTemplate}>{'Same As Template'}</Text>
          </View>
        </View>

        <View style={styles.checkBoxView}>
          <BouncyCheckbox
            size={20}
            fillColor={Colors.primary}
            unfillColor={Colors.white}
            iconStyle={{borderColor: Colors.primary}}
            isChecked={formFields[formFieldsKeys.is_schedule]}
            onPress={value => { 
              handleInputChange([formFieldsKeys.is_schedule], value);
              handleInputChange([formFieldsKeys.campaign_send_date_time], ''); 
            }}
          />
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.saveAsTemplate}>{'Schedule SMS'}</Text>
          </View>
        </View>
        {formFields[formFieldsKeys.is_schedule] ? (
          <InputValidation
            value={
              formFields[formFieldsKeys.campaign_send_date_time]
                ? moment(
                    formFields[formFieldsKeys.campaign_send_date_time],
                  ).format('MMMM Do YYYY, h:mm:ss a')
                : ''
            }
            placeHolder={'Date & Time'}
            onPressIcon={showDatePicker}
            iconRight={'calendar'}
            label={'Date & Time'}
            style={{marginTop: Constants.formFieldTopMargin}}
            editable={false}
          />
        ) : null}

        <CustomButton 
          onPress={() => {
            if (validation()) {
              sendSmsFunction();
            } else {
              Alert.alert(
                'Validation Error',
                'Please fill all required fields',
              );
            }
          }}
          title={
            formFields[formFieldsKeys.is_schedule]
              ? 'Schedule Message'
              : 'Send Message Now'
          }
        />
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="datetime"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
      </KeyboardAwareScrollView>
    </BaseContainer>
  );
};

export default SendSMSForm;

const styles = StyleSheet.create({
  headerOptionContainer: {
    backgroundColor: Colors.lightPrimary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 10,
    marginTop: 5,
    borderWidth: 2,
    borderColor: Colors.primary,
    overflow: 'hidden',
  },
  headerOption: {
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
  },
  headerOptionText: {
    fontSize: getProportionalFontSize(14),

    fontFamily: fonts.semiBold,
  },
  nextButton: {
    marginBottom: 70,
  },
  approxCountStyle: {
    fontSize: getProportionalFontSize(12),
    fontFamily: fonts.mediumItalic,
  },
  inputStyle: {
    fontSize: getProportionalFontSize(16),
    borderColor: Colors.borderColor,
    backgroundColor: Colors.white,
  },
  checkBoxView: {flexDirection: 'row', alignItems: 'center', marginTop: 30},
  saveAsTemplate: {
    fontSize: getProportionalFontSize(13),
    fontFamily: Assets.fonts.regular,
  },
  errorText: {
    fontSize: getProportionalFontSize(12),
    fontFamily: Assets.fonts.regular,
    color: Colors.red,
  },
  dropDownContainer: {
    width: '51%',
    borderWidth: 0,
    position: 'absolute',
    right: 0,
    marginTop: 0,
    zIndex: 10,
    backgroundColor: Colors.transparent,
  },
});
