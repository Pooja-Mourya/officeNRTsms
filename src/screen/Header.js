import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Entypo from 'react-native-vector-icons/Entypo';

const Header = (props) => {
    return (
        <View>
            <View>
                <View style={style.topReport}>
                    <Entypo name='menu' size={28} color='white' style={style.menuIcon} onPress={() => 
                    props.navigation.openDrawer()} />
                    <Text style={style.reportHeading}>Home</Text>
                </View>
            </View>
        </View>
    )
}

export default Header

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
        marginHorizontal: 130
    }
})