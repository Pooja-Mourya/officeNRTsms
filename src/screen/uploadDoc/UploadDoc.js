import {
  StyleSheet,
  Text,
  View,
  Linking,
  Button,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  RefreshControl,
} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {useSelector} from 'react-redux';
import APIService from '../../Services/APIService';
import Constants from '../../constant/Constants';
import BaseContainer from '../../components/BaseContainer';
import PickerAndLocationServices from '../../Services/PickerAndLocationServices';
import {fonts, img} from '../../assets/Assets';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import DropDownComp from '../../components/DropDownComp';
import Colors from '../../assets/Colors';
import {getProportionalFontSize} from '../../Services/CommonMethods';
import LottieView from 'lottie-react-native';
import {FAB, Portal} from 'react-native-paper';
import DocuploadAnimation from '../../components/DocuploadAnimation';
import DocumentPicker from 'react-native-document-picker';
import InputValidation from '../../components/InputValidation';
import TransparentLoader from '../../components/TransparentLoader';

const UploadDoc = ({navigation}) => {
  const formFieldsKeys = {
    title: 'title',
    file_path: 'file_path',
    is_share_to_parent: 'is_share_to_parent',
  };
  const initialValues = {
    [formFieldsKeys.title]: '',
    [formFieldsKeys.file_path]: '',
    [formFieldsKeys.is_share_to_parent]: '',
  };
  const initialValidationObj = {
    [formFieldsKeys.title]: {
      invalid: false,
      title: 'Invalid Title',
    },
    [formFieldsKeys.file_path]: {
      invalid: false,
      title: 'Invalid File',
    },
    [formFieldsKeys.is_share_to_parent]: {
      invalid: false,
      title: 'Invalid Share',
    },
  };

  const userLogin = useSelector(state => state.global_store.userLogin);
  const [validationObj, setValidationObj] = useState({...initialValidationObj});
  const [formValues, setFormValues] = useState(initialValues);
  const [singleFile, setSingleFile] = useState(null);
  const [filePath, setFilePath] = useState(null);
  const [isUploading, setIsUploading] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (key, value) => {
    setFormValues({
      ...formValues,
      [key]: value,
    });
  };

  const validation = () => {
    let tempValidationObj = {...initialValidationObj};
    let isValid = true;
    if (formValues[formFieldsKeys.title] === '') {
      tempValidationObj[formFieldsKeys.title].invalid = true;
      isValid = false;
    }
    if (!filePath) {
      tempValidationObj[formFieldsKeys.file_path].invalid = true;
      isValid = false;
    }
    if (formValues[formFieldsKeys.is_share_to_parent] === '') {
      tempValidationObj[formFieldsKeys.is_share_to_parent].invalid = true;
      isValid = false;
    }

    setValidationObj(tempValidationObj);
    return isValid;
  };

  const removeErrorTextForInputThatUserIsTyping = uniqueKey => {
    let tempValidationObj = {...validationObj};
    tempValidationObj[uniqueKey] = initialValidationObj[uniqueKey];
    setValidationObj(tempValidationObj);
  };

  const uploadImage = async singleFile => {
    if (singleFile != null) {
      setIsUploading(true);
      let url = Constants.apiEndPoints.uploadDoc;
      let res = await APIService.uploadFile(
        url,
        singleFile,
        userLogin.access_token,
        'CSV_',
        'no_multiple',
        'csv Attachment',
      );
      if (res.errorMsg) {
        Alert.alert(Constants.danger, res.errorMsg);
        setIsUploading(false);
        return null;
      } else {
        Alert.alert(
          Constants.success,
          Constants.labels.message_uploaded_successfully,
        );
        if (res?.data?.data?.file_name) setFilePath(res?.data?.data?.file_name);
        setIsUploading(false);
      }
    }
  };

  const selectFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      if (singleFile <= 10000) {
        uploadImage(res);
      }
    } catch (err) {
      setSingleFile(null);
      if (DocumentPicker.isCancel(err)) {
        alert('Canceled');
      } else {
        alert('Unknown Error: ' + JSON.stringify(err));
      }
    }
  };

  const userDocument = async () => {
    setIsLoading(true);
    const params = {
      title: formValues.title,
      file_path: filePath,
      is_share_to_parent: formValues.is_share_to_parent ? '1' : '0',
    };
    const url = Constants.apiEndPoints.userDocument;
    let response = await APIService.postData(
      url,
      params,
      userLogin.access_token,
      null,
      'userDocument',
    );
    if (!response.errorMsg) {
      setIsLoading(false);
      navigation.navigate('DocUploadList');
      Alert.alert(
        Constants.success,
        response.data.message ?? 'Document uploaded successfully',
      );
    } else {
      setIsLoading(false);
      Alert.alert(
        Constants.danger,
        response.errorMsg ?? 'Something went wrong',
      );
    }
  };

  return (
    <BaseContainer
      title="Upload Document"
      leftIcon="arrow-back"
      onPressLeftIcon={() => navigation.goBack()}
    >
      <TransparentLoader isLoading={isLoading} />
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.white,
          padding: Constants.globalPadding,
        }}
      >
        <InputValidation
          validationObj={validationObj}
          uniqueKey={formFieldsKeys.title}
          placeHolder={'Title'}
          label={'Title'}
          value={formValues?.[formFieldsKeys?.title] ?? ''}
          onChangeText={text => {
            removeErrorTextForInputThatUserIsTyping(formFieldsKeys?.title);
            handleInputChange(formFieldsKeys?.title, text);
          }}
        />
        <Text
          style={{
            fontSize: getProportionalFontSize(15),
            color: Colors.primary,
          }}
        >
          Share To Parent*
        </Text>
        <View style={{...styles.bounsy,borderColor: validationObj?.is_share_to_parent?.invalid ?Colors.red:Colors.primary,}}>
          <BouncyCheckbox
            size={20}
            fillColor={'#ffaa33'}
            unfillColor={'white'}
            iconStyle={{borderColor: '#ffaa33'}}
            isChecked={formValues?.is_share_to_parent}
            onPress={value => {
              handleInputChange('is_share_to_parent', value);
              removeErrorTextForInputThatUserIsTyping(
                formFieldsKeys?.is_share_to_parent,
              );
            }}
          />
          <Text>({formValues?.is_share_to_parent ? 'Yes' : 'No'})</Text>
        </View>
        {validationObj?.is_share_to_parent?.invalid && (
          <Text style={styles.errorText}>
            {validationObj?.is_share_to_parent?.title}
          </Text>
        )}

        <View style={styles.UploadStyle}>
          {!isUploading ? (
            <TouchableOpacity onPress={selectFile} style={styles.btnStyle}>
              <AntDesign name={'clouduploado'} size={30} />
              <Text
                style={{
                  fontSize: getProportionalFontSize(18),
                  fontFamily: fonts.semiBold,
                }}
              >
                Upload
              </Text>
              <Text>Please Upload File Less Than 10 MB</Text>
            </TouchableOpacity>
          ) : (
            <LottieView
              style={{
                width: 100,
                height: 100,
                alignSelf: 'center',
              }}
              source={img.ledloader}
              autoPlay
            />
          )}
          <View style={styles.btnStyle}>
            <TouchableOpacity
              onPress={() => Linking.openURL(Constants.base_url2 + filePath)}
            >
              <Text>{filePath}</Text>
            </TouchableOpacity>
            <Text>
              {filePath ? (
                <AntDesign
                  onPress={() => setFilePath(!filePath)}
                  name="delete"
                  size={20}
                  color={Colors.secondary}
                />
              ) : null}
            </Text>
          </View>
        </View>
        {validationObj?.file_path?.invalid && (
          <Text style={styles.errorText}>
            {validationObj?.file_path?.title}
          </Text>
        )}

        <CustomButton
          title="Submit"
          onPress={() => {
            if (validation()) {
              userDocument();
            } else {
              Alert.alert(Constants.danger, 'Validation Error');
            }
          }}
        />
      </View>
    </BaseContainer>
  );
};
export default UploadDoc;

const styles = StyleSheet.create({
  btnStyle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bounsy: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1, 
    borderRadius: 5,
    height: 55,
    marginVertical: 5,
    paddingHorizontal: 10,
  },
  errorText: {
    color: Colors.red,
    fontSize: getProportionalFontSize(12),
    marginTop: 5,
  },
  UploadStyle: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 5,
    padding: 20,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
});
