import { StyleSheet, Text, View, Pressable, TextInput, useState, Alert, useCallback, TouchableOpacity } from 'react-native'
import React from 'react'

import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { fonts } from '../../../assets/Assets';
import DocumentPicker from 'react-native-document-picker'
import Constants from '../../../constant/Constants';
import APIService from '../../../Services/APIService';
import { useSelector } from 'react-redux';
// file
import FileUploadingAnimation from '../../../components/FileUploadingAnimation';
import PickerAndLocationServices from '../../../Services/PickerAndLocationServices';

const ImportBlockNumber = (props) => {

    // redux hooks
    const UserLogin = useSelector(state => state?.global_store?.userLogin);

    const [fileResponse, setFileResponse] = React.useState([]);
    const [importFile, setImportFile] = React.useState([])
    // file
    const [isIncorrectFormate, setIsIncorrectFormate] = React.useState(true)
    const [uploadingFile, setUploadingFile] = React.useState()
    const [isLoading, setIsLoading] = React.useState(false)

    // pick file 
    const handleDocumentSelection = React.useCallback(async () => {
        try {
            const response = await DocumentPicker.pick({
                presentationStyle: 'fullScreen',

            });
            setFileResponse(response);
        } catch (err) {
            console.warn(err);
        }
    }, []);
    // file.................
    async function open_document_picker() {
        let docRes = await PickerAndLocationServices.OpenDocumentPicker(true);
        setImportFile(docRes)
        if (!docRes)
            return
        else
            imageOrDocumentResponseHandler(docRes)
    }

    const uploadFile = async (attachmentArr) => {
        setUploadingFile(true)
        console.log("UserLogin.access_token", UserLogin.access_token)
        let params = {

        };
        let url = "blacklists-import";
        console.log(url, params)
        // return
        let res = await APIService.uploadFile(url, attachmentArr, UserLogin.access_token, 'CSV_', 'no_multiple', 'blockList csv Attachment')
        setUploadingFile(false)
        // setIsModalVisible(false)
        // return
        if (res.errorMsg) {
            Alert.alert(Constants.danger, res.errorMsg)
            return null;
        }
        else {
            Alert.alert(Constants.success, Constants.labels.message_uploaded_successfully)
            return res.data.file_path;
        }
    }

    const imageOrDocumentResponseHandler = async (response) => {
        if (response.didCancel) {
            console.log('User cancelled image picker');
        } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
            Alert.alert(Constants.danger, Constants.labels.message_something_went_wrong)
        } else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
        } else {
            //  this.setState({ avatarSource: response, imagePathText: response.type });
            if (Array.isArray(response) && response.length > 0) {
                console.log("image res......if.", response);
                setImportFile(response)
                if (response[0]?.type != "text/comma-separated-values") {
                    setIsIncorrectFormate(true);
                    // setIsModalVisible(true)
                    return
                }

                else { setIsIncorrectFormate(false) }
                return
                // setIsModalVisible(true)
                // return;
                let uploaded_doc_arr = await uploadFile(response);
                // return
                if (!uploaded_doc_arr)
                    return;
                uploaded_doc_arr.map((obj) => {
                    obj['uploaded_doc_url'] = obj.file_name;
                    obj['uri'] = obj.file_name;
                    obj['type'] = obj.uploading_file_name;
                })
                let tempDocArr = [...formFields.documents];
                tempDocArr = tempDocArr.concat(uploaded_doc_arr)
                // handleInputChange(formFieldsKeys.documents, tempDocArr)
                console.log("tempdocarr------", tempDocArr)
            }
            else if (response?.assets) {
                console.log("image res.......", response);
                if (response?.type != "text/comma-separated-values") {
                    setIsIncorrectFormate(true);
                    return
                }
                else { setIsIncorrectFormate(false) }
                // CSVToJSON(response?.uri)
                // setIsModalVisible(true)
                // props.setModalVisible2(false)
                // return;
                let uploaded_doc_arr = await uploadFile(response?.assets);
                if (!uploaded_doc_arr)
                    return;
                uploaded_doc_arr.map((obj) => {
                    obj['uploaded_doc_url'] = obj.file_name
                    obj['uri'] = obj.file_name;
                    obj['type'] = "image";
                })

                let tempDocArr = [...formFields.documents];
                tempDocArr = tempDocArr.concat(uploaded_doc_arr)
                console.log("tempDocArr", tempDocArr)
                // handleInputChange(formFieldsKeys.documents, tempDocArr)
                console.log("tempdocarr------", tempDocArr)
            }
        }
    }

    const onRequestClose = () => {
        // console.log('onRequestClose called')
        // setIsModalVisible(false);
        // props.setModalVisible2(false)
    }
    // file uploading function ends here


    // upload file API calling
    const UploadBlacklist = async () => {
        props.setModalVisible2(false)
        // return
        // alert("abc")
        let params = {
            // file_path: formFields?.file_path ?? '',
            'file_path': 'file_path....'
        };
        let url = Constants.apiEndPoints.upload_blacklist;
        console.log(url, params)
        // return
        let response = await APIService.postData(url, params, userLogin.access_token, null, "upload_blacklist_API");
        console.log('response ', response)
        if (!response.errorMsg) {

            // setIsLoading(false);
            console.log('response with no error', response)
            // setModalVisible2(false)
            props.setModalVisible2(false)
        }
        else {

            console.log('error is here')

        }


    };






    return (
        <View style={[style.modalView, {
            marginTop: 100, width: '80%',
            marginHorizontal: '5%'
        }]}>
            <View style={style.modalHeadTextView}>
                <Text style={style.modalHeadText}>Import Blacklist</Text>
                <Pressable
                    // onPress={() => { setModalVisible2(false) }}
                    onPress={props.setModalVisibleI}

                    style={{ alignSelf: 'flex-end', marginLeft: 150, alignSelf: 'center' }}
                >
                    <Entypo name="cross" size={22} color="white" />
                </Pressable>
            </View>



            <Text style={{ marginLeft: 20, fontFamily: fonts.mediumItalic }}> Choose file </Text>

            {/* <View
            // style={style.urlStyle}
            > */}
            {/* {fileResponse.map((file, index) => ( */}
            <View
                style=
                {{ flexDirection: 'row', marginHorizontal: 15 }}>
                {/* <View style={style.textFileInputField}><Text>Choose File</Text></View> */}
                <Ionicons size={25} name="cloud-upload-sharp" style={style.textFileInputField} onPress={() => open_document_picker()} />
                <TextInput
                    // key={index.toString()}
                    style={[style.urlStyle,]}
                    placeholder={' no file choosen'}
                    // style={style.uri}
                    // numberOfLines={1}
                    // ellipsizeMode={'middle'}
                    // onFocus={() => alert("pressed")}
                    // onChangeText={() => open_document_picker()}
                    value={importFile[0]?.["name"]}
                    editable={false}
                />

            </View>

            <TouchableOpacity
                style={[style.UploadFileButton, { marginTop: 20, }]}
                onPress={async () => await uploadFile(importFile)}
            >
                {/* <FileUploadingAnimation
                    isIncorrectFormate={isIncorrectFormate} onRequestClose={onRequestClose} isLoading={isLoading}
                    open_document_picker={() => open_document_picker()}

                /> */}
                <Text style={{ textAlign: 'center', marginVertical: 6, color: 'white' }}>Upload</Text>
            </TouchableOpacity>
        </View>
    )
}

