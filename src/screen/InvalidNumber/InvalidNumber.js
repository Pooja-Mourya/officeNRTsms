import {
  StyleSheet,
  Text,
  View,
  Modal,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import BaseContainer from '../../components/BaseContainer';
import CustomButton from '../../components/CustomButton';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Constants from '../../constant/Constants';
import APIService from '../../Services/APIService';
import InputValidation from '../../components/InputValidation';
import {useSelector} from 'react-redux';
import EmptyList from '../../components/EmptyList';
import FooterCompForFlatlist from '../../components/FooterCompForFlatlist';
import ListLoader from '../../components/ListLoader';
import Colors from '../../assets/Colors';

const InvalidNumber = ({navigation}) => {
  const userLogin = useSelector(state => state.global_store.userLogin);
  const [modalVisible, setModalVisible] = useState(false);
  const [validData, setValidData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [number, setNumber] = useState('');

  const administrationInvalidSeriesListAPI = async (page, refresh) => {
    if (refresh) setIsRefreshing(true);
    else if (!page) setIsLoading(true);
    else setPaginationLoading(true);
    let params = {
      page: page ? page : 1,
      per_page_record: 10,
    };
    let url = Constants.apiEndPoints.administrationInvalidSeriesList;
    let response = await APIService.postData(
      url,
      params,
      userLogin.access_token,
      null,
      'administrationInvalidSeriesListAPI',
    );

    if (!response.errorMsg) {
      if (!page) {
        setPage(1);
        setValidData(response.data.data.data);
        setIsLoading(false);
        if (refresh) setIsRefreshing(false);
      } else {
        let tempValidData = [...validData];
        tempValidData = tempValidData.concat(response.data.data.data);
        setPage(page);
        setValidData([...tempValidData]);
        setPaginationLoading(false);
      }
    } else {
      if (!page) setIsLoading(false);
      else setPaginationLoading(false);
      if (refresh) setIsRefreshing(false);
      Alert.showAlert(Constants.danger, response.errorMsg);
    }
  };
  const administrationInvalidSeriesCreateAPI = async () => {
    let params = {
      start_with: number,
    };
    let url = Constants.apiEndPoints.administrationInvalidSeries;
    console.log(url, params);
    // return
    let response = await APIService.postData(
      url,
      params,
      userLogin.access_token,
      null,
      'administrationInvalidSeriesCreateAPI',
    );
    if (!response.errorMsg) {
      setModalVisible(false);
      administrationInvalidSeriesListAPI();
      Alert.alert(
        Constants.success,
        response.message ?? 'Invalid Number Created Successfully',
      );
    } else {
      Alert.alert(
        Constants.danger,
        response.errorMsg ?? Constants.somethingWentWrong,
      );
    }
  };

  const administrationInvalidSeriesDeleteAPI = async id => {
    let url = Constants.apiEndPoints.administrationInvalidSeries + '/' + id;
    // return
    let response = await APIService.deleteData(
      url,
      userLogin.access_token,
      null,
      'administrationInvalidSeriesDeleteAPI',
    );
    if (!response.errorMsg) {
      administrationInvalidSeriesListAPI(),
        Alert.alert(
          Constants.success,
          response.data.message ?? 'Number deleted successfully',
        );
    } else {
      Alert.alert(
        Constants.danger,
        response.errorMsg ?? 'Something went wrong',
      );
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      administrationInvalidSeriesListAPI();
    });
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({item}) => {
    return (
      <>
        <View style={styles.viewContainer}>
          <Text>{item.start_with}</Text>
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                'Delete Number',
                'Are you sure you want to delete this number?',
                [
                  {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                  },
                  {
                    text: 'OK',
                    onPress: () => {
                      administrationInvalidSeriesDeleteAPI(item.id);
                    },
                  },
                ],
                {cancelable: false},
              );
            }}
          >
            <AntDesign name="delete" color="red" size={18} />
          </TouchableOpacity>
        </View>
      </>
    );
  };

  if (isLoading) {
    return <ListLoader />;
  }

  return (
    <BaseContainer
      title="Invalid Number"
      leftIcon="arrow-back"
      onPressLeftIcon={() => navigation.goBack()}
      onPressRightIcon={() => setModalVisible(true)}
      rightIcon="add"
    >
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <View style={styles.modalCartView}>
            <Entypo
              name="circle-with-cross"
              size={25}
              color="black"
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
              }}
              onPress={() => setModalVisible(false)}
            />
            <InputValidation
              label="Enter Number"
              placeHolder="Enter Number"
              maxLength={10}
              value={number}
              maskedInput
              onChangeText={text => setNumber(text)}
              keyboardType={'numeric'}
            />
            <CustomButton
              style={{
                backgroundColor: number.length < 1 ? '#ccc' : Colors.primary,
              }}
              title="ADD"
              onPress={() => administrationInvalidSeriesCreateAPI()}
            />
          </View>
        </View>
      </Modal>
      <FlatList
        data={validData}
        renderItem={renderItem}
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
          administrationInvalidSeriesListAPI(page + 1);
        }}
        onEndReachedThreshold={0.1}
        numColumns={2}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => {
              administrationInvalidSeriesListAPI(null, true);
            }}
          />
        }
        ListFooterComponent={() => (
          <FooterCompForFlatlist paginationLoading={paginationLoading} />
        )}
      />
    </BaseContainer>
  );
};

export default InvalidNumber;

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalCartView: {
    margin: 30,
    padding: 20,
    elevation: 5,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  viewContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
    margin: 15,
    padding: 10,
    elevation: 10,
    justifyContent: 'space-between',
    borderRadius: 9,
  },
});
