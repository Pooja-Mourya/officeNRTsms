import {StyleSheet, Text, View, Alert, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import APIService from '../Services/APIService';
import Constants from '../constant/Constants';

const NotificationDetail = props => {
  const userLogin = useSelector(state => state.global_store.userLogin);
  const [detailData, setDetailData] = useState({});

  const notificationReadAPI = async id => {
    let url = Constants.apiEndPoints.notificationRead + '/' + id;
    console.log('notificationRead url...........', url);
    let response = await APIService.getData(
      url,
      userLogin.access_token,
      null,
      'notificationReadAPI',
    );
    if (!response.errorMsg) {
      setDetailData(response.data.data);
    } else {
      Alert.alert(response.errorMsg);
    }
  };

  useEffect(() => {
    notificationReadAPI();
  }, []);
  return (
    <>
      <ScrollView>
        <View style={{marginHorizontal: 10, padding: 20, paddingVertical: 20}}>
          <Text
            style={[styles.userTextStyle, {textAlign: 'center', fontSize: 22}]}
          >
            {detailData.notification_for}
          </Text>
          <Text style={{borderBottomWidth: 1, marginBottom: 15}}></Text>

          <Text style={styles.userTextStyle}>Mail Subject</Text>
          <Text style={styles.detailData}>{detailData.mail_subject}</Text>

          <Text style={styles.userTextStyle}>Mail Body</Text>
          <Text style={styles.detailData}>{detailData.mail_body}</Text>

          <Text style={styles.userTextStyle}>Notification Subject</Text>
          <Text style={styles.detailData}>
            {detailData.notification_subject}
          </Text>

          <Text>{detailData.total_block_number}</Text>

          <Text style={styles.userTextStyle}>Notification Body</Text>
          <Text style={styles.detailData}>{detailData.notification_body}</Text>

          <Text style={styles.userTextStyle}>Custom Attribute</Text>
          <Text style={styles.detailData}>{detailData.custom_attributes}</Text>

          <View
            style={{
              marginBottom: 18,
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 10,
            }}
          >
            <Text style={styles.userTextStyle}>Save to data</Text>
            <Text style={[styles.detailData, {width: '30%'}]}>
              {detailData.save_to_database == 1 ? 'Yes' : 'No'}
            </Text>
          </View>
          <View
            style={{
              marginBottom: 18,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Text style={styles.userTextStyle}>Status Code</Text>
            <Text style={[styles.detailData, {width: '30%'}]}>
              {detailData.status_code}
            </Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default NotificationDetail;

const styles = StyleSheet.create({
  userTextStyle: {
    color: '#ff9900',
    fontWeight: 'bold',
    height: 25,
    fontSize: 18,
  },
  detailData: {
    backgroundColor: '#ffffe6',
    padding: 10,
    elevation: 15,
  },
});
