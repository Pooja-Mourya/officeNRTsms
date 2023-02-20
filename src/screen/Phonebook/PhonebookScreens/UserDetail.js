import {StyleSheet, Text, View, Image, ScrollView} from 'react-native';
import React, {useState, useEffect} from 'react';
import Constants from '../../../constant/Constants';
import {Divider} from 'react-native-paper';
import {getProportionalFontSize} from '../../../Services/CommonMethods';
import Colors from '../../../assets/Colors';
import {fonts} from '../../../assets/Assets';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import BaseContainer from '../../../components/BaseContainer';

const UserDetail = props => {
  let userInfo = props.route.params.user; 

  return (
    <BaseContainer
      title={'User Detail'}
      leftIcon="arrow-back" 
      onPressLeftIcon={() => props.navigation.goBack()}>

    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingBottom: 60}}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            style={styles.headerImage}
            source={{uri: Constants.base_url2 + userInfo?.companyLogo}}
          />
          <View style={styles.headerContent}>
            <Text
              style={{
                fontSize: getProportionalFontSize(16),
                fontFamily: fonts.semiBold,
                color: Colors.black,
              }}>
              {userInfo?.name.toUpperCase()}
            </Text>
            <Divider style={{backgroundColor: Colors.gray, height: 1, width:'100%', marginBottom: 5,}} />
            <View style={styles.rowView}>
              <AntDesign name="user" size={15} color={Colors.black} />

              <Text style={styles.headerText}> : {userInfo?.username}</Text>
            </View>
            <View style={styles.rowView}>
              <Entypo name="email" size={15} color={Colors.black} />
              <Text style={styles.headerText}> : {userInfo?.email}</Text>
            </View>
            <View style={styles.rowView}>
              <AntDesign name="phone" size={15} color={Colors.black} />

              <Text style={styles.headerText}> : {userInfo?.mobile}</Text>
            </View>
          </View>
        </View>
        <View style={styles.body}>
          {/* <Text
            style={{
              fontSize: getProportionalFontSize(16),
              fontFamily: fonts.bold,
              color: Colors.black,
              marginVertical: 10,
              backgroundColor: Colors.primary,
              padding: 10,
              borderRadius: 10,
              textAlign: 'center',
            }}>
            UserInfo
          </Text> */}
          <View style={styles.bodyView}>
          <Text style={styles.bodyHead}>Website</Text>
            <Text style={styles.bodyText}>{userInfo?.websiteUrl}</Text>
            <Divider style={{height: 1, width: '100%'}} />
          </View>

          <View style={styles.bodyView}>
            <Text style={styles.bodyHead}>User Type</Text>
            <Text style={styles.bodyText}> 
              {userInfo?.userType == '0'
                ? 'Company'
                : userInfo?.userType == '1'
                ? 'Reseller'
                : userInfo?.userType == '2'
                ? 'Client'
                : userInfo?.userType == '3'
                ? 'Employee'
                : ''}
            </Text>
            <Divider style={{height: 1, width: '100%'}} />
          </View>
          <View style={styles.bodyView}>
            <Text style={styles.bodyHead}>Designation</Text>
            <Text style={styles.bodyText}>
              {userInfo?.designation}
            </Text>
            <Divider style={{height: 1, width: '100%'}} />
          </View>
          <View style={styles.bodyView}>
            <Text style={styles.bodyHead}>Authority Type</Text>
            <Text style={styles.bodyText}> 
              {userInfo?.authority_type == '1'
                ? 'On Delivered'
                : 'On Submission'}
            </Text>
            <Divider style={{height: 1, width: '100%'}} />
          </View>
          <View style={styles.bodyView}>
            <Text style={styles.bodyHead}>Enable Api IP Security</Text>
            <Text style={styles.bodyText}>
              {userInfo?.is_enabled_api_ip_security}
            </Text>
            <Divider style={{height: 1, width: '100%'}} />
          </View>
          <View style={styles.bodyView}>
            <Text style={styles.bodyHead}>Lock Timeout</Text>
            <Text style={styles.bodyText}>
              {userInfo?.locktimeout}
            </Text>
            <Divider style={{height: 1, width: '100%'}} />
          </View>
          <View style={styles.bodyView}>
            <Text style={styles.bodyHead}>Status </Text>
            <Text style={styles.bodyText}>
              {userInfo?.status == '1' ? 'Active' : 'Inactive'}
            </Text>
            <Divider style={{height: 1, width: '100%'}} />
          </View>
          <View style={styles.bodyView}>
            <Text style={styles.bodyHead}>Promotional Credit</Text>
            <Text style={styles.bodyText}>
              {userInfo?.promotional_credit}
            </Text>
            <Divider style={{height: 1, width: '100%'}} />
          </View>
          <View style={styles.bodyView}>
            <Text style={styles.bodyHead}> Transaction Credit </Text>
            <Text style={styles.bodyText}>
             {userInfo?.transaction_credit}
            </Text>
            <Divider style={{height: 1, width: '100%'}} />
          </View>
          <View style={styles.bodyView}>
            <Text style={styles.bodyHead}>Two-Way SMS Credit </Text>
            <Text style={styles.bodyText}>
              {userInfo?.two_waysms_credit}
            </Text>
            <Divider style={{height: 1, width: '100%'}} />
          </View>
          <View style={styles.bodyView}>
            <Text style={styles.bodyHead}> Voice SMS Credit </Text>
            <Text style={styles.bodyText}>
             {userInfo?.voice_sms_credit}
            </Text>
            <Divider style={{height: 1, width: '100%'}} />
          </View>
          <View style={styles.bodyView}>
            <Text style={styles.bodyHead}>Adress </Text>
            <Text style={styles.bodyText}>{userInfo?.address}</Text>
            <Divider style={{height: 1, width: '100%'}} />
          </View>
          <View style={styles.bodyView}>
            <Text style={styles.bodyHead}>City </Text>
            <Text style={styles.bodyText}> {userInfo?.city}</Text>
            <Divider style={{height: 1, width: '100%'}} />
          </View>
          <View style={styles.bodyView}>
            <Text style={styles.bodyHead}>Priority</Text>
            <Text style={styles.bodyText}>NA</Text>
            <Divider style={{height: 1, width: '100%'}} />
          </View>
        </View>
      </View>
    </ScrollView>
    </BaseContainer>
  );
};

export default UserDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  headerImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  headerContent: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginRight: 60,
  },
  headerText: {
    fontSize: getProportionalFontSize(13),
    fontFamily: fonts.regular,
    color: Colors.black,
  },
  body: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    padding: 10,
    marginBottom: 10,   
    },
  bodyText: {
    fontSize: getProportionalFontSize(14),
    marginVertical: 4,
    fontFamily: fonts.regular,
    color: Colors.black,
  },
  bodyView: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    padding: 10,
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
    bodyHead: {
    fontSize: getProportionalFontSize(14), 
    fontFamily: fonts.bold,
    color: Colors.black,

    },
});
