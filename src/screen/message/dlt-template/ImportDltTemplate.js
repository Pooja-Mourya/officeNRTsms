import APIService from '../../../Services/APIService';
import Constants from '../../../constant/Constants';
import {useSelector} from 'react-redux';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import React, {useState, useCallback} from 'react';
import PickerAndLocationServices from '../../../Services/PickerAndLocationServices';
import {Button, Portal, Modal} from 'react-native-paper';
import FileUploadingAnimation from '../../../components/FileUploadingAnimation';
import Colors from '../../../assets/Colors';
import {getProportionalFontSize} from '../../../Services/CommonMethods';
import {fonts} from '../../../assets/Assets';
import CustomButton from '../../../components/CustomButton';
import AlertComp from '../../../components/AlertCom';
import DropDownComp from '../../../components/DropDownComp';
import * as Papa from 'papaparse';
import AntDesign from 'react-native-vector-icons/AntDesign';

const ImportDltTemplate = ({navigation}) => {
  const initialValues = {
    file_path: '',
    user_id: '',
  };
  const formFieldsKeys = {
    file_path: 'file_path',
    user_id: 'user_id',
  };
  const initialValidationObj = {
    [formFieldsKeys.file_path]: {
      title: 'invalid file',
      invalid: false,
    },
    [formFieldsKeys.user_id]: {
      title: 'invalid user',
      invalid: false,
    },
  };

  const validation = () => {
    let isValid = true;
    let validationObj = {...initialValidationObj};
    if (formValues[formFieldsKeys.file_path] == '') {
      validationObj[formFieldsKeys.file_path].invalid = true;
      isValid = false;
    }
    if (formValues[formFieldsKeys.user_id] == '') {
      validationObj[formFieldsKeys.user_id].invalid = true;
      isValid = false;
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
      Alert.alert('Constants.danger', res.errorMsg);
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
  const [modalKey, setModalKey] = React.useState('');
  const [formValues, setFormValues] = useState(initialValues);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isIncorrectFormate, setIsIncorrectFormate] = useState(true);
  const [userData, setUserData] = useState([]);

  React.useEffect(() => {
    const DltUserTemplateAPI = async () => {
      let url = Constants.apiEndPoints.users;
      // console.log(url, params)
      let response = await APIService.postData(
        url,
        {},
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
    DltUserTemplateAPI();
  }, []);

  const ImportDltTemplate = async () => {
    setIsLoading(true);
    let url = Constants.apiEndPoints.ImportDltTemplate;
    let params = {
      ...formValues,
    };
    console.log(url, params);
    // return
    let response = await APIService.postData(
      url,
      params,
      userLogin.access_token,
      null,
      'ImportDltTemplate',
    );
    if (!response.errorMsg) {
      setIsLoading(false);
      navigation.navigate('DltTemplateList');
      Alert.alert(
        Constants.success,
        response.message ?? 'Imported Successfully',
      );
    } else {
      setIsLoading(false);
      Alert.alert(
        Constants.danger,
        response.errorMsg ?? 'Something went wrong',
      );
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
      title={'Import DLT Template'}
      leftIcon="arrow-back"
      onPressLeftIcon={() => navigation.goBack()}>
      <TransparentLoader isLoading={isLoading} />

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
      <View
        style={{
          flex: 1,
          backgroundColor: '#fff',
          padding: 10,
        }}>
        <DropDownComp
          value={formValues?.user_id}
          validationObj={validationObj}
          uniqueKey={formFieldsKeys.user_id}
          data={userData}
          onPressItem={item => {
            handleInputChange(formFieldsKeys.user_id, item.id);
            removeErrorTextForInputThatUserIsTyping(formFieldsKeys.user_id);
          }}
          keyToShowData="name"
          keyToCompareData="id"
          placeHolder="User"
          isSearch="Search User..."
        />

        <Text style={{marginTop: 5, marginLeft: 5, color: Colors.primary}}>
          Choose File *
        </Text>
        <Button
          icon="upload"
          mode="outlined"
          loading={isLoading}
          style={{
            ...styles.button,
            borderColor: validationObj.file_path.invalid
              ? Colors.red
              : Colors.primary,
          }}
          onPress={() => open_document_picker()}>
          {formValues.file_path
            ? formValues.file_path.split('/').pop()
            : 'Upload File'}
        </Button>

        {validationObj.file_path.invalid && (
          <Text style={styles.errorText}>Invalid file path</Text>
        )}

        <View
          style={{
            marginVertical: 10,
            borderWidth: 1,
            borderColor: Colors.primary,
            borderRadius: 5,
            padding: 5,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <AntDesign name="infocirlceo" size={20} color={Colors.primary} />
          <Text
            style={{
              fontSize: getProportionalFontSize(12),
              marginTop: 10,
              fontFamily: fonts.medium,
              textDecorationStyle: 'solid',
              textDecorationLine: 'underline',
              color: Colors.primary,
            }}>
            "Please Download This Excel File And Fill All The Details
            Accordingly After That You Can Upload The File To Import Your
            Items."
          </Text>
          <Button
            icon="download"
            mode="elevated" 
            color={Colors.darkgreen}
            style={styles.button}
            onPress={() => downloadSampleFile()}>
            Download sample file
          </Button>
        </View>

        <CustomButton
          title="Submit" 
          onPress={() => {
            if (validation()) {
              ImportDltTemplate();
            } else {
              Alert.alert(Constants.danger, 'Validation Error');
            }
          }}
        />
      </View>
    </BaseContainer>
  );
};

export default ImportDltTemplate;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: Colors.red,
    marginLeft: 5,
    fontSize: getProportionalFontSize(12),
  },
  button: {
    marginTop: 10,
    width: '100%',
    height: 50,
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
