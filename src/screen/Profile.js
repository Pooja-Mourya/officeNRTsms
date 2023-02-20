import {StyleSheet, Text, View, Image} from 'react-native';
import React, {useState,useEffect} from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {Divider} from 'react-native-paper';
import {useSelector} from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Constants from '../constant/Constants'; 
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {getProportionalFontSize} from '../Services/CommonMethods';
import CustomButton from '../components/CustomButton'; 
import {fonts} from '../assets/Assets';
import Colors from '../assets/Colors';

const Profile = ({navigation}) => {
  const UserLogin = useSelector(state => state?.global_store?.userLogin);
  const adminEmpData  = useSelector(state => state?.global_store?.adminEmpData);
  const [data, setData] = useState(); 

  useEffect(() => {
     if(adminEmpData){
       setData(adminEmpData)
     }
  }, []) 
 
 

  return (
    <BaseContainer
      title="Profile"
      leftIcon="menu"
      rightIcon="vpn-key"
      onPressLeftIcon={() => navigation.openDrawer()}
      onPressRightIcon={() => navigation.navigate('AppInfo')}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 150}}
        style={{
          flex: 1,
          backgroundColor: Colors.white,
        }}
      >
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: Colors.primary,
            height: '35%',
          }}
        >
          <Image
            source={{
              uri: ( UserLogin?.userType == 0 || UserLogin?.userType == 3)? Constants.base_url2 + data?.app_logo :Constants.base_url2+ UserLogin?.companyLogo 
            }}
            style={style.ImageView}
          />
          <Text style={style.userName}>{UserLogin?.name}</Text>
          <Text
            style={{
              color: Colors.white,
              fontSize: getProportionalFontSize(14),
              fontFamily: fonts?.semiBold,

            }}
          >
            ({' '}
            {UserLogin?.userType === 0
              ? 'Company'
              : UserLogin?.userType === 1
              ? 'Reseller'
              : UserLogin?.userType === 2
              ? 'Client'
              : UserLogin?.userType === 3
              ? 'Employee'
              : null}
            )
          </Text>
        </View>

        <View style={style.section}>
          <Text
            style={{
              fontSize: getProportionalFontSize(20),
              color: '#000',
              fontFamily: fonts.semiBold,
            }}
          >
            Personal Details
          </Text>
          {UserLogin.userType === 0 || UserLogin.userType === 3 ? (
            <View>
              <Text style={style.view}>Name</Text>
              <View style={style.viewstyle}>
                <Fontisto name="person" size={20} />
                <Text style={style.text}>{data?.app_name}</Text>
              </View>

              <Divider style={style.divider} />
              <Text style={style.view}>Contact Number</Text>
              <View style={style.viewstyle}>
                <Fontisto name="phone" size={20} color="grey" />
                <Text style={style.text}>{data?.contact_number}</Text>
              </View>
              <Divider style={style.divider} />
              <Text style={style.view}>Contact Email</Text>
              <View style={style.viewstyle}>
                <Fontisto name="email" size={20} />
                <Text style={style.text}>{data?.contact_email}</Text>
              </View>
              <Divider style={style.divider} />
              <Text style={style.view}>Contact Address</Text>
              <View style={style.viewstyle}>
                <MaterialIcons name="location-on" size={20} />
                <Text style={style.text}>{data?.contact_address}</Text>
              </View>
              <Divider style={style.divider} />
              <Text style={style.view}>File Generation</Text>
              <View style={style.viewstyle}>
                <MaterialIcons name="file-present" size={20} />
                <Text style={style.text}>{data?.file_gen_if_exceed}</Text>
              </View>
              <Divider style={style.divider} />
              <Text style={style.view}>Order Start</Text>
              <View style={style.viewstyle}>
                <FontAwesome name="first-order" size={20} />
                <Text style={style.text}>{data?.order_no_start}</Text>
              </View>
              <Divider style={style.divider} />
              <Text style={style.view}>Tax Percentage</Text>
              <View style={style.viewstyle}>
                <FontAwesome name="percent" size={20} />
                <Text style={style.text}>{data?.tax_percentage}</Text>
              </View>
            </View>
          ) : <View
          style={{
            flex: 1,
            alignContent: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={style.view}>Name</Text>
          <View style={style.viewstyle}>
            <Fontisto name="person" size={20} />
            <Text style={style.text}>{UserLogin?.name}</Text>
          </View>
          <Divider style={style.divider} />
          <Text style={style.view}>Contact Number</Text>
          <View style={style.viewstyle}>
            <Fontisto name="phone" size={20} color="grey" />
            <Text style={style.text}>{UserLogin?.mobile}</Text>
          </View>
          <Divider style={style.divider} />
          <Text style={style.view}>Address</Text>
          <View style={style.viewstyle}>
            <MaterialIcons name="location-on" size={20} />
            <Text style={style.text}>{UserLogin?.address}</Text>
          </View>
          <Divider style={style.divider} />
          <Text style={style.view}>Website Url</Text>
          <View style={style.viewstyle}>
            <MaterialCommunityIcons name="web" size={20} />
            <Text style={style.text}>{UserLogin?.websiteUrl}</Text>
          </View>
          <Divider style={style.divider} />
          <Text style={style.view}>City</Text>
          <View style={style.viewstyle}>
            <MaterialCommunityIcons name="city" size={20} />
            <Text style={style.text}>
              {UserLogin?.city}, {UserLogin?.zipCode}
            </Text>
          </View>
          <Divider style={style.divider} />
          <Text style={style.view}>Designation</Text>
          <View style={style.viewstyle}>
            <MaterialCommunityIcons name="material-design" size={20} />
            <Text style={style.text}>{UserLogin?.designation}</Text>
          </View>
          <Divider style={style.divider} />
          <Text style={style.view}>Company Name</Text>
          <View style={style.viewstyle}>
            <MaterialCommunityIcons name="material-design" size={20} />
            <Text style={style.text}>{UserLogin?.companyName}</Text>
          </View>
          <Divider style={style.divider} />
          <Text style={style.view}> Locktimeout</Text>
          <View style={style.viewstyle}>
            <MaterialCommunityIcons
              name="clock-time-ten-outline"
              size={20}
            />
            <Text style={style.text}>{UserLogin?.locktimeout}Minutes</Text>
          </View>
        </View>} 
        </View>
        <View
          style={{
            marginHorizontal: 16,
          }}
        >
          <CustomButton
            title="Edit Profile"
            onPress={() => {
              UserLogin?.userType == 0 || UserLogin?.userType == 3
                ? navigation?.navigate('EditProfile', {data: data})
                : navigation.navigate('EditProfile');
            }}
          />
          <CustomButton
            title="Change Password"
            onPress={() => {
              navigation?.navigate('ChangePassword', {user: null});
            }}
          />
        </View>
      </ScrollView>
    </BaseContainer>
  );
};

export default Profile;

const style = StyleSheet?.create({
  userName: {
    fontSize: getProportionalFontSize(20), 
    color: Colors.white,
    marginTop: 10,
    fontFamily:fonts.bold
  },
  section: {
    marginVertical: 20,
    backgroundColor: 'transparent',
    padding: Constants.globalPadding * 1.5,
  },
  view: {
    paddingLeft: 35,
    fontSize: getProportionalFontSize(14),
    color: Colors.black,
    fontFamily: fonts.medium,

  },
  viewstyle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
  },
  text: {
    fontSize: getProportionalFontSize(12),
    color: '#000',
    marginLeft: 20,
    fontFamily: fonts.regular,
    
  },
  divider: {
    width: '100%',
    height: 2,
    margin: 5,
  },
  ImageView: {
    width: 130,
    height: 130,
    borderRadius: 65,
  },
});
