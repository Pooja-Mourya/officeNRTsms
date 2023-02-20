import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { fonts } from '../../assets/Assets';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import InputValidation from '../../components/InputValidation';
import BaseContainer from '../../components/BaseContainer';
import { useSelector } from 'react-redux';
import DropDownComp from '../../components/DropDownComp';
import APIService from '../../Services/APIService';
import Constants from '../../constant/Constants';
import CustomButton from '../../components/CustomButton';

const creditType = [
    {
        id: '1',
        title: 'Transactional',
    },
    {
        id: '2',
        title: 'Promotional',
    },
    {
        id: '3',
        title: 'Two way SMS',
    },
    {
        id: '4',
        title: 'Voice',
    },
]

const AddCredit = ({ navigation }) => {
    const formFieldsKeys = {
        "credit_request": 'credit_request',
        "route_type": 'route_type',
        "comment": "comment",
    };
    const initialValues = {
        [formFieldsKeys.credit_request]: "",
        [formFieldsKeys.route_type]: "",
        [formFieldsKeys.comment]: "",
    };
    const initialValidationObj = {
        [formFieldsKeys.credit_request]: {
            invalid: false,
            title: 'credit request is require',
        },
        [formFieldsKeys.route_type]: {
            invalid: false,
            // title: 'Invalid manager action for',
        },
        [formFieldsKeys.comment]: {
            invalid: false,
            title: 'this field is required',
        },

    };
    // let { navigation } = props

    const userLogin = useSelector((state) => state.global_store.userLogin)
    const [validationObj, setValidationObj] = useState({ ...initialValidationObj });
    const [formValues, setFormValues] = useState(initialValues);


    const handleInputChange = (key, value) => {
        setFormValues({
            ...formValues, [key]: value
        })
    }

    const validation = () => {
        let validationObjTemp = { ...validationObj };
        let valid = true
        if (!formValues?.[formFieldsKeys?.credit_request]) {
            validationObjTemp[formFieldsKeys?.credit_request].invalid = true;
            valid = false 
        }
        if (!formValues?.[formFieldsKeys?.route_type]) {
            validationObjTemp[formFieldsKeys?.route_type].invalid = true;
            valid = false 
        }
        if (!formValues?.[formFieldsKeys?.comment]) {
            validationObjTemp[formFieldsKeys?.comment].invalid = true;
            valid = false 
        }

        setValidationObj(validationObjTemp);
        return valid;
    };

    const removeErrorTextForInputThatUserIsTyping = uniqueKey => {
        let tempValidationObj = { ...validationObj };
        tempValidationObj[uniqueKey] = initialValidationObj[uniqueKey];
        setValidationObj(tempValidationObj);
    };

    const userCreditRequest = async () => {
        const params = {
            credit_request: formValues.credit_request,
            route_type: formValues.route_type?.id,
            comment: formValues.comment,
        }
        const url = Constants.apiEndPoints.userCreditRequest;
        console.log('userCreditRequest', url, params)
        // return
        let response = await APIService.postData(url, params, userLogin.access_token, null, "userCreditRequest")
        console.log("response", JSON.stringify(response))

        if (!response.errorMsg) {
            // 
            Alert.alert("success")
            navigation.pop()
        }
        else {
            Alert.alert(response.errorMsg)
        }
    }

    useEffect(() => {
        // userCreditRequest()
    }, [])
    return (
        <BaseContainer
            onPressLeftIcon={() => navigation.goBack()}
            leftIcon="arrow-back"
            title="Add Credit"
        > 
        <View style={styles.container}>
                <InputValidation
                    validationObj={validationObj}
                    uniqueKey={formFieldsKeys?.credit_request}
                    placeHolder={"Credit Request"}
                    label={"Credit Request"}
                    value={formValues?.[formFieldsKeys?.credit_request] ?? ''}
                    onChangeText={(text) => {
                        removeErrorTextForInputThatUserIsTyping(formFieldsKeys?.credit_request);
                        handleInputChange(formFieldsKeys?.credit_request, text)
                    }}
                />
                <DropDownComp
                    data={creditType}
                    onPressItem={(item) => {
                        handleInputChange("route_type", item)
                    }}
                    keyToShowData="title"
                    keyToCompareData="id"
                    placeHolder={"Route Type"}
                    isSearch={"Search route Type ..."}
                />
                {
                    validationObj[formFieldsKeys?.route_type].invalid
                        ? <Text style={{ color: 'red' }}> choose option is required</Text>
                        : null
                }
                <InputValidation
                    validationObj={validationObj}
                    uniqueKey={formFieldsKeys?.comment}
                    placeHolder={"comment"}
                    label={"comment"}
                    value={formValues?.[formFieldsKeys?.comment] ?? ''}
                    onChangeText={(text) => {
                        removeErrorTextForInputThatUserIsTyping(formFieldsKeys.comment);
                        handleInputChange(formFieldsKeys?.comment, text)
                    }}
                    inputStyle={{ height: 90, marginTop: 5 }}
                    multiline={true}
                />
                <CustomButton
                    title="Add Credit"
                    onPress={() => { 
                        if (validation()) {
                            userCreditRequest()
                        } else {
                            console.log('Validation false');
                            Alert.alert('please fill all field')
                        }
                    }}
                /> 
            </View>
        </BaseContainer>
    )
}

export default AddCredit
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
    },

})

 