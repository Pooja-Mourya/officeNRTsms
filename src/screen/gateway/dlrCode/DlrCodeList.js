// import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert, ActivityIndicator, Modal, RefreshControl } from 'react-native'
// import React, { useState, useEffect } from 'react'
// import { fonts } from '../../../assets/Assets';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import Fontisto from 'react-native-vector-icons/Fontisto';
// // import AntDesign from 'react-native-vector-icons/AntDesign';
// import { useSelector } from 'react-redux';
// import APIService from '../../../Services/APIService';
// import Constants from '../../../constant/Constants';
// import { FAB, Portal, Provider } from 'react-native-paper';
// import BaseContainer from '../../../components/BaseContainer';
// import DltFilterTemplate from './DltFilterTemplate';
// import FileUploadingAnimation from '../../../components/FileUploadingAnimation';
// import PickerAndLocationServices from '../../../Services/PickerAndLocationServices';
// import EmptyList from '../../../components/EmptyList';
// import FooterCompForFlatlist from '../../../components/FooterCompForFlatlist';
// import TransparentLoader from '../../../components/TransparentLoader';
// import DltDetailPage from './DltDetailPage';
// import Colors from '../../../assets/Colors';



// const DltTemplateList = ({ navigation }) => {
//     const [listData, setListData] = useState([])
//     const userLogin = useSelector((state) => state.global_store.userLogin)
//     // console.log()
//     const [visible, setVisible] = useState(false);
//     const [state, setState] = useState({ open: false });
//     const [modalVisible, setModalVisible] = useState(false);
//     const [isIncorrectFormate, setIsIncorrectFormate] = useState(true)
//     const [uploadingFile, setUploadingFile] = useState()
//     const [isModalVisible, setIsModalVisible] = useState(false)
//     const [isLoading, setIsLoading] = useState(false)
//     const [loader, setLoader] = useState(false)
//     const [page, setPage] = useState([])
//     const [isRefreshing, setIsRefreshing] = useState(false)
//     const [paginationLoading, setPaginationLoading] = useState(false)
//     const [filterData, setFilterData] = useState({})
//     const [detailModal, setDetailModal] = useState()
//     const [openFAB, setOpenFAB] = useState(false)

//     const onStateChange = ({ open }) => setState({ open });

//     const { open } = state;

//     const openMenu = () => setVisible(true);

//     const closeMenu = () => setVisible(false);

//     const handleDeleteBtnAPI = async (id) => {
//         let params = {
//         }
//         let url = Constants.apiEndPoints.DltTemplate + "/" + id;
//         console.log(url, params)
//         // return
//         let response = await APIService.deleteData(url, userLogin.access_token, null, "DliTemplateDelete")
//         if (!response.errorMsg) {
//             console.log("dlt Delete")
//             DltTemplateListAPI()
//             // Alert.alert('do you want to delete', [
//             //     {
//             //         Text: 'yes',
//             //         onPress: () => setListData([])
//             //     },
//             //     {
//             //         Text: 'No'
//             //     }
//             // ])
//             Alert.alert('record deleted successfully')

//         } else {
//             Alert.alert(response.errorMsg)
//         }
//     }

//     const DltTemplateListAPI = async (page, refresh) => {
//         // return
//         setLoader(true)
//         if (refresh)
//             setIsRefreshing(true)
//         else if (!page)
//             setIsLoading(true);
//         else
//             setPaginationLoading(true)
//         let params = {
//             current_page: page ?? 1,
//             per_page_record: 10,
//             manage_sender_id: filterData?.manage_sender_id?.id,
//             template_name: filterData?.template_name,
//             dlt_template_id: filterData?.dlt_template_id,
//             entity_id: filterData?.entity_id,
//             sender_id: filterData?.sender_id,
//             header_id: filterData?.header_id,
//             is_unicode: filterData?.is_unicode ? "1" : "0",
//             dlt_message: filterData?.dlt_message,
//             status: filterData?.status ? "1" : "0"

//         }
//         let url = Constants.apiEndPoints.DltTemplateListing;
//         console.log("url", url);
//         let response = await APIService.postData(url, params, userLogin.access_token, null, "DltTemplateListAPI");

