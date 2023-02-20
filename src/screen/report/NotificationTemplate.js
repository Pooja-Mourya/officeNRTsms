import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {fonts} from '../../assets/Assets';
import BaseContainer from '../../components/BaseContainer';
import APIService from '../../Services/APIService';
import Constants from '../../constant/Constants';
import {useSelector} from 'react-redux';
import EmptyList from '../../components/EmptyList';
import FooterCompForFlatlist from '../../components/FooterCompForFlatlist';
import {FAB, Portal} from 'react-native-paper';
import Colors from '../../assets/Colors';
import Fontisto from 'react-native-vector-icons/Fontisto';
import TemplateFilter from './TemplateFilter';
import ListLoader from '../../components/ListLoader';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {getProportionalFontSize} from '../../Services/CommonMethods';

const NotificationTemplate = ({navigation}) => {
  const [listData, setListData] = useState([]);
  const [page, setPage] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterData, setFilterData] = useState({});
  const userLogin = useSelector(state => state.global_store.userLogin);

  const ListAdministrationNotificationTemplatesAPI = async (
    page,
    refresh,
    addFilter,
  ) => {
    let params = {
      page: page ? page : 1,
      per_page_record: 10,
    };
    if (addFilter) {
      params = {
        ...params,
        ...filterData,
        status_code: filterData.status_code?.id,
      };
    }
    if (refresh) setIsRefreshing(true);
    else if (!page) setIsLoading(true);
    else setPaginationLoading(true);
    let url = Constants.apiEndPoints.administrationNotificationTemplates;
    // console.log('url', url, 'params', params);
    // return
    let response = await APIService.postData(
      url,
      params,
      userLogin.access_token,
      null,
      'ListAdministrationNotificationTemplatesAPI',
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
      Alert.alert(
        Constants.danger,
        response.errorMsg ?? 'Something went wrong',
      );
    }
  };

  const handleDeleteBtnAPI = async id => {
    let url =
      Constants.apiEndPoints.administrationNotificationTemplate + '/' + id;
    // return
    let response = await APIService.deleteData(
      url,
      userLogin.access_token,
      null,
      'handleDeleteBtnAPI',
    );
    if (!response.errorMsg) {
      ListAdministrationNotificationTemplatesAPI();
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

  useEffect(() => {
    ListAdministrationNotificationTemplatesAPI(null, null, true);
  }, [filterData]);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      ListAdministrationNotificationTemplatesAPI();
    });
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({item, index}) => {
    return (
      <View style={styles.container}>
        <View style={styles.cartContainer}>
          <View
            style={[
              styles.useHeading,
              {backgroundColor: Colors.extraDarkPrimary},
            ]}
          >
            <View style={styles.useHeading}>
              <Text style={styles.statusCodeText}>Status :</Text>
              <Text style={styles.headerText}>{item.status_code}</Text>
            </View>
            <View style={styles.viewStyle}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('TemplateDetail', {itemId: item})
                }
                style={styles.btn}
              >
                <Text>
                  <Fontisto name="preview" color="white" size={18} />
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('TemplateForm', {itemId: item})
                }
                style={[styles.btn]}
              >
                <Text>
                  <AntDesign name="edit" color="white" size={20} />
                </Text>
              </TouchableOpacity>
              {item?.status_code == 'success' ? null : (
                <TouchableOpacity
                  onPress={() =>
                    Alert.alert(
                      'Confirm',
                      'Are you sure you want to deleted it?',
                      [
                        {
                          text: 'Cancel',
                          onPress: () => console.log('Cancel Pressed'),
                          style: 'cancel',
                        },
                        {
                          text: 'OK',
                          onPress: id => handleDeleteBtnAPI(id),
                        },
                      ],
                    )
                  }
                  style={[styles.btn]}
                >
                  <Text>
                    <AntDesign name="delete" color="white" size={20} />
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          <View>
            <Text style={[styles.headerTextStyle, {textAlign: 'center'}]}>
              Custom Attribute :{' '}
              <Text style={styles.attributeStyle}>
                {item.custom_attributes}
              </Text>
            </Text>
          </View>
          <View style={styles.useHeading}>
            <Text
              style={[styles.headerTextStyle, {textAlign: 'center', flex: 1}]}
            >
              Save to database :{' '}
              <Text style={{color: Colors.darkPrimary}}>
                {item.save_to_database == 1 ? 'Yes' : 'No'}
              </Text>
            </Text>
          </View>

          <View>
            <Text style={styles.headerTextStyle}>
              To :{' '}
              <Text style={styles.attributeStyle}>{item.notification_for}</Text>
            </Text>
          </View>

          <Text style={styles.titleStyle}>Notification</Text>
          <View style={{padding: 10}}>
            <View style={styles.innerTextNM}>
              <Text style={styles.headerTextStyle}>Subject:</Text>
              <Text style={styles.NM}>{item.notification_subject}</Text>
            </View>

            <View style={styles.innerTextNM}>
              <Text style={styles.headerTextStyle}>Body:</Text>
              <Text style={styles.NM}>{item.notification_body}</Text>
            </View>
          </View>
          <Text style={styles.titleStyle}>Mail</Text>
          <View style={{padding: 10}}>
            <View style={styles.innerTextNM}>
              <Text style={styles.headerTextStyle}>Subject:</Text>
              <Text style={styles.NM}>{item.mail_subject}</Text>
            </View>

            <View style={styles.innerTextNM}>
              <Text style={styles.headerTextStyle}>Body:</Text>
              <Text style={styles.NM}>{item.mail_body}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return <ListLoader />;
  }

  return (
    <BaseContainer
      title="Notification Templates"
      leftIcon="arrow-back"
      onPressLeftIcon={() => navigation.goBack()}
      onPressRightIcon={() => setModalVisible(true)}
      rightIcon="filter-list"
    >
      <FlatList
        data={listData}
        renderItem={renderItem}
        ListEmptyComponent={<EmptyList />}
        contentContainerStyle={{
          borderWidth: 0,
          paddingVertical: Constants.globalPaddingVetical,
          paddingHorizontal: Constants.globalPaddingHorizontal,
          paddingBottom: 200,
          marginBottom: 100,
        }}
        keyExtractor={item => item.id}
        onEndReached={() => {
          ListAdministrationNotificationTemplatesAPI(page + 1, null, true);
        }}
        onEndReachedThreshold={0.1}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => {
              ListAdministrationNotificationTemplatesAPI(null, true);
            }}
          />
        }
        ListFooterComponent={() => (
          <FooterCompForFlatlist paginationLoading={paginationLoading} />
        )}
      />
      <FAB
        icon="plus"
        label="Add Template"
        style={styles.fab}
        onPress={() => navigation.navigate('TemplateForm', {itemId: null})}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalViewStyle}>
          <View style={styles.modalView}>
            <AntDesign
              name="close"
              size={20}
              color={'#000'}
              onPress={() => setModalVisible(false)}
              style={styles.closeIcon}
            />
            <TemplateFilter
              filterData={filterData}
              setFilterData={setFilterData}
              modalVisible={modalVisible}
              setModalVisible={setModalVisible}
              ListAdministrationNotificationTemplatesAPI={
                ListAdministrationNotificationTemplatesAPI
              }
            />
          </View>
        </View>
      </Modal>
    </BaseContainer>
  );
};

