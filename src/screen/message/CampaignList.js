import {
  Text,
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  Linking,
  RefreshControl,
  Alert,
  StyleSheet
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import BaseContainer from '../../components/BaseContainer';
import APIService from '../../Services/APIService';
import Constants from '../../constant/Constants';
import {useSelector} from 'react-redux';
import EmptyList from '../../components/EmptyList';
import FooterCompForFlatlist from '../../components/FooterCompForFlatlist';
import CampaignFilter from './CampaignFilter';
import CustomButton from '../../components/CustomButton';
import moment from 'moment';
import ListLoader from '../../components/ListLoader';
import ListingCard from '../../components/ListingCard';
import Colors from '../../assets/Colors';
import { getProportionalFontSize } from '../../Services/CommonMethods';

const CampaignList = (props) => { 
  const [listData, setListData] = useState([]);
  const [page, setPage] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [paginationLoading, setPaginationLoading] = useState(false); 
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isReadMore, setIsReadMore] = useState();
  const [transparency, setTransparency] = useState({}); 
  const [modalVisible, setModalVisible] = useState(false); 
  const [filterData, setFilterData] = useState({}); 
  const userLogin = useSelector(state => state.global_store.userLogin); 
 
  const campaignListAPI = async (page, refresh, addFilter) => { 
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
      };
    }

    let url = Constants.apiEndPoints.campaignList; 
    // return
    let response = await APIService.postData(
      url,
      params,
      userLogin.access_token,
      null,
      'campaignListAPI',
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
      Alert.alert(Constants.danger, response.errorMsg??'Something went wrong');
    }
  };

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      campaignListAPI();
    });
    return unsubscribe;
  }, [props.navigation]); 

   
  useEffect(() => {
    campaignListAPI(null,null,true);
  }, [filterData]); 
  
 


  const reportExportByIdAPI = async id => {
    const params = {
      send_sms_id: id,
    };
    const url = Constants.apiEndPoints.reportExportById;
    // return
    let response = await APIService.postData(
      url,
      params,
      userLogin.access_token,
      null,
      'reportExportByIdAPI',
    );
    if (!response.errorMsg) {
      if (response?.data?.data?.file_path) {
        Linking.openURL(Constants?.base_url2 + response?.data?.data?.file_path);
      } else {
        Alert.alert('File not found');
      }
    } else {
      Alert.alert(response.errorMsg);
    }
  };

  const StatStatusStopAPI = async item => {
    const params = {
      send_sms_id: item,
    };
    const url = Constants.apiEndPoints.changeCampaignStatusToStop; 
    // return
    let response = await APIService.postData(
      url,
      params,
      userLogin.access_token,
      null,
      'StatStatusStopAPI',
    );
    if (response) {
      return;
    } else {
      Alert.alert(response.errorMsg);
    }
  };

  const statusComplete = async id => {
    const url = Constants.apiEndPoints.ChangeCompaginStatusToComplete + '/' + id;
    // return
    let response = await APIService.getData(
      url,
      userLogin.access_token,
      null,
      'statusComplete',
    );
    if (!response.errorMsg) {
      campaignListAPI();
      setTransparency(null);
      Alert.alert(Constants.success, 'Campaign status changed successfully');
    } else {
      Alert.alert(
        Constants.danger,
        response.errorMsg ?? 'Something went wrong',
      );
    }
  };
  const statusStop = async id => {
    const url = Constants.apiEndPoints.ChangeCompaginStatusToStop;
    // return
    let response = await APIService.postData(
      url,
      {send_sms_id: id},
      userLogin.access_token,
      null,
      'statusStop',
    );
    if (!response.errorMsg) {
      campaignListAPI();
      setTransparency(null);
      Alert.alert(Constants.success,response.message?? 'Campaign status changed successfully');
    } else {
      Alert.alert(
        Constants.danger,
        response.errorMsg ?? 'Something went wrong',
      );
    }
  };
