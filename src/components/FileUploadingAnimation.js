import React from 'react';
import { StyleSheet, Text, View, Button, Alert } from 'react-native'
import LottieView from 'lottie-react-native';
import Colors from '../assets/Colors';
import { getProportionalFontSize } from '../Services/CommonMethods';
import { fonts } from '../assets/Assets';
// import Entypo from 'react-native-vector-icons/Entypo';
// import PickerAndLocationServices from '../Services/PickerAndLocationServices';
// import Constants from '../constant/Constants';
// import TransparentLoader from '../components/TransparentLoader';
// import { FAB, Portal, Modal } from 'react-native-paper';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import APIService from '../Services/APIService';
// import { useSelector } from 'react-redux';

const FileUploadingAnimation = (props) => {
    const { isIncorrectFormate, onRequestClose, isLoading, open_document_picker } = props
    return (
        <View style={{ backgroundColor: 'transparent', justifyContent: "center", alignItems: "center", paddingHorizontal: 16, flex: 1 }}>
            <View style={{ width: '100%', minHeight: 300, backgroundColor: Colors.backgroundColor, paddingVertical: 15, paddingHorizontal: 16, borderRadius: 15 }}>
                {/* close icon */}
                {/* <Icon name='cancel' color={Colors.primary} size={30} onPress={onRequestClose} /> */}
                <Text style={{
                    fontSize: getProportionalFontSize(20), fontFamily: fonts.medium, textTransform: "uppercase",
                    color: isIncorrectFormate ? Colors.red : Colors.primary
                    , textAlign: "center"
                }}>
                    {isIncorrectFormate
                        ? "ERROR"
                        : "PROCESSING"
                    }
                </Text>
                <View
                    style={{
                        height: 150,
                        // position: "absolute",
                        // bottom: 70,
                        alignItems: "center"
                    }}>{
                        isIncorrectFormate
                            ? <LottieView source={require('../assets/Images/upload_file_error.json')} autoPlay />
                            : <LottieView source={require('../assets/Images/uploading_file.json')} autoPlay loop />
                    }

                </View>
                <Text style={{ fontSize: getProportionalFontSize(16), fontFamily: fonts.medium, textTransform: "uppercase", color: isIncorrectFormate ? Colors.red : Colors.primary, textAlign: "center" }}>
                    {isIncorrectFormate
                        ? "UNSUPPORTED FILE FORMAT"
                        : "FILE UPLOADING....."
                    }
                </Text>

                {isIncorrectFormate
                    ? <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <CustomButton
                            onPress={() => onRequestClose()
                            } isLoading={isLoading}
                            title={"close"}
                            style={{ marginTop: 10, width: "40%" }} />

                        <CustomButton onPress={() => { onRequestClose(); open_document_picker(); }
                        } isLoading={isLoading} title={"select new file"} style={{ marginTop: 10, width: "55%" }}

                        />

                    </View>
                    : null
                }
            </View>
        </View>

    )
}

export default FileUploadingAnimation

const styles = StyleSheet.create({})