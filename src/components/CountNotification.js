import { View, Text } from 'react-native'
import React from 'react'
import APIService from '../Services/APIService'
import Constants from '../constant/Constants'
import Ionicons from 'react-native-vector-icons/Ionicons';

const CountNotification = () => {

    const ShowNotificationCountBtnAPI = async () => { 
        let url = Constants.apiEndPoints.unreadNotificationCount; 
        // return
        let response = await APIService.getData(url, userLogin.access_token, null, "userDocumentDelete")
        if (!response.errorMsg) { 
            notificationsAPI()
            Alert.alert('Show notification Count ')

        } else {
            Alert.alert(response.errorMsg)
        }
    }


    return (
        <View>
            <Text>CountNotification</Text>
            <Ionicons onPress={() => ShowNotificationCountBtnAPI()} name='notifications' size={30} />
        </View>
    )
}

export default CountNotification