import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert, ActivityIndicator, Modal, RefreshControl } from 'react-native'
import React, { useState, useEffect } from 'react'
// import { fonts } from '../../../assets/Assets';
import { fonts } from '../../../assets/Assets';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Fontisto from 'react-native-vector-icons/Fontisto';
// import AntDesign from 'react-native-vector-icons/AntDesign';
import { useSelector } from 'react-redux';
import APIService from '../../../Services/APIService';
// import Constants from '../../../constant/Constants';
import Constants from '../../../constant/Constants';
import { FAB, Portal, Provider } from 'react-native-paper';
import BaseContainer from '../../../components/BaseContainer';
import EmptyList from '../../../components/EmptyList';
import FooterCompForFlatlist from '../../../components/FooterCompForFlatlist';
import TransparentLoader from '../../../components/TransparentLoader';
import Colors from '../../../assets/Colors';
import SmppFilter from './SmppFilter';


const SmppList = ({ navigation }) => {
    const [listData, setListData] = useState([])
    const userLogin = useSelector((state) => state.global_store.userLogin) 
    const [visible, setVisible] = useState(false);
    const [state, setState] = useState({ open: false });
    const [modalVisible, setModalVisible] = useState(false);
    const [isIncorrectFormate, setIsIncorrectFormate] = useState(true)
    const [uploadingFile, setUploadingFile] = useState()
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [loader, setLoader] = useState(false)
    const [page, setPage] = useState([])
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [paginationLoading, setPaginationLoading] = useState(false)
    const [filterData, setFilterData] = useState({})
    const [detailModal, setDetailModal] = useState()
    const [openFAB, setOpenFAB] = useState(false)
    const [showBox, setShowBox] = useState(true);

    const onStateChange = ({ open }) => setState({ open });

    const { open } = state;

    const openMenu = () => setVisible(true);

    const closeMenu = () => setVisible(false);

    const handleDeleteBtnAPI = async (id) => {
        let params = {
        }
        let url = Constants.apiEndPoints.administrationCheckPrimaryRouteConnection + "/" + id; 
        // return
        let response = await APIService.deleteData(url, userLogin.access_token, null, "DliTemplateDelete")
        if (!response.errorMsg) { 
            administrationPrimaryRoutesAPI()
            Alert.alert('record deleted successfully')

        } else {
            Alert.alert(response.errorMsg)
        }
    }

    const handleActionBtnAPI = async (id) => {
        let params = {
        }
        let url = Constants.apiEndPoints.DltTemplate + "/" + id; 
        // return
        let response = await APIService.deleteData(url, userLogin.access_token, null, "DliTemplateDelete")
        if (!response.errorMsg) { 
            administrationPrimaryRoutesAPI()
            Alert.alert('record deleted successfully')

        } else {
            Alert.alert(response.errorMsg)
        }
    }

    const showConfirmDialog = (item) => {
        return Alert.alert(
            "Are your sure?",
            " you want to remove this ?",
            [
                // The "Yes" button
                {
                    text: "Yes",
                    onPress: () => {
                        setShowBox(false);
                        handleDeleteBtnAPI(item.id)
                    },
                },
                // Does nothing but dismiss the dialog when tapped
                {
                    text: "No",
                },
            ]
        );
    };

    const administrationPrimaryRoutesAPI = async (page, refresh) => {
        // return
        setLoader(true)
        if (refresh)
            setIsRefreshing(true)
        else if (!page)
            setIsLoading(true);
        else
            setPaginationLoading(true)
        let params = {
            current_page: page ?? 1,
            per_page_record: 10,
            route_name: filterData?.route_name?.id,
            smsc_id: filterData?.smsc_id,
            ip_address: filterData?.ip_address,
            port: filterData?.port,
            smsc_username: filterData?.smsc_username,
            status: filterData?.status ? "1" : "0",
        }
        let url = Constants.apiEndPoints.administrationPrimaryRoutes; 

        // return
        let response = await APIService.postData(url, params, userLogin.access_token, null, "administrationPrimaryRoutesAPI");

        if (!response.errorMsg) {
            if (!page) {
                setPage(1);
                setListData(response.data.data.data);
                setIsLoading(false);
                if (refresh)
                    setIsRefreshing(false);
            }
            else {
                let tempListData = [...listData];
                tempListData = tempListData.concat(response.data.data.data);
                setPage(page);
                setListData([...tempListData]);
                setPaginationLoading(false);
            }
        }
        else {
            if (!page)
                setIsLoading(false);
            else
                setPaginationLoading(false)
            if (refresh)
                setIsRefreshing(false);
            setLoader(false)
            Alert.showAlert(Constants.danger, response.errorMsg)
        }
    }


    const renderItemList = ({ item }) => {
        return (
            <>

                <View style={styles.cartContainer}>
                    <View style={[styles.spaceBetweenStyle, { backgroundColor: '#ffb84d', borderRadius: 7 }]}>
                        <View style={[styles.headerText,]}>
                            <Text style={styles.userTextStyle}>{item.template_name}</Text>
                        </View>
                        < View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row' }}>
                            <TouchableOpacity
                                onPress={() => handleActionBtnAPI(item)}
                                style={[styles.btn, styles.spaceBetweenStyle]}>
                                <AntDesign name='wifi' color='white' size={18} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('SmppDetail', { itemId: item })}
                                style={[styles.btn, styles.spaceBetweenStyle]}>
                                <Fontisto name='preview' color='white' size={18} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('SmppAdd', { itemId: item })}
                                style={[styles.btn, styles.spaceBetweenStyle]}>
                                <AntDesign name='edit' color='white' size={18} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => showConfirmDialog(item)}
                                style={[styles.btn, styles.spaceBetweenStyle]}>
                                <AntDesign name='delete' color='white' size={18} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.useHeading}>
                        <Text style={styles.headerTextStyle}>Route Name : {item.route_name}</Text>
                        <Text style={styles.headerTextStyle}>SMSC Id : {item.smsc_id}</Text>
                        <Text style={styles.headerTextStyle}>IP Address : {item.ip_address}</Text>
                        <Text style={styles.headerTextStyle}>Port : {item.port}</Text>
                        <Text style={styles.headerTextStyle}>SMS userName : {item.smsc_username}</Text>
                        <Text style={styles.headerTextStyle}>Status : {item.status == 1 ? "Yes" : "No"}</Text>
                    </View>
                </View>
            </>
        )
    }
    useEffect(() => {
        administrationPrimaryRoutesAPI()
    }, [])
 
    return (
        <BaseContainer
            title='Smpp List'
            leftIcon="arrow-back"
            onPressRightIcon={() => setModalVisible(true)}
            rightIcon="filter-list"
            onPressLeftIcon={() => { navigation.goBack() }}
        >
            <TransparentLoader isLoading={isLoading} />

            <FlatList
                data={listData}
                renderItem={renderItemList}
                ListEmptyComponent={<EmptyList />}
                // renderItem={flatListRenderItem}
                contentContainerStyle={{ paddingBottom: 200, marginBottom: 100, borderWidth: 0, paddingVertical: Constants.globalPaddingVetical, paddingHorizontal: Constants.globalPaddingHorizontal, marginBottom: 200 }}
                keyExtractor={item => item.id}
                onEndReached={() => { administrationPrimaryRoutesAPI(page + 1) }}
                onEndReachedThreshold={0.1}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={() => {
                            administrationPrimaryRoutesAPI(null, true)
                        }}
                    />
                }
                ListFooterComponent={() => <FooterCompForFlatlist paginationLoading={paginationLoading} />}
            />
            <FAB
                icon="plus"
                style={styles.fab}
                onPress={() => navigation.navigate('SmppAdd')}
            />

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={[styles.centeredView, { backgroundColor: 'rgba(0,0,0,0.5)', marginTop: -10, }]}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <TouchableOpacity
                                // style={[styles.button, styles.buttonClose]}
                                onPress={() => setModalVisible(!modalVisible)}
                            >
                                <AntDesign style={{ backgroundColor: '#ffa31a', padding: 8, borderRadius: 25, width: 40 }} name='close' size={25} color={"white"} />
                                {/* <Text >Hide Modal</Text> */}
                            </TouchableOpacity>

                            <SmppFilter
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
    )
}
export default SmppList

