import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  Alert,
  RefreshControl,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {fonts} from '../../assets/Assets';
import BaseContainer from '../../components/BaseContainer';
import APIService from '../../Services/APIService';
import Constants from '../../constant/Constants';
import {useSelector} from 'react-redux';
import EmptyList from '../../components/EmptyList';
import FooterCompForFlatlist from '../../components/FooterCompForFlatlist';
import {FAB} from 'react-native-paper';
import ExportBySenderId from './ExportBySenderId';
import ExportByNumber from './ExportByNumber';
import Colors from '../../assets/Colors';
import moment from 'moment';
import ListLoader from '../../components/ListLoader';
import DeliveryFilter from './DeliveryFilter';
import {getProportionalFontSize} from '../../Services/CommonMethods';

const Delivery = ({navigation}) => {
  const [listData, setListData] = useState([]);
  const [page, setPage] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [senderIdModal, setSenderIdModal] = useState(false);
  const [numberModal, setNumberModal] = useState(false);
  const [isReadMore, setIsReadMore] = useState(false);
  const [openFAB, setOpenFAB] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterParams, setFilterParams] = useState([]);
  const userLogin = useSelector(state => state.global_store.userLogin);

  const ReportListAPI = async (page, refresh, addFilter) => {
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
        ...filterParams,
        status: filterParams.status ? '1' : '0',
      };
    }

    let url = Constants.apiEndPoints.ReportList;
    console.log('url', url, 'params', params);
    // return
    let response = await APIService.postData(
      url,
      params,
      userLogin.access_token,
      null,
      'ReportListAPI',
    );
    // return
    if (!response.errorMsg) {
      if (!page) {
        setPage(1);
        setListData(response?.data?.data?.data);
        setIsLoading(false);
        if (refresh) setIsRefreshing(false);
      } else {
        let tempListData = [...listData];
        tempListData = tempListData.concat(response?.data?.data?.data);
        setPage(page);
        setListData([...tempListData]);
        setPaginationLoading(false);
      }
    } else {
      if (!page) setIsLoading(false);
      else setPaginationLoading(false);
      if (refresh) setIsRefreshing(false);
      Alert.alert(Constants.danger, response.errorMsg);
    }
  };

  useEffect(() => { 
    ReportListAPI(null, null, true);
  }, [filterParams]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      ReportListAPI();
    });
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({item, index}) => {  
    const dateTime = moment(item.campaign_send_date_time).fromNow();
    return ( 
        <View style={styles.cartContainer}>
          <View
            style={styles.topHeader}>
            <View style={styles.headerText}>
              <Text style={styles.userTextStyle}>{item.campaign}</Text>
              <Text
                style={{
                  ...styles.userTextStyle,
                  fontSize: getProportionalFontSize(12),
                  fontFamily: fonts.medium,



                }}>
                {dateTime}
              </Text>
            </View>
          </View>  
            <Text style={styles.status}>{item.status}</Text> 
          <View style={{padding:Constants.globalPadding}}>
          <Text style={styles.headerTextStyle}>Contact Info: {item.total_contacts}</Text>
          <Text style={styles.headerTextStyle}>Credit Info: {item.total_credit_deduct}</Text>
            {index !== isReadMore ? (
              <Text numberOfLines={2} style={styles.msgText}>
                {item.message.length < 100
                  ? `${item.message}`
                  : `${item.message.substring(0, 97)}...`}
              </Text>
            ) : (
              <Text style={styles.msgText}>{item.message}</Text>
            )} 
              <Text
               onPress={
                index == isReadMore
                  ? () => setIsReadMore(null)
                  : () => setIsReadMore(index)
              }
              style={{...styles.msgText,color:Colors.info,paddingBottom:-40 }}>
                {index !== isReadMore ? ' ...read more' : '...read less'}
              </Text> 
          </View>
        </View> 
    );
  };

  if (isLoading) {
    return <ListLoader />;
  }

  return (
    <BaseContainer
      title="Delivery Report"
      leftIcon="arrow-back"
      onPressRightIcon={() => setModalVisible(true)}
      onPressLeftIcon={() => navigation.goBack()}
      rightIcon="filter-list">
      <FlatList
        data={listData}
        renderItem={renderItem}
        ListEmptyComponent={<EmptyList />}
        contentContainerStyle={{paddingBottom: 100}}
        keyExtractor={item => item.id}
        onEndReached={() => {
          ReportListAPI(page + 1, null, true);
        }}
        onEndReachedThreshold={0.1}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => {
              ReportListAPI(null, true);
            }}
          />
        }
        ListFooterComponent={() => (
          <FooterCompForFlatlist paginationLoading={paginationLoading} />
        )}
      />

      <FAB.Group
        style={{marginBottom: 56}}
        actions={[
          {
            icon: 'export',
            label: 'Export By Sender Id',
            onPress: () => setSenderIdModal(true),
          },
          {
            icon: 'export',
            label: 'Export By Number',
            onPress: () => setNumberModal(true),
          },
        ]}
        fabStyle={{backgroundColor: Colors.primary}}
        open={openFAB}
        icon={openFAB ? 'close' : 'export'}
        color={Colors.white}
        onStateChange={open => {
          if (openFAB) setOpenFAB(false);
          else setOpenFAB(true);
        }}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={senderIdModal}
        onRequestClose={() => setSenderIdModal(false)}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
            width: '100%',
            height: '100%',
          }}>
          <View style={{...styles.modalStyle, height: '55%'}}>
            <AntDesign
              name="close"
              size={20}
              color={'#000'}
              style={{
                position: 'absolute',
                right: 10,
                top: 10,
                zIndex: 1,
                backgroundColor: Colors.primary,
                borderRadius: 50,
                padding: 5,
              }}
              onPress={() => setSenderIdModal(false)}
            />
            <ExportBySenderId
              setSenderIdModal={setSenderIdModal}
              senderIdModal={senderIdModal}
            />
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={numberModal}
        onRequestClose={() => setNumberModal(false)}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
            width: '100%',
            height: '100%',
          }}>
          <View style={{...styles.modalStyle, height: '60%'}}>
            <AntDesign
              name="close"
              size={20}
              color={'#000'}
              style={{
                position: 'absolute',
                right: 10,
                top: 10,
                zIndex: 1,
                backgroundColor: Colors.primary,
                borderRadius: 50,
                padding: 5,
              }}
              onPress={() => setNumberModal(false)}
            />
            <ExportByNumber
              numberModal={numberModal}
              setNumberModal={setNumberModal}
            />
          </View>
        </View>
      </Modal>

      <Modal
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
            <AntDesign
              name="close"
              size={20}
              color={'#000'}
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
            <DeliveryFilter
              filterParams={filterParams}
              setModalVisible={setModalVisible}
              setFilterParams={setFilterParams}
              ReportListAPI={ReportListAPI}
            />
          </View>
        </View>
      </Modal>
    </BaseContainer>
  );
};