const AlertStop = (id) => {
  Alert.alert(
    "Stop Campaign",
    "Are you sure you want to stop this campaign?",
    [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel"
      },
      { text: "OK", onPress: () => statusStop(id) }
    ]
  );
}  
  const customAlert = id => {
    Alert.alert(
      'Are you sure?',
      'You want to complete this campaign',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => statusComplete(id)},
      ],
      {cancelable: false},
    );
  };

  const messageBody = (item, index) => (
    <View
      style={{
        flex: 1,
      }}>
      {index !== isReadMore ? (
        <Text numberOfLines={2}>
          {item.message.length < 100
            ? `${item.message}`
            : `${item.message.substring(0, 97)}...`}
        </Text>
      ) : (
        <Text>{item.message}</Text>
      )}

      <TouchableOpacity
        onPress={
          index == isReadMore
            ? () => setIsReadMore(null)
            : () => setIsReadMore(index)
        }>
        <Text style={{ color: Colors.blue, fontSize: getProportionalFontSize(12)}}>
          {index !== isReadMore ? ' ...read more' : '...read less'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({item, index}) => { 
    console.log('item',item);
    return (
      <ListingCard
        showMenu={true}
        setOpenCardOptions={true}
        index={index}
        isTreeDot={true}
        onPressMenu={() => setTransparency(index)}
        transparency={transparency}
        setTransparency={setTransparency}
        title={item.campaign}
        subTitle={moment(item.campaign_send_date_time).fromNow()}
        isContact={item.total_contacts}
        isCredit={item.total_credit_deduct}
        status={item.status}
        userLogin={userLogin?.userType==0 || userLogin?.userType==3}
        messageBody={() => messageBody(item, index)}
        showSecondaryTitle={true}
        cardLabels={item.status}
        isTrue={item.status=='Completed'||item.status=='Ready-to-complete'||item.status=='Stop'}
        isFalse={item.status=='Pending'}
        completeAction={()=>  customAlert(item.id)} 
        stopAction={()=>AlertStop(item.id)}
        
        manageCompaign={() => {
          props.navigation.navigate('ManageCampaign', {itemId: item});
          setTransparency(null);
        }}
        viewDetails={() => {
          props.navigation.navigate('CampaignDetailPage', {itemId: item});
          setTransparency(null);
        }}
        isDivider={true}
        StatStatusStopAPI={() => StatStatusStopAPI(item.id)}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            bottom: 10,
          }}>
          <CustomButton
            title="Export by Id"
            onPress={() => reportExportByIdAPI(item.id)}
            style={{width: '45%'}}
            isIcon={<AntDesign name="download" color="#fff" size={18} />} 
          />
          <CustomButton
            title="Resend"
            onPress={() =>
              props.navigation.navigate('ResendCampaign', {itemId: item})
            }
            style={{width: '45%'}}
            isIcon={<AntDesign name="sharealt" color="#fff" size={18} />} 
          />
        </View>
      </ListingCard>
    );
  };
  if (isLoading) {
    return <ListLoader />;
  }

  return (
    <BaseContainer
      title="Campaign List"
      leftIcon="arrow-back"
      onPressLeftIcon={() => props.navigation.goBack()}
      onPressRightIcon={() =>  setModalVisible(true)}
      rightIcon="filter-list"> 

      <FlatList
        data={listData??[]}
        renderItem={renderItem}
        ListEmptyComponent={<EmptyList />}
        contentContainerStyle={{ 
          padding:Constants.globalPadding,
          paddingBottom: 200, 
        }}
        keyExtractor={item => item.id}
        onEndReached={() => { 
          campaignListAPI(page + 1,null, true);
        }}
        onEndReachedThreshold={0.1}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => {
              campaignListAPI(null, true);
            }}
          />
        }
        ListFooterComponent={() => (
          <FooterCompForFlatlist paginationLoading={paginationLoading} />
        )}
      /> 
        <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
         <View
          style={styles.modalView1}> 
          <View style={styles.modalView}> 
                <AntDesign name="close" size={20} color={'#000'} 
                 style={styles.closeIcon}
                onPress={() => setModalVisible(false)}
                />  
                <CampaignFilter
                  filterData={filterData}
                  setFilterData={setFilterData}
                  modalVisible={modalVisible} 
                  setModalVisible={setModalVisible}
                  campaignListAPI={campaignListAPI}
                />  
          </View>
        </View>
      </Modal>
    </BaseContainer>
  );
};

export default CampaignList;
const styles = StyleSheet.create({
  modalView: {
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
  closeIcon:{
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 50,
    padding: 5,
  },
  modalView1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',   
    width: '100%',
    height: '100%', 
  },
});
