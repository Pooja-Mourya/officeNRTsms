import { View, Text, Image, StyleSheet, ImageBackground, TouchableOpacity, TextInput, Keyboard } from 'react-native'
import React, { useState } from 'react'
import Octicons from 'react-native-vector-icons/dist/Octicons';
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';
import Feather from 'react-native-vector-icons/dist/Feather';
import LinearGradient from 'react-native-linear-gradient';
import { img, fonts } from '../assets/Assets';
import { checkEmailFormat, getProportionalFontSize } from '../Services/CommonMethods'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Colors from '../assets/Colors';
import Constants from '../constant/Constants';
import APIService from '../Services/APIService';
import { Modal, Portal, } from 'react-native-paper';
import { useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import TransparentLoader from '../components/TransparentLoader';


const Forgot = ({ navigation }) => {
    // Immutable Variables
    const initialValidationObj = {
        email: {
            invalid: false,
            title: 'Invalid Email',
        },
    };

    const UserLogin = useSelector(state => state.global_store.userLogin);
    const [isLoading, setIsLoading] = useState(false);
    const [newPassword, setNewPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [passwordVisibility, setPasswordVisibility] = useState(true);
    const [email, setEmail] = useState();
    const [validationObj, setValidationObj] = React.useState({
        ...initialValidationObj,
    });
    const [visible, setVisible] = React.useState(false);

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    const containerStyle = { backgroundColor: Colors.transparent, justifyContent: "center", alignItems: "center" };

    const handlePasswordVisibility = () => {
        setPasswordVisibility(!passwordVisibility);
    };


    const submit = ({ navigation }) => {
        if (newPassword && confirmPassword) {
            Alert.alert('Password Changed success fully')
        }
    }
    const removeErrorTextForInputThatUserIsTyping = uniqueKey => {
        let tempValidationObj = { ...validationObj };
        tempValidationObj[uniqueKey] = initialValidationObj[uniqueKey];
        setValidationObj(tempValidationObj);
    };
    const validation = () => {
        let isValid = true;
        let tempValidationObj = { ...validationObj }
        if (!email || email.trim().length == 0) {
            tempValidationObj.email.invalid = true;
            tempValidationObj.email.title = "Email is required"
            isValid = false
        }
        if (!checkEmailFormat(email)) {
            tempValidationObj.email.invalid = true;
            tempValidationObj.email.title = 'Email is invalid';
            isValid = false
        }
        setValidationObj(tempValidationObj)
        return isValid
    }
    const forgotPasswordApi = async () => {
        setIsLoading(true);
        let params = { email: email }
        let url = Constants.apiEndPoints.forgotPassword;
        let response = await APIService.postData(url, params, UserLogin.access_token, null, "forgot password api")
        if (!response.errorMsg) {
            showModal()
            setIsLoading(false);
            // navigation.goBack()
        } else {
            setIsLoading(false);
            alert(response.errorMsg)
        }
    }
    return (
        <View
            style={{
                flex: 1,
                backgroundColor: '#fff',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
            <TransparentLoader isLoading={isLoading} />
            <Portal>
                <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modalContainerOuter}>
                    <View style={styles.modalContainerInner}>
                        <Text style={{
                            textAlign: "center",
                            fontFamily: fonts.semiBold,
                            fontSize: getProportionalFontSize(20),
                            color: Colors.primary,
                        }}>Success</Text>

                        <Text style={{
                            textAlign: "center",
                            fontFamily: fonts.medium,
                            fontSize: getProportionalFontSize(12),
                            color: Colors.black,
                            marginTop: 10,
                            marginBottom: 15
                        }}>Password reset link send successfully. Check your email</Text>

                        <TouchableOpacity style={{
                            backgroundColor: Colors.primary,
                            paddingHorizontal: 20,
                            borderRadius: 30,
                            alignSelf: "center",
                        }}
                            onPress={() => {
                                hideModal()
                                navigation.goBack()
                            }}>
                            <Text style={{
                                textAlign: "center",
                                fontFamily: fonts.medium,
                                fontSize: getProportionalFontSize(15),
                                color: Colors.white,
                            }}>close</Text>
                        </TouchableOpacity>

                    </View>
                </Modal>
            </Portal>
            <KeyboardAwareScrollView style={{ width: "100%", height: "100%", }} keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false} >
                <TouchableOpacity
                    onPress={() => { navigation.goBack() }} style={{
                        position: "absolute",
                        top: 30,
                        left: 20,
                        zIndex: 100,
                        flexDirection: "row",
                        // justifyContent:"center",
                        alignItems: "center"
                    }}>
                    <Ionicons name={"md-chevron-back-circle"} size={getProportionalFontSize(27)} color={Colors.white} />
                    <Text style={{
                        fontFamily: fonts.medium, fontSize: getProportionalFontSize(18), color: Colors.white,
                        marginTop: 2, marginLeft: 5
                    }}>Back To Login</Text>
                </TouchableOpacity               >
                <Image source={img.BgTop} style={styles.ImageBackgroundTop} resizeMode={"contain"} />

                <Image style={styles.nrtLogo} source={img.logo} />

                <View style={styles.container}>
                    <InputValidation
                        validationObj={validationObj}
                        uniqueKey={"email"}
                        value={email}
                        placeHolder={'demo@email.com'}
                        onChangeText={text => {
                            setEmail(text);
                            removeErrorTextForInputThatUserIsTyping('email');
                        }}
                        label={"Email"}
                        style={{ marginTop: Constants.formFieldTopMargin }}
                        inputStyle={{
                            ...styles.inputStyle1,
                        }}
                        roundness={10}
                        iconLeft={"email"}
                    // isIconTouchable={}
                    // onPressIcon
                    />

                    <Text style={{
                        fontFamily: fonts.medium,
                        color: Colors.primary,
                        fontSize: getProportionalFontSize(12),
                        marginTop: 10,
                        paddingHorizontal: 5
                    }}>Enter your email and we'll send you instructions to reset your password</Text>

                    <LinearGradient colors={['#FFAD33', '#FF9B36']} style={styles.button}>
                        <TouchableOpacity
                            onPress={() => {
                                Keyboard.dismiss()
                                if (validation()) {
                                    forgotPasswordApi()
                                } else {
                                    alert("All fields are required")
                                }
                            }}
                            style={{
                                width: '100%',
                                height: '100%',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <Text
                                style={styles.LoginButton}>
                                Send Reset Link
                            </Text>
                        </TouchableOpacity>
                    </LinearGradient>
                </View>
            </KeyboardAwareScrollView>
        </View>
        // <>
        //     <KeyboardAwareScrollView>
        //         <Image source={img.BgTop} style={styles.sms} />
        //         <Image
        //             style={styles.nrtLogo}
        //             source={img.logo}
        //         />
        //         <View style={styles.container}>

        //             {/* new password InputText */}

        //             <View>
        //                 <View style={styles.inputStyle}>
        //                     <TextInput
        //                         value={newPassword}
        //                         placeholder='New Password'
        //                         onChangeText={(e) => setNewPassword(e)}
        //                         mode='outline'
        //                         secureTextEntry={passwordVisibility}
        //                         autoCapitalize="none"
        //                         enablesReturnKeyAutomatically
        //                         passwordVisibility
        //                         handlePasswordVisibility
        //                     />
        //                 </View>
        //                 <Text style={styles.circle}></Text>
        //                 <ImageBackground>
        //                     <Text style={{
        //                         position: 'absolute',
        //                         left: 38,
        //                         top: 70,
        //                         zIndex: 2
        //                     }}>
        //                         <MaterialIcons name="card-travel" size={30} color="#FFFFFF" />
        //                     </Text>
        //                 </ImageBackground>
        //                 <Feather onPress={handlePasswordVisibility} style={styles.eyeIcon} name={passwordVisibility ? 'eye-off' : 'eye'} size={30} color="#696767" />
        //             </View>

        //             {/* confirmPassword Input Text */}
        //             <View>
        //                 <View style={styles.inputStyle}>
        //                     <TextInput
        //                         value={confirmPassword}
        //                         placeholder='Confirm Password'
        //                         onChangeText={(e) => setConfirmPassword(e)}
        //                         mode='outline'
        //                         secureTextEntry={passwordVisibility}
        //                         autoCapitalize="none"
        //                         enablesReturnKeyAutomatically
        //                         passwordVisibility
        //                         handlePasswordVisibility
        //                     />
        //                 </View>
        //                 <Text style={styles.circle}></Text>
        //                 <ImageBackground>
        //                     <Text style={{
        //                         position: 'absolute',
        //                         left: 38,
        //                         top: 70,
        //                         zIndex: 2
        //                     }}>
        //                         <MaterialIcons name="card-travel" size={30} color="#FFFFFF" />
        //                     </Text>
        //                 </ImageBackground>
        //                 <Feather style={styles.eyeIcon} name="eye-off" size={30} color="#696767" />
        //             </View>

        //             {/* submit button  */}
        //             <View style={{ height: 200 }}>
        //                 <LinearGradient colors={['#FFAD33', '#FF9B36']} style={styles.button} >
        //                     <TouchableOpacity onPress={submit} >
        //                         <Text onPress={() => { navigation.navigate('Login') }}
        //                             style={styles.LoginButton}>Submit</Text>
        //                     </TouchableOpacity>
        //                 </LinearGradient>
        //             </View>
        //         </View>
        //     </KeyboardAwareScrollView>
        // </>
    )
}

export default Forgot

const styles = StyleSheet.create({
    modalContainerOuter: { backgroundColor: Colors.transparent, justifyContent: "center", alignItems: "center" },
    modalContainerInner: {
        backgroundColor: Colors.white,
        width: "70%",
        padding: 20,
        borderRadius: 10
    },
    ImageBackgroundTop: {
        width: "100%",
        top: 0,
        borderWidth: 1,
        borderColor: Colors.transparent

        // borderColor:"green"
    },
    vector7: {
        position: 'absolute',
        width: 337.5,
        height: 231.5,
        left: 0,
        top: 105,
    },
    outlineFocus: {
        borderColor: 'red',
    },
    nrtLogo: {
        position: 'absolute',
        width: '50%',
        height: '10%',
        left: "25%",
        top: "40%",
    },
    container: {
        paddingHorizontal: Constants.globalPaddingHorizontal,
        // flex: 1,
        // marginTop: 50,
        // top: -85,
        // width: '100%',
        // height: '100%',
    },

    inputContainer: {
        // borderWidth: 2,
        position: 'absolute',
        height: 'auto',
    },

    inputStyle: {
        width: "90%",
        height: 50,
        top: 120,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#696767',
        borderRadius: 50,
        marginVertical: 10,
        paddingLeft: 70,
        marginHorizontal: 16,
        zIndex: 2,


    },

    button: {
        // position: 'absolute',
        width: "100%",
        height: 50,
        // top: 300,
        borderRadius: 50,
        backgroundColor: '#FFAD33',
        marginVertical: 30
    },

    circle: {
        borderBottomRightRadius: 900,
        borderTopRightRadius: 900,
        borderTopLeftRadius: 900,
        transform: [{ rotate: '-135deg' }],
        position: 'absolute',
        width: 51,
        height: 51,
        top: 130,
        left: 15,
        zIndex: 2,
        backgroundColor: '#FFAD33',
    },

    LoginButton: {
        fontSize: getProportionalFontSize(18),
        padding: 10,
        color: 'white',
        fontFamily: fonts.semiBold,
        alignSelf: 'center',
    },


    eyeIcon: {
        position: 'absolute',
        top: 145,
        flex: 1,
        zIndex: 2,
        right: 60,
    },
    inputStyle1: {
        fontSize: getProportionalFontSize(16),
        borderColor: Colors.borderColor,
        backgroundColor: Colors.white,
    },
    //////////////////
    // nrtLogo: {
    //     position: 'absolute',
    //     width: 220,
    //     height: 89,
    //     left: 97,
    //     top: 243,
    // },
    // container: {
    //     fontFamily: fonts.bold,
    //     right: 10,
    //     top: -85,
    // },
    // inputStyle: {
    //     width: 360,
    //     height: 51,
    //     left: 27,
    //     top: 120,
    //     backgroundColor: '#FFFFFF',
    //     borderWidth: 1,
    //     borderColor: '#696767',
    //     borderRadius: 50,
    //     marginVertical: 10,
    //     paddingHorizontal: 70,
    //     zIndex: 2,
    // },

    // button: {
    //     // position: 'absolute',
    //     width: 360,
    //     height: 51,
    //     left: 27,
    //     top: 150,
    //     borderRadius: 50,
    //     backgroundColor: '#FFAD33'
    // },
    // circle: {
    //     borderBottomRightRadius: 900,
    //     borderTopRightRadius: 900,
    //     borderTopLeftRadius: 900,
    //     transform: [{ rotate: '-135deg' }],
    //     position: 'absolute',
    //     width: 51,
    //     height: 51,
    //     left: 27,
    //     top: 130,
    //     zIndex: 2,
    //     backgroundColor: '#696767'
    // },
    // spaceBetween: {
    //     flexDirection: 'row',
    //     marginTop: 125,
    //     justifyContent: 'space-between'
    // },
    // LoginButton: {
    //     // position: 'absolute',
    //     textAlign: 'center',
    //     fontSize: getProportionalFontSize(18),
    //     padding: 10,
    //     color: 'white',
    // },
    // icons: {
    //     transform: [{ rotate: '-55deg' }],
    //     transform: [{ translateX: -50 }],
    //     width: 500,
    //     height: 500,
    //     justifyContent: 'center',
    //     alignContent: 'center',
    //     textAlign: 'center',
    //     padding: 15,
    // },
    // eyeIcon: {
    //     position: 'absolute',
    //     left: 330,
    //     top: 140,
    //     flex: 1,
    //     zIndex: 2
    // }

})