const styles = StyleSheet.create({

    spaceBetweenStyle: {
        // flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        // marginEnd: 5
    },
    DltTemplateStyle: {
        margin: 10,
        padding: 10,
        fontSize: 25,
        fontFamily: fonts.bold,
        color: '#ff9900'
    },
    cartContainer: {
        backgroundColor: '#fff5e6',
        // flexDirection: 'row',
        elevation: 12,
        borderRadius: 10,
        marginVertical: 10,
        marginHorizontal: 10,
        marginTop: 15,
    },
    headerText: {
        // flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 8,
    },
    headerTextStyle: {
        fontFamily: fonts.bold,
        fontWeight: '900',
    },
    useHeading: {
        // flexDirection: 'row',
        // justifyContent: 'space-between',
        marginHorizontal: 8,
        padding: 10,
        fontFamily: fonts.medium,
        color: '#995c00'
    },

    userTextStyle: {
        fontFamily: fonts.semiBold,
    },
    btn: {
        padding: 10,
        fontFamily: fonts.boldItalic,
        borderRadius: 10,
        backgroundColor: '#FFAD33',
        width: 38,
    },
    //modal style
    centeredView: {
        // flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },

    modalView: {
        // margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 10,
        // alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },

    loadMoreBtn: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: '#ff9900',
        borderRadius: 4,
        width: 100,
        flex: 1,
        alignSelf: 'center'
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: Colors.primary
    },


})


