import { Image, StyleSheet, Text, TouchableOpacity, View ,Alert} from 'react-native'
import React from 'react' 
// import { checkFileSize, checkUrlFormat, getProportionalFontSize, template } from '../Services/CommonMethods' 
import { checkFileSize,checkUrlFormat } from '../Services/CommonMethods'
import APIService from '../Services/APIService' 
import PickerAndLocationServices from '../Services/PickerAndLocationServices'
import LottieView from 'lottie-react-native';  
import { getProportionalFontSize } from '../Services/CommonMethods'
import {img} from '../assets/Assets';
import Constants from '../constant/Constants';
import Colors from '../assets/Colors';

const UploadAvtar = (props) => { 
    const [uploadingFile, setUploadingFile] = React.useState(false)
    const [fileName, setFileName] = React.useState(false) 
    React.useEffect(() => {
        let temp = false
        if (checkUrlFormat(props?.doc_value)) {
            temp = props?.doc_value
        }else if(props.doc_value&&checkUrlFormat(Constants.base_url2+props?.doc_value)){
            temp = Constants.base_url2+props?.doc_value 
        }        
        else {
            temp = false
        }
        setFileName({ "file_name": temp })
    }, [props?.doc_value])

    
    const uploadFile = async (attachmentArr) => { 
        console.log('attachmentArr',attachmentArr)       
        // return
        setUploadingFile(true)
        let res = await APIService.uploadFile(Constants.apiEndPoints.uploadDoc, attachmentArr, props.UserLogin.access_token, 'avatar_attachments_', 'No', 'Avatar Attachment')
        setUploadingFile(false) 
        if (res.errorMsg) {
            Alert.alert(Constants.danger, res.errorMsg) 
            return null;
        }
        else {  
            Alert.alert(Constants.success, 'File uploaded successfully')
            return res?.data?.data?.file_name;
        }
    }
 

    const imageOrDocumentResponseHandler = async () => {
        let response = await PickerAndLocationServices.openImageLibrary(props.chooseMultiple);  
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
            if (!checkFileSize(response?.assets[0], 2)) { return }
          if (Array.isArray(response?.assets) && response?.assets.length > 0) {
            let temp = []
            response?.assets.forEach((item) => {
                temp.push({
                    uri: item.uri,
                    name: item.fileName,
                    type: item.type,
                })
            }
            )
            let tempRes = await uploadFile(temp)
            // let tempRes = await uploadFile(response?.assets);
            if (tempRes) {
                props?.handleInputChange(props.doc_key, tempRes);
            }else{
                setFileName(false)
            }
            }  
        }
      };
    return (
        <View style={{ marginTop: 10, }}>
            <Text style={styles.headingTitleStyle}>Avtar</Text>
            <View style={styles.container}>
                <View style={{ ...styles.view, ...styles.leftView }}>
                    <Image source={{ uri: fileName?.file_name ?fileName?.file_name: Constants?.userImageMale }} style={styles.avatarStyle} resizeMode={"cover"} />
                </View>
                <View style={{ ...styles.view, ...styles.rightView }}>
                    <Text style={styles.info}>*please-upload-file-less-than size": "02MB"</Text>
                    {fileName?.uploading_file_name ? <Text numberOfLines={1} style={{ ...styles.file_name, color: Colors.primary, }}>{fileName?.uploading_file_name}</Text> : null}
                    <TouchableOpacity
                        style={styles.btn}
                        onPress={() => imageOrDocumentResponseHandler()}
                    >
                        {
                            uploadingFile
                                ? <LottieView
                                    source={img.uploadAnimi}
                                    autoPlay
                                    loop={true}
                                    style={{
                                        width: "80%",
                                    }}
                                />
                                : <Text style={styles.buttonTitle}>upload</Text>
                        }
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default UploadAvtar

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        width: "100%",
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.primary,
        marginTop: 5,
        paddingVertical: 10,
        borderRadius: 10,

    },
    view: {
        justifyContent: "center"
    },
    leftView: {
        width: "40%",
        alignItems: "center"
    },
    rightView: {
        width: "60%",
    },
    avatarStyle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2.5,
        borderColor: Colors.navBackgroundWhite
    },
    info: {
        // fontFamily: Assets.fonts.mediumItalic,
        fontSize: getProportionalFontSize(12),
        marginRight: getProportionalFontSize(15)
    },
    file_name: {
        // fontFamily: Assets.fonts.mediumItalic,
        fontSize: getProportionalFontSize(12),
        marginRight: getProportionalFontSize(15)
    },
    btn: {
        marginTop: 7,
        width: '70%',
        minHeight: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 6,
        backgroundColor: Colors.primary,
        paddingVertical: 5,
        overflow: "hidden",
        // paddingHorizontal: 5
    },
    buttonTitle: {
        // fontFamily: Assets.fonts.bold,
        fontSize: getProportionalFontSize(13),
        color: Colors.white,
        textTransform: "uppercase"
    },
    headingTitleStyle: {
        // fontFamily: Assets.fonts.robotoMedium,
        fontSize: getProportionalFontSize(15),
        color: Colors.darkPrimary,
        // fontWeight: "4s00"
    }
})