//         if (!response.errorMsg) {
//             if (!page) {
//                 setPage(1);
//                 setListData(response.data.data.data);
//                 setIsLoading(false);
//                 if (refresh)
//                     setIsRefreshing(false);
//             }
//             else {
//                 let tempListData = [...listData];
//                 tempListData = tempListData.concat(response.data.data.data);
//                 setPage(page);
//                 setListData([...tempListData]);
//                 setPaginationLoading(false);
//             }
//         }
//         else {
//             if (!page)
//                 setIsLoading(false);
//             else
//                 setPaginationLoading(false)
//             if (refresh)
//                 setIsRefreshing(false);
//             setLoader(false)
//             Alert.showAlert(Constants.danger, response.errorMsg)
//         }
//     }
//     const renderItemList = ({ item }) => {
//         return (
//             <>

//                 <View style={styles.cartContainer}>
//                     <View style={[styles.spaceBetweenStyle, { backgroundColor: '#ffb84d', borderRadius: 7 }]}>
//                         <View style={[styles.headerText,]}>
//                             <Text style={styles.userTextStyle}>{item.template_name}</Text>
//                         </View>
//                         < View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row' }}>
//                             <TouchableOpacity
//                                 onPress={() => navigation.navigate('DltDetailPage', { itemId: item })}
//                                 style={[styles.btn, styles.spaceBetweenStyle]}>
//                                 <Fontisto name='preview' color='white' size={18} />
//                             </TouchableOpacity>
//                             {/* {setIndicator(false) ? */}
//                             <TouchableOpacity
//                                 onPress={() => navigation.navigate('DltTemplate', { itemId: item })}
//                                 style={[styles.btn, styles.spaceBetweenStyle]}>
//                                 <AntDesign name='edit' color='white' size={18} />
//                             </TouchableOpacity>
//                             <TouchableOpacity
//                                 onPress={() => handleDeleteBtnAPI(item.id)}
//                                 style={[styles.btn, styles.spaceBetweenStyle]}>
//                                 <AntDesign name='delete' color='white' size={18} />
//                             </TouchableOpacity>
//                             {/* // : setIndicator(true)} */}
//                         </View>
//                     </View>
//                     <View style={styles.useHeading}>
//                         <Text style={styles.headerTextStyle}>Template Id : {item.dlt_template_id}</Text>
//                         <Text style={styles.headerTextStyle}>Unicode : {item.is_unicode}</Text>
//                         <Text style={styles.headerTextStyle}>Create At : {item.created_at}</Text>
//                     </View>
//                 </View>
//             </>
//         )
//     }
//     useEffect(() => {
//         DltTemplateListAPI()
//     }, [])

//     async function open_document_picker() {
//         let docRes = await PickerAndLocationServices.OpenDocumentPicker(false);
//         if (!docRes)
//             return
//         else
//             imageOrDocumentResponseHandler(docRes)
//     }

//     const uploadFile = async (attachmentArr) => {
//         // if (!checkFileSize(attachmentObj))
//         //     return;
//         setUploadingFile(true)
//         console.log("UserLogin.access_token", userLogin.access_token)

//         let url = Constants.apiEndPoints.dltTemplatesImport
//         console.log(url)
//         // return
//         let res = await APIService.uploadFile(url, attachmentArr, userLogin.access_token, 'CSV_', 'no_multiple', 'csv Attachment')
//         setUploadingFile(false)
//         setIsModalVisible(false)
//         // return
//         if (res.errorMsg) {
//             Alert.alert(Constants.danger, res.errorMsg)
//             // Alert.alert()
//             return null;
//         }
//         else {
//             Alert.alert(Constants.success, Constants.labels.message_uploaded_successfully)
//             return res.data.file_path;
//         }
//     }

