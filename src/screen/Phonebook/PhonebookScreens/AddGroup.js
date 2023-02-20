import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  Linking,
} from 'react-native';
import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import Constants from '../../../constant/Constants';
import InputeValidation from '../../../components/InputValidation';
import APIService from '../../../Services/APIService';
import CustomButton from '../../../components/CustomButton';
import {getProportionalFontSize} from '../../../Services/CommonMethods';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import TransparentLoader from '../../../components/TransparentLoader';
import {useEffect} from 'react';
import Colors from '../../../assets/Colors';
import {img, fonts} from '../../../assets/Assets';
import {Button, Portal, Modal} from 'react-native-paper';
import PickerAndLocationServices from '../../../Services/PickerAndLocationServices';
import FileUploadingAnimation from '../../../components/FileUploadingAnimation';
import AlertComp from '../../../components/AlertCom';
import * as Papa from 'papaparse';

const AddGroup = props => {
  const initialValues = {
    groupName: '',
    groupDescription: '',
    groupNumbers: '',
    numbers: [],
    file_path: '',
  };
  const formFieldsKeys = {
    groupName: 'groupName',
    groupDescription: 'groupDescription',
    groupNumbers: 'groupNumbers',
    numbers: 'numbers',
    file_path: 'file_path',
  };

  // validation starts from here
  const initialValidationObj = {
    [formFieldsKeys.groupName]: {
      title: 'Invalid Group Name',
      invalid: false,
    },
    [formFieldsKeys.groupDescription]: {
      title: 'Invalid Group Description',
      invalid: false,
    },
    [formFieldsKeys.numbers]: {
      title: 'Invalid Numbers',
      invalid: false,
    },
    [formFieldsKeys.file_path]: {
      title: 'Invalid File',
      invalid: false,
    },
  };

  const validation = () => {
    let isValid = true;
    let validationObj = {...initialValidationObj};
    for (let key in validationObj) {
      if (formValues[key] === '' && key !== formFieldsKeys.file_path) {
        isValid = false;
        validationObj[key].invalid = true;
      } else if (
        !isImport &&
        Array.isArray(formValues[key]) &&
        formValues[key].length === 0
      ) {
        isValid = false;
        validationObj[key].invalid = true;
      }
    }
    setValidationObj(validationObj);

    return isValid;
  };

  const downloadSampleFile = async () => {
    const url = Constants.apiEndPoints.dltSampleFile;
    let response = await APIService.getData(
      url,
      userLogin.access_token,
      null,
      'downloadFileSample',
    );
    if (!response.errorMsg) {
      if (response?.data) {
        Linking.openURL(`${Constants?.base_url2}${response?.data?.data}`);
      } else {
        Alert.alert('url not found');
      }
    } else {
      Alert.alert(response.errorMsg);
    }
  };

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
      //  this.setState({ avatarSource: response, imagePathText: response.type });
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

  const userLogin = useSelector(state => state?.global_store?.userLogin);
  const [validationObj, setValidationObj] = useState(initialValidationObj);
  const [formValues, setFormValues] = useState(initialValues);
  const [isLoading, setIsLoading] = useState(false);
  const [modalKey, setModalKey] = React.useState('');
  const [isIncorrectFormate, setIsIncorrectFormate] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const data = props?.route?.params?.item;
  const isImport = props?.route?.params?.isImport;

  useEffect(() => {
    if (data) {
      setFormValues({
        groupName: data?.group_name,
        groupDescription: data?.description,
      });
    }
  }, [data]);

  // Api calling for add groups
  const AddGroup = async t => {
    setIsLoading(true);
    let params = {
      group_name: formValues.groupName,
      description: formValues.groupDescription,
      numbers: formValues.numbers,
    };

    let url = Constants.apiEndPoints.contact_add_group;
    // return
    let response = await APIService.postData(
      url,
      params,
      userLogin.access_token,
      null,
      'contact_add_group_API',
    );
    if (!response.errorMsg) {
      setIsLoading(false);
      props.navigation.navigate('PhoneBook');
      setFormValues(initialValues);
      Alert.alert(
        Constants.success,
        response?.data.message ?? 'Group Added Successfully',
      );
    } else {
      setIsLoading(false);
      Alert.alert(
        Constants.danger,
        response.errorMsg ?? 'Something went wrong',
      );
    }
  };

  // update group
  const UpdateGroup = async () => {
    setIsLoading(true);
    let params = {
      group_name: formValues.groupName,
      description: formValues.groupDescription,
    };
    let url = Constants.apiEndPoints.ContactGroup + '/' + data?.id;
    // return
    let response = await APIService.putData(
      url,
      params,
      userLogin.access_token,
      null,
      'contact_listing_delete',
    );

    if (!response.errorMsg) {
      setIsLoading(false);
      props.navigation.navigate('PhoneBook');
      setFormValues(initialValues);
      Alert.alert(
        Constants.success,
        response?.data.message ?? 'Group Updated Successfully',
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
      group_name: formValues.groupName,
      description: formValues.groupDescription,
      file_path: formValues.file_path,
    };

    let url = Constants.apiEndPoints.importContact;
    // return
    let response = await APIService.postData(
      url,
      params,
      userLogin.access_token,
      null,
      'contact_import',
    );
    if (!response.errorMsg) {
      setIsLoading(false);
      props.navigation.navigate('PhoneBook');
      setFormValues(initialValues);
      Alert.alert('Contact Imported Successfully');
    } else {
      setIsLoading(false);
      Alert.alert(Constants.danger, 'Something went wrong');
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

  const onRequestClose = () => {
    setIsModalVisible(false);
  };
  return (
    <BaseContainer
      title={data ? 'Update Group' : isImport ? 'Import Group' : 'Add Group'}
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
            style={{}}
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
          <InputeValidation
            label="Group Name"
            placeHolder="Enter Group Name"
            value={formValues.groupName}
            uniqueKey={formFieldsKeys.groupName}
            validationObj={validationObj}
            onChangeText={text => {
              handleInputChange(formFieldsKeys.groupName, text);
              removeErrorTextForInputThatUserIsTyping(formFieldsKeys.groupName);
            }}
          />

          <InputeValidation
            label="Group Description"
            placeHolder="Enter Group Description"
            value={formValues.groupDescription}
            uniqueKey={formFieldsKeys.groupDescription}
            validationObj={validationObj}
            onChangeText={text => {
              handleInputChange(formFieldsKeys.groupDescription, text);
              removeErrorTextForInputThatUserIsTyping(
                formFieldsKeys.groupDescription,
              );
            }}
          />
          {!data && !isImport && (
            <InputeValidation
              label="Group Numbers"
              placeHolder="Enter Group Numbers"
              value={formValues.groupNumbers}
              uniqueKey={formFieldsKeys.numbers}
              maxLength={10}
              validationObj={validationObj}
              iconRight={'plus'}
              keyboardType={'numeric'}
              isIconTouchable={true}
              onPressIcon={() => {
                if (formValues.groupNumbers.length == 10) {
                  let numbers = formValues.numbers;
                  numbers.push(formValues.groupNumbers);
                  setFormValues({
                    ...formValues,
                    numbers: numbers,
                    groupNumbers: '',
                  });
                } else {
                  alert('Please enter 10 digit number');
                }
                handleInputChange(formFieldsKeys.groupNumbers, '');
              }}
              onChangeText={text => {
                handleInputChange(formFieldsKeys.groupNumbers, text);
                removeErrorTextForInputThatUserIsTyping(formFieldsKeys.numbers);
              }}
            />
          )}
          {isImport && (
            <>
              <Text style={styles.chooseText}>Choose File *</Text>
              <Button
                icon="upload"
                mode="outlined"
                loading={isLoading}
                style={styles.uploadBtn}
                onPress={() => open_document_picker()}
              >
                {formValues.file_path
                  ? formValues.file_path.split('/').pop()
                  : 'Upload File'}
              </Button>

              {validationObj.file_path.invalid && (
                <Text style={styles.invalidPath}>Invalid file path</Text>
              )}

              <View style={styles.uploadingInstr}>
                <AntDesign
                  name="infocirlceo"
                  size={20}
                  color={Colors.primary}
                />
                <Text style={styles.pleaseDownload}>
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
            </>
          )}

          {formValues.numbers &&
            formValues.numbers.map((item, index) => {
              return (
                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginVertical: 10,
                    marginHorizontal: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: getProportionalFontSize(14),
                      fontWeight: 'bold',
                      width: '80%',
                    }}
                  >
                    {item}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      let temp = [...formValues.numbers];
                      temp.splice(index, 1);
                      setFormValues({
                        ...formValues,
                        numbers: temp,
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
                  'Add Group',
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
                      onPress: () =>
                        data
                          ? UpdateGroup()
                          : isImport
                          ? ImportContact()
                          : AddGroup(),
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

export default AddGroup;

const styles = StyleSheet.create({
  inputView: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  uploadBtn: {
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
  chooseText: {marginTop: 5, marginLeft: 5, color: Colors.primary},
  uploadingInstr: {
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
  invalidPath: {
    color: 'red',
    marginLeft: 5,
    fontSize: getProportionalFontSize(12),
  },
  pleaseDownload: {
    fontSize: getProportionalFontSize(12),
    marginTop: 10,
    fontFamily: fonts.medium,
    textDecorationStyle: 'solid',
    textDecorationLine: 'underline',
    color: Colors.primary,
  },
});
