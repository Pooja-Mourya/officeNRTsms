import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import InputeValidation from '../../../components/InputValidation';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {fonts} from '../../../assets/Assets';
import Constants from '../../../constant/Constants';
import {
  checkMobileNumberFormat,
  getProportionalFontSize,
} from '../../../Services/CommonMethods';
import APIService from '../../../Services/APIService';
import {Button, Portal, Modal} from 'react-native-paper';
import AlertComp from '../../../components/AlertCom';
import FileUploadingAnimation from '../../../components/FileUploadingAnimation';
import CustomButton from '../../../components/CustomButton';
import Colors from '../../../assets/Colors';
import PickerAndLocationServices from '../../../Services/PickerAndLocationServices';
import * as Papa from 'papaparse';

const AddBlockNumber = props => {
  const formFieldsKeys = {
    groupNumbers: 'groupNumbers',
    mobile_numbers: 'mobile_numbers',
    file_path: 'file_path',
  };

  const initialValues = {
    mobile_numbers: [],
    file_path: '',
    groupNumbers: '',
  };
  // validation starts from here
  const initialValidationObj = {
    [formFieldsKeys.mobile_numbers]: {
      title: 'invalid mobile_numbers',
      invalid: false,
    },
    [formFieldsKeys.file_path]: {
      title: 'invalid file',
      invalid: false,
    },
  };

  const validation = () => {
    let isValid = true;
    let validationObj = {...initialValidationObj};
    if (formValues.mobile_numbers.length === 0 && !isImport) {
      isValid = false;
      validationObj[formFieldsKeys.mobile_numbers].invalid = true;
    }
    if (formValues.file_path === '' && isImport) {
      validationObj[formFieldsKeys.file_path].invalid = true;
      isValid = false;
    }

    setValidationObj(validationObj);
    return isValid;
  };

  const userLogin = useSelector(state => state?.global_store?.userLogin);
  const [validationObj, setValidationObj] = useState(initialValidationObj);
  const [modalKey, setModalKey] = React.useState('');
  const [formValues, setFormValues] = useState(initialValues);
  const [isLoading, setIsLoading] = useState(false);
  const [isIncorrectFormate, setIsIncorrectFormate] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const isImport = props?.route?.params?.isImport;

  async function open_document_picker() {
    let docRes = await PickerAndLocationServices.OpenDocumentPicker(false);
    if (!docRes) return;
    else imageOrDocumentResponseHandler(docRes);
  }

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
      if (Array.isArray(response) && response.length > 0) {
        if (
          response[0]?.type != 'text/comma-separated-values' &&
          response[0]?.type !=
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ) {
          setIsIncorrectFormate(true);
          setModalKey('');
          setIsModalVisible(true);
          return;
        } else {
          setIsIncorrectFormate(false);
        }
        setModalKey('');
        setIsModalVisible(true);
        let uploaded_doc_arr = await uploadFile(response);
        if (uploaded_doc_arr) {
          handleInputChange(formFieldsKeys.file_path, uploaded_doc_arr);
          removeErrorTextForInputThatUserIsTyping(formFieldsKeys.file_path);
        }
      } else if (response?.assets) {
        console.log('image res.......', response);
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

        console.log('tempdocarr------', tempDocArr);
      }
    }
  };

  const uploadFile = async attachmentArr => {
    let res = await APIService.uploadFile(
      Constants.apiEndPoints.uploadDoc,
      attachmentArr,
      userLogin.access_token,
      'CSV_',
      'no_multiple',
      'csv Attachment',
    );

    // return
    if (res.errorMsg) {
      setIsModalVisible(false);
      Alert.alert(Constants.danger, res.errorMsg);
      return null;
    } else {
      setModalKey('send');
      let file = attachmentArr[0].uri;
      const res1 = await fetch(file);
      const text = await res1.text();
      const result = Papa.parse(text, {header: false});
      let arr = result.data;
      console.log('arr', arr);
      setIsModalVisible(false);
      return res?.data?.data?.file_name;
    }
  };

  const AddGroup = async () => {
    setIsLoading(true);
    let params = {
      mobile_numbers: formValues.mobile_numbers,
    };
    let url = Constants.apiEndPoints.Add_block_number;
    console.log(params, url);
    // return
    let response = await APIService.postData(
      url,
      params,
      userLogin.access_token,
      null,
      'Add_black_number',
    );
    if (!response.errorMsg) {
      setIsLoading(false);
      props.navigation.goBack();
      Alert.alert(
        Constants.success,
        response?.data?.message ?? 'Number added successfully',
      );
    } else {
      setIsLoading(false);
      Alert.alert(
        Constants.danger,
        response.errorMsg ?? 'Something went wrong',
      );
    }
  };

  const ImportContact = async () => {
    setIsLoading(true);
    let params = {
      file_path: formValues.file_path,
    };
    let url = Constants.apiEndPoints.upload_blacklist;
    console.log(params, url);
    // return
    let response = await APIService.postData(
      url,
      params,
      userLogin.access_token,
      null,
      'upload_blacklist_API',
    );
    if (!response.errorMsg) {
      setIsLoading(false);
      props.navigation.goBack();
      Alert.alert(
        Constants.success,
        response?.data?.message ?? 'File uploaded successfully',
      );
    } else {
      setIsLoading(false);
      Alert.alert(Constants.danger, response.errorMsg, 'Something went wrong');
    }
  };

  const downloadSampleFile = async () => {
    let url = Constants.apiEndPoints.sampleFIleBlacklist;
    let response = await APIService.getData(
      url,
      userLogin.access_token,
      null,
      'download_sample_file',
    );
    if (!response.errorMsg) {
      Linking.openURL(`${Constants?.base_url2}${response?.data?.data}`);
    } else {
      Alert.alert(Constants.danger, response.errorMsg);
    }
  };

  const removeErrorTextForInputThatUserIsTyping = key => {
    let validationObj = {...initialValidationObj};
    validationObj[key].invalid = false;
    setValidationObj(validationObj);
  };

  const handleInputChange = (key, value) => {
    setFormValues({
      ...formValues,
      [key]: value,
    });
  };

  const onRequestClose = () => {
    setIsModalVisible(false);
  };

  return (
    <BaseContainer
      title={isImport ? 'Import Blacklist' : 'Add Blacklist'}
      leftIcon="arrow-back"
      onPressLeftIcon={() => props.navigation.goBack()}
    >
      <TransparentLoader isLoading={isLoading} />
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Portal>
          <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={onRequestClose}
          >
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
        <View style={styles.inputView}>
          {!isImport && (
            <InputeValidation
              label="Blacklist Numbers"
              placeHolder="Enter Blacklist Numbers"
              value={formValues.groupNumbers}
              uniqueKey={formFieldsKeys.mobile_numbers}
              maxLength={10}
              validationObj={validationObj}
              iconRight={'plus'}
              keyboardType={'numeric'}
              isIconTouchable={true}
              onPressIcon={() => {
                if (formValues.groupNumbers.length == 10) {
                  let mobile_numbers = formValues.mobile_numbers;
                  mobile_numbers.push(formValues.groupNumbers);
                  setFormValues({
                    ...formValues,
                    mobile_numbers: mobile_numbers,
                    groupNumbers: '',
                  });
                } else {
                  alert('Please enter 10 digit number');
                }

                handleInputChange(formFieldsKeys.groupNumbers, '');
              }}
              onChangeText={text => {
                handleInputChange(formFieldsKeys.groupNumbers, text);
                removeErrorTextForInputThatUserIsTyping(
                  formFieldsKeys.mobile_numbers,
                );
              }}
            />
          )}
          {isImport && (
            <>
              <View style={styles.isImportView}>
                <AntDesign
                  name="infocirlceo"
                  size={20}
                  color={Colors.primary}
                />
                <Text style={styles.uploadFileStyle}>
                  "Please Download This Excel File And Fill All The Details
                  Accordingly After That You Can Upload The File To Import Your
                  Items."
                </Text>
                <CustomButton
                  title="Download sample file"
                  onPress={() => downloadSampleFile()}
                  style={styles.customBtn}
                  titleStyle={{
                    color: Colors.darkgreen,
                    fontSize: getProportionalFontSize(15),
                    fontFamily: fonts.medium,
                  }}
                />
              </View>
              <Text style={styles.chooseFileText}>Choose File *</Text>
              <Button
                icon="upload"
                mode="outlined"
                loading={isLoading}
                style={styles.chooseFileStyle}
                onPress={() => open_document_picker()}
              >
                {formValues.file_path
                  ? formValues.file_path.split('/').pop()
                  : 'Upload File'}
              </Button>

              {validationObj.file_path.invalid && (
                <Text
                  style={{
                    color: 'red',
                    marginLeft: 5,
                    fontSize: getProportionalFontSize(12),
                  }}
                >
                  Invalid file path
                </Text>
              )}
            </>
          )}

          {formValues.mobile_numbers &&
            formValues.mobile_numbers.map((item, index) => {
              return (
                <View key={index} style={styles.blackViewContainer}>
                  <Text style={styles.blackText}>{item}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      let temp = [...formValues.mobile_numbers];
                      temp.splice(index, 1);
                      setFormValues({
                        ...formValues,
                        mobile_numbers: temp,
                      });
                    }}
                  >
                    <Entypo name="cross" size={24} color="red" />
                  </TouchableOpacity>
                </View>
              );
            })}

          <CustomButton
            title="Submit"
            onPress={() => {
              if (validation()) {
                Alert.alert(
                  'Add Black Number',
                  'Do you want to add Number',
                  [
                    {
                      text: 'Cancel',
                    },
                    {
                      text: 'Add',
                      onPress: () => isImport ?? ImportContact(),
                    },
                    {
                      text: 'Submit',
                      onPress: () => AddGroup(),
                    },
                  ],
                  {cancelable: false},
                );
              } else {
                Alert.alert(Constants.danger, 'Validation failed');
              }
            }}
          />
        </View>
      </ScrollView>
    </BaseContainer>
  );
};

export default AddBlockNumber;

const styles = StyleSheet.create({
  inputView: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  chooseFileStyle: {
    marginTop: 10,
    width: '100%',
    height: 50,
    marginBottom: 10,
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blackText: {
    fontSize: getProportionalFontSize(14),
    fontWeight: 'bold',
    width: '80%',
  },
  blackViewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 10,
  },
  uploadFileStyle: {
    fontSize: getProportionalFontSize(12),
    marginTop: 10,
    fontFamily: fonts.medium,
    textDecorationStyle: 'solid',
    textDecorationLine: 'underline',
    color: Colors.primary,
  },
  chooseFileText: {marginTop: 5, marginLeft: 5, color: Colors.primary},
  isImportView: {
    marginVertical: 10,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 5,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customBtn: {
    backgroundColor: null,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
