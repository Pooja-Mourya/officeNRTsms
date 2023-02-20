import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Alert,
  Pressable,
  ScrollView,
  TextInput,
  FlatList,
  RefreshControl,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {img, fonts} from '../../../assets/Assets';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Constants from '../../../constant/Constants';
import APIService from '../../../Services/APIService';
import {useSelector} from 'react-redux';  
import {FAB} from 'react-native-paper';
import FooterCompForFlatlist from '../../../components/FooterCompForFlatlist';
import EmptyList from '../../../components/EmptyList';
import Colors from '../../../assets/Colors';
import TransparentLoader from '../../../components/TransparentLoader';
import ListLoader from '../../../components/ListLoader';
import {getProportionalFontSize} from '../../../Services/CommonMethods';

const PhoneBook = ({navigation}) => {
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      listingData();
    });
    return unsubscribe;
  }, [navigation]);

  // redux hooks
  const userLogin = useSelector(state => state.global_store.userLogin); 
  const [phoneBookList, setPhoneBookList] = React.useState([]);
  const [page, setPage] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openFAB, setOpenFAB] = useState(false); 
  const [modal, setModal] = useState();

  const listingData = async (page, refresh, addFilter) => {
    if (refresh) setIsRefreshing(true);
    else if (!page) setIsLoading(true);
    else setPaginationLoading(true);
    let params = {
      page: page ? page : 1,
      per_page_record: 10,
    };
    let url = Constants.apiEndPoints.contact_listing;
    // return
    let response = await APIService.postData(
      url,
      params,
      userLogin.access_token,
      null,
      'Contact Group Listing',
    );
    // return
    if (!response.errorMsg) {
      if (!page) {
        setPage(1);
        setPhoneBookList(response?.data?.data?.data);
        setIsLoading(false);
        if (refresh) setIsRefreshing(false);
      } else {
        let tempListData = [...phoneBookList];
        tempListData = tempListData.concat(response?.data?.data?.data);
        setPage(page);
        setPhoneBookList([...tempListData]);
        setPaginationLoading(false);
      }
    } else {
      if (!page) setIsLoading(false);
      else setPaginationLoading(false);
      if (refresh) setIsRefreshing(false);
      Alert.showAlert(Constants.danger, response.errorMsg);
    }
  };

  // delete groups from cards
  const handleDeleteGroup = async id => { 
    setIsLoading(true);
    let url = Constants.apiEndPoints.ContactGroup + '/' + id;
    // return
    let response = await APIService.deleteData(
      url,
      userLogin.access_token,
      null,
      'Contact Group Delete',
    );
    if (!response.errorMsg) {
      setIsLoading(false);
      listingData();
      Alert.alert('Success', response?.data?.message);
    } else { 
      setIsLoading(false);
      Alert.alert(response.errorMsg);
    }
  };
  // cinfirmBox
  const deleteGroup = item => {
    return Alert.alert(
      'Confirm ?',
      'Are you sure you want to delete this group ?',
      [ 
        {
        text: 'No',
        onPress: () => console.log('Cancel Pressed'),
        },
        {
            text: 'Yes',
            onPress: () => {
              handleDeleteGroup(item.id);
            },
          },
      ],
    );
  };
 
  const renderItemList = ({item, index}) => { 
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
              right: 10,
              top: 10,
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
                navigation.navigate('AddGroup', {item: item});
                setModal();
              }}
            />
            
            <AntDesign
              name="delete"
              size={20}
              color="white"
              style={styles.buttonStyle}
              onPress={() =>{setModal() ;deleteGroup(item)}}
            />  
            <AntDesign
              name="eye"
              size={20}
              color="white"
              style={styles.buttonStyle}
              onPress={() =>{ navigation.navigate('PhoneView', {item: item}); setModal()}}
            />
          </View>
        </View>
      ) : null}
      <View style={styles.cardContainer} key={index}>
        <View style={styles.leftContent}>
          <Text style={styles.cardTitle}>
            {item?.group_name?.slice()[0].toUpperCase()}
          </Text>
        </View>
        <View style={styles.centerContent}>
          <Text
            style={{
              fontSize: getProportionalFontSize(18),
              fontWeight: 'bold',
              color: Colors.black,
              textTransform: 'capitalize',
            }}>
            {item.group_name}
          </Text>
          <Text
            style={{
              textTransform: 'capitalize',
            }}
          >{item?.description.slice(0, 50) + '...'}</Text> 
        </View> 
        <TouchableOpacity
                  style={styles.rightContent}
                  onPress={() => {
                    setModal(item.id);
                  }}>
                  <Entypo
                    name="dots-three-vertical"
                    size={18}
                    color={Colors.black}
                  />
                </TouchableOpacity>
      </View>
      </>
    );
  };

  useEffect(() => {
    listingData(null, null, true);
  }, []);

  if (isLoading) {
    return <ListLoader />;
  }

  return (
    <BaseContainer
      title="PhoneBook"
      leftIcon="arrow-back"
      onPressLeftIcon={() => navigation.goBack()}>
      <TransparentLoader isLoading={isLoading} /> 
        <FlatList
          data={phoneBookList}
          renderItem={renderItemList}
          keyExtractor={(item, index) => index}
          ListEmptyComponent={<EmptyList />}
          contentContainerStyle={{paddingBottom: 80}}
          onEndReached={() => {
            listingData(page + 1, null, true);
          }}
          onEndReachedThreshold={0.1}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => {
                listingData(null, true);
              }}
            />
          }
          ListFooterComponent={() => (
            <FooterCompForFlatlist paginationLoading={paginationLoading} />
          )}
        /> 
      <FAB.Group
        style={{marginBottom: 60}}
        actions={[
          {
            icon: 'import',
            label: 'import contact',
            onPress: () =>  navigation.navigate('AddGroup', {isImport: true})},
          {
            icon: 'account-group',
            label: 'Add Group', 
            onPress: () => navigation.navigate('AddGroup',{isImport: false})},
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
export default PhoneBook;

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
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    height: 100, 
    marginHorizontal: 16,
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
  cardTitle: {
    fontSize: getProportionalFontSize(25),
    fontWeight: 'bold',
    color: '#fff',
    lineHeight: 30,
  },
  buttonStyle: {
    backgroundColor: Colors.primary,
    padding: 5,
    borderRadius: 5,
    margin: 5,
  
  },

 
});