export default ImportBlockNumber

const style = StyleSheet.create({
    modalView: {
        marginTop: 50,
        width: '80%',

        backgroundColor: "white",
        borderRadius: 10,
        // padding: 10,

        elevation: 5,

    },
    modalHeadTextView: {
        height: 40,
        width: '100%',
        backgroundColor: '#FF9B36',
        // borderTopLeftRadius: 20,
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'space-around',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    modalHeadText: {
        // marginBottom: 15,
        // textAlign: "center",
        marginTop: 5,
        color: 'white',
        marginLeft: 20,
        fontFamily: fonts.semiBold

    },
    fileInput: {
        // width: '100%',
        // height: 50,
        borderWidth: 1,
        borderColor: 'red'
    },
    urlStyle: {
        borderColor: '#ffad33',
        // height: 50,
        width: '75%',
        borderWidth: 2,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        marginHorizontal: 15,
        paddingLeft: 10,
        fontFamily: fonts.medium

    },
    uri: {

    },
    textFileInputField: {
        borderBottomWidth: 2,
        borderLeftWidth: 2,
        borderTopWidth: 2,
        borderColor: '#ffad33',
        marginRight: -15,
        paddingVertical: 11,
        paddingHorizontal: 25,
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5
    },
    UploadFileButton: {
        marginHorizontal: 5,
        width: 100,
        height: 35,
        backgroundColor: '#FF9B36',
        alignSelf: 'center',
        marginBottom: 10,
        borderRadius: 5,


    }
})