import {
  StyleSheet,
  Text,
  View, 
  ScrollView,
  Dimensions,
} from 'react-native';
import React from 'react'; 
import BaseContainer from './../components/BaseContainer';
import {img, fonts} from '../assets/Assets';
import {useSelector, useDispatch} from 'react-redux';
import {} from '../redux/reduxSlicer';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather'; 
import {CircularProgressBase} from 'react-native-circular-progress-indicator'; 
import Constants from '../constant/Constants';
import APIService from '../Services/APIService';
import {getProportionalFontSize} from '../Services/CommonMethods';
import TransparentLoader from '../components/TransparentLoader'; 
import Colors from '../assets/Colors';
import {AdminEmpData} from '../redux/reduxSlicer';
// import {useSelector,useDispatch} from 'react-redux';

const Home = ({navigation}) => {
  // Redux Hook
  const dispatch = useDispatch();
  const UserLogin  = useSelector(state => state?.global_store?.userLogin);
  const adminEmpData  = useSelector(state => state?.global_store?.adminEmpData);

 

  const [creditInfo, setCreditInfo] = React.useState({});
  const [serverInfo, setServerInfo] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(true);   
  const delivered = parseInt(creditInfo?.total_delivered);
  const failed =   parseInt(creditInfo?.total_failed);
  const invalid =  parseInt(creditInfo?.total_invalid_number); 
  const total =  delivered + failed + invalid;
  const deliveredPercent = (delivered / total) * 100;
  const failedPercent = (failed / total) * 100;
  const invalidPercent = (invalid / total) * 100; 


  const Dashboard = async () => {
    setIsLoading(true);
    let url = Constants.apiEndPoints['dashboard'];
    let response = await APIService.postData(
      url,
      {},
      UserLogin.access_token,
      null,
      'dashboard',
    );
    if (!response.errorMsg) {
      setIsLoading(false);
      setCreditInfo(response?.data?.data);
    } else {
      setIsLoading(false);
      console.log('error', response.errorMsg??'Something went wrong');
    }
  };
  const ServerApi = async () => {
    let url = Constants.apiEndPoints.serverInfo;
    let response = await APIService.getData(
      url,
      UserLogin.access_token,
      null,
      'serverInfo',
    );
    if (!response.errorMsg) {
      setServerInfo(response?.data?.data);
    } else {
      console.log('error', response.errorMsg??'Something went wrong');
    }
  }; 


  React.useEffect(() => { 
        Dashboard();
        ServerApi(); 
    // const interval = setInterval(() => {
    //   ServerApi();
    // }, 5000);
    // return () => clearInterval(interval); 
      getUserProfile();
  }, [UserLogin.access_token]); 

 

const getUserProfile = async () => { 
    let url = Constants.apiEndPoints['get-app-setting'];
    // return
    let response = await APIService.getData(
      url,
      UserLogin.access_token,
      null,
      'getUserProfile',
    );
    if (!response.errorMsg) {  
      dispatch(AdminEmpData(response?.data?.data));
    } else { 
      console.log('err', response.errorMsg);
    }
  };


  const Circle = {
    activeStrokeWidth: 10,
    inActiveStrokeWidth: 10,
    inActiveStrokeOpacity: 0.2,
  };
 
  return (
    <BaseContainer
      title="Dashboard"
      leftIcon="menu"
      // rightIcon="add-road"
      onPressLeftIcon={() => navigation.openDrawer()}>
      <TransparentLoader isLoading={isLoading} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 60}}>
        <View style={styles.topHome}>
          {/* Dashboard Dummy Card ui design in react native */} 
          {UserLogin?.userType==0?<View>
            <Text style={styles.headingText}>Dashboard</Text>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              <View>
                <View style={styles.homeHeading}>
                  <View style={{flexDirection: 'row'}}>
                    <View style={styles.imgContainer}> 
                      <MaterialCommunityIcons name="access-point-network" size={14} color="#28c76f" />
                    </View>
                    <Text style={styles.smsImg}>{`Established${'\n'}Connections`}</Text>
                  </View>
                  <View>
                    <Text style={styles.count}>
                      {serverInfo?.established_connections}
                    </Text> 
                  </View>
                </View>
                <View style={styles.homeHeading}>
                  <View style={{flexDirection: 'row'}}>
                    <View style={styles.imgContainer}>
                      <MaterialCommunityIcons
                        name="access-point-network"
                        size={14}
                        color="#28c76f"
                      />
                    </View>
                    <Text style={ styles.smsImg }>Total Connections</Text>
                  </View>
                  <View>
                    <Text style={styles.count}>
                      {serverInfo?.total_connections}
                    </Text> 
                  </View>
                </View> 
              </View>
              <View>
                <View style={ styles.homeHeading }>
                  <View style={{flexDirection: 'row'}}>
                    <View style={styles.imgContainer}>
                      <MaterialCommunityIcons name="language-php" size={14} color="#28c76f" />
                    </View>
                    <Text style={styles.smsImg}>Php Version</Text>
                  </View>
                  <View>
                    <Text style={ styles.count }>
                      {serverInfo?.php_version}
                    </Text> 
                  </View>
                </View>
                <View style={ styles.homeHeading }>
                  <View style={{flexDirection: 'row'}}>
                    <View style={styles.imgContainer}>
                      <MaterialCommunityIcons
                        name="language-php"
                        size={14}
                        color="#28c76f"
                      />
                    </View>
                    <Text style={ styles.smsImg }>Php Load in Gb</Text>
                  </View>
                  <View>
                    <Text style={styles.count }>
                      {serverInfo?.php_load_gb}
                    </Text> 
                  </View>
                </View>
              </View>
              <View>
                <View style={styles.homeHeading }>
                  <View style={{flexDirection: 'row'}}>
                    <View style={styles.imgContainer}>
                      <Feather name="server" size={14} color="#28c76f" />
                    </View>
                    <Text style={styles.smsImg}>Server Name</Text>
                  </View>
                  <View>
                    <Text style={ styles.count }>
                      {serverInfo?.server_name}
                    </Text> 
                  </View>
                </View>
                <View  style={ styles.homeHeading }>
                  <View style={{flexDirection: 'row'}}>
                    <View style={styles.imgContainer}>
                      <Feather
                        name="server"
                        size={14}
                        color="#28c76f"
                      />
                    </View>
                    <Text style={ styles.smsImg }>Server Address</Text>
                  </View>
                  <View>
                    <Text style={ styles.count }>
                      {serverInfo?.server_addr}
                    </Text> 
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>:null}

          {/* Credit info */}
          <View>
            <Text style={styles.headingText}>Credit Info</Text>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              <View style={styles.homeHeading}>
                <View style={{flexDirection: 'row'}}>
                  <View style={styles.imgContainer}>
                    <FontAwesome5 name="rupee-sign" size={14} color="#28c76f" />
                  </View>
                  <Text style={styles.smsImg}>Transaction</Text>
                </View>
                <View>
                  <Text style={ styles.count }>
                    {creditInfo?.credit_info?.transaction}
                  </Text>
                  <Text style={styles.info}>Total no. of Transaction SMS</Text>
                </View>
              </View>
              <View style={styles.homeHeading}>
                <View style={{flexDirection: 'row'}}>
                  <View
                    style={ styles.imgContainer }>
                    <MaterialIcons
                      name="settings-voice"
                      size={17}
                      color="#00cfe8"
                    />
                  </View>

                  <Text style={styles.smsImg}>Voice</Text>
                </View>
                <View>
                  <Text style={ styles.count }>
                    {creditInfo?.credit_info?.voice_sms}
                  </Text>
                  <Text style={styles.info}>Total no. of Voice SMS</Text>
                </View>
              </View>
              <View style={styles.homeHeading}>
                <View style={{flexDirection: 'row'}}>
                  <View
                    style={ styles.imgContainer }>
                    <MaterialIcons
                      name="control-camera"
                      size={17}
                      color="#5058b8"
                    />
                  </View>
                  <Text style={styles.smsImg}>Promotional</Text>
                </View>
                <View>
                  <Text style={ styles.count}>
                    {creditInfo?.credit_info?.promotional}
                  </Text>
                  <Text style={styles.info}>Total no. of Promotional SMS</Text>
                </View>
              </View>
              <View style={styles.homeHeading}>
                <View style={{flexDirection: 'row'}}>
                  <View style={ styles.pswdImg }>
                    <Octicons name="arrow-switch" size={16} color="#ff9f43" />
                  </View>
                  <Text style={styles.smsImg}>Two-Way</Text>
                </View>
                <View>
                  <Text style={ styles.count }>
                    {creditInfo?.credit_info?.two_waysms}
                  </Text>
                  <Text style={styles.info}>Total no. of Two-Way SMS</Text>
                </View>
              </View>
            </ScrollView>
          </View>
          {/* Other info */}
          <View>
            <Text style={styles.headingText}>Other Info</Text>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              {UserLogin?.userType==2?null: <View style={styles.homeHeading}>
              <View style={{flexDirection: 'row'}}>
                  <View style={styles.imgContainer}>
                    <FontAwesome5 name="user" size={14} color="#28c76f" />
                  </View>
                  <Text style={styles.smsImg}>User</Text>
                </View>
                <View>
                  <Text style={ styles.count }>
                    {creditInfo?.total_users}
                  </Text>
                  <Text style={styles.info}>Total no. of Users</Text>
                </View>
              </View>}
              <View style={styles.homeHeading}>
                <View style={{flexDirection: 'row'}}>
                  <View style={styles.imgContainer}>
                    <Ionicons
                      name="hourglass-outline"
                      size={14}
                      color="#28c76f"
                    />
                  </View>
                  <Text style={styles.smsImg}>Process</Text>
                </View>
                <View>
                  <Text style={ styles.count }>
                    {creditInfo?.total_process}
                  </Text>
                  <Text style={styles.info}>Total no. of Process</Text>
                </View>
              </View>
            </ScrollView>
          </View>
          <View>
            <Text style={styles.headingText}>Status</Text>
            <View style={styles.imgContainer1}>
              <View style={styles.smsView}>
                <CircularProgressBase
                  {...Circle}
                  value={deliveredPercent==NaN?0:deliveredPercent}
                  radius={60}
                  activeStrokeColor={'#533483'}
                  inActiveStrokeColor={'#533483'}>
                  <CircularProgressBase
                    {...Circle}
                    value={failedPercent==NaN?0:failedPercent}
                    radius={40}
                    activeStrokeColor={'#FF9551'}
                    inActiveStrokeColor={'#FF9551'}>
                    <CircularProgressBase
                      {...Circle}
                      value={invalidPercent==NaN?0:invalidPercent}
                      radius={20}
                      activeStrokeColor={'#FF4A4A'}
                      inActiveStrokeColor={'#FF4A4A'}
                    />
                  </CircularProgressBase>
                </CircularProgressBase>
                <View style={styles.smsTxt}>
                  <View style={{flexDirection: 'row', margin: 5}}>
                    <View style={styles.round} />
                    <Text style={styles.text}>Delivered</Text>
                  </View>
                  <View style={{flexDirection: 'row', margin: 5}}>
                    <View style={styles.round1} />
                    <Text style={styles.text}>Failed</Text>
                  </View>
                  <View style={{flexDirection: 'row', margin: 5}}>
                    <View style={styles.round2} />
                    <Text style={styles.text}>Invalid</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </BaseContainer>
  );
};

