import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native'
import React, { useState } from 'react'
import BaseContainer from './../components/BaseContainer';
import { img, fonts } from '../assets/Assets'
// import { TextInput, } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// import InputValidation from './../components/InputValidation';

const userLogin = { name: ' ', email: ' ', address: ' ' }

const Profile = ({ navigation }) => {

    const [formvalue, setFormValue] = useState({ ...userLogin }); 

    const [name, setName] = useState('Enter your  fullName here');
    const [email, setEmail] = useState('Enter your  Email here');
    const [address, setAddress] = useState('your address');
    const [mobileNumber, setMobileNumber] = useState('your mobile number')



    // for onFocus
    const [borderCOlor, setBorderColor] = useState('#FFAD33');

    // input handlers
    const handleOnChange1 = (e, key) => {
        // setName(e.target.value)
        setFormValue({ ...formvalue, [key]: e })


    }
    // const handleOnChange2 = (e) => {
    //     setEmail(e.target.value)
    // }
    const handleOnFocus = () => {
        // borderColor ? 
        setBorderColor('black')
        // : setBorderColor('#FFAD33')
    }
    const handleOnBlur = () => {
        setBorderColor('#FFAD33')
    }

    return (

        <BaseContainer title='Profile'
            leftIcon='menu'
            onPressLeftIcon={() => navigation.openDrawer()}
            titleStyle={style.ProfileHeaderStyle}
        >
            {/* <SafeAreaView> */}
            <KeyboardAwareScrollView>
                <View style={style.inputMainContainer}>
                    <View style={style.inputView}>
                        <Text style={style.inputTxt}>Name</Text>
                        {/* <InputValidation
                            // placeholder=' company'
                            label=' company'
                            value={formvalue.name}
                            onChangeText={(text) => { handleOnChange1(text, "name") }}
                            //  placeholder='Enter your  fullName here'
                            style={[style.input, { borderColor: borderCOlor }]} /> */}
                        <TextInput
                            value={formvalue.name}
                            onChangeText={(text) => { handleOnChange1(text, "name") }}
                            placeholder='Enter your  fullName here'
                            style={[style.input, { borderColor: borderCOlor }]}
                            // clearTextOnFocus={true}
                            onFocus={handleOnFocus}
                            onBlur={handleOnBlur}
                        />
                    </View>
                    <View style={style.inputView}>
                        <Text style={style.inputTxt}>Email</Text>
                        <TextInput
                            value={formvalue.email}
                            onChangeText={(text) => { handleOnChange1(text, "email") }}
                            placeholder='Enter your  Email '
                            style={[style.input, { borderColor: borderCOlor }]}
                            onFocus={() => { handleOnFocus }}
                            onBlur={() => handleOnBlur}
                        />
                    </View>

                    {/* Address field with single line  starts with address */}
                    <View style={style.inputView}>
                        <Text style={style.inputTxt}>Address</Text>
                        <TextInput
                            // value={address}
                            // onChange={handleOnChange}
                            placeholder='Enter your  Address here'
                            style={[style.input, { borderColor: borderCOlor }]}
                            onFocus={() => { handleOnFocus }}
                            onBlur={() => handleOnBlur}
                        />
                    </View>
                    <View style={[style.inputView, { display: 'flex', flexDirection: 'row', maxWidth: '95%', }]}>
                        <View style={{ display: 'flex', flexDirection: 'column', maxWidth: '48%' }}>
                            <Text style={[style.inputTxt, { marginLeft: 20, }]} >postalCode</Text>
                            <TextInput

                                style={[style.input, { borderColor: borderCOlor }]}
                                placeholder='Enter your  city '
                                onFocus={() => { handleOnFocus }}
                                onBlur={() => handleOnBlur}
                            />
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'column', maxWidth: '48%' }}>
                            <Text style={[style.inputTxt, { marginLeft: 20, }]}>city</Text>
                            <TextInput
                                placeholder='Enter your  pinCode here'
                                style={[style.input, { borderColor: borderCOlor, marginLeft: '10%' }]}
                                onFocus={() => { handleOnFocus }}
                                onBlur={() => handleOnBlur}
                            />
                        </View>
                    </View>
                    {/* ending here address field */}

                    <View style={style.inputView}>
                        <Text style={style.inputTxt}>mobile Number</Text>
                        <TextInput
                            // value={mobileNumber}
                            // onChange={handleOnChange}
                            placeholder='Enter your  mobile number here'
                            style={[style.input, { borderColor: borderCOlor }]}
                            onFocus={() => { handleOnFocus }}
                            onBlur={() => handleOnBlur}
                        />
                    </View>
                    <View style={style.inputView}>
                        <Text style={style.inputTxt}>Website</Text>
                        <TextInput
                            placeholder='Enter your  website if exits here'
                            style={[style.input, { borderColor: borderCOlor }]}
                            onFocus={() => { handleOnFocus }}
                            onBlur={() => handleOnBlur}
                        />
                    </View>
                    <View style={style.inputView}>
                        <Text style={style.inputTxt}>Company Name</Text>
                        <TextInput
                            placeholder='Enter your  Company here'
                            style={[style.input, { borderColor: borderCOlor }]}
                            onFocus={() => { handleOnFocus }}
                            onBlur={() => handleOnBlur}
                        />
                    </View>

                    <View>
                        {/* <TouchableOpacity > <Text>Save</Text></TouchableOpacity> */}
                        <TouchableOpacity
                            style={style.button}
                            onPress={() => { onPress }}
                        >
                            <Text style={{ textAlign: 'center', color: 'white', fontFamily: fonts.medium, fontSize: 20 }}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAwareScrollView>
            {/* </SafeAreaView> */}
        </BaseContainer>
    )
}

export default Profile;

const style = StyleSheet.create({
    ProfileHeaderStyle: {
        fontFamily: fonts.medium,
        fontSize: 18,
    },
    inputMainContainer: {
        marginHorizontal: '5%',
        marginTop: 40,
        // backgroundColor: 'white'

    },
    inputView: {
        marginBottom: 15,
        // marginHorizontal: 20,


    },
    input: {
        borderWidth: 1,
        // borderColor: { borderCOlor },
        borderRadius: 17,
        padding: 5,
        paddingLeft: 20,
        fontFamily: fonts.medium,

    },

    inputTxt: {
        marginLeft: 20,
        marginBottom: 2,
        color: 'black',
        fontFamily: fonts.medium


    },
    button: {
        backgroundColor: '#FFAD33',
        borderRadius: 25,
        paddingVertical: 6,
        marginTop: 15

    },
    addressStyle: {

    }

})