import {
  StyleSheet,
  Text,
  View,
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
import {FAB, Portal} from 'react-native-paper';
import ExportBySenderId from './ExportBySenderId';
import ExportByNumber from './ExportByNumber';
import Colors from '../../assets/Colors';
import moment from 'moment';
import DropDownComp from '../../components/DropDownComp';
import ListingCard from '../../components/ListingCard';
import FooterCompForFlatlist from '../../components/FooterCompForFlatlist';

const ScheduleCampaign = ({navigation}) => {
  const formFieldsKeys = {
    user_id: 'user_id',
  };

  const initialValues = {
    [formFieldsKeys.user_id]: '',
  };

  const [listData, setListData] = useState([]);
  const [senderIdModal, setSenderIdModal] = useState(false);
  const [numberModal, setNumberModal] = useState(false);
  const [openFAB, setOpenFAB] = useState(false);
  const [formValues, setFormValues] = useState(initialValues);
  const [userData, setUserData] = useState([]);
  const userLogin = useSelector(state => state.global_store.userLogin);
  const [page, setPage] = useState([]); //page number
  const [isRefreshing, setIsRefreshing] = useState(false); //for pull to refresh
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const UserTemplateAPI = async () => {
    let url = Constants.apiEndPoints.users;
    let response = await APIService.postData(
      url,
      {},
      userLogin.access_token,
      null,
      'UserTemplateAPI',
    );
    if (!response.errorMsg) {
      setUserData(response.data.data);
    } else {
      Alert.alert(
        Constants.danger,
        response.errorMsg ?? Constants.somethingWentWrong,
      );
    }
  };

  const handleInputChange = (key, value) => {
    setFormValues({
      ...formValues,
      [key]: value,
    });
  };

  const scheduledCampaignReportAPI = async (page, refresh, addFilter) => {
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
        user_id: formValues?.[formFieldsKeys.user_id]?.id,
      };
    }
    let url = Constants.apiEndPoints.scheduledCampaignReport;
    // return
    let response = await APIService.postData(
      url,
      params,
      userLogin.access_token,
      null,
      'scheduledCampaignReportAPI',
    );

    if (!response.errorMsg) {
      if (!page) {
        setPage(1);
        setListData(response?.data?.data?.data);
        setIsLoading(false);
        if (refresh) setIsRefreshing(false);
      } else {
        let tempListData = [...listData];
        tempListData = tempListData.concat(response.data.data?.data);
        setPage(page);
        setListData([...tempListData]);
        setPaginationLoading(false);
      }
    } else {
      if (!page) setIsLoading(false);
      else setPaginationLoading(false);
      if (refresh) setIsRefreshing(false);
      Alert.alert(
        Constants.danger,
        response.errorMsg ?? 'Something went wrong',
      );
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      scheduledCampaignReportAPI();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    UserTemplateAPI();
  }, []);

  const renderItem = ({item, index}) => {
    const dateTime = moment(item.campaign_send_date_time).format('LL');
    return (
      <View key={index}>
        <ListingCard
          showMenu={false}
          title={item?.campaign}
          subTitle={dateTime}
          ContactInfo={item?.total_contacts}
          CreditInfo={item?.total_credit_deduct}
          showSecondaryTitle={true}
          cardLabels={item?.status}
        />
      </View>
    );
  };
  return (
    <BaseContainer
      title="Schedule Campaign"
      leftIcon="arrow-back"
      onPressLeftIcon={() => navigation.goBack()}>
      {userLogin?.userType !== 2 && (
        <View style={styles.container}>
          <DropDownComp
            data={userData}
            onPressItem={item => {
              handleInputChange(formFieldsKeys.user_id, item);
              scheduledCampaignReportAPI(null, null, true);
            }}
            value={formValues?.[formFieldsKeys.user_id]?.id}
            keyToShowData="name"
            keyToCompareData="id"
            placeHolder="Select User"
            isSearch="Search User..."
          />
        </View>
      )}
      <FlatList
        data={Array.isArray(listData) ? listData : []}
        renderItem={renderItem}
        ListEmptyComponent={<EmptyList />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 200,
          padding: Constants.globalPadding,
        }}
        keyExtractor={item => item.id}
        onEndReached={() => {
          scheduledCampaignReportAPI(page + 1, null, false);
        }}
        onEndReachedThreshold={0.1}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => {
              scheduledCampaignReportAPI(null, true);
            }}
          />
        }
        ListFooterComponent={() => (
          <FooterCompForFlatlist paginationLoading={paginationLoading} />
        )}
      />
      <FAB.Group
        style={{marginBottom: 100}}
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
        icon={openFAB ? 'close' : 'calendar-export'}
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
          style={styles.modalStyle1}>
          <View style={styles.modalStyle}>
            <AntDesign
              name="close"
              size={20}
              color={'#000'}
              style={styles.closeIcon}
              onPress={() => setSenderIdModal(false)}
            />

            <ExportBySenderId setSenderIdModal={setSenderIdModal} />
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={numberModal}
        onRequestClose={() => setNumberModal(false)}>
        <View
         style={styles.modalStyle1}>
          <View style={styles.modalStyle}>
            <AntDesign
              name="close"
              size={20}
              color={'#000'}
              style={styles.closeIcon}
              onPress={() => setNumberModal(false)}
            />

            <ExportByNumber
              numberModal={numberModal}
              setNumberModal={setNumberModal}
            />
          </View>
        </View>
      </Modal>
    </BaseContainer>
  );
};

export default ScheduleCampaign;

const styles = StyleSheet.create({
  cartContainer: {
    flex: 1,
    padding: 10,
    margin: 10,
    backgroundColor: '#fff',
    borderTopEndRadius: 20,
    borderBottomStartRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  closeIcon: {
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 50,
    padding: 5,
  },
  container: {
    padding: Constants.globalPadding,
    backgroundColor: Colors.white, 
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5, 
    borderRadius: 10, 
    margin: Constants.globalPadding,
 
        
   
  },
  modalStyle: {
    width: '90%',
    height: '60%',
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
    modalStyle1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        width: '100%',
        height: '100%',
    },
  innerContainer: {
    borderTopStartRadius: 20,
    borderBottomEndRadius: 20,
    backgroundColor: Colors.extraDarkPrimary,
    padding: 5,
    alignItems: 'center',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 8,
    padding: 10,
    fontFamily: fonts.medium,
    color: '#995c00',
  },

  userTextStyle: {
    fontFamily: fonts.semiBold,
    padding: 8,
  },
  smsText: {
    alignItems: 'center',
    fontFamily: fonts.regular,
    padding: 10,
    // height: 65
  },
  btn: {
    padding: 10,
    fontFamily: fonts.boldItalic,
    borderRadius: 10,
    backgroundColor: '#FFAD33',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center', 
    marginVertical: 20, 
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 22, 
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 100, 
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
