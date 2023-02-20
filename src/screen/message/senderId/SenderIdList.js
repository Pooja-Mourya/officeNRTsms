import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  RefreshControl,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {fonts} from '../../../assets/Assets';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useSelector} from 'react-redux';
import Constants from '../../../constant/Constants';
import APIService from '../../../Services/APIService';
import {FAB, Portal, Button} from 'react-native-paper';
import BaseContainer from '../../../components/BaseContainer';
import EmptyList from '../../../components/EmptyList';
import FooterCompForFlatlist from '../../../components/FooterCompForFlatlist';
import ListLoader from '../../../components/ListLoader';
import Colors from '../../../assets/Colors';
import ListingCard from '../../../components/ListingCard';
import SenderFilter from './SenderFilter';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {getProportionalFontSize} from '../../../Services/CommonMethods';

const SenderIdList = ({navigation}) => {
  const [listData, setListData] = useState([]);
  const userLogin = useSelector(state => state.global_store.userLogin);
  // console.log()
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [openFAB, setOpenFAB] = React.useState(false);
  const [filterData, setFilterData] = useState({});
  const [selected, setSelected] = useState([]);

  const handleDeleteBtnAPI = async id => {
    let url = Constants.apiEndPoints.manageSenderId + '/' + id;
    // return
    let response = await APIService.deleteData(
      url,
      userLogin.access_token,
      null,
      'DliTemplateDelete',
    );
    if (!response.errorMsg) {
      ManageSenderIdAPI();
      Alert.alert(
        Constants.success,
        response.message ?? 'Deleted Successfully',
      );
    } else {
      Alert.alert(
        Constants.danger,
        response.errorMsg ?? 'Something went wrong',
      );
    }
  };

  const deleteAlert = id => {
    Alert.alert(
      'Delete',
      'Are you sure you want to delete this record?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => handleDeleteBtnAPI(id)},
      ],
      {cancelable: false},
    );
  };

  const ManageSenderIdAPI = async (page, refresh, addFilter) => {
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
      };
    }
    let url = Constants.apiEndPoints.ManageSenderId;
    let response = await APIService.postData(
      url,
      params,
      userLogin.access_token,
      null,
      'ManageSenderIdAPI',
    );

    if (!response.errorMsg) {
      if (!page) {
        setPage(1);
        setListData(response.data.data.data);
        setIsLoading(false);
        if (refresh) setIsRefreshing(false);
      } else {
        let tempListData = [...listData];
        tempListData = tempListData.concat(response.data.data.data);
        setPage(page);
        setListData([...tempListData]);
        setPaginationLoading(false);
      }
    } else {
      if (!page) setIsLoading(false);
      else setPaginationLoading(false);
      if (refresh) setIsRefreshing(false);
      Alert.showAlert(Constants.danger, response.errorMsg);
    }
  };

  const isSelection = item => {
    let temp = [...selected];
    if (temp.find(a => a == item.id)) {
      temp = temp.filter(a => a != item.id);
    } else {
      temp.push(item.id);
    }
    setSelected(temp);
  };

  const userAction = () => {
    let url = Constants.apiEndPoints.senderIdAction;
    let params = {
      status: 1,
      manage_sender_ids: selected,
    };
    console.log(url, params);
    // return
    let response = APIService.postData(
      url,
      params,
      userLogin.access_token,
      null,
      'userAction',
    );
    if (!response.errorMsg) {
      setSelected([]);
      ManageSenderIdAPI();
      Alert.alert(
        Constants.success,
        response.message ?? 'User action performed successfully',
      );
    } else {
      setSelected([]);
      Alert.alert(
        Constants.danger,
        response.errorMsg ?? 'Something went wrong',
      );
    }
  };

  const renderItemList = ({item, index}) => (
    <ListingCard
      showMenu={false}
      title={item.company_name}
      onPress={() => isSelection(item)}
      sender_id={item?.sender_id}
      header_id={item?.header_id}
      entity_id={item?.entity_id}
      onPressMenu={() => setModalVisible(true)}
      showSecondaryTitle={true}
      cardLabels={item.status == 1 ? 'Active' : 'Inactive'}
      is_approved={item.status == 1 ? true : false}
      isDelete={() => deleteAlert(item.id)}
      isEdit={() => navigation.navigate('SenderId', {itemId: item})}
      categoryTypeCard={{
        elevation: selected.includes(item.id) ? 0 : 5,
        backgroundColor: selected.find(a => a == item.id)
          ? 'rgba(0,0,0,0.5)'
          : '#fff',
      }}
    />
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      ManageSenderIdAPI();
    });
    return unsubscribe;
  }, [navigation]);
  useEffect(() => {
    ManageSenderIdAPI(null, null, true);
  }, [filterData]);

  if (isLoading) {
    return <ListLoader />;
  }
  return (
    <BaseContainer
      title="Sender Id List"
      leftIcon="arrow-back"
      onPressRightIcon={() => setModalVisible(true)}
      rightIcon="filter-list"
      onPressLeftIcon={() => {
        navigation.pop();
      }}>
      {!selected.length == 0 && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginHorizontal: 10,
            marginTop: 10,
          }}>
          <Button
            icon="check"
            mode="contained"
            Active
            onPress={() => userAction()}>
            Active
          </Button>
          <BouncyCheckbox
            size={25}
            fillColor="#00BFFF"
            unfillColor="#FFFFFF"
            text="Select All"
            textStyle={{
              fontSize: getProportionalFontSize(14),
              color: '#000000',
              fontFamily: fonts.semiBold,
            }}
            style={{
              margin: 5,
              padding: 8,
              borderRadius: 5,
              borderWidth: 1,
              borderColor: '#000000',
              backgroundColor: '#FFFFFF',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              let temp = listData.map(item => item.id);
              selected.length == temp.length
                ? setSelected([])
                : setSelected(temp);
            }}
          />
        </View>
      )}
      <FlatList
        data={listData}
        renderItem={renderItemList}
        ListEmptyComponent={<EmptyList />}
        contentContainerStyle={{
          paddingBottom: 200,
          marginBottom: 100,
          borderWidth: 0,
          paddingVertical: Constants.globalPaddingVetical,
          paddingHorizontal: Constants.globalPaddingHorizontal,
          marginBottom: 200,
        }}
        keyExtractor={item => item.id}
        onEndReached={() => {
          ManageSenderIdAPI(page + 1, null, true);
        }}
        onEndReachedThreshold={0.1}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => {
              ManageSenderIdAPI(null, true);
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
            <AntDesign
              name="close"
              size={20}
              color={'#000'}
              onPress={() => setModalVisible(false)}
              style={styles.closeIcon}
            />
            <SenderFilter
              filterData={filterData}
              setFilterData={setFilterData}
              modalVisible={modalVisible}
              setModalVisible={setModalVisible}
              ManageSenderIdAPI={ManageSenderIdAPI}
            />
          </View>
        </View>
      </Modal>

      <FAB.Group
        style={{
          flex: 1,
          marginBottom: 70,
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
        }}
        actions={[
          {
            icon: 'plus',
            label: 'Add Sender Id',
            onPress: () => navigation.navigate('SenderId'),
          },
          {
            icon: 'account-group',
            label:
              userLogin?.userType === 0 || userLogin?.userType === 3
                ? 'Assign Sender Id'
                : 'NA',
            onPress: () => {
              if (userLogin?.userType === 0 || userLogin?.userType === 3) {
                navigation.navigate('AssignSenderId');
              } else {
                Alert.alert(
                  Constants.danger,
                  'You are not authorized to access this page',
                );
              }
            },
          },
        ]}
        fabStyle={{backgroundColor: Colors.primary}}
        open={openFAB}
        icon={openFAB ? 'close' : 'plus'}
        color={Colors.white}
        onStateChange={open => {
          if (openFAB) setOpenFAB(false);
          else setOpenFAB(true);
        }}
      />
    </BaseContainer>
  );
};
export default SenderIdList;
const styles = StyleSheet.create({
  closeIcon: {
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
});