//     const imageOrDocumentResponseHandler = async (response) => {
//         if (response.didCancel) {
//             console.log('User cancelled image picker');
//         } else if (response.error) {
//             console.log('ImagePicker Error: ', response.error);
//             Alert.alert(Constants.danger, Constants.labels.message_something_went_wrong)
//         } else if (response.customButton) {
//             console.log('User tapped custom button: ', response.customButton);
//         } else {
//             //  this.setState({ avatarSource: response, imagePathText: response.type });
//             if (Array.isArray(response) && response.length > 0) {
//                 console.log("image res......if.", response);
//                 // return
//                 if (response[0]?.type != "text/comma-separated-values") {
//                     setIsIncorrectFormate(true);
//                     setIsModalVisible(true)
//                     return
//                 }
//                 else { setIsIncorrectFormate(false) }
//                 setIsModalVisible(true)
//                 // return;
//                 let uploaded_doc_arr = await uploadFile(response);
//                 // return
//                 if (!uploaded_doc_arr)
//                     return;
//                 uploaded_doc_arr.map((obj) => {
//                     obj['uploaded_doc_url'] = obj.file_name;
//                     obj['uri'] = obj.file_name;
//                     obj['type'] = obj.uploading_file_name;
//                 })
//                 let tempDocArr = [...formFields.documents];
//                 tempDocArr = tempDocArr.concat(uploaded_doc_arr)
//                 // handleInputChange(formFieldsKeys.documents, tempDocArr)
//                 console.log("tempdocarr------", tempDocArr)
//             }
//             else if (response?.assets) {
//                 console.log("image res.......", response);
//                 if (response?.type != "text/comma-separated-values") {
//                     setIsIncorrectFormate(true);
//                     return
//                 }
//                 else { setIsIncorrectFormate(false) }
//                 // CSVToJSON(response?.uri)
//                 setIsModalVisible(true)
//                 // return;
//                 let uploaded_doc_arr = await uploadFile(response?.assets);
//                 if (!uploaded_doc_arr)
//                     return;
//                 uploaded_doc_arr.map((obj) => {
//                     obj['uploaded_doc_url'] = obj.file_name
//                     obj['uri'] = obj.file_name;
//                     obj['type'] = "image";
//                 })

//                 let tempDocArr = [...formFields.documents];
//                 tempDocArr = tempDocArr.concat(uploaded_doc_arr)
//                 console.log("tempDocArr", tempDocArr)
//                 // handleInputChange(formFieldsKeys.documents, tempDocArr)
//                 console.log("tempdocarr------", tempDocArr)
//             }
//         }
//     }

//     const onRequestClose = () => {
//         // console.log('onRequestClose called')
//         setIsModalVisible(false);
//     }
//     console.log("filter data", filterData)
//     return (
//         <BaseContainer
//             title='Dlt Template List'
//             leftIcon="arrow-back"
//             onPressRightIcon={() => setModalVisible(true)}
//             rightIcon="filter-list"
//             onPressLeftIcon={() => { navigation.pop() }}
//         >
//             <TransparentLoader isLoading={isLoading} />


//             <FlatList
//                 data={listData}
//                 renderItem={renderItemList}
//                 ListEmptyComponent={<EmptyList />}
//                 // renderItem={flatListRenderItem}
//                 contentContainerStyle={{ paddingBottom: 200, marginBottom: 100, borderWidth: 0, paddingVertical: Constants.globalPaddingVetical, paddingHorizontal: Constants.globalPaddingHorizontal, marginBottom: 200 }}
//                 keyExtractor={item => item.id}
//                 onEndReached={() => { DltTemplateListAPI(page + 1) }}
//                 onEndReachedThreshold={0.1}
//                 refreshControl={
//                     <RefreshControl
//                         refreshing={isRefreshing}
//                         onRefresh={() => {
//                             DltTemplateListAPI(null, true)
//                         }}
//                     />
//                 }
//                 ListFooterComponent={() => <FooterCompForFlatlist paginationLoading={paginationLoading} />}
//             />

//             <FAB.Group
//                 style={{ marginBottom: 100 }}
//                 actions={[
//                     {
//                         icon: 'plus',
//                         label: 'Add Template',
//                         onPress: () => navigation.navigate('DltTemplate')
//                     },
//                     {
//                         icon: 'arrow-up-bold-circle-outline',
//                         label: 'Import Dlt Template',
//                         onPress: () => open_document_picker(true)
//                     },
//                     {
//                         icon: 'account-box-outline',
//                         label: 'Change Priority',
//                         onPress: () => navigation.navigate('ChangePriority'),
//                     },
//                     {
//                         icon: 'account',
//                         label: 'Assign User',
//                         onPress: () => navigation.navigate('AssignUser'),
//                         // labelTextColor: 'green',
//                     }
//                 ]}
//                 fabStyle={{ backgroundColor: Colors.primary, }}
//                 open={openFAB}
//                 icon={openFAB ? 'close' : 'plus'}
//                 color={Colors.white}
//                 onStateChange={(open) => {
//                     if (openFAB)
//                         setOpenFAB(false)
//                     else
//                         setOpenFAB(true)
//                 }}
//             />
//             <Modal
//                 animationType="slide"
//                 transparent={true}
//                 visible={modalVisible}
//                 onRequestClose={() => {
//                     Alert.alert("Modal has been closed.");
//                     setModalVisible(!modalVisible);
//                 }}
//             >
//                 <View style={[styles.centeredView, { backgroundColor: 'rgba(0,0,0,0.5)', marginTop: -10, }]}>
//                     <View style={styles.centeredView}>
//                         <View style={styles.modalView}>
//                             <TouchableOpacity
//                                 // style={[styles.button, styles.buttonClose]}
//                                 onPress={() => setModalVisible(!modalVisible)}
//                             >
//                                 <AntDesign style={{ backgroundColor: '#ffa31a', padding: 8, borderRadius: 25, width: 40 }} name='close' size={25} color={"white"} />
//                                 {/* <Text >Hide Modal</Text> */}
//                             </TouchableOpacity>

