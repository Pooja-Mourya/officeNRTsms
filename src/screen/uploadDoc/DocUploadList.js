import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Linking,
  RefreshControl,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {fonts} from '../../assets/Assets';
import BaseContainer from '../../components/BaseContainer';
import APIService from '../../Services/APIService';
import Constants from '../../constant/Constants';
import {useSelector} from 'react-redux';
import EmptyList from '../../components/EmptyList';
import FooterCompForFlatlist from '../../components/FooterCompForFlatlist';
import {FAB} from 'react-native-paper';
import Colors from '../../assets/Colors';
import ListLoader from '../../components/ListLoader';
import { getProportionalFontSize } from '../../Services/CommonMethods';

const DocUploadList = ({navigation}) => {
  const [listData, setListData] = useState([]);
  const [page, setPage] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const userLogin = useSelector(state => state.global_store.userLogin);

  const userDocumentsAPI = async (page, refresh) => {
    if (refresh) setIsRefreshing(true);
    else if (!page) setIsLoading(true);
    else setPaginationLoading(true);
    let params = {
      page: page ? page : 1,
      per_page_record: 10,
    };
    let url = Constants.apiEndPoints.userDocuments;
    // return
    let response = await APIService.postData(
      url,
      params,
      userLogin.access_token,
      null,
      'userDocumentsAPI',
    );
    console.log('response', response.data.data.data);
    if (!response.errorMsg) {
      if (!page) {
        setIsLoading(false);
        setPage(1);
        setListData(response?.data?.data?.data);
        if (refresh) setIsRefreshing(false);
      } else {
        setIsLoading(false);
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
      Alert.showAlert(Constants.danger, response.errorMsg);
    }
  };

  const handleDeleteBtnAPI = async id => {
    let url = Constants.apiEndPoints.userDocument + '/' + id;
    // return
    let response = await APIService.deleteData(
      url,
      userLogin.access_token,
      null,
      'userDocumentDelete',
    );
    if (!response.errorMsg) {
      userDocumentsAPI();
      Alert.alert(
        Constants.success,
        response.message ?? 'Document deleted successfully',
      );
    } else {
      Alert.alert(Constants.danger, response.errorMsg);
    }
  };

  useEffect(() => {
    userDocumentsAPI();
  }, []);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      userDocumentsAPI();
    });
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({item}) => (
    <View style={styles.cartContainer}>
      <View style={{}}>
        <Text style={styles.titleStyle}>{item.title}</Text>
        <Text style={{fontFamily: fonts.mediumItalic,color:Colors.black}}>
          share to Parent :
          {item.is_share_to_parent == 1 ? (
            <Text style={{color: Colors.darkgreen}}>Yes</Text>
          ) : (
            <Text style={{color: Colors.secondary}}>No</Text>
          )}
        </Text>
      </View>
      <View>
        <TouchableOpacity
          onPress={() => Linking.openURL(Constants?.base_url2 + item.document)}
          style={{color: Colors.primary}}
        >
          <Fontisto name="preview" size={20} color={Colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              'Delete',
              'Are you sure you want to delete this record?',
              [
                {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {text: 'OK', onPress: () => handleDeleteBtnAPI(item.id)},
              ],
            );
          }}
          style={{color: Colors.primary}}
        >
          <AntDesign
            name="delete"
            color={Colors.primary}
            style={{marginTop: 10}}
            size={20}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading) {
    return <ListLoader />;
  }

  return (
    <BaseContainer
      title="Upload Document List"
      leftIcon="arrow-back"
      onPressLeftIcon={() => navigation.goBack()}
    >
      <FlatList
        data={listData}
        renderItem={renderItem}
        ListEmptyComponent={<EmptyList />}
        contentContainerStyle={styles.flatListStyle}
        keyExtractor={item => item.id}
        onEndReached={() => {
          userDocumentsAPI(page + 1);
        }}
        onEndReachedThreshold={0.1}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => {
              userDocumentsAPI(null, true);
            }}
          />
        }
        ListFooterComponent={() => (
          <FooterCompForFlatlist paginationLoading={paginationLoading} />
        )}
      />
      {(userLogin?.userType == 1 || userLogin?.userType == 2) && (
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => navigation.navigate('UploadDoc')}
        />
      )}
    </BaseContainer>
  );
};

export default DocUploadList;

const styles = StyleSheet.create({
  cartContainer: {
    borderTopLeftRadius: 30,
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.primary,
    borderLeftColor: Colors.primary,
    borderLeftWidth: 8,
    flex: 1,
    flexDirection: 'row',
    marginVertical: 10,
    justifyContent: 'space-between',
    backgroundColor: 'white',
    elevation: 10,
    padding: 10,
  },

  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.primary,
  },

  flatListStyle: {
    borderWidth: 0,
    paddingVertical: Constants.globalPaddingVetical,
    paddingHorizontal: Constants.globalPaddingHorizontal,
    paddingBottom: 200,
    marginBottom: 100,
  },
  titleStyle: {
    fontFamily: fonts.bold,
     textTransform: 'capitalize',

  fontSize:getProportionalFontSize(16),
  color:Colors.black
},
});
