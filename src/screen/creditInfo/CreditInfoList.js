import {StyleSheet, Text, View, FlatList, RefreshControl} from 'react-native';
import React, {useEffect, useState} from 'react';
import {fonts} from '../../assets/Assets';
import BaseContainer from '../../components/BaseContainer';
import APIService from '../../Services/APIService';
import Constants from '../../constant/Constants';
import {useSelector} from 'react-redux';
import EmptyList from '../../components/EmptyList';
import FooterCompForFlatlist from '../../components/FooterCompForFlatlist';
import {FAB} from 'react-native-paper';
import ListLoader from '../../components/ListLoader';
import Colors from '../../assets/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { getProportionalFontSize } from '../../Services/CommonMethods';

const CreditInfoList = props => {
  let {navigation} = props;

  const [listData, setListData] = useState([]);
  const [page, setPage] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const userLogin = useSelector(state => state.global_store.userLogin);

  const userCreditsAPI = async (page, refresh) => {
    if (refresh) setIsRefreshing(true);
    else if (!page) setIsLoading(true);
    else setPaginationLoading(true);
    let params = {
      page: page ? page : 1,
      per_page_record: 15,
    };
    let url = Constants.apiEndPoints.userCredits;
    let response = await APIService.postData(
      url,
      params,
      userLogin.access_token,
      null,
      'userCreditsAPI',
    );
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
    userCreditsAPI(null, null, true);
  }, []);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      userCreditsAPI();
    });
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({item}) => (
    <View>
      <View style={styles.containerView}>
        <View style={styles.roundedBorder}>
          <View style={styles.cartView}>
            <Text style={[styles.headerTextStyle, {color: 'white'}]}>
              Creditor <Ionicons name="md-remove-outline" color={'white'} />
            </Text>
            <Text style={{color: 'white',fontSize: getProportionalFontSize(13),fontFamily:fonts.medium}}>{item.user?.name}</Text>
          </View>
        </View>
        <View style={styles.colView}>
          <View style={styles.secColView}>
            <Text style={styles.headerTextStyle}>Credit Type</Text>
            <Text
              style={{
                color:
                  item.credit_type == '1'
                    ? Colors.darkgreen
                    : Colors.extraDarkPrimary,
              }}
            >
              {item.credit_type == '1' ? 'Credit' : 'Debit'}
            </Text>
          </View>
          <View style={styles.typeView}>
            <Text style={styles.headerTextStyle}>Route Type</Text>
            <Text>
              {(item.action_for == 1 ? (
                <Text style={{color: Colors.darkgreen}}>
                  <MaterialCommunityIcons
                    name={'bank-transfer-out'}
                    size={20}
                  />{' '}
                  Transactional
                </Text>
              ) : null) ||
                (item.action_for == 2 ? (
                  <Text style={{color: Colors.darkPrimary}}>
                    <MaterialCommunityIcons
                      name={'message-processing-outline'}
                      size={20}
                    />{' '}
                    Promotional
                  </Text>
                ) : null) ||
                (item.action_for == 3 ? (
                  <Text style={{color: Colors.info}}>
                    <MaterialCommunityIcons
                      name={'network-strength-4-cog'}
                      size={20}
                    />{' '}
                    Two way SMS
                  </Text>
                ) : null) ||
                (item.action_for == 4 ? (
                  <Text style={{color: Colors.blue}}>
                    <MaterialIcons name={'keyboard-voice'} size={20} /> Voice
                  </Text>
                ) : null)}
            </Text>
          </View>
        </View>
        <View style={{margin: 10}}>
          <View style={styles.rateView}>
            <Text style={styles.headerTextStyle}>Rate : </Text>
            <Text>{item.rate}</Text>
          </View>

          <View style={styles.rateView}>
            <Text style={styles.headerTextStyle}>Current Balance : </Text>
            <Text>{item.current_balance}</Text>
          </View>

          <View style={styles.rateView}>
            <Text style={styles.headerTextStyle}>Old Balance : </Text>
            <Text>{item.old_balance}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  if (isLoading) {
    return <ListLoader />;
  }

  return (
    <BaseContainer
      title="Credit Info List"
      leftIcon="arrow-back"
      onPressLeftIcon={() => navigation.goBack()}
    >
      <FlatList
        data={listData}
        renderItem={renderItem}
        ListEmptyComponent={<EmptyList />}
        contentContainerStyle={styles.flatlistStyle}
        keyExtractor={item => item.id}
        onEndReached={() => { 
          userCreditsAPI(page + 1, null, true);
        }}
        onEndReachedThreshold={0.1}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => {
              userCreditsAPI(null, true);
            }}
          />
        }
        ListFooterComponent={() => (
          <FooterCompForFlatlist paginationLoading={paginationLoading} />
        )}
      />
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('CreditInfoAdd')}
      />
    </BaseContainer>
  );
};

export default CreditInfoList;

const styles = StyleSheet.create({
  headerTextStyle: {
    fontFamily: fonts.semiBold,  
    fontSize: getProportionalFontSize(14),
    color: Colors.black,
    

  },
  containerView: {
    borderRightWidth: 2,
    borderRightColor: Colors.extraDarkPrimary,
    backgroundColor: 'white',
    borderRadius: 7,
    elevation: 12,
    marginVertical: 10,
    borderTopRightRadius: 25,
    borderBottomLeftRadius: 25,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.primary,
  },
  roundedBorder: {
    backgroundColor: Colors.extraDarkPrimary,
    borderTopRightRadius: 25,
    borderBottomLeftRadius: 25,
  },
  cartView: {
    marginBottom: 10,
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 15,
    justifyContent: 'center',
  },
  colView: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginHorizontal: 20,
  },
  secColView: {marginTop: 5, flex: 1, marginHorizontal: 20, width: '50%'},
  typeView: {marginTop: 5, flex: 1, marginHorizontal: 20},
  rateView: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginHorizontal: 20,
  },
  flatlistStyle: {
    borderWidth: 0,
    paddingVertical: Constants.globalPaddingVetical,
    paddingHorizontal: Constants.globalPaddingHorizontal,
    paddingBottom: 200,
    marginBottom: 100,
  },
});