//                             <DltFilterTemplate
//                                 filterData={filterData}
//                                 setFilterData={setFilterData}
//                                 modalVisible={modalVisible}
//                                 setModalVisible={setModalVisible}
//                             />
//                         </View>
//                     </View>
//                 </View>
//             </Modal>

//             <Modal
//                 animationType="slide"
//                 transparent={true}
//                 visible={isModalVisible}
//                 onRequestClose={() => {
//                     Alert.alert("Modal has been closed.");
//                     setIsModalVisible(!isModalVisible);
//                 }}
//             >
//                 <View style={[styles.centeredView, { backgroundColor: 'rgba(0,0,0,0.5)', marginTop: -120, }]}>
//                     <View style={styles.centeredView}>
//                         <View style={[styles.modalView, { height: 400, marginTop: 230 }]}>

//                             <FileUploadingAnimation
//                                 isIncorrectFormate={isIncorrectFormate} onRequestClose={onRequestClose} isLoading={isLoading}
//                                 open_document_picker={() => open_document_picker()}

//                             />

//                         </View>
//                     </View>
//                 </View>
//             </Modal>

//             {/* <Modal
//                 animationType="slide"
//                 transparent={true}
//                 visible={detailModal}
//                 onRequestClose={() => {
//                     Alert.alert("Modal has been closed.");
//                     setDetailModal(!detailModal);
//                 }}
//             >
//                 <View>
//                     <View style={{ top: 320, margin: 40, borderRedis: 8 }}>
//                         <Text>Hello</Text>
//                         <DltDetailPage />
//                     </View>
//                 </View>
//             </Modal> */}

//         </BaseContainer>
//     )
// }
// export default DltTemplateList

// const styles = StyleSheet.create({

//     spaceBetweenStyle: {
//         // flex: 1,
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         // marginEnd: 5
//     },
//     DltTemplateStyle: {
//         margin: 10,
//         padding: 10,
//         fontSize: 25,
//         fontFamily: fonts.bold,
//         color: '#ff9900'
//     },
//     cartContainer: {
//         backgroundColor: '#fff5e6',
//         // flexDirection: 'row',
//         elevation: 12,
//         borderRadius: 10,
//         marginVertical: 10,
//         marginHorizontal: 10,
//         marginTop: 15,
//     },
//     headerText: {
//         // flex: 1,
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         margin: 8,
//     },
//     headerTextStyle: {
//         fontFamily: fonts.bold,
//         fontWeight: '900',
//     },
//     useHeading: {
//         // flexDirection: 'row',
//         // justifyContent: 'space-between',
//         marginHorizontal: 8,
//         padding: 10,
//         fontFamily: fonts.medium,
//         color: '#995c00'
//     },

//     userTextStyle: {
//         fontFamily: fonts.semiBold,
//     },
//     btn: {
//         padding: 10,
//         fontFamily: fonts.boldItalic,
//         borderRadius: 10,
//         backgroundColor: '#FFAD33',
//         width: 38,
//     },
//     //modal style
//     centeredView: {
//         // flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//         marginTop: 22
//     },

//     modalView: {
//         // margin: 20,
//         backgroundColor: "white",
//         borderRadius: 20,
//         padding: 10,
//         // alignItems: "center",
//         shadowColor: "#000",
//         shadowOffset: {
//             width: 0,
//             height: 2
//         },
//         shadowOpacity: 0.25,
//         shadowRadius: 4,
//         elevation: 5,
//     },

//     loadMoreBtn: {
//         paddingHorizontal: 16,
//         paddingVertical: 10,
//         backgroundColor: '#ff9900',
//         borderRadius: 4,
//         width: 100,
//         flex: 1,
//         alignSelf: 'center'
//     },


// })

import { View, Text } from 'react-native'
import React from 'react'

const DlrCodeList = () => {
    return (
        <View>
            <Text>DlrCodeList</Text>
        </View>
    )
}

export default DlrCodeList

