import {
  StyleSheet,
  Text,
  View,
  Alert,
  FlatList,
  RefreshControl,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal as NativeModal
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Constants from '../../../constant/Constants';
import APIService from '../../../Services/APIService';
import { useSelector } from 'react-redux';
import BaseContainer from '../../../components/BaseContainer';
import Feather from 'react-native-vector-icons/Feather';
import EmptyList from '../../../components/EmptyList';
import {getProportionalFontSize,checkUrlFormat} from '../../../Services/CommonMethods';
import Colors from '../../../assets/Colors';
import Entypo from 'react-native-vector-icons/Entypo';
import Fontisto from 'react-native-vector-icons/Fontisto';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FooterCompForFlatlist from '../../../components/FooterCompForFlatlist';
import ListLoader from '../../../components/ListLoader';
import { FAB, Portal, Button, Modal } from 'react-native-paper';
import CustomButton from '../../../components/CustomButton';
import InputValidation from '../../../components/InputValidation';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { fonts } from '../../../assets/Assets';
import UserManageFilter from './UserManageFilter';

const UserManagement = ({ navigation }) => {
  const [usersData, setUserData] = useState();
  const [isLoading, setLoading] = useState(true);
  const userLogin = useSelector(state => state.global_store.userLogin);
  const [modalVisible, setModalVisible] = useState(false);
  const [page, setPage] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [modal, setModal] = useState();
  const [visible, setVisible] = React.useState(false);
  const [ration, setRatio] = useState('');
  const [value, setValue] = useState({});
  const [selected, setSelected] = useState([]);
  const [openFAB, setOpenFAB] = useState(false); 
  const [filterData, setFilterData] = useState({}); 


  useEffect(() => {
    getUsers(null, null, true);
  }, [filterData]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getUsers();
    });
    return unsubscribe;
  }, [navigation]);

  const getUsers = async (page, refresh, addFilter) => {
    let params = {
      page: page ? page : 1,
      per_page_record: 10,
    };
    if (addFilter) {
      params = {
        ...params, 
        ...filterData,  
      }
    } 
    if (refresh) setIsRefreshing(true);
    else if (!page) setLoading(true);
    else setPaginationLoading(true);
    let url = Constants.apiEndPoints.users;
    let response = await APIService.postData(
      url,
      params,
      userLogin.access_token,
      null,
      'UserManagement',
    );
    if (!response.errorMsg) {
      if (!page) {
        setPage(1);
        setUserData(response?.data?.data?.data);
        setLoading(false);
        if (refresh) setIsRefreshing(false);
      } else {
        let tempListData = [...usersData];
        tempListData = tempListData.concat(response?.data?.data?.data);

        setPage(page);
        setUserData([...tempListData]);
        setPaginationLoading(false);
      }
    } else {
      if (!page) setLoading(false);
      else setPaginationLoading(false);
      if (refresh) setIsRefreshing(false);
      Alert.alert(Constants.danger, response.errorMsg);
    }
  };

  const deleteUser = async (id, index) => {
    setLoading(true);
    let url = Constants.apiEndPoints['user'] + '/' + id;
    let response = await APIService.deleteData(
      url,
      userLogin.access_token,
      null,
      'deleteUser',
    );
    if (!response.errorMsg) {
      setLoading(false);
      let tempListData = [...usersData];
      tempListData.splice(index, 1);
      setUserData([...tempListData]);
      getUsers();
      Alert.alert(Constants.success, 'User deleted successfully');
    } else {
      setLoading(false);
      Alert.alert(Constants.danger, response.errorMsg);
    }
  }; 
  const deleteAlert = id => {
    Alert.alert(
      'Delete User',
      'Are you sure you want to delete this user?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            deleteUser(id);
            setModal();
          },
        },
      ],
      { cancelable: false },
    );
  };

  const handleRatio = id => {
    let params = {
      ratio: ration,
      user_id: id,
    };
    let url = Constants.apiEndPoints.setRatio;
    console.log(url, params);
    // return
    let response = APIService.postData(
      url,
      params,
      userLogin.access_token,
      null,
      'setRatio',
    );

    if (!response.errorMsg) {
      setVisible(false);
      getUsers();
      setRatio('');
      setModal();
      setValue({});
      Alert.alert(
        Constants.success,
        response.message ?? 'Ratio set successfully',
      );
    } else {
      setVisible(false);
      getUsers();
      setModal();
      setValue({});
      setRatio('');
      Alert.alert(
        Constants.danger,
        response.errorMsg ?? 'Something went wrong',
      );
    }
  };

  const userAction = (id) => {
    let url = Constants.apiEndPoints.userAction;
    let params = {
      status: 1,
      user_ids: selected,
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
      getUsers();
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


  const isSelection = (item) => {
    let temp = [...selected];
    if (temp.find(a => a == item.id)) {
      temp = temp.filter(a => a != item.id);
    } else {
      temp.push(item.id);
    }
    setSelected(temp);
  }

  const assignroute = () => {
    userLogin?.userType == 0 || userLogin?.userType == 2 ? navigation.navigate('AssignRoute', { user: null }) : Alert.alert(Constants.danger, 'You are not authorized to perform this action')

  };

  if (isLoading) {
    return <ListLoader />;
  }
  return (
    <BaseContainer
      title="User Management"
      leftIcon="arrow-back"
      rightIcon="filter-list"
      right={[]}
      onPressLeftIcon={() => navigation.goBack()}
      onPressRightIcon={() => setModalVisible(true)} >
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
            labelStyle={{ 
              fontSize:getProportionalFontSize(12), 
              fontFamily: fonts.semiBold, 
             }}
            onPress={() => userAction()}>
              Activate
                </Button> 
          <BouncyCheckbox
            size={20}
            fillColor="#00BFFF"
            unfillColor="#FFFFFF"
            text="Select All"
            textStyle={{
              fontSize: getProportionalFontSize(12), 
              fontFamily: fonts.semiBold,
              color:Colors.black
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
              let temp = usersData.map(item => item.id);
              selected.length == temp.length
                ? setSelected([])
                : setSelected(temp);
            }}
          />
        </View>
      )}
      <FlatList
        data={usersData}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item, index }) => {
          return (
            <>
              {modal == item.id ? (
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 999,
                    height: 100,
                    padding: 10,
                    margin: 10,
                    borderRadius: 10,
                  }}>
                  <EvilIcons
                    name="close-o"
                    size={27}
                    color="#fff"
                    style={{
                      position: 'absolute',
                      right: 5,
                      top: 5,
                      zIndex: modal ? 5 : 0,
                    }}
                    onPress={() => setModal()}
                  />
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-evenly',
                      alignItems: 'center',
                      width: '100%',
                    }}>
                    <Feather
                      name="edit"
                      size={20}
                      color="white"
                      style={styles.buttonStyle}
                      onPress={() => {
                        navigation.navigate('UserAddFrom', { user: item });
                        setModal();
                      }}
                    />

                    <AntDesign
                      name="delete"
                      size={20}
                      color="white"
                      style={styles.buttonStyle}
                      onPress={() => deleteAlert(item.id)}
                    />
                    <AntDesign
                      name="eye"
                      size={20}
                      color="white"
                      style={styles.buttonStyle}
                      onPress={() => {
                        navigation.navigate('UserDetail', { user: item });
                        setModal();
                      }}
                    />
                    {userLogin?.userType == 0 || userLogin?.userType == 2 ? <AntDesign
                      name="wifi"
                      size={20}
                      color="white"
                      style={styles.buttonStyle}
                      onPress={() => {
                        setVisible(true);
                        setValue(item);
                      }}
                    /> : null}
                    <Fontisto
                      name="locked"
                      size={20}
                      color="white"
                      style={styles.buttonStyle}
                      onPress={() => {
                        navigation.navigate('ChangePassword', { user: item.id });
                        setModal();
                      }}
                    />
                  </View>
                </View>
              ) : null}
              <TouchableOpacity
                style={{
                  ...styles.cardContainer,
                  elevation: selected.includes(item.id) ? 0 : 5,
                  backgroundColor: selected.find(a => a == item.id)
                    ? 'rgba(0,0,0,0.5)'
                    : '#fff',
                }}
                onPress={() => isSelection(item)}>
                <View style={styles.leftContent}>
                  {!checkUrlFormat(item?.companyLogo) ? (
                    <Image
                      source={{ uri: Constants.base_url2 + item.companyLogo }}
                      style={styles.image}
                    />
                  ) : (
                    <Text style={styles.cardTitle}>
                      {item?.name?.slice()[0].toUpperCase()}
                    </Text>
                  )}
                </View>
                <View style={styles.centerContent}>
                  <Text
                    style={{
                      fontSize: getProportionalFontSize(18),
                      fontWeight: 'bold',
                      color: Colors.black,
                      textTransform: 'capitalize',  
                    }}>
                    {item.name}
                  </Text>
                  <Text>{item.username}</Text>
                </View>
                <TouchableOpacity
                  style={styles.rightContent}
                  onPress={() => selected.length == 0 ? setModal(item.id) : isSelection(item)}>
                  <Entypo
                    name="dots-three-vertical"
                    size={18}
                    color={Colors.black}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            </>
          );
        }}
        ListEmptyComponent={() => <EmptyList />}
        onEndReached={() => {
          getUsers(page + 1, null, true);
        }}
        onEndReachedThreshold={0.1}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => getUsers(null, true)}
          />
        }
        ListFooterComponent={() => (
          <FooterCompForFlatlist paginationLoading={paginationLoading} />
        )}
      />


      <FAB.Group
        style={{ paddingBottom: 100 }}
        actions={[
          {
            icon: 'plus',
            label: 'Add User',
            onPress: () => navigation.navigate('UserAddFrom', { user: null })
          },
          {
            icon: 'import',
            label: userLogin?.userType === 0 ? 'Assign Route' : 'NA',
            onPress: () => userLogin?.userType === 0 ? assignroute() : null,
          },
        ]}
        fabStyle={{ backgroundColor: Colors.primary }}
        open={openFAB}
        icon={openFAB ? 'close' : 'plus'}
        color={Colors.white}
        onStateChange={() => {
          if (openFAB) setOpenFAB(false);
          else setOpenFAB(true);
        }}
      />




      <NativeModal
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
            <UserManageFilter
              filterData={filterData}
              setFilterData={setFilterData}
              setModalVisible={setModalVisible}
              getUsers={getUsers}
            />
          </View>
        </View>
      </NativeModal>


      <Portal>
        <Modal
          visible={visible}
          onDismiss={() => setVisible(false)}
          contentContainerStyle={{
            backgroundColor: 'white',
            padding: 10,
            borderRadius: 10,
            height: 200,
            width: 300,
            alignSelf: 'center',
            justifyContent: 'center',
            marginBottom: 100,
          }}>
          <Entypo
            name="circle-with-cross"
            size={26}
            color="black"
            style={{ position: 'absolute', right: 10, top: 10, zIndex: 5 }}
            onPress={() => setVisible(false)}
          />
          <InputValidation  
            label="Set Ratio"
            value={ration}
            placeHolder="Enter Ratio"
            onChangeText={value => {
              setRatio(value);
            }}
          />
          {
            !ration && <Text style={{ color: 'red', fontSize: 12  }}>Please Enter Ratio</Text> 
          }
           
          <CustomButton title="Apply" onPress={() =>{
            if(ration){
             handleRatio(value?.id)
            }
          }} />
        </Modal>
      </Portal>
    </BaseContainer>
  );
};

export default UserManagement;

const styles = StyleSheet.create({
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    height: 100,
    elevation: 5,  
  },
  leftContent: {
    backgroundColor: Colors.primary,
    width: 60,
    height: 60,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
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
  cardTitle: {
    fontSize: getProportionalFontSize(25),
    fontWeight: 'bold',
    color: '#fff',
    lineHeight: 30,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 80,
    backgroundColor: Colors.primary,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 50,
  },
  buttonStyle: {
    backgroundColor: Colors.primary,
    padding: 5,
    borderRadius: 5,
    margin: 5,
  },


  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: Colors.primary,
    width: 30,
    height: 30,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
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
});
