import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal as RNModal,
  RefreshControl,
  Dimensions,
  ScrollView,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { fonts } from '../../../assets/Assets';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { useSelector } from 'react-redux';
import APIService from '../../../Services/APIService';
import Constants from '../../../constant/Constants';
import { FAB, Modal, Portal, } from 'react-native-paper';
import BaseContainer from '../../../components/BaseContainer';
import DltFilterTemplate from './DltFilterTemplate';
import FileUploadingAnimation from '../../../components/FileUploadingAnimation';
import PickerAndLocationServices from '../../../Services/PickerAndLocationServices';
import EmptyList from '../../../components/EmptyList';
import FooterCompForFlatlist from '../../../components/FooterCompForFlatlist';
import Colors from '../../../assets/Colors';
import moment from 'moment';
import ListLoader from '../../../components/ListLoader';
import { getProportionalFontSize } from '../../../Services/CommonMethods';
import ListingCard from '../../../components/ListingCard';

const DltTemplateList = ({ navigation }) => {
  const [listData, setListData] = useState([]); // list data
  const userLogin = useSelector(state => state.global_store.userLogin); //getting user login data from redux
  const [modalVisible, setModalVisible] = useState(false);    // for filter modal
  const [isIncorrectFormate, setIsIncorrectFormate] = useState(true); // for checking file format
  const [isModalVisible, setIsModalVisible] = useState(false);    // for filter modal
  const [isLoading, setIsLoading] = useState(false);    // for loader
  const [page, setPage] = useState([]); //page number
  const [isRefreshing, setIsRefreshing] = useState(false);    //for pull to refresh
  const [paginationLoading, setPaginationLoading] = useState(false);    //for pagination
  const [filterData, setFilterData] = useState({}); //filter data
  const [openFAB, setOpenFAB] = useState(false); // for FAB
  const [transparency, setTransparency] = useState({}); // for transparency
  const [visible, setVisible] = useState(false); // for modal
  const [msg, setMsg] = useState(''); // for modal


  const handleDeleteBtnAPI = (id) => {
    Alert.alert(
      'Delete Template',
      'Are you sure you want to delete this template?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => deleteRecord(id),
        },
      ],
      { cancelable: false },
    );

  };

  const deleteRecord = async id => {
    let params = {};
    let url = Constants.apiEndPoints.DltTemplate + '/' + id;
    console.log(url, params);
    // return
    let response = await APIService.deleteData(
      url,
      userLogin.access_token,
      null,
      'DliTemplateDelete',
    );
    if (!response.errorMsg) {
      DltTemplateListAPI();
      setTransparency({});
      Alert.alert('Success', 'Template Deleted Successfully');

    } else {
      Alert.alert(response.errorMsg);
    }
  };




  const DltTemplateListAPI = async (page, refresh, addFilter) => {
    if (refresh) setIsRefreshing(true);
    else if (!page) setIsLoading(true);
    else setPaginationLoading(true);
    let params = {
      page: page ? page : 1,
      per_page_record: 10,
    };
    if (addFilter) {
      params = {
        ...params,
        ...filterData,
        status: filterData?.status ? '1' : '0',
      }
    }
    let url = Constants.apiEndPoints.DltTemplateListing;
    // return
    let response = await APIService.postData(
      url,
      params,
      userLogin.access_token,
      null,
      'DltTemplateListAPI',
    );

    if (!response.errorMsg) {
      if (!page) {
        setPage(1);
        setListData(response.data.data.data);
        setIsLoading(false);
        setTransparency({});
        if (refresh) setIsRefreshing(false);
      } else {
        let tempListData = [...listData];
        tempListData = tempListData.concat(response.data.data.data);
        setPage(page);
        setListData([...tempListData]);
        setPaginationLoading(false);
        setTransparency({});
      }
    } else {
      if (!page) setIsLoading(false);
      else setPaginationLoading(false);
      if (refresh) setIsRefreshing(false);
      Alert.alert(Constants.danger, response.errorMsg??'Something went wrong');
    }
  };
  
  const renderItem = ({ item, index }) => {
    const dateA = moment(item.create_at).format('LL');
    return ( 
      <ListingCard 
        showMenu={true}
        setOpenCardOptions={true}
        index={index}
        isTreeDot={true}
        onPressMenu={() => setTransparency(index)}
        transparency={transparency}
        setTransparency={setTransparency}
        title={item.template_name}
        subTitle={dateA}
        cardLabels={item?.status == 1 ? 'Active' : 'Inactive'}
        AssignTo={item?.user?.name ?? 'NA'}
        dltId={item?.dlt_template_id}
        entity={item?.entity_id}
        showSecondaryTitle={true}
        is_approved={item?.status == 1 ? true : false}
        Unicode={item?.is_unicode == 1 ? 'Yes' : 'No'}
        Priority={'Instant(OTP)'}
        dltEdit={true}
        editAction={() => navigation.navigate('AddDltTemplate', { item: item })}
        dltDelete={true}
        deleteAction={() => handleDeleteBtnAPI(item.id)}
        msgView={() => {
          setVisible(true)
          setMsg(item?.dlt_message) 

        }}
         
      >
      </ListingCard> 
    );
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      DltTemplateListAPI();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    DltTemplateListAPI(null, null, true);
  }, [filterData]);



  async function open_document_picker() {
    let docRes = await PickerAndLocationServices.OpenDocumentPicker(false);
    if (!docRes) return;
    else imageOrDocumentResponseHandler(docRes);
  }

  const uploadFile = async attachmentArr => {

    let url = Constants.apiEndPoints.dltTemplatesImport;
    console.log(url);
    // return
    let res = await APIService.uploadFile(
      url,
      attachmentArr,
      userLogin.access_token,
      'CSV_',
      'no_multiple',
      'csv Attachment',
      "file_path"
    );
    setIsModalVisible(false);
    // return
    if (res.errorMsg) {
      Alert.alert(Constants.danger, res.errorMsg);
      // Alert.alert()
      return null;
    } else {
      Alert.alert(
        Constants.success,
        Constants.labels.message_uploaded_successfully,
      );
      return res.data.file_path;
    }
  };

  const imageOrDocumentResponseHandler = async response => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
      Alert.alert(
        Constants.danger,
        Constants.labels.message_something_went_wrong,
      );
    } else if (response.customButton) {
      console.log('User tapped custom button: ', response.customButton);
    } else {
      //  this.setState({ avatarSource: response, imagePathText: response.type });
      if (Array.isArray(response) && response.length > 0) {
        console.log('image res......if.', response);
        // return
        if (response[0]?.type != 'text/comma-separated-values') {
          setIsIncorrectFormate(true);
          setIsModalVisible(true);
          return;
        } else {
          setIsIncorrectFormate(false);
        }
        setIsModalVisible(true);
        // return;
        await uploadFile(response);

      } else if (response?.assets) {
        console.log('image res.......', response);
        if (response?.type != 'text/comma-separated-values') {
          setIsIncorrectFormate(true);
          return;
        } else {
          setIsIncorrectFormate(false);
        }
        setIsModalVisible(true);
      }
    }
  };

  const onRequestClose = () => {
    // console.log('onRequestClose called')
    setIsModalVisible(false);
  };

  if (isLoading) {
    return <ListLoader />;
  }

  return (
    <BaseContainer
      title="Dlt Template List"
      leftIcon="arrow-back"
      onPressRightIcon={() => setModalVisible(true)}
      rightIcon="filter-list"
      onPressLeftIcon={() => navigation.goBack()}>
      <FlatList
        data={listData}
        renderItem={renderItem}
        ListEmptyComponent={<EmptyList />}
        contentContainerStyle={{
          paddingBottom: 200,
          padding: Constants.globalPadding,
        }}
        keyExtractor={item => item.id}
        onEndReached={() => {
          DltTemplateListAPI(page + 1, null, true);
        }}
        onEndReachedThreshold={0.1}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => {
              DltTemplateListAPI(null, true);
            }}
          />
        }
        ListFooterComponent={() => (
          <FooterCompForFlatlist paginationLoading={paginationLoading} />
        )}
      />

      <Portal>
        <Modal visible={visible} onDismiss={() => {
          setTransparency({})
          setVisible(false)
          setMsg('')
        }} 
        contentContainerStyle={{ 
          backgroundColor: 'white', 
          padding: 20,
          marginHorizontal: 20,
          borderRadius: 10,
          height: 300, 
          alignItems: 'center' 
          
          }}>
            <AntDesign name="close" size={24} color="black" style={{ position: 'absolute', right: 10, top: 10 }} onPress={() => {setVisible(false)
              setMsg('')
              setTransparency(-1)
            }} />
            <ScrollView
              contentContainerStyle={{
                marginBottom: 100
              }}
              showsVerticalScrollIndicator={false}
            >
            <AntDesign name='infocirlce' size={30} color={Colors.info} style={{ 
              marginBottom: 10,
              alignSelf: 'center'

              }} />
          <Text
            style={{
              fontSize: getProportionalFontSize(16), 
              marginBottom: 10,
              alignSelf: 'center'

            }}
          >{msg}</Text>
          </ScrollView>
        </Modal>
      </Portal>
      <FAB.Group
        style={{
          paddingBottom: Dimensions.get("window").height * 0.1
        }}
        actions={[
          {
            icon: 'plus',
            label: 'Add Dlt Template',
            onPress: () => navigation.navigate('AddDltTemplate'),
          },
          {
            icon: 'arrow-down-bold-circle-outline',
            label: 'Import Dlt Template',
            onPress: () => navigation.navigate('ImportDltTemplate'),
          },
          {
            icon: 'account-box-outline',
            label: userLogin?.userType == 0 || userLogin?.userType == 3 ? 'Change Priority' : 'NA',
            onPress: () => { (userLogin?.userType == 0 || userLogin?.userType == 3) && navigation.navigate('ChangePriority') },
          },
          {
            icon: 'account',
            label: userLogin?.userType == 2 ? 'NA' : 'Assign Dlt Template',
            onPress: () => { userLogin?.userType == 2 ? Alert.alert(Constants.danger, "You are not authorized to perform") : navigation.navigate('AssignUser') },
          },
        ]}
        fabStyle={{ backgroundColor: Colors.primary }}
        open={openFAB}
        icon={openFAB ? 'close' : 'plus'}
        color={Colors.white}
        onStateChange={open => {
          if (openFAB) setOpenFAB(false);
          else setOpenFAB(true);
        }}
      />
      <RNModal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
            width: '100%',
            height: '100%',
          }}>
          <View style={styles.modalStyle}>
            <AntDesign name="close" size={20} color={'#000'}
              style={{
                position: 'absolute',
                right: 10,
                top: 10,
                zIndex: 1,
                backgroundColor: Colors.primary,
                borderRadius: 50,
                padding: 5,
              }}
              onPress={() => setModalVisible(false)}
            />
            <DltFilterTemplate
              filterData={filterData}
              setFilterData={setFilterData}
              setModalVisible={setModalVisible}
              DltTemplateListAPI={DltTemplateListAPI}
            />
          </View>
        </View>
      </RNModal>

      <RNModal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}>
        <View
          style={[styles.centeredView, { backgroundColor: 'rgba(0,0,0,0.5)', marginTop: -120 },
          ]}>
          <View style={styles.centeredView}>
            <View style={[styles.modalView, { height: 400, marginTop: 230 }]}>
              <FileUploadingAnimation
                isIncorrectFormate={isIncorrectFormate}
                onRequestClose={onRequestClose}
                isLoading={isLoading}
                open_document_picker={() => open_document_picker()}
              />
            </View>
          </View>
        </View>
      </RNModal>

    </BaseContainer>
  );
};
export default DltTemplateList;

const styles = StyleSheet.create({
  iconStyle: {
    backgroundColor: '#fff5e6',
    borderRadius: 10,
    padding: 10,

  },
  modalStyle: {
    width: '90%',
    height: '80%',
    borderRadius: 20,
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,

    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,

  },
  cartContainer: {
    backgroundColor: '#fff5e6',
    elevation: 12,
    borderRadius: 10,
    marginVertical: 10,
    marginTop: 15,
  },
  headerTextStyle: {
    fontFamily: fonts.regular,
    fontSize: getProportionalFontSize(14),
    color: '#000',

  },

  useHeading: {
    marginHorizontal: 8,
    padding: 10,
    fontFamily: fonts.medium,
    color: '#995c00',
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: Constants.globalPadding,
    height: '100%',

  },

  modalView: {
    width: '90%',
    height: '80%',
    borderRadius: 20,
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,

  },
  headTestStyle: {
    fontFamily: fonts.semiBold,
    fontSize: getProportionalFontSize(13),
    color: '#fff',

  },

});