export default NotificationTemplate;

const styles = StyleSheet.create({
  container: {
    elevation: 12,
    padding: 10,
    borderRadius: 10,
    backgroundColor: Colors.white,
    marginTop: 10,
    width: '100%',
    // paddingHorizontal: 10,
  },
  cartContainer: {
    elevation: 3,
    borderRadius: 300,
    backgroundColor: Colors.white,
    padding: 10,
    margin: 10,
  },
  headerTextStyle: {
    fontFamily: fonts.semiBold,
    fontSize: getProportionalFontSize(15),
    justifyContent: 'flex-end',
    color: Colors.black,
  },
  useHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontFamily: fonts.medium,
    alignItems: 'center',
    padding: 5,
  },

  userTextStyle: {
    fontFamily: fonts.semiBold,
  },

  btn: {
    padding: 10,
    fontFamily: fonts.boldItalic,
    borderRadius: 10,
  },
  centeredView: {
    justifyContent: 'center',
    marginVertical: 20,
  },
  modalView: {
    width: '90%',
    height: '80%',
    borderRadius: 20,
    backgroundColor: Colors.white,
    padding: Constants.globalPadding,
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
    bottom: 0,
    backgroundColor: Colors.primary,
  },
  titleStyle: {
    backgroundColor: Colors.ultraLightPrimary,
    color: Colors.extraDarkPrimary,
    padding: 8,
    textAlign: 'center',
    fontFamily: fonts.bold,
    borderBottomRightRadius: 50,
    borderTopLeftRadius: 50,
    marginHorizontal: 50,
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
  viewStyle: {
    flex: 1,
    justifyContent: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
  },
  attributeStyle: {
    fontFamily: fonts.regular,
    textAlign: 'center',
    marginTop: 10,
    // marginHorizontal: 20,
  },
  modalViewStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  headerText: {
    color: Colors.white,
    fontSize: getProportionalFontSize(13),
    fontFamily: fonts.regular,
    fontWeight: 'bold',
    paddingLeft: 10,
    bottom: 2,
    textTransform: 'capitalize',
  },
  statusCodeText: {
    color: 'white',
    fontFamily: fonts.bold,
    fontSize: getProportionalFontSize(17),
  },
  innerTextNM: {
    flex: 1,
    flexDirection: 'row',
  },
  NM: {
    marginHorizontal: 10,
    fontFamily: fonts.mediumItalic,
    paddingRight: 10,
  },
});
