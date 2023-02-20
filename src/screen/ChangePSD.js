import { StyleSheet, Text, View, Button, Alert, Pressable, TextInput, ScrollView, FlatList } from 'react-native'
import React, { useState } from 'react'
import Colors from '../assets/Colors';
import { useSelector } from 'react-redux';
import { fonts } from '../assets/Assets';
import InputValidation from '../components/InputValidation';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { Searchbar } from 'react-native-paper';
const ChangePSD = ({ navigation }) => {
    // redux hooks
    const searchData = [
        {
            id: '1',
            text: "Thanks for your interest We're grateful for your interest in exploring our technology, and our Communications team would be happy to help you.If you're a journalist, social media personality, or creator exploring a story, video or other social media content about the API, please contact press@openai.com with a short description of your project, and we'll get in touch.Not you? Go back"
        },
        {
            id: '2',
            text: 'The biggest way you can show your support for Black Lives Matter is to vote. If you’re not sure how to register, our friends at When We All Vote have created a handy online tool to get you the information you need to get registered.'
        },
        {
            id: '3',
            text: 'All you need is your name, your address, and your date of birth to get started. You can also choose to register to vote by mail, text, or visit your state’s voter registration website directly.'
        },
        {
            id: '4',
            text: 'It takes less than five minutes to register. Once you do, you’ll be prompted to sign up to commit to voting. Once you do, you’ll receive information on where your polling place is, what’s on your ballot, and how to get there'
        },
        {
            id: '5',
            text: 'It takes less than five minutes to register. Once you do, you’ll be prompted to sign up to commit to voting. Once you do, you’ll receive information on where your polling place is, what’s on your ballot, and how to get there'
        },
        {
            id: '6',
            text: 'It takes less than five minutes to register. Once you do, you’ll be prompted to sign up to commit to voting. Once you do, you’ll receive information on where your polling place is, what’s on your ballot, and how to get there'
        }
    ]

    const UserLogin = useSelector((state) => state.global_store.userLogin);
    const [searchQuery, setSearchQuery] = useState(searchData);
    const [undo, setUndo] = useState(text)
    const [text, setText] = useState()

    const onChangeSearch = (search) => {
        if (search !== undefined || search !== null) {
            const filterQuery = searchData.filter((input) => {
                return input.text.toLowerCase().includes(search)
            })
            setSearchQuery(filterQuery)
        } else {
            setSearchQuery(searchData)
        }
    };

    return (
        // <BaseContainer
        //     title="Chat"
        //     leftIcon='menu'
        //     onPressLeftIcon={() => navigation.openDrawer()}
        // >
        <ScrollView
        // fadingEdgeLength={5}
        // endFillColor={'green'}
        // horizontal={false}
        >
            {/* <Searchbar
                placeholder="Search"
                onChangeText={(item) => onChangeSearch(item)}
                value={searchQuery}
            /> */}

            <InputValidation
                placeholder={"my text"}
                onChangeText={() => setText(text)}
            />

            {/* <FlatList
                data={searchQuery}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                    return (
                        <View style={{ margin: 20 }}>
                            <Text>{item.text}</Text>
                        </View>
                    )
                }}
            /> */}



        </ScrollView>

        // </BaseContainer>
    )
}

export default ChangePSD

const style = StyleSheet.create({

    topReport: {
        top: 0,
        width: '100%',
        backgroundColor: '#FFAD33',
        height: 50,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    menuIcon: {
        marginLeft: 10,

    },
    reportHeading: {
        color: '#FFFFFF',
        fontSize: 25,
        fontWeight: 'bold',
        marginHorizontal: 90
    },
    modalMainView: { backgroundColor: 'transparent', justifyContent: "center", alignItems: "center", paddingHorizontal: 16 },
    innerView: { width: '100%', minHeight: 300, backgroundColor: Colors.backgroundColor, paddingVertical: 15, paddingHorizontal: 16, borderRadius: 20 },

})