import {StyleSheet, Text, View, Alert, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import Constants from '../../../constant/Constants';
import APIService from '../../../Services/APIService';
import {useSelector} from 'react-redux';
import {fonts} from '../../../assets/Assets';
import Colors from '../../../assets/Colors';
import BaseContainer from '../../../components/BaseContainer';
import {DataTable} from 'react-native-paper';
import {getProportionalFontSize} from '../../../Services/CommonMethods';
const PhoneView = props => {
  let routeParm = props.route.params.item;

  console.log('routeParm', routeParm);
  const userLogin = useSelector(state => state?.global_store?.userLogin);
  const [mobile, setMobile] = useState([]);
  //   console.log('routeParm', routeParm);
  //   console.log('mobile', mobile);

  const getData = async id => {
    let url = Constants.apiEndPoints.ContactGroup + '/' + id;
    let response = await APIService.getData(
      url,
      userLogin.access_token,
      null,
      'contact_add_group_API',
    );
    if (!response.errorMsg) {
      setMobile(response?.data?.data?.contact_numbers);
    } else {
      Alert.alert(response.errorMsg);
    }
  };

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      getData(routeParm.id);
    });
    return unsubscribe;
  }, [props.navigation]);

  return (
    <BaseContainer
      title="Phone View"
      leftIcon="arrow-back"
      onPressLeftIcon={() => props.navigation.goBack()}>
      <View style={styles.container}>
        <View
          style={{
            marginHorizontal: 10,
            marginVertical: 10,
             
          }}>
          <Text
            style={{
              fontSize: getProportionalFontSize(16),
              fontFamily: fonts.medium,
              color: Colors.black,
              marginBottom: 10,
            }}>
            Group Name :{' '}
            <Text
              style={{
                fontSize: getProportionalFontSize(14),
                fontFamily: fonts.regular,
                color: null,
                marginBottom: 10,
              }}>
              {routeParm.group_name}
            </Text>
          </Text>

          <Text
            style={{
              fontSize: getProportionalFontSize(16),
              fontFamily: fonts.medium,
              color: Colors.black,
              marginBottom: 10,
            }}>
            Description :{' '}
            <Text
              style={{
                fontSize: getProportionalFontSize(14),
                fontFamily: fonts.regular,
                color: null,
                marginBottom: 10,
              }}>
              {routeParm.description}
            </Text>
          </Text>
        </View>

        <DataTable.Header>
          <DataTable.Title>#</DataTable.Title>
          <DataTable.Title numeric>Mobile</DataTable.Title>
        </DataTable.Header>

        {mobile?.map((item, index) => (
          <DataTable.Row key={index}>
            <DataTable.Cell>{index + 1}</DataTable.Cell>
            <DataTable.Cell numeric>{item.number}</DataTable.Cell>
          </DataTable.Row>
        ))}
      </View>
    </BaseContainer>
  );
};

export default PhoneView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
});
