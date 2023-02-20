import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import BaseContainer from './../components/BaseContainer';
import {img} from '../assets/Assets';
import {fonts} from '../assets/Assets';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; 
import Colors from '../assets/Colors';
import {getProportionalFontSize} from '../Services/CommonMethods'; 

const BnHome = ({navigation}) => {
  return (
    <BaseContainer
      title="Report"
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
            onPress={() => navigation.navigate('Delivery')}>
            <Image style={styles.icon} source={img.delivery} />
            <Text style={styles.textStyles}>Delivery</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cartContainer}
            onPress={() => navigation.navigate('Consumption')}>
            <Image style={styles.icon} source={img.expenses} />
            <Text style={styles.textStyles}>Message Consumption</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            style={styles.cartContainer}
            onPress={() => navigation.navigate('ScheduleCampaign')}>
            <MaterialIcons
              name="campaign"
              size={25}
              color={Colors.primary}
              style={styles.icon}
            />
            <Text style={styles.textStyles}>Schedule Campaign</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cartContainer}
            onPress={() => navigation.navigate('MobileReport')}>
            <Image style={styles.icon} source={img.report} />

            <Text style={styles.textStyles}>Mobile Report</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </BaseContainer>
  );
};

export default BnHome;

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
    width: 25,
    height: 25,
  },
});
