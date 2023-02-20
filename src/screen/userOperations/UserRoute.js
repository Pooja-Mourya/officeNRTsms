import {
  StyleSheet,
  Text,
  View,
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
import ListLoader from '../../components/ListLoader';
import Colors from '../../assets/Colors';
import { getProportionalFontSize } from '../../Services/CommonMethods';

const UserRoute = ({navigation}) => {
  const [listData, setListData] = useState([]);
  const [page, setPage] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const userLogin = useSelector(state => state.global_store.userLogin);

  const administrationGetUserRouteInfoAPI = async (page, refresh) => {
    if (refresh) setIsRefreshing(true);
    else if (!page) setIsLoading(true);
    else setPaginationLoading(true);
    let params = {
      page: page ? page : 1,
      per_page_record: 10,
    };
    let url = Constants.apiEndPoints.administrationGetUserRouteInfo;
    console.log('url', url, 'params', params);
    // return
    let response = await APIService.getData(
      url,
      userLogin.access_token,
      null,
      'administrationGetUserRouteInfo',
    );
    if (!response.errorMsg) {
      if (!page) {
        setPage(1);
        setListData(response?.data?.data);
        setIsLoading(false);
        if (refresh) setIsRefreshing(false);
      } else {
        let tempListData = [...listData];
        tempListData = tempListData.concat(response?.data?.data);
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
    administrationGetUserRouteInfoAPI();
  }, []);

  const renderItem = ({item,index}) => { 
    return (
      <View style={styles.mainView} key={index}>
        <View
          style={{
            borderTopRightRadius: 30,
            borderTopColor: Colors.yellow,
          }}
        >
          <View style={styles.nameHeading}>
            <Text style={styles.mainTextStyle}>{item.name}</Text>
          </View>
          <View style={{backgroundColor: Colors.ultraLightProPrimary}}>
            <Text style={styles.routeHeadingText}>Promotional</Text>
            <View style={styles.innerTextStyle}>
              <Text style={styles.headerTextStyle}>SMPP</Text>
              <Text style={styles.normalText}>
                {item.promotional_route_info?.primary_route?.route_name}
              </Text>
            </View>
            <View style={styles.innerTextStyle}>
              <Text style={styles.headerTextStyle}>SECONDARY</Text>
              <Text style={styles.normalText}>
                {item.promotional_route_info?.sec_route_name}
              </Text>
            </View>
          </View>

          <View style={{backgroundColor: Colors.ultraLightPrimary}}>
            <Text style={styles.routeHeadingText}>Transaction</Text>
            <View style={styles.innerTextStyle}>
              <Text style={styles.headerTextStyle}>SMPP</Text>

              <Text style={styles.normalText}>
                {item.transaction_route_info?.primary_route?.route_name}
              </Text>
            </View>

            <View style={styles.innerTextStyle}>
              <Text style={styles.headerTextStyle}>SECONDARY</Text>
              <Text style={styles.normalText}>
                {item.transaction_route_info?.sec_route_name}
              </Text>
            </View>
          </View>
          <View style={{backgroundColor: Colors.lightPrimary}}>
            <Text style={styles.routeHeadingText}>Two-Way</Text>
            <View style={styles.innerTextStyle}>
              <Text style={styles.headerTextStyle}>SMPP</Text>
              <Text style={styles.normalText}>
                {item.two_waysms_route_info?.primary_route?.route_name}
              </Text>
            </View>

            <View style={styles.innerTextStyle}>
              <Text style={styles.headerTextStyle}>SECONDARY</Text>
              <Text style={styles.normalText}>
                {item.two_waysms_route_info?.sec_route_name}
              </Text>
            </View>
          </View>

          <View style={styles.voiceContainer}>
            <Text style={styles.routeHeadingText}>Voice</Text>
            <View style={styles.innerTextStyle}>
              <Text style={styles.headerTextStyle}>SMPP </Text>
              <Text style={styles.normalText}>
                {item.voice_sms_route_info?.primary_route?.route_name}
              </Text>
            </View>

            <View style={styles.innerTextStyle}>
              <Text style={styles.headerTextStyle}>SECONDARY </Text>
              <Text style={styles.normalText}>{item.voice_sms_route_info?.sec_route_name}</Text>
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
      title="User Route"
      leftIcon="arrow-back"
      onPressLeftIcon={() => navigation.goBack()}
    >
      <FlatList
        data={Array.isArray(listData) ? listData : []}
        renderItem={renderItem}
        ListEmptyComponent={<EmptyList />}
        contentContainerStyle={{ 
          paddingBottom: 200, 
          padding:Constants.globalPadding
        }}
        keyExtractor={item => item.id}
        onEndReached={() => {
          console.log('onEndReached');
          administrationGetUserRouteInfoAPI(page + 1,null);
        }}
        onEndReachedThreshold={0.1}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => {
              administrationGetUserRouteInfoAPI(null, true);
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

export default UserRoute;

const styles = StyleSheet.create({
  headerTextStyle: {
    fontFamily: fonts.semiBold, 
    paddingHorizontal: 20,
    fontSize: getProportionalFontSize(14),
    color: Colors.black,
    

  },
  mainTextStyle: {
    fontFamily: fonts.bold,  
    fontSize: getProportionalFontSize(18),
    color:Colors.white, 
  },
  innerTextStyle: {
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    marginBottom: 5,
    color: Colors.extraDarkPrimary,
    paddingHorizontal: 20,
  },
  nameHeading: {
    backgroundColor: Colors.darkPrimary,
    borderTopRightRadius: 25,
    borderBottomLeftRadius: 25,
    padding: 18,
  },
  mainView: {
    borderRadius: 8,
    marginHorizontal: 5,
    marginBottom: 10,
    elevation: 12,
    backgroundColor: Colors.white,
    borderTopEndRadius: 30,
    borderBottomStartRadius: 30,
  },
  routeHeadingText: {
    padding: 5,
    textAlign: 'center',
    fontFamily: fonts.boldItalic,
    backgroundColor: 'rgba(52, 52, 52, 0.1)',
    marginHorizontal: 100,
    margin: 5,
    borderBottomRightRadius: 15,
    borderTopLeftRadius: 15,
    color: Colors.black,

  },
  voiceContainer: {
    backgroundColor: Colors.yellow,
    borderBottomStartRadius: 30,
  },
  normalText: {
    fontFamily: fonts.regular,
    fontSize: getProportionalFontSize(13),
    color: Colors.lightBlack,

  },
});