export default Home;

const styles = StyleSheet.create({
  topHome: {
    flex: 1,
    width: '100%',
    paddingHorizontal: getProportionalFontSize(10),
    paddingVertical: getProportionalFontSize(10),
  },
 
  headingText: {
    fontSize: getProportionalFontSize(18),
    color: Colors.black,
    marginTop: 5,
    fontFamily: fonts.bold,
  },

  count: {
    fontSize: getProportionalFontSize(16),
    color: Colors.sky,
    textAlign: 'center',
    fontFamily: fonts.medium,
  },
  info: {
    fontSize: getProportionalFontSize(12),
    color:  Colors.gray,
    color: 'grey',
    fontFamily: fonts.regular,
  },
  homeHeading: {
    width:  Dimensions.get('window').width / 1.8,
    height:90,
    backgroundColor: '#fff',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 5,
    shadowOpacity: 0.9,
    padding: 5,
    margin: 10,  

  },
  smsImg: {
    fontSize: getProportionalFontSize(16),
    color:  Colors.black,
    fontFamily: fonts.medium,
    paddingLeft: 5, 
  },
  imgContainer: {
    width: 25,
    height: 25,
    backgroundColor: '#CCEDD2',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgContainer1: {
    width: '95%',
    height: undefined,
    backgroundColor: '#fff',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 5,
    shadowOpacity: 0.9,
    margin: 10,
    marginHorizontal: 10,
  },
  infoImg: {
    width: 30,
    height: 30,
    backgroundColor: 'lightblue',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reportImg: {
    width: 30,
    height: 30,
    backgroundColor: '#E7EAF6',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pswdImg: { 
    width: 30,
    height: 30,
    backgroundColor: '#FDEEDC',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  smsView: {
    flexDirection: 'row',
    margin: 10,
    justifyContent: 'space-between',
  },
  smsTxt: {
    flexDirection: 'column',
    padding: 5,
  },
  text: {
    fontSize:  getProportionalFontSize(14),
    color:  Colors.black,
    marginLeft: 10,
    fontFamily: fonts.regular,


  },
  round: {
    width: 20,
    height: 20,
    borderRadius: 15, 
    backgroundColor: '#533485', 
  },
  round1: {
    width: 20,
    height: 20,
    borderRadius: 15, 
    backgroundColor: '#FF9553',
  },
  round2: {
    width: 20,
    height: 20,
    borderRadius: 15, 
    backgroundColor: '#FF4A4C',
  },
});