export default Delivery;

const styles = StyleSheet.create({
  cartContainer: {
    backgroundColor: 'white',
    elevation: 12,
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal: 10,
    marginTop: 15, 
    elevation: 5, 


  },
  topHeader: {
    backgroundColor: Colors.primary,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  modalStyle: {
    width: '90%',
    height: '70%',
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
  headerText: { 
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 8, 
  },
  headerTextStyle: {
    fontSize: getProportionalFontSize(14),
    fontFamily: fonts.regular,
    color: Colors.black,


  },
  status: { 
    fontSize: getProportionalFontSize(12),
    fontFamily: fonts.semiBold,
    color: Colors.white,
    backgroundColor:Colors.info,
    padding:5, 
    margin:5,
    borderTopLeftRadius:8,
    borderBottomRightRadius:8,
    textAlign:'center', 
    alignSelf:'center',
    elevation:5,
    position: 'absolute',
    right: 5,
    top: 45, 
  },
  useHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    padding:Constants.globalPadding,

  },

  userTextStyle: {
    fontFamily: fonts.semiBold,
    fontSize: getProportionalFontSize(16),
    textTransform: 'capitalize',
    color:Colors.white


  }, 
  msgText:{
    fontFamily: fonts.regular,
    fontSize: getProportionalFontSize(12),
    textTransform: 'capitalize',
    color:Colors.black,
    textAlign:'justify', 
    letterSpacing:0.5,  
    marginTop:10


  }
});
