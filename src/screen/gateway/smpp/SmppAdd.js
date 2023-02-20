
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { fonts } from '../../../assets/Assets';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Ionicons from 'react-native-vector-icons/Ionicons';
import InputValidation from '../../../components/InputValidation';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import APIService from '../../../Services/APIService';
import Constants from '../../../constant/Constants';
import { useSelector, useDispatch } from 'react-redux';
import CustomButton from '../../../components/CustomButton';
import BaseContainer from '../../../components/BaseContainer';


const SmppAdd = (props) => {
    let { navigation } = props
    let routeParm = props?.route?.params ?? {};
    const formFieldsKeys = {
        "route_name": "route_name",
        "sec_route_name": "sec_route_name",
        "smpp_credit": "smpp_credit",
        "smsc_id": "smsc_id",
        "ip_address": "ip_address",
        "port": "port",
        "smsc_username": "smsc_username",
        "smsc_password": "smsc_password",
        "system_type": "system_type",
        "throughput": "throughput",
        "reconnect_delay": "reconnect_delay",
        "enquire_link_interval": "enquire_link_interval",
        "max_pending_submits": "max_pending_submits",
        "transceiver_mode": "transceiver_mode",
        "source_addr_ton": "source_addr_ton",
        "source_addr_npi": "source_addr_npi",
        "dest_addr_ton": "dest_addr_ton",
        "dest_addr_npi": "dest_addr_npi",
        "log_file": "log_file",
        "log_level": "log_level",
        "instances": "instances",
        "voice": "voice"

    };
    const initialValues = {
        [formFieldsKeys.route_name]: "",
        [formFieldsKeys.sec_route_name]: "",
        [formFieldsKeys.smpp_credit]: "",
        [formFieldsKeys.smsc_id]: "",
        [formFieldsKeys.ip_address]: "",
        [formFieldsKeys.port]: "",
        [formFieldsKeys.smsc_username]: "",
        [formFieldsKeys.smsc_password]: "",
        [formFieldsKeys.system_type]: "",
        [formFieldsKeys.throughput]: "",
        [formFieldsKeys.reconnect_delay]: "",
        [formFieldsKeys.enquire_link_interval]: "",
        [formFieldsKeys.max_pending_submits]: "",
        [formFieldsKeys.transceiver_mode]: "",
        [formFieldsKeys.source_addr_ton]: "",
        [formFieldsKeys.source_addr_npi]: "",
        [formFieldsKeys.dest_addr_ton]: "",
        [formFieldsKeys.dest_addr_npi]: "",
        [formFieldsKeys.log_file]: "",
        [formFieldsKeys.log_level]: "",
        [formFieldsKeys.instances]: "",
        [formFieldsKeys.voice]: "",
        [formFieldsKeys.status]: "",
    };

    const initialValidationObj = {
        [formFieldsKeys.route_name]: {
            invalid: false,
            title: 'Invalid user',
        },
        [formFieldsKeys.sec_route_name]: {
            invalid: false,
            title: 'Invalid sec_route_name',
        },
        [formFieldsKeys.smpp_credit]: {
            invalid: false,
            title: 'Invalid smpp_credit',
        },
        [formFieldsKeys.smsc_id]: {
            invalid: false,
            title: 'Invalid smsc_id',
        },
        [formFieldsKeys.ip_address]: {
            invalid: false,
            title: 'Invalid ip_address',
        },
        [formFieldsKeys.port]: {
            invalid: false,
            title: 'Invalid is unicode',
        },
        [formFieldsKeys.smsc_username]: {
            invalid: false,
            title: 'Invalid smsc_username',
        },

        // [formFieldsKeys.status]: {
        //     invalid: false,
        //     title: 'Invalid status',
        // },
        [formFieldsKeys.smsc_password]: {
            invalid: false,
            title: 'Invalid smsc_password',
        },
        [formFieldsKeys.system_type]: {
            invalid: false,
            title: 'Invalid system_type',
        },
        [formFieldsKeys.throughput]: {
            invalid: false,
            title: 'Invalid throughput',
        },
        [formFieldsKeys.reconnect_delay]: {
            invalid: false,
            title: 'Invalid reconnect_delay',
        },
        [formFieldsKeys.enquire_link_interval]: {
            invalid: false,
            title: 'Invalid enquire_link_interval',
        },
        [formFieldsKeys.max_pending_submits]: {
            invalid: false,
            title: 'Invalid max_pending_submits',
        },

        [formFieldsKeys.transceiver_mode]: {
            invalid: false,
            title: 'Invalid transceiver_mode',
        },
        [formFieldsKeys.source_addr_ton]: {
            invalid: false,
            title: 'Invalid source_addr_ton',
        },
        [formFieldsKeys.source_addr_npi]: {
            invalid: false,
            title: 'Invalid source_addr_npi',
        },
        [formFieldsKeys.dest_addr_ton]: {
            invalid: false,
            title: 'Invalid dest_addr_ton',
        },
        [formFieldsKeys.dest_addr_npi]: {
            invalid: false,
            title: 'Invalid dest_addr_npi',
        },
        [formFieldsKeys.log_file]: {
            invalid: false,
            title: 'Invalid log_file',
        },
        [formFieldsKeys.log_level]: {
            invalid: false,
            title: 'Invalid log_level',
        },
        [formFieldsKeys.instances]: {
            invalid: false,
            title: 'Invalid instances',
        },
        [formFieldsKeys.voice]: {
            invalid: false,
            title: 'Invalid voice',
        },
    };

    const validation = () => {
        let validationObjTemp = { ...validationObj };
        let valid = true

        if (!formValues?.[formFieldsKeys?.route_name]) {
            validationObjTemp[formFieldsKeys?.route_name].invalid = true;
            valid = false 
        }
        if (!formValues?.[formFieldsKeys?.sec_route_name]) {
            validationObjTemp[formFieldsKeys?.sec_route_name].invalid = true;
            valid = false 
        }
        if (!formValues?.[formFieldsKeys?.smpp_credit]) {
            validationObjTemp[formFieldsKeys?.smpp_credit].invalid = true;
            valid = false 
        }
        if (!formValues?.[formFieldsKeys?.smsc_id]) {
            validationObjTemp[formFieldsKeys?.smsc_id].invalid = true;
            valid = false 
        }
        if (!formValues?.[formFieldsKeys?.ip_address]) {
            validationObjTemp[formFieldsKeys?.ip_address].invalid = true;
            valid = false 
        }
        if (!formValues?.[formFieldsKeys?.port]) {
            validationObjTemp[formFieldsKeys?.port].invalid = true;
            valid = false 
        }
        if (!formValues?.[formFieldsKeys?.smsc_username]) {
            validationObjTemp[formFieldsKeys?.smsc_username].invalid = true;
            valid = false 
        }
        if (!formValues?.[formFieldsKeys?.smsc_password]) {
            validationObjTemp[formFieldsKeys?.smsc_password].invalid = true;
            valid = false 
        }
        if (!formValues?.[formFieldsKeys?.system_type]) {
            validationObjTemp[formFieldsKeys?.system_type].invalid = true;
            valid = false 
        }

        if (!formValues?.[formFieldsKeys?.throughput]) {
            validationObjTemp[formFieldsKeys?.throughput].invalid = true;
            valid = false 
        }

        if (!formValues?.[formFieldsKeys?.reconnect_delay]) {
            validationObjTemp[formFieldsKeys?.reconnect_delay].invalid = true;
            valid = false 
        }

        if (!formValues?.[formFieldsKeys?.enquire_link_interval]) {
            validationObjTemp[formFieldsKeys?.enquire_link_interval].invalid = true;
            valid = false 
        }

        if (!formValues?.[formFieldsKeys?.max_pending_submits]) {
            validationObjTemp[formFieldsKeys?.max_pending_submits].invalid = true;
            valid = false 
        }

        if (!formValues?.[formFieldsKeys?.transceiver_mode]) {
            validationObjTemp[formFieldsKeys?.transceiver_mode].invalid = true;
            valid = false 
        }

        if (!formValues?.[formFieldsKeys?.source_addr_ton]) {
            validationObjTemp[formFieldsKeys?.source_addr_ton].invalid = true;
            valid = false 
        }

        if (!formValues?.[formFieldsKeys?.source_addr_npi]) {
            validationObjTemp[formFieldsKeys?.source_addr_npi].invalid = true;
            valid = false 
        }

        if (!formValues?.[formFieldsKeys?.dest_addr_ton]) {
            validationObjTemp[formFieldsKeys?.dest_addr_ton].invalid = true;
            valid = false 
        }

        if (!formValues?.[formFieldsKeys?.dest_addr_npi]) {
            validationObjTemp[formFieldsKeys?.dest_addr_npi].invalid = true;
            valid = false 
        }

        if (!formValues?.[formFieldsKeys?.log_file]) {
            validationObjTemp[formFieldsKeys?.log_file].invalid = true;
            valid = false 
        }

        if (!formValues?.[formFieldsKeys?.log_level]) {
            validationObjTemp[formFieldsKeys?.log_level].invalid = true;
            valid = false 
        }

        if (!formValues?.[formFieldsKeys?.instances]) {
            validationObjTemp[formFieldsKeys?.instances].invalid = true;
            valid = false 
        }

        if (!formValues?.[formFieldsKeys?.voice]) {
            validationObjTemp[formFieldsKeys?.voice].invalid = true;
            valid = false 
        }

        setValidationObj(validationObjTemp);
        return valid;
    };
    //    REDUX hooks
    const dispatch = useDispatch()
    const userLogin = useSelector((state) => state.global_store.userLogin) 
    //    useState hooks
    const [validationObj, setValidationObj] = useState({ ...initialValidationObj });
    const [formValues, setFormValues] = useState(initialValues);

    const removeErrorTextForInputThatUserIsTyping = uniqueKey => {
        let tempValidationObj = { ...validationObj };
        tempValidationObj[uniqueKey] = initialValidationObj[uniqueKey];
        setValidationObj(tempValidationObj);
    };

    const AddAdministrationPrimaryRouteAPI = async () => {
        let params = {
            route_name: formValues?.route_name,
            sec_route_name: formValues?.sec_route_name,
            ip_address: formValues?.ip_address,
            smpp_credit: formValues?.smpp_credit,
            smsc_id: formValues?.smsc_id,
            ip_address: formValues?.ip_address,
            port: formValues?.port ? "1" : "0",
            smsc_username: formValues?.smsc_username,
            smsc_password: formValues?.smsc_password,
            system_type: formValues?.system_type,
            reconnect_delay: formValues?.reconnect_delay,
            enquire_link_interval: formValues?.enquire_link_interval,
            max_pending_submits: formValues?.max_pending_submits,
            transceiver_mode: formValues?.transceiver_mode,
            source_addr_ton: formValues?.source_addr_ton,
            source_addr_npi: formValues?.source_addr_npi,
            dest_addr_ton: formValues?.dest_addr_ton,
            dest_addr_npi: formValues?.dest_addr_npi,
            log_file: formValues?.log_file,
            log_level: formValues?.log_level,
            instances: formValues?.instances,
            voice: formValues?.voice,
            status: formValues?.status ? "1" : "0"
        }
        let url = Constants.apiEndPoints.AdministrationPrimaryRoute; 
        return
        let response = await APIService.postData(url, params, userLogin.access_token, null, "AddDltTemplateAPI")
        console.log("response", JSON.stringify(response))
        if (response) {
            Alert.alert('Data Save Successfully')
        }
        else {
            Alert.alert(response.errorMsg)

        }

    }

    const updateAdministrationPrimaryRouteData = async () => {
        let url = Constants.apiEndPoints.AdministrationPrimaryRoute; 

        return
        let response = await APIService.putData(url, userLogin.access_token, null, "updateDltTemplateData")
        if (!response.errorMsg) {
            console.log("dlt Update")
        } else {
            Alert.alert(response.errorMsg)
        }
    }

    useEffect(() => { 
        if (routeParm?.itemId) {
            setFormValues({
                ...formValues,
                "user": routeParm?.itemId.userData,
                "ip_address": routeParm?.itemId.userSenderIdData,
                "smpp_credit": routeParm?.itemId.smpp_credit,
                "smsc_id": routeParm?.itemId.smsc_id,
                "entity_id": routeParm?.itemId.entity_id,
                "ip_address": routeParm?.itemId.ip_address,
                "header_id": routeParm?.itemId.header_id,
                "smsc_username": routeParm?.itemId.smsc_username,
            })
        }
    }, [])

    const handleInputChange = (key, value) => {
        setFormValues({
            ...formValues, [key]: value
        })
    }

    return (
        <>
            <BaseContainer
                onPressLeftIcon={() => { navigation.pop() }}
                leftIcon="arrow-back"
                title="Create Smmpp"
            >
                <KeyboardAwareScrollView>
                    <View style={[styles.centeredView, styles.modalView]}>
                        <InputValidation
                            validationObj={validationObj}
                            uniqueKey={formFieldsKeys.route_name}
                            placeHolder={"Route Name"}
                            label={"Route Name"}
                            value={formValues[formFieldsKeys.route_name]}
                            onChangeText={(text) => {
                                removeErrorTextForInputThatUserIsTyping(formFieldsKeys.route_name);
                                handleInputChange(formFieldsKeys.route_name, text)
                            }}
                        />
                        <InputValidation
                            validationObj={validationObj}
                            uniqueKey={formFieldsKeys.smpp_credit}
                            placeHolder={"Smpp Credit"}
                            label={"Smpp Credit"}
                            value={formValues[formFieldsKeys.smpp_credit]}
                            onChangeText={(text) => {
                                removeErrorTextForInputThatUserIsTyping(formFieldsKeys.smpp_credit);
                                handleInputChange(formFieldsKeys.smpp_credit, text)
                            }}
                        />

                        <InputValidation
                            validationObj={validationObj}
                            uniqueKey={formFieldsKeys.smsc_id}
                            placeHolder={"Smsc ID"}
                            label={"Smsc ID"}
                            value={formValues[formFieldsKeys.smsc_id]}
                            onChangeText={(text) => {
                                removeErrorTextForInputThatUserIsTyping(formFieldsKeys.smsc_id);
                                handleInputChange(formFieldsKeys.smsc_id, text)
                            }}
                        />
                        <InputValidation
                            validationObj={validationObj}
                            uniqueKey={formFieldsKeys.ip_address}
                            placeHolder={"IP Address"}
                            label={"IP Address"}
                            value={formValues[formFieldsKeys.ip_address]}
                            onChangeText={(text) => {
                                removeErrorTextForInputThatUserIsTyping(formFieldsKeys.ip_address);
                                handleInputChange(formFieldsKeys.ip_address, text)
                            }}
                        />
                        <InputValidation
                            validationObj={validationObj}
                            uniqueKey={formFieldsKeys.port}
                            placeHolder={"Port"}
                            label={"Port"}
                            value={formValues[formFieldsKeys.port]}
                            onChangeText={(text) => {
                                removeErrorTextForInputThatUserIsTyping(formFieldsKeys.port);
                                handleInputChange(formFieldsKeys.port, text)
                            }}
                        />
                        <InputValidation
                            validationObj={validationObj}
                            uniqueKey={formFieldsKeys.smsc_username}
                            placeHolder={"Smsc Username"}
                            label={"Smsc Username"}
                            value={formValues[formFieldsKeys.smsc_username]}
                            onChangeText={(text) => {
                                removeErrorTextForInputThatUserIsTyping(formFieldsKeys.smsc_username);
                                handleInputChange(formFieldsKeys.smsc_username, text)
                            }}
                        />
                        <InputValidation
                            validationObj={validationObj}
                            uniqueKey={formFieldsKeys.smsc_password}
                            placeHolder={"Smsc Password"}
                            label={"Smsc Password"}
                            value={formValues[formFieldsKeys.smsc_password]}
                            onChangeText={(text) => {
                                removeErrorTextForInputThatUserIsTyping(formFieldsKeys.smsc_password);
                                handleInputChange(formFieldsKeys.smsc_password, text)
                            }}
                        />
                        <InputValidation
                            validationObj={validationObj}
                            uniqueKey={formFieldsKeys.system_type}
                            placeHolder={"System Type"}
                            label={"System Type"}
                            value={formValues[formFieldsKeys.system_type]}
                            onChangeText={(text) => {
                                removeErrorTextForInputThatUserIsTyping(formFieldsKeys.system_type);
                                handleInputChange(formFieldsKeys.system_type, text)
                            }}

                        />
                        <InputValidation
                            validationObj={validationObj}
                            uniqueKey={formFieldsKeys.throughput}
                            placeHolder={"Throughput"}
                            label={"Throughput"}
                            value={formValues[formFieldsKeys.throughput]}
                            onChangeText={(text) => {
                                removeErrorTextForInputThatUserIsTyping(formFieldsKeys.throughput);
                                handleInputChange(formFieldsKeys.throughput, text)
                            }}
                        />
                        <InputValidation
                            validationObj={validationObj}
                            uniqueKey={formFieldsKeys.reconnect_delay}
                            placeHolder={"Reconnect Delay"}
                            label={"Reconnect Delay"}
                            value={formValues[formFieldsKeys.reconnect_delay]}
                            onChangeText={(text) => {
                                removeErrorTextForInputThatUserIsTyping(formFieldsKeys.reconnect_delay);
                                handleInputChange(formFieldsKeys.reconnect_delay, text)
                            }}
                        />
                        <InputValidation
                            validationObj={validationObj}
                            uniqueKey={formFieldsKeys.enquire_link_interval}
                            placeHolder={"Enquire Link Interval"}
                            label={"Enquire Link Interval"}
                            value={formValues[formFieldsKeys.enquire_link_interval]}
                            onChangeText={(text) => {
                                removeErrorTextForInputThatUserIsTyping(formFieldsKeys.enquire_link_interval);
                                handleInputChange(formFieldsKeys.enquire_link_interval, text)
                            }}
                        />
                        <InputValidation
                            validationObj={validationObj}
                            uniqueKey={formFieldsKeys.max_pending_submits}
                            placeHolder={"Max Pending Submit"}
                            label={"Max Pending Submit"}
                            value={formValues[formFieldsKeys.max_pending_submits]}
                            onChangeText={(text) => {
                                removeErrorTextForInputThatUserIsTyping(formFieldsKeys.max_pending_submits);
                                handleInputChange(formFieldsKeys.max_pending_submits, text)
                            }}
                        />

                        <InputValidation
                            validationObj={validationObj}
                            uniqueKey={formFieldsKeys.source_addr_ton}
                            placeHolder={"Source Addr Ton"}
                            label={"Source Addr Ton"}
                            value={formValues[formFieldsKeys.source_addr_ton]}
                            onChangeText={(text) => {
                                removeErrorTextForInputThatUserIsTyping(formFieldsKeys.source_addr_ton);
                                handleInputChange(formFieldsKeys.source_addr_ton, text)
                            }}
                        />
                        <InputValidation
                            validationObj={validationObj}
                            uniqueKey={formFieldsKeys.source_addr_npi}
                            placeHolder={"Source Addr Npi"}
                            label={"Source Addr Npi"}
                            value={formValues[formFieldsKeys.source_addr_npi]}
                            onChangeText={(text) => {
                                removeErrorTextForInputThatUserIsTyping(formFieldsKeys.source_addr_npi);
                                handleInputChange(formFieldsKeys.source_addr_npi, text)
                            }}
                        />
                        <InputValidation
                            validationObj={validationObj}
                            uniqueKey={formFieldsKeys.dest_addr_ton}
                            placeHolder={"Dest Addr Ton"}
                            label={"Dest Addr Ton"}
                            value={formValues[formFieldsKeys.dest_addr_ton]}
                            onChangeText={(text) => {
                                removeErrorTextForInputThatUserIsTyping(formFieldsKeys.dest_addr_ton);
                                handleInputChange(formFieldsKeys.dest_addr_ton, text)
                            }}
                        />
                        <InputValidation
                            validationObj={validationObj}
                            uniqueKey={formFieldsKeys.dest_addr_npi}
                            placeHolder={"Dest Addr Npi"}
                            label={"Dest Addr Npi"}
                            value={formValues[formFieldsKeys.dest_addr_npi]}
                            onChangeText={(text) => {
                                removeErrorTextForInputThatUserIsTyping(formFieldsKeys.dest_addr_npi);
                                handleInputChange(formFieldsKeys.dest_addr_npi, text)
                            }}
                        />
                        <InputValidation
                            validationObj={validationObj}
                            uniqueKey={formFieldsKeys.log_level}
                            placeHolder={"Log Level"}
                            label={"Log Level"}
                            value={formValues[formFieldsKeys.log_level]}
                            onChangeText={(text) => {
                                removeErrorTextForInputThatUserIsTyping(formFieldsKeys.log_level);
                                handleInputChange(formFieldsKeys.log_level, text)
                            }}
                        />
                        <InputValidation
                            validationObj={validationObj}
                            uniqueKey={formFieldsKeys.instances}
                            placeHolder={"Instances"}
                            label={"Instances"}
                            value={formValues[formFieldsKeys.instances]}
                            onChangeText={(text) => {
                                removeErrorTextForInputThatUserIsTyping(formFieldsKeys.instances);
                                handleInputChange(formFieldsKeys.instances, text)
                            }}
                        />
                        {/* <View style={[styles.mainView, { borderWidth: 1, borderColor: '#ffad33', paddingVertical: 12, paddingHorizontal: 10 }]}> */}
                        <View style={styles.checkBoxView}>
                            <BouncyCheckbox
                                size={20}
                                fillColor={'#ffaa33'}
                                unfillColor={'white'}
                                iconStyle={{ borderColor: '#ffaa33' }}
                                isChecked={formValues?.voice}
                                onPress={(value) => {
                                    handleInputChange("voice", value)
                                }}
                            />
                            <Text>Voice</Text>
                        </View>
                        <View style={styles.checkBoxView}>
                            <BouncyCheckbox
                                size={20}
                                fillColor={'#ffaa33'}
                                unfillColor={'white'}
                                iconStyle={{ borderColor: '#ffaa33' }}
                                isChecked={formValues?.log_file}
                                onPress={(value) => {
                                    handleInputChange("log_file", value)
                                }}
                            />
                            <Text>Log File</Text>
                        </View>
                        <View style={styles.checkBoxView}>
                            <BouncyCheckbox
                                size={20}
                                fillColor={'#ffaa33'}
                                unfillColor={'white'}
                                iconStyle={{ borderColor: '#ffaa33' }}
                                isChecked={formValues?.transceiver_mode}
                                onPress={(value) => {
                                    handleInputChange("transceiver_mode", value)
                                }}
                            />
                            <Text>Transceiver Mode</Text>
                        </View>
                        {/* </View> */}
                        <InputValidation
                            validationObj={validationObj}
                            uniqueKey={formFieldsKeys.sec_route_name}
                            placeHolder={"Secondary Route Name"}
                            label={"Secondary Route Name"}
                            value={formValues[formFieldsKeys.sec_route_name]}
                            onChangeText={(text) => {
                                removeErrorTextForInputThatUserIsTyping(formFieldsKeys.sec_route_name);
                                handleInputChange(formFieldsKeys.sec_route_name, text)
                            }}
                        />
                        <View style={[styles.mainView, { borderWidth: 1, borderColor: '#ffad33', paddingVertical: 12, paddingHorizontal: 10 }]}>
                            <View style={styles.checkBoxView}>
                                <BouncyCheckbox
                                    size={20}
                                    fillColor={'#ffaa33'}
                                    unfillColor={'white'}
                                    iconStyle={{ borderColor: '#ffaa33' }}
                                    isChecked={formValues?.status}
                                    onPress={(value) => {
                                        handleInputChange("status", value)
                                    }}
                                />
                                <Text style={styles.saveAsTemplate}> Status ({formValues?.status ? "Active" : "Inactive"})</Text>
                            </View>
                        </View>

                        <CustomButton
                            style={{
                                ...styles.button, marginBottom: 200
                            }}
                            onPress={() => {
                                if (validation()) {
                                    AddAdministrationPrimaryRouteAPI()
                                    Alert.alert('data save successfully')
                                    if (routeParm?.itemId) {  
                                        updateAdministrationPrimaryRouteData()
                                        
                                    }

                                    alert('wrong')
                                }
                            }}
                            title={'Create Dlt Template'}
                        />
                    </View>
                </KeyboardAwareScrollView>
            </BaseContainer>
        </>
    )

}


export default SmppAdd

const styles = StyleSheet.create({

    inputContainer: {
        justifyContent: 'space-between',
        marginHorizontal: 20,
        flexDirection: 'row',
        marginTop: 20,
        elevation: 12,
        backgroundColor: '#fff5e6',
        padding: 10,
        width: 300
    },
    creditBtn: {
        width: '45%',
        fontFamily: fonts.bold,
        backgroundColor: '#ffaa33',
        marginHorizontal: 20,
        marginVertical: 20,
        padding: 10,
        fontSize: 20,
        color: 'white',
        borderRadius: 50
    },
    modalView: {
        margin: 15,
        backgroundColor: "white",
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        padding: 6
    },

    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },

    mainView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 5,
        borderRadius: 5
    },
    button: {
        padding: 10,
        elevation: 2,
        backgroundColor: '#ffad33',
        borderRadius: 5
    },
    checkBoxView: { flexDirection: 'row', alignItems: 'center', padding: 8 },
    saveAsTemplate: { marginHorizontal: 20 },
})

