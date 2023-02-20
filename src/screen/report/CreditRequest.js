import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Modal as RNModal,
  Alert,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import {useSelector} from 'react-redux';
import APIService from '../../Services/APIService';
import Constants from '../../constant/Constants';
import BaseContainer from '../../components/BaseContainer';
import {fonts} from '../../assets/Assets';
import AddCreditFilter from './AddCreditFilter';
import EmptyList from '../../components/EmptyList';
import FooterCompForFlatlist from '../../components/FooterCompForFlatlist';
import ListLoader from '../../components/ListLoader';
import Colors from '../../assets/Colors';
import {Modal, Portal, Button, FAB} from 'react-native-paper';
import InputValidation from '../../components/InputValidation';
import CustomButton from '../../components/CustomButton';
import {getProportionalFontSize} from '../../Services/CommonMethods';

const CreditRequest = ({navigation}) => {
  const [filterParams, setFilterParams] = useState({});
  const [listData, setListData] = useState([]);
  const userLogin = useSelector(state => state.global_store.userLogin);
  const [modalVisible, setModalVisible] = useState(false);
  const [page, setPage] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [visible, setVisible] = React.useState(false);
  const [isReply, setIsReply] = useState();

  const creditRequestsListAPI = async (page, refresh, addFilter) => {
    if (refresh) setIsRefreshing(true);
    else if (!page) setIsLoading(true);
    else setPaginationLoading(true);
    let params = {
      page: page ? page : 1,
      per_page_record: 10,
    };
    if (addFilter)
      params = {
        ...params,
        credit_request: filterParams?.credit_request ?? '',
        route_type: filterParams?.route_type?.id ?? '',
      };
    let url = Constants.apiEndPoints.creditRequestsList;
    console.log('url', url, params);
    // return
    let response = await APIService.postData(
      url,
      params,
      userLogin.access_token,
      null,
      'creditRequestsListAPI',
    );

    if (!response.errorMsg) {
      if (!page) {
        setPage(1);
        setListData(response.data.data?.data);
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
      Alert.alert(Constants.danger, response.errorMsg);
    }
  };

  const replyUserCredit = async id => {
    let params = {
      credit_request_id: id,
      request_reply: 'na',
    };
    let url = Constants.apiEndPoints.userCreditRequestReply;
    console.log('url', url, params);
    // return
    let response = await APIService.postData(
      url,
      params,
      userLogin.access_token,
      null,
      'replyUserCredit',
    );

    if (!response.errorMsg) {
      setVisible(false);
      creditRequestsListAPI();
      Alert.alert(
        Constants.success,
        response.data.message ?? 'Reply sent successfully',
      );
    } else {
      Alert.alert(
        Constants.danger,
        response.errorMsg ?? 'Something went wrong',
      );
    }
  };

  const renderItemList = ({item}) => (
    <View style={styles.cardContainer}>
      <View style={styles.leftContent}>
        <Text style={styles.cardTitle}>
          {item?.created_by?.name.slice()[0].toUpperCase()}
        </Text>
      </View>
      <View style={styles.centerContent}>
        <Text
          style={{
            fontSize: getProportionalFontSize(18),
            color: Colors.black,
            textTransform: 'capitalize',
            fontFamily: fonts.semiBold,
          }}
        >
          {item?.created_by?.name}
        </Text>
        <Text
          style={styles.cardSubTitle}
        >
          Credit Request : <Text style={{color:Colors.gray}}>{item?.credit_request}</Text>
        </Text>
        <Text
         style={styles.cardSubTitle}
        >
          Route Type :
          <Text style={{color:Colors.gray}}>
          {(item.route_type == 1 ? 'Transactional' : null) ||
            (item.route_type == 2 ? 'Promotional' : null) ||
            (item.route_type == 3 ? 'Two way SMS' : null) ||
            (item.route_type == 4 ? 'Voice' : null)}
            </Text>
        </Text>
      </View>

      <TouchableOpacity
        style={styles.rightContent}
        onPress={() => {
          setVisible(true);
          setIsReply(item.id);
        }}
      >
        <Entypo
          name="reply"
          size={20}
          color="#000"
          style={{
            transform: [{rotate: '180deg'}],
          }}
        />
      </TouchableOpacity>
    </View>
  );

  useEffect(() => {
    creditRequestsListAPI(null, null, true);
  }, [filterParams]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      creditRequestsListAPI();
    });
    return unsubscribe;
  }, [navigation]);

  if (isLoading) {
    return <ListLoader />;
  }

  return (
    <BaseContainer
      title="Credit Requests"
      leftIcon="arrow-back"
      onPressRightIcon={() => setModalVisible(true)}
      rightIcon="filter-list"
      onPressLeftIcon={() => navigation.goBack()}
    >
      <FlatList
        data={listData}
        renderItem={renderItemList}
        ListEmptyComponent={<EmptyList />}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        keyExtractor={item => item.id}
        onEndReached={() => {
          creditRequestsListAPI(page + 1, null, true);
        }}
        onEndReachedThreshold={0.1}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => {
              creditRequestsListAPI(null, true);
            }}
          />
        }
        ListFooterComponent={() => (
          <FooterCompForFlatlist paginationLoading={paginationLoading} />
        )}
      />
      {(userLogin?.userType === 1 || userLogin?.userType === 2) && (
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => navigation.navigate('AddCredit')}
        />
      )}

      <RNModal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <AntDesign
              onPress={() => setModalVisible(false)}
              style={styles.iconStyle}
              name="close"
              size={20}
              color={Colors.black}
            />
            <AddCreditFilter
              filterParams={filterParams}
              setFilterParams={setFilterParams}
              modalVisible={modalVisible}
              setModalVisible={setModalVisible}
              creditRequestsListAPI={creditRequestsListAPI}
            />
          </View>
        </View>
      </RNModal>

      <Portal>
        <Modal
          visible={visible}
          onDismiss={() => setVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Entypo
            name="circle-with-cross"
            size={25}
            color="black"
            style={styles.btnStyle}
            onPress={() => setVisible(false)}
          />
          <InputValidation
            multiline={true}
            placeHolder={'Request Reply'}
            label={'Request Reply'} 
            value={replyText}
            onChangeText={text => setReplyText(text)}
            inputStyle={styles.inputReply}
          />
          <CustomButton
            title={'Reply'}
            onPress={() => {
              if(replyText == ''){
                Alert.alert(Constants.danger, 'Please enter reply');
              }else{
                replyUserCredit(isReply);
              } 
            }}
          />
        </Modal>
      </Portal>
    </BaseContainer>
  );
};
export default CreditRequest;

const styles = StyleSheet.create({
  iconStyle: {
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 1,
    backgroundColor: Colors.primary,
    padding: 3,
    borderRadius: 10,
  },
  cardContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    height: 100,
    elevation: 5,
  },
  cardSubTitle:{
    fontSize: getProportionalFontSize(14),
    fontFamily: fonts.medium,
    color: Colors.black,
  },
  cardTitle: {
    fontSize: getProportionalFontSize(25),
    fontWeight: 'bold',
    color: '#fff',
    lineHeight: 30,
  },
  leftContent: {
    backgroundColor: Colors.primary,
    width: 60,
    height: 60,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  centerContent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  rightContent: {
    backgroundColor: Colors.primary,
    width: 25,
    height: 25,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: '100%',
    height: '100%',
  },

  modalView: {
    width: '90%',
    height: '40%',
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 65,
    backgroundColor: '#ffa31a',
  },
  inputReply: {
    maxHeight: 110,
    minHeight: 110,
    textAlignVertical: 'top',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignSelf: 'center',
    marginBottom: 50,
  },
  btnStyle: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
});
