import { StyleSheet, View, Alert, Text } from 'react-native';
import React, { useState, useEffect } from 'react';
import InputValidation from '../../components/InputValidation';
import BaseContainer from '../../components/BaseContainer';
import { useSelector } from 'react-redux';
import DropDownComp from '../../components/DropDownComp';
import APIService from '../../Services/APIService';
import Constants from '../../constant/Constants';
import CustomButton from '../../components/CustomButton';
import TransparentLoader from '../../components/TransparentLoader';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const RoutType = [
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
];

const creditType = [
    {
        id: '1',
        type: 'Credit',
    },
    {
        id: '2',
        type: 'Debit',
    },
];

const CreditInfoAdd = ({ navigation }) => {
    const formFieldsKeys = {
        user_id: 'user_id',
        action_for: 'action_for',
        credit_type: 'credit_type',
        balance: 'balance',
        rate: 'rate',
    };
    const initialValues = {
        [formFieldsKeys.user_id]: '',
        [formFieldsKeys.action_for]: '',
        [formFieldsKeys.credit_type]: '',
        [formFieldsKeys.balance]: '',
        [formFieldsKeys.rate]: '',
    };

    const initialValidationObj = {
        [formFieldsKeys.user_id]: {
            invalid: false,
            title: 'Invalid User Id',
        },
        [formFieldsKeys.action_for]: {
            invalid: false,
            title: 'Invalid action_for',
        },
        [formFieldsKeys.credit_type]: {
            invalid: false,
            title: 'Invalid credit_type',
        },

        [formFieldsKeys.balance]: {
            invalid: false,
            title: 'Invalid balance',
        },
        [formFieldsKeys.rate]: {
            invalid: false,
            title: 'Invalid rate',
        },
    };

    const userLogin = useSelector(state => state.global_store.userLogin);
    const [validationObj, setValidationObj] = useState({ ...initialValidationObj });
    const [formValues, setFormValues] = useState(initialValues);
    const [userData, setUserData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const validation = () => {
        let validationObj = { ...initialValidationObj };
        let isValid = true;
        for (let key in formValues) {
            if (formValues[key] === '') {
                validationObj[key].invalid = true;
                isValid = false;
            }
        }
        setValidationObj({ ...validationObj });
        return isValid;
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

    const UserTemplateAPI = async () => {
        let url = Constants.apiEndPoints.users;
        let response = await APIService.postData(
            url,
            {},
            userLogin.access_token,
            null,
            'userTemplatelist',
        );
        if (!response.errorMsg) {
            setUserData(response.data.data);
        } else {
            Alert.alert(response.errorMsg);
        }
    };

    const userCredit = async () => {
        setIsLoading(true);
        const params = {
            user_id: formValues.user_id.id,
            action_for: formValues.action_for.id,
            credit_type: formValues.credit_type.id,
            balance: formValues.balance,
            rate: formValues.rate,
        };
        const url = Constants.apiEndPoints.userCredit;
        // return;
        let response = await APIService.postData(
            url,
            params,
            userLogin.access_token,
            null,
            'userCredit',
        );

        if (!response.errorMsg) {
            setIsLoading(false);
            setFormValues(initialValues);
            navigation.goBack();
            Alert.alert(Constants.success, response.message ?? 'Credit added successfully');
        } else {
            setIsLoading(false);
            Alert.alert(Constants.danger, response.errorMsg ?? Constants.somethingWentWrong);
        }
    };

    useEffect(() => {
        UserTemplateAPI();
    }, []);

    return (
        <BaseContainer
            onPressLeftIcon={() => navigation.goBack()}
            leftIcon="arrow-back"
            title="Add Credit">
            <TransparentLoader isLoading={isLoading} />
            <KeyboardAwareScrollView>
                <View style={styles.inputContainer}>
                    <DropDownComp
                        data={userData}
                        validationObj={validationObj}
                        uniqueKey={formFieldsKeys.user_id}
                        onPressItem={item => {
                            handleInputChange(formFieldsKeys.user_id, item);
                            removeErrorTextForInputThatUserIsTyping(formFieldsKeys.user_id);
                        }}
                        keyToShowData="name"
                        keyToCompareData="id"
                        placeHolder="User"
                        value={formValues[formFieldsKeys.user_id]?.name}
                        isSearch="Search User..."
                    />
                     
                    <DropDownComp
                        data={RoutType}
                        validationObj={validationObj}
                        uniqueKey={formFieldsKeys.action_for}
                        onPressItem={item => {
                            handleInputChange(formFieldsKeys.action_for, item);
                            removeErrorTextForInputThatUserIsTyping(formFieldsKeys.action_for);
                        }}
                        keyToShowData="title"
                        keyToCompareData="id"
                        placeHolder={'Route Type'}
                        isSearch={'Search route Type ...'}
                        value={formValues[formFieldsKeys.action_for]?.name}
                    /> 
                    <DropDownComp
                        data={creditType}
                        validationObj={validationObj}
                        uniqueKey={formFieldsKeys.credit_type}
                        onPressItem={item => {
                            handleInputChange(formFieldsKeys.credit_type, item);
                            removeErrorTextForInputThatUserIsTyping(formFieldsKeys.credit_type);
                        }}
                        keyToShowData="type"
                        keyToCompareData="id"
                        placeHolder={'Credit Type'}
                        isSearch={'Search Credit Type ...'}
                        value={formValues[formFieldsKeys.credit_type]?.name}
                    />
                  
                    <InputValidation
                        validationObj={validationObj}
                        keyboardType="numeric"
                        uniqueKey={formFieldsKeys?.balance}
                        placeHolder={'Balance'}
                        label={'Balance'}
                        value={formValues?.[formFieldsKeys?.balance] ?? ''}
                        onChangeText={text => {
                            handleInputChange(formFieldsKeys.balance, text);
                            removeErrorTextForInputThatUserIsTyping(formFieldsKeys.balance);
                        }}
                    />

                    <InputValidation
                        validationObj={validationObj}
                        keyboardType="numeric"
                        uniqueKey={formFieldsKeys?.rate}
                        placeHolder={'Rate'}
                        label={'Rate'}
                        value={formValues?.[formFieldsKeys?.rate] ?? ''}
                        onChangeText={text => {
                            handleInputChange(formFieldsKeys.rate, text);
                            removeErrorTextForInputThatUserIsTyping(formFieldsKeys.rate);
                        }}
                    />
                    <CustomButton
                        title="Add credit"
                        onPress={() => {
                            if (validation()) {
                                userCredit();
                            } else {
                                Alert.alert(Constants.danger, 'Validation Failed');
                            }
                        }}
                    />

                </View>
            </KeyboardAwareScrollView>
        </BaseContainer>
    );
};

export default CreditInfoAdd;

const styles = StyleSheet.create({
    inputContainer: {
        flex: 1,
        marginHorizontal: 16,
    },

    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 5,
        marginBottom: 5,
    },
});
