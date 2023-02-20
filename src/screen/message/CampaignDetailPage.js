import {
  StyleSheet,
  Text,
  View,
  Alert,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import APIService from '../../Services/APIService';
import Constants from '../../constant/Constants';
import BaseContainer from '../../components/BaseContainer';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Colors from '../../assets/Colors';
import {getProportionalFontSize} from '../../Services/CommonMethods';
import {fonts} from '../../assets/Assets';
import {DataTable} from 'react-native-paper';
import {CircularProgressBase} from 'react-native-circular-progress-indicator';
import InputValidation from '../../components/InputValidation'; 

const CampaignDetailPage = props => { 
  const data = [
    {
      id: 1,
      number: 0,
      name: 'Blocked Number',
    },
    {
      id: 2,
      number: 0,
      name: 'Delivered',
    },
    {
      id: 3,
      number: 0,
      name: 'Failed',
    },
    {
      id: 4,
      number: 0,
      name: 'Processing',
    },
    {
      id: 5,
      number: 0,
      name: 'Total',
    },
    {
      id: 6,
      number: 0,
      name: 'Template Name',
    },
    {
      id: 7,
      number: 0,
      name: 'Template ID',
    },
  ];
  let {navigation} = props;
  const userLogin = useSelector(state => state.global_store.userLogin);
  let routeParm = props?.route?.params ?? {}; 
  const [mobileLog, setMobileLog] = useState({});
  const [headerOptions, setHeaderOptions] = useState('BD');
  const [tableData, setTableData] = useState(data);
  const [counter, setCounter] = useState({
    dilivered: 0,
    failed: 0,
    processing: 0,
  }); 
  const [search , setSearch] = useState(); 
  const [isSearch , setIsSearch] = useState(false);

 

  const NumberLogAPI = async () => {
    let url =
      Constants.apiEndPoints.getCampaignInfo + `/${routeParm?.itemId.id}`;
    // return;
    let response = await APIService.postData(
      url,
      {},
      userLogin.access_token,
      null,
      'DltTemplateUsersAPI',
    );
    if (!response.errorMsg) {
      setMobileLog(response.data.data);
    } else {
      Alert.alert('Error', response.errorMsg);
    }
  };

 

  useEffect(() => { 
    NumberLogAPI();
    if (routeParm?.itemId) {
      let tempArr = tableData;
      tempArr[0].number = routeParm?.itemId?.total_block_number ?? 0;
      tempArr[1].number = routeParm?.itemId?.total_delivered ?? 0;
      tempArr[2].number = routeParm?.itemId?.total_failed ?? 0;
      tempArr[3].number =
        routeParm?.itemId?.total_contacts -
          routeParm?.itemId?.total_invalid_number ?? 0;
      tempArr[4].number = routeParm?.itemId?.total_contacts ?? 0;
      tempArr[5].number = routeParm?.itemId?.dlt_template?.template_name ?? 0;
      tempArr[6].number = routeParm?.itemId?.dlt_template?.dlt_template_id ?? 0;
      setCounter({
        // calculating the percentage of each status
        dilivered: Math.round(
          (routeParm?.itemId?.total_delivered /
            routeParm?.itemId?.total_contacts) *
            100,
        ),
        failed: Math.round(
          (routeParm?.itemId?.total_failed /
            routeParm?.itemId?.total_contacts) *
            100,
        ),
        processing: Math.round(
          ((routeParm?.itemId?.total_contacts -
            routeParm?.itemId?.total_invalid_number -
            routeParm?.itemId?.total_delivered -
            routeParm?.itemId?.total_failed) /
            routeParm?.itemId?.total_contacts) *
            100,
        ),
      });
      setTableData(tempArr);
    } 

  }, []);
 
  const searchFilterFunction = text => { 
    if(!search)return text;
    let number  = text.mobile.toString();
    let result = number.includes(search);
    if(result){
      return text;
    } 
  }; 

  return (
    <BaseContainer
      title="Campaign Info"
      leftIcon="arrow-back" 
      onPressLeftIcon={() =>  navigation.goBack()}
      rightIcon={headerOptions==='NL' && 'filter-list'}
      onPressRightIcon={() => setIsSearch(true)}
      >
      <ScrollView  
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ 
          paddingBottom: 100,
        }}
      >
      <View 
      style={styles.headerOptionContainer}>
        <TouchableOpacity
          onPress={() => setHeaderOptions('BD')}
          style={{
            ...styles.headerOption,
            backgroundColor:
              headerOptions == 'BD' ? Colors.primary : Colors.transparent,
          }}>
            <MaterialCommunityIcons name="account-details" size={20} color={Colors.white} style={{right:5}}/>
          <Text
            style={{
              ...styles.headerOptionText,
              color: headerOptions == 'BD' ? Colors.white : Colors.primary,
            }}>
            Basic Details
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setHeaderOptions('NL')}
          style={{
            ...styles.headerOption,
            backgroundColor:
              headerOptions == 'NL' ? Colors.primary : Colors.transparent,
          }}>
            <AntDesign name="lock" size={20} color={Colors.white} style={{right:5}} />
          <Text
            style={{
              ...styles.headerOptionText,
              color: headerOptions == 'NL' ? Colors.white : Colors.primary,
            }}>
            Send Number Log
          </Text>
        </TouchableOpacity>
      </View>

      {headerOptions == 'BD' ? (
        <View
          style={{
            flex: 1,
            marginHorizontal: 10,
          }}>
          <DataTable>
            {tableData &&
              tableData.map((item, index) => {
                return (
                  <DataTable.Row key={index}>
                    <DataTable.Cell>{item.name}</DataTable.Cell>
                    <DataTable.Cell numeric>{item.number}</DataTable.Cell>
                  </DataTable.Row>
                );
              })}
          </DataTable>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
              marginTop: 20,
              marginBottom: 10,
            }}>
            <View>
              <CircularProgressBase
                value={counter?.dilivered ?? 0}
                radius={50}
                activeStrokeColor={Colors.green}
                inActiveStrokeColor={Colors.lightGreen}>
                <Text style={styles.percentStyle}>
                  {counter?.dilivered ?? 0}%{' '}
                </Text>
              </CircularProgressBase>
              <Text style={styles.circleStyle}>
                Delivered
              </Text>
            </View>
            <View>
              <CircularProgressBase
                value={counter?.failed ?? 0}
                radius={50}
                activeStrokeColor={Colors.bloodred}
                inActiveStrokeColor={Colors.lightred}>
                <Text style={styles.percentStyle}>
                  {counter?.failed ?? 0}%{' '}
                </Text>
              </CircularProgressBase>
              <Text style={styles.circleStyle}>
                Failed
              </Text>
            </View>
            <View>
              <CircularProgressBase
                value={counter?.processing ?? 0}
                radius={50}
                activeStrokeColor={Colors.primary}
                inActiveStrokeColor={Colors.lightPrimary}>
                <Text style={styles.percentStyle}>
                  {counter?.processing ?? 0}%{' '}
                </Text>
              </CircularProgressBase>
              <Text
                style={styles.circleStyle}>
                 Invalid
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            marginHorizontal: 10,
          }}> 

           {isSearch&&<InputValidation    
              placeHolder={"Search by number"}
              value={search}
              onChangeText={text => setSearch(text)}
              style={{marginBottom: 10}} 
              iconRight={search?.length > 0 ? 'close' : "magnify"} 
              isIconTouchable={search?.length > 0 ? true : false}
              onPressIcon={() => {   
                setSearch(''); 
                setIsSearch(false);
              }}
              keyboardType={"number-pad"}

            />}
            
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Mobile No.</DataTable.Title>
              <DataTable.Title numeric>USER CREDIT</DataTable.Title>
              <DataTable.Title numeric>STATS</DataTable.Title>
            </DataTable.Header> 
            {mobileLog &&
              mobileLog.filter(searchFilterFunction).map((item, index) => (
                <DataTable.Row key={index}>
                  <DataTable.Cell>{item?.mobile}</DataTable.Cell>
                  <DataTable.Cell numeric>{item?.use_credit}</DataTable.Cell>
                  <DataTable.Cell numeric>{item?.stat}</DataTable.Cell>
                </DataTable.Row>
              ))} 
          </DataTable>
        </View>
      )} 
      </ScrollView>
    </BaseContainer>
  );
};

export default CampaignDetailPage;

const styles = StyleSheet.create({
  headerOptionContainer: {
    backgroundColor: Colors.lightPrimary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 10,
    marginTop: 5,
    borderWidth: 2,
    borderColor: Colors.primary,
    overflow: 'hidden',
    marginHorizontal: 10,
  },
  headerOption: {
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40, 
    flexDirection: 'row', 
  },
  headerOptionText: {
    fontSize: getProportionalFontSize(14),

    fontFamily: fonts.semiBold,
  },

  percentStyle: {
    fontSize: getProportionalFontSize(16), 
    fontFamily: fonts.semiBold,
    alignSelf: 'center',

  },
  circleStyle: {
    textAlign: 'center', 
    fontSize: getProportionalFontSize(16),
    fontFamily: fonts.boldItalic,
    color: Colors.black,
  },
});
