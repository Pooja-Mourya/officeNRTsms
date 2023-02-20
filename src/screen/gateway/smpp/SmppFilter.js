
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { fonts } from '../../../assets/Assets';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import InputValidation from '../../../components/InputValidation';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import APIService from '../../../Services/APIService';
import Constants from '../../../constant/Constants';
import { useSelector, useDispatch } from 'react-redux';
import CustomButton from '../../../components/CustomButton';
import DropDownComp from '../../../components/DropDownComp';


const SmppFilter = (props) => {
    let routeParm = props?.route?.params ?? {};
    const { setModalVisible, modalVisible, setFilterData, filterData } = props
    const formFieldsKeys = {
        "user": "user",
        "per_page_record": "per_page_record",
        "manage_sender_id": "manage_sender_id",
        "template_name": "template_name",
        "dlt_template_id": "dlt_template_id",
        "sender_id": "sender_id",
        "header_id": "header_id",
        "is_unicode": "is_unicode",
        "dlt_message": "dlt_message",
        "status": "status",
        "entity_id": "entity_id",

    };
    const initialValues = {
        [formFieldsKeys.user.id]: "",
        [formFieldsKeys.manage_sender_id.id]: "",
        [formFieldsKeys.template_name]: "",
        [formFieldsKeys.dlt_template_id]: "",
        [formFieldsKeys.sender_id]: "",
        [formFieldsKeys.is_unicode]: "",
        [formFieldsKeys.dlt_message]: "",
        [formFieldsKeys.status]: "",
    };


    // REDUX hooks
    const userLogin = useSelector((state) => state.global_store.userLogin) 
    // useState hooks
    // const [validationObj, setValidationObj] = useState({ ...initialValidationObj });
    const [formValues, setFormValues] = useState(initialValues);

    const handleInputChange = (key, value) => {
        setFormValues({
            ...formValues, [key]: value
        })
    }

    return (
        <>
            <KeyboardAwareScrollView>
                <View style={[{ width: 320 }, styles.modalView]}>
                    <InputValidation
                        // validationObj={validationObj}
                        // uniqueKey={formFieldsKeys.route_name}
                        placeHolder={"Route Name"}
                        label={"Route Name"}
                        value={formValues[formFieldsKeys.route_name]}
                        onChangeText={(text) => {
                            // removeErrorTextForInputThatUserIsTyping(formFieldsKeys.route_name);
                            handleInputChange(formFieldsKeys.route_name, text)
                        }}
                    />
                    <InputValidation
                        // validationObj={validationObj}
                        // uniqueKey={formFieldsKeys.smpp_credit}
                        placeHolder={"Smpp Credit"}
                        label={"Smpp Credit"}
                        value={formValues[formFieldsKeys.smpp_credit]}
                        onChangeText={(text) => {
                            // removeErrorTextForInputThatUserIsTyping(formFieldsKeys.smpp_credit);
                            handleInputChange(formFieldsKeys.smpp_credit, text)
                        }}
                    />

                    <InputValidation
                        // validationObj={validationObj}
                        // uniqueKey={formFieldsKeys.smsc_id}
                        placeHolder={"Smsc ID"}
                        label={"Smsc ID"}
                        value={formValues[formFieldsKeys.smsc_id]}
                        onChangeText={(text) => {
                            // removeErrorTextForInputThatUserIsTyping(formFieldsKeys.smsc_id);
                            handleInputChange(formFieldsKeys.smsc_id, text)
                        }}
                    />
                    <InputValidation
                        // validationObj={validationObj}
                        // uniqueKey={formFieldsKeys.ip_address}
                        placeHolder={"IP Address"}
                        label={"IP Address"}
                        value={formValues[formFieldsKeys.ip_address]}
                        onChangeText={(text) => {
                            // removeErrorTextForInputThatUserIsTyping(formFieldsKeys.ip_address);
                            handleInputChange(formFieldsKeys.ip_address, text)
                        }}
                    />
                    <InputValidation
                        // validationObj={validationObj}
                        // uniqueKey={formFieldsKeys.port}
                        placeHolder={"Port"}
                        label={"Port"}
                        value={formValues[formFieldsKeys.port]}
                        onChangeText={(text) => {
                            // removeErrorTextForInputThatUserIsTyping(formFieldsKeys.port);
                            handleInputChange(formFieldsKeys.port, text)
                        }}
                    />
                    <InputValidation
                        // validationObj={validationObj}
                        // uniqueKey={formFieldsKeys.smsc_username}
                        placeHolder={"Smsc Username"}
                        label={"Smsc Username"}
                        value={formValues[formFieldsKeys.smsc_username]}
                        onChangeText={(text) => {
                            // removeErrorTextForInputThatUserIsTyping(formFieldsKeys.smsc_username);
                            handleInputChange(formFieldsKeys.smsc_username, text)
                        }}
                    />
                    <InputValidation
                        // validationObj={validationObj}
                        // uniqueKey={formFieldsKeys.smsc_password}
                        placeHolder={"Smsc Password"}
                        label={"Smsc Password"}
                        value={formValues[formFieldsKeys.smsc_password]}
                        onChangeText={(text) => {
                            // removeErrorTextForInputThatUserIsTyping(formFieldsKeys.smsc_password);
                            handleInputChange(formFieldsKeys.smsc_password, text)
                        }}
                    />
                    <InputValidation
                        // validationObj={validationObj}
                        // uniqueKey={formFieldsKeys.system_type}
                        placeHolder={"System Type"}
                        label={"System Type"}
                        value={formValues[formFieldsKeys.system_type]}
                        onChangeText={(text) => {
                            // removeErrorTextForInputThatUserIsTyping(formFieldsKeys.system_type);
                            handleInputChange(formFieldsKeys.system_type, text)
                        }}

                    />
                    <InputValidation
                        // validationObj={validationObj}
                        // uniqueKey={formFieldsKeys.throughput}
                        placeHolder={"Throughput"}
                        label={"Throughput"}
                        value={formValues[formFieldsKeys.throughput]}
                        onChangeText={(text) => {
                            // removeErrorTextForInputThatUserIsTyping(formFieldsKeys.throughput);
                            handleInputChange(formFieldsKeys.throughput, text)
                        }}
                    />
                    <InputValidation
                        // validationObj={validationObj}
                        // uniqueKey={formFieldsKeys.reconnect_delay}
                        placeHolder={"Reconnect Delay"}
                        label={"Reconnect Delay"}
                        value={formValues[formFieldsKeys.reconnect_delay]}
                        onChangeText={(text) => {
                            // removeErrorTextForInputThatUserIsTyping(formFieldsKeys.reconnect_delay);
                            handleInputChange(formFieldsKeys.reconnect_delay, text)
                        }}
                    />
                    <InputValidation
                        // validationObj={validationObj}
                        // uniqueKey={formFieldsKeys.enquire_link_interval}
                        placeHolder={"Enquire Link Interval"}
                        label={"Enquire Link Interval"}
                        value={formValues[formFieldsKeys.enquire_link_interval]}
                        onChangeText={(text) => {
                            // removeErrorTextForInputThatUserIsTyping(formFieldsKeys.enquire_link_interval);
                            handleInputChange(formFieldsKeys.enquire_link_interval, text)
                        }}
                    />
                    <InputValidation
                        // validationObj={validationObj}
                        // uniqueKey={formFieldsKeys.max_pending_submits}
                        placeHolder={"Max Pending Submit"}
                        label={"Max Pending Submit"}
                        value={formValues[formFieldsKeys.max_pending_submits]}
                        onChangeText={(text) => {
                            // removeErrorTextForInputThatUserIsTyping(formFieldsKeys.max_pending_submits);
                            handleInputChange(formFieldsKeys.max_pending_submits, text)
                        }}
                    />

                    <InputValidation
                        // validationObj={validationObj}
                        // uniqueKey={formFieldsKeys.source_addr_ton}
                        placeHolder={"Source Addr Ton"}
                        label={"Source Addr Ton"}
                        value={formValues[formFieldsKeys.source_addr_ton]}
                        onChangeText={(text) => {
                            // removeErrorTextForInputThatUserIsTyping(formFieldsKeys.source_addr_ton);
                            handleInputChange(formFieldsKeys.source_addr_ton, text)
                        }}
                    />
                    <InputValidation
                        // validationObj={validationObj}
                        // uniqueKey={formFieldsKeys.source_addr_npi}
                        placeHolder={"Source Addr Npi"}
                        label={"Source Addr Npi"}
                        value={formValues[formFieldsKeys.source_addr_npi]}
                        onChangeText={(text) => {
                            // removeErrorTextForInputThatUserIsTyping(formFieldsKeys.source_addr_npi);
                            handleInputChange(formFieldsKeys.source_addr_npi, text)
                        }}
                    />
                    <InputValidation
                        // validationObj={validationObj}
                        // uniqueKey={formFieldsKeys.dest_addr_ton}
                        placeHolder={"Dest Addr Ton"}
                        label={"Dest Addr Ton"}
                        value={formValues[formFieldsKeys.dest_addr_ton]}
                        onChangeText={(text) => {
                            // removeErrorTextForInputThatUserIsTyping(formFieldsKeys.dest_addr_ton);
                            handleInputChange(formFieldsKeys.dest_addr_ton, text)
                        }}
                    />
                    <InputValidation
                        // validationObj={validationObj}
                        // uniqueKey={formFieldsKeys.dest_addr_npi}
                        placeHolder={"Dest Addr Npi"}
                        label={"Dest Addr Npi"}
                        value={formValues[formFieldsKeys.dest_addr_npi]}
                        onChangeText={(text) => {
                            // removeErrorTextForInputThatUserIsTyping(formFieldsKeys.dest_addr_npi);
                            handleInputChange(formFieldsKeys.dest_addr_npi, text)
                        }}
                    />
                    <InputValidation
                        // validationObj={validationObj}
                        // uniqueKey={formFieldsKeys.log_level}
                        placeHolder={"Log Level"}
                        label={"Log Level"}
                        value={formValues[formFieldsKeys.log_level]}
                        onChangeText={(text) => {
                            // removeErrorTextForInputThatUserIsTyping(formFieldsKeys.log_level);
                            handleInputChange(formFieldsKeys.log_level, text)
                        }}
                    />
                    <InputValidation
                        // validationObj={validationObj}
                        // uniqueKey={formFieldsKeys.instances}
                        placeHolder={"Instances"}
                        label={"Instances"}
                        value={formValues[formFieldsKeys.instances]}
                        onChangeText={(text) => {
                            // removeErrorTextForInputThatUserIsTyping(formFieldsKeys.instances);
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
                        // validationObj={validationObj}
                        // uniqueKey={formFieldsKeys.sec_route_name}
                        placeHolder={"Secondary Route Name"}
                        label={"Secondary Route Name"}
                        value={formValues[formFieldsKeys.sec_route_name]}
                        onChangeText={(text) => {
                            // removeErrorTextForInputThatUserIsTyping(formFieldsKeys.sec_route_name);
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
                        onPress={() => {
                            // DltTemplateListAPI()
                            setFilterData(formValues)
                            setModalVisible(false)
                        }}
                        title={'Smpp Filter Data'}
                    />
                    <CustomButton

                        onPress={() => {
                            setFormValues()
                        }}

                        title={'Clear Filter'}
                    />
                </View>
            </KeyboardAwareScrollView>
        </>
    )

}


export default SmppFilter

const styles = StyleSheet.create({

    inputContainer: {
        // flex: 1,
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
        // top: 10,
        // l,opacity;[.p]
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
        // padding: 35,
        // alignItems: "center",
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
        // marginHorizontal: 20,
        // margin: 20
        // flex: 1,
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

