import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React from 'react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import BaseContainer from '../components/BaseContainer';
import {fonts} from '../assets/Assets';
import {getProportionalFontSize} from '../Services/CommonMethods';
import Colors from '../assets/Colors';

const SendSms = ({navigation}) => {
  return (
    <BaseContainer
      title="Send Sms"
      leftIcon="menu"
      onPressLeftIcon={() => navigation.openDrawer()}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            style={styles.cartContainer}
            onPress={() => navigation.navigate('SendSMSForm')}>
            <FontAwesome5
              name="sms"
              size={25}
              color={Colors.primary}
              style={styles.icon}
            />
            <Text style={styles.textStyles}>Send SMS</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cartContainer}
            onPress={() => navigation.navigate('DltTemplateList')}>
            <FontAwesome
              name="th-list"
              size={25}
              color={Colors.primary}
              style={styles.icon}
            />
            <Text style={styles.textStyles}>DltTemplate List</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            style={styles.cartContainer}
            onPress={() => navigation.navigate('SenderIdList')}>
            <FontAwesome
              name="id-badge"
              size={25}
              color={Colors.primary}
              style={styles.icon}
            />
            <Text style={styles.textStyles}>Sender Id</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cartContainer}
            onPress={() => navigation.navigate('CampaignList')}>
            <Feather
              name="grid"
              size={25}
              color={Colors.primary}
              style={styles.icon}
            />
            <Text style={styles.textStyles}>Campaign List</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </BaseContainer>
  );
};
export default SendSms;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 16,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartContainer: {
    backgroundColor: '#fff5e6',
    elevation: 5,
    borderRadius: 15,
    marginVertical: 30,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    justifyContent: 'center',
    width: '45%', 
    height: 150,
    alignItems: 'center',
  },
  textStyles: {
    textAlign: 'center',
    fontFamily: fonts.bold,
    color: Colors.primary,
    fontSize: getProportionalFontSize(16),
  },
  icon: {
    textAlign: 'center',
    marginBottom: 10,
  },
});
