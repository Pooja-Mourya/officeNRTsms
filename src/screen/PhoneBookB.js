import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import BaseContainer from '../components/BaseContainer';
import {fonts, img} from '../assets/Assets'; 
import {getProportionalFontSize} from '../Services/CommonMethods';
import Colors from '../assets/Colors';
import { useSelector } from 'react-redux';

const PhoneBookB = ({navigation}) => {
  const userLogin = useSelector(state => state.global_store.userLogin);
  return (
    <BaseContainer
      title="Phone Book"
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
         {userLogin?.userType==2?null:<TouchableOpacity
            style={styles.cartContainer}
            onPress={() => navigation.navigate('UserManagement')}>
            <Feather
              name="user-plus"
              size={25}
              color={Colors.primary}
              style={styles.icon}
            />
            <Text style={styles.textStyles}>User Management</Text>
          </TouchableOpacity>}
          <TouchableOpacity
            style={styles.cartContainer}
            onPress={() => navigation.navigate('PhoneBook')}>
            <MaterialCommunityIcons
              name="card-account-phone"
              size={25}
              color={Colors.primary}
              style={styles.icon}
            />
            <Text style={styles.textStyles}>Phone Book</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            style={styles.cartContainer}
            onPress={() => navigation.navigate('BlackList')}>
            <Image
              source={img.blacklist}
              style={styles.icon}
              width={40}
              height={40}
              borderRadius={25}
            />
            <Text style={styles.textStyles}>Black List</Text>
          </TouchableOpacity> 
        </View>
      </ScrollView>
    </BaseContainer>
  );
};

export default PhoneBookB;

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
    width: 155,
    display: 'flex',
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
