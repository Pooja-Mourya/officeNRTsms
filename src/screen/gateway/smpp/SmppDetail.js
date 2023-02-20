// import { View, Text } from 'react-native'
// import React from 'react'

// const SmppDetail = () => {
//     return (
//         <View>
//             <Text>SmppDetail</Text>
//         </View>
//     )
// }

// export default SmppDetail

import { StyleSheet, Text, View, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const SmppDetail = (props) => {
    let { navigation } = props

    const userLogin = useSelector((state) => state.global_store.userLogin)
    let routeParm = props?.route?.params ?? {};
    const [detailData, setDetailData] = useState({})

    // const []
    // const AdministrationPrimaryRouteAPI = async (id) => {
    //     let params = {
    //     }
    //     let url = Constants.apiEndPoints.AdministrationPrimaryRoute + '/' + id;
    //     console.log("Check Smpp get url...........", url,)
    //     // return
    //     let response = await APIService.getData(url, userLogin.access_token, null, "DltTemplateUsersAPI")
    //     if (!response.errorMsg) {
    //         // console.log("dltUserApi", JSON.stringify(response.data.data))
    //         setUserData(response.data.data)
    //     } else {
    //         Alert.alert(response.errorMsg)
    //     }
    // }

    useEffect(() => { 
        if (routeParm?.itemId) {
            setDetailData({
                ...detailData,
                "route_name": routeParm?.itemId.route_name,
                "smsc_id": routeParm?.itemId.smsc_id,
                "ip_address": routeParm?.itemId.ip_address,
                "port": routeParm?.itemId.port,
                "smsc_username": routeParm?.itemId.smsc_username,
                "status": routeParm?.itemId.status,
            })
        }
    }, []) 
    return (
        <View style={[styles.modalView, { marginHorizontal: 10, padding: 20, paddingVertical: 20 }]}>

            <View style={{ marginBottom: 8 }}>
                <Text style={styles.userTextStyle}>Route Name</Text>
                <Text style={styles.detailData}>{detailData.route_name}</Text>
            </View>
            <View style={{ marginBottom: 8 }}>
                <Text style={styles.userTextStyle}>SMS Id</Text>
                <Text style={styles.detailData}>{detailData.smsc_id}</Text>
            </View>

            <View style={{ marginBottom: 8 }}>
                <Text style={styles.userTextStyle}>Ip Address</Text>
                <Text style={styles.detailData}>{detailData.ip_address}</Text>
            </View>

            <View style={{ marginBottom: 8 }}>
                <Text style={styles.userTextStyle}>Port</Text>
                <Text style={styles.detailData}>{detailData.port}</Text>
            </View>

            <View style={{ marginBottom: 8 }}>
                <Text style={styles.userTextStyle}>UserName</Text>
                <Text style={styles.detailData}>{detailData.smsc_username}</Text>
            </View>

            <View style={{ marginBottom: 8 }}>
                <Text style={styles.userTextStyle}>Status</Text>
                <Text style={styles.detailData}>{detailData.status}</Text>
            </View>
        </View>
    )
}

export default SmppDetail

const styles = StyleSheet.create({
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
    userTextStyle: {
        color: "#ff9900",
        fontWeight: "bold",
        // textAlign: "center",
        elevation: 15,
        height: 25,
        fontSize: 22
        // backgroundColor: 'blue'
    },
    detailData: {
        backgroundColor: '#ffffe6',
        padding: 10
    }


})