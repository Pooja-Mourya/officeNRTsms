import { StyleSheet, Text, View, Alert, Modal, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
// import APIService from '../../../Services/APIService';
// import Constants from '../../../constant/Constants';
import APIService from '../../Services/APIService'
import Constants from '../../constant/Constants'
import BaseContainer from '../../components/BaseContainer'
import AntDesign from 'react-native-vector-icons/AntDesign';
import CampaignFilter from './CampaignFilter'

const CampaignAdd = (props) => {
    let { navigation } = props

    const userLogin = useSelector((state) => state.global_store.userLogin)
    let routeParm = props?.route?.params ?? {};
    const [detailData, setDetailData] = useState({})
    const [modalVisible, setModalVisible] = useState(false)
    const [filterData, setFilterData] = useState({})

    const getCampaignInfoAPI = async (id) => {
        let params = {
        }
        let url = Constants.apiEndPoints.getCampaignInfo + '/' + id;
        console.log("chech url...........", url,)
        return
        let response = await APIService.getData(url, userLogin.access_token, null, "DltTemplateUsersAPI")
        if (!response.errorMsg) {
            // console.log("dltUserApi", JSON.stringify(response.data.data))
            setUserData(response.data.data)
        } else {
            Alert.alert(response.errorMsg)
        }
    }



    useEffect(() => {
        // console.log('routeParm?.itemId', routeParm?.itemId)
        if (routeParm?.itemId) {
            setDetailData({
                ...detailData,
                // "user_id": routeParm?.itemId.user_id,
                // "user_id": routeParm?.itemId.user_id,
                // "user_id": routeParm?.itemId.user_id,
                // "user_id": routeParm?.itemId.user_id,
                // "user_id": routeParm?.itemId.user_id,
                // "user_id": routeParm?.itemId.user_id,
                // "user_id": routeParm?.itemId.user_id,
                // "user_id": routeParm?.itemId.user_id,
                // "user_id": routeParm?.itemId.user_id,
                // "user_id": routeParm?.itemId.user_id,
                // "user_id": routeParm?.itemId.user_id,
                // "user_id": routeParm?.itemId.user_id,
                "campaign": routeParm?.itemId.campaign,
                "dlt_templete_id": routeParm?.itemId.dlt_templete_id,
                "route_type": routeParm?.itemId.route_type,
                "sender_id": routeParm?.itemId.sender_id,
                "sms_type": routeParm?.itemId.sms_type,
                "message_type": routeParm?.itemId.message_type,
                "total_contacts": routeParm?.itemId.total_contacts,
            })
        }
        getCampaignInfoAPI
    }, [])
    console.log("details", routeParm?.itemId)
    return (
        <BaseContainer
            title='phone log'
            leftIcon="arrow-back"
            onPressRightIcon={() => setModalVisible(true)}
            rightIcon="filter-list"
            onPressLeftIcon={() => { navigation.pop() }}
        >
            <View style={{ marginHorizontal: 10, padding: 20, paddingVertical: 20, }}>


                <View style={{ marginBottom: 18, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.userTextStyle}>Dlt template Id</Text>
                    <Text style={styles.detailData}>{detailData.status}</Text>
                </View>
                <View style={{ marginBottom: 18, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.userTextStyle}>Total Delivered</Text>
                    <Text style={styles.detailData}>{detailData.total_delivered}</Text>
                </View>
                <View style={{ marginBottom: 18, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.userTextStyle}>Fail</Text>
                    <Text style={styles.detailData}>{detailData.total_failed}</Text>
                </View>

                <View style={{ marginBottom: 18, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.userTextStyle}>Total Block Number</Text>
                    <Text style={styles.detailData}>{detailData.total_block_number}</Text>
                </View>
                <View style={{ marginBottom: 18, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.userTextStyle}>Dlt template Id</Text>
                    <Text style={styles.detailData}>{detailData.status}</Text>
                </View>
                <View style={{ marginBottom: 18, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.userTextStyle}>Total Contact</Text>
                    <Text style={styles.detailData}>{detailData.total_contacts}</Text>
                </View>

                <View style={{ marginBottom: 18, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.userTextStyle}>Template Name</Text>
                    <Text style={styles.detailData}>{detailData?.template_name}</Text>
                </View>
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
                    <View style={{ margin: 20, padding: 0, elevation: 5, borderRadius: 8, backgroundColor: 'white' }}>
                        <View style={styles.modalView}>
                            <TouchableOpacity
                                style={{ marginBottom: -30 }}
                                onPress={() => setModalVisible(!modalVisible)}
                            >
                                <AntDesign style={{ backgroundColor: '#ffa31a', padding: 8, borderRadius: 25, width: 40, margin: 10 }} name='close' size={25} color={"white"} />
                            </TouchableOpacity>
                            <CampaignFilter
                                filterData={filterData}
                                setFilterData={setFilterData}
                                modalVisible={modalVisible}
                                setModalVisible={setModalVisible}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        </BaseContainer>
        // <>
        //     <Text>hii</Text>
        // </>
    )
}

export default CampaignAdd

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
        padding: 10,
        width: '30%',
        elevation: 15
    }


})

