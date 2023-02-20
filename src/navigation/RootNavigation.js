import React from 'react';
import {Text, View, StyleSheet, Animated, TouchableOpacity} from 'react-native';
// navigation packages
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';
import {CurvedBottomBar} from 'react-native-curved-bottom-bar';
//assets and methods
import Colors from '../assets/Colors';
import {getProportionalFontSize} from '../Services/CommonMethods';
// icon library
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
//helper components
import BaseContainer from '../components/BaseContainer';
//main screens
import Login from '../screen/Login';
import Forgot from '../screen/Forgot';
import SplashScreen from '../screen/SplashScreen';
import Home from './../screen/Home';
import SendSms from './../screen/SendSms';
import PhoneBookB from './../screen/PhoneBookB';
import Report from './../screen/Report';
import ChangePSD from './../screen/ChangePSD';
import CustomDrawer from '../screen/CustomDrawer';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CampaignDetailPage from './../screen/message/CampaignDetailPage';
import CampaignFilter from './../screen/message/CampaignFilter';
import ManageCampaign from '../screen/message/ManageCampaign';
import ResendCampaign from '../screen/message/ResendCampaign';
import EditProfile from '../screen/EditProfile';
import ChangePassword from '../screen/ChangePassword';
import Profile from '../screen/Profile';
// MessageChannel
import SendSMSForm from '../screen/message/SendSMSForm';
import SenderId from '../screen/message/senderId/SenderId';
import CampaignList from './../screen/message/CampaignList';
import AddDltTemplate from './../screen/message/dlt-template/AddDltTemplate';
import DltTemplateList from './../screen/message/dlt-template/DltTemplateList';
import ImportDltTemplate from './../screen/message/dlt-template/ImportDltTemplate';
import AssignUser from './../screen/message/dlt-template/AssignUser';
import AppInfo from '../screen/AppInfo';
import ChangePriority from '../screen/message/dlt-template/ChangePriority';
import SenderIdList from '../screen/message/senderId/SenderIdList';
import AssignSenderId from '../screen/message/senderId/AssignSenderId';
import Notification from '../screen/Notification';
import CampaignAdd from '../screen/message/CampaignAdd';
// Report / addcredit
import AddCredit from '../screen/report/AddCredit';
import Consumption from '../screen/report/Consumption';
import ScheduleCampaign from '../screen/report/ScheduleCampaign';
import CreditRequest from '../screen/report/CreditRequest';
import MobileReport from '../screen/report/MobileReport';

// import InvalidNumber from '../screen/InvalidNumber/InvalidNumber';
// phoneBook
import BlackList from '../screen/Phonebook/BlackList/BlackList_listing';
import PhoneBook from '../screen/Phonebook/PhonebookScreens/PhoneBookLIstingData';
// invalid Number
import InvalidNumber from '../screen/InvalidNumber/InvalidNumber';

//template
import TemplateFilter from '../screen/report/TemplateFilter';
import NotificationTemplate from '../screen/report/NotificationTemplate';

import TemplateDetail from '../screen/report/TemplateDetail';
//gateway screen

// import DlrCodeAdd from '../screen/gateway/dlrCode/DlrCodeAdd'
// import DlrCodeDetail from '../screen/gateway/dlrCode/DlrCodeDetail'
// import DlrCodeFilter from '../screen/gateway/dlrCode/DlrCodeFilter'
import DlrCodeList from '../screen/gateway/dlrCode/DlrCodeList';

import SmppList from '../screen/gateway/smpp/SmppList';
import SmppAdd from '../screen/gateway/smpp/SmppAdd';
import SmppDetail from '../screen/gateway/smpp/SmppDetail';
import SmppFilter from '../screen/gateway/smpp/SmppFilter';

import SecondGatewayList from '../screen/gateway/smppSecondary/SecondGatewayList';
// import SecondGatewayList from '../screen/gateway/smppSecondary/SecondGatewayList'
// import SecondGatewayList from '../screen/gateway/smppSecondary/SecondGatewayList'
// import SecondGatewayList from '../screen/gateway/smppSecondary/SecondGatewayList'

import CreditInfoList from '../screen/creditInfo/CreditInfoList';
import CreditInfoAdd from '../screen/creditInfo/CreditInfoAdd';
import DocUploadList from '../screen/uploadDoc/DocUploadList';
import UploadDoc from '../screen/uploadDoc/UploadDoc';
import PhoneView from '../screen/Phonebook/PhonebookScreens/PhoneView';

// notification Detail
import NotificationDetail from '../screen/NotificationDetail';
import UserManagement from '../screen/Phonebook/PhonebookScreens/UserManagement';
import UserAddFrom from '../screen/Phonebook/PhonebookScreens/UserAddFrom';
import UserDetail from '../screen/Phonebook/PhonebookScreens/UserDetail';
import AddGroup from '../screen/Phonebook/PhonebookScreens/AddGroup';
import AddBlockNumber from '../screen/Phonebook/BlackList/AddBlockNumber';
import Delivery from '../screen/report/Delivery';

//user operations

import OverView from '../screen/userOperations/OverView';
import UserRoute from '../screen/userOperations/UserRoute';
import ServerInfo from '../screen/userOperations/ServerInfo';
import AssignRoute from '../screen/Phonebook/PhonebookScreens/AssignRoute';
import TemplateForm from '../screen/report/TemplateForm';
import DeliveryFilter from '../screen/report/DeliveryFilter';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const SendSmsStack = () => (
  <Stack.Navigator initialRouteName="SendSms">
    {/* //message  */}
    <Stack.Screen
      options={{headerShown: false}}
      name="SendSms"
      component={SendSms}
    />
    <Stack.Screen
      options={{headerShown: false}}
      name="SendSMSForm"
      component={SendSMSForm}
    />
    <Stack.Screen
      options={{headerShown: false}}
      name="SenderId"
      component={SenderId}
    />
    <Stack.Screen
      options={{headerShown: false}}
      name="DltTemplateList"
      component={DltTemplateList}
    />
    <Stack.Screen
      options={{headerShown: false}}
      name="AssignUser"
      component={AssignUser}
    />
    <Stack.Screen
      options={{headerShown: false}}
      name="AddDltTemplate"
      component={AddDltTemplate}
    />
    <Stack.Screen
      options={{headerShown: false}}
      name="ImportDltTemplate"
      component={ImportDltTemplate}
    />
    <Stack.Screen
      options={{headerShown: false}}
      name="CampaignList"
      component={CampaignList}
    />
    <Stack.Screen
      options={{headerShown: false}}
      name="ChangePriority"
      component={ChangePriority}
    />
    <Stack.Screen
      options={{headerShown: false}}
      name="SenderIdList"
      component={SenderIdList}
    />
    <Stack.Screen
      options={{headerShown: false}}
      name="AssignSenderId"
      component={AssignSenderId}
    />
    <Stack.Screen
      options={{headerShown: false}}
      name="CampaignDetailPage"
      component={CampaignDetailPage}
    />
    <Stack.Screen
      options={{headerShown: false}}
      name="CampaignFilter"
      component={CampaignFilter}
    />
    <Stack.Screen
      options={{headerShown: false}}
      name="ManageCampaign"
      component={ManageCampaign}
    />
    <Stack.Screen
      options={{headerShown: false}}
      name="ResendCampaign"
      component={ResendCampaign}
    />
    <Stack.Screen
      options={{headerShown: false}}
      name="CampaignAdd"
      component={CampaignAdd}
    />
  </Stack.Navigator>
);

const InformationStack = () => (
  <Stack.Navigator initialRouteName="PhoneBookB">
    {/* //message  */}
    <Stack.Screen
      options={{headerShown: false}}
      name="PhoneBookB"
      component={PhoneBookB}
    />
    <Stack.Screen
      options={{headerShown: false}}
      name="BlackList"
      component={BlackList}
    />
    <Stack.Screen
      options={{headerShown: false}}
      name="AddBlockNumber"
      component={AddBlockNumber}
    />
    <Stack.Screen
      options={{headerShown: false}}
      name="PhoneBook"
      component={PhoneBook}
    />
    <Stack.Screen
      options={{headerShown: false}}
      name="PhoneView"
      component={PhoneView}
    />
    <Stack.Screen
      options={{headerShown: false}}
      name="AddGroup"
      component={AddGroup}
    />
    <Stack.Screen
      options={{headerShown: false}}
      name="AssignRoute"
      component={AssignRoute}
    />
    <Stack.Screen
      options={{headerShown: false}}
      name="UserManagement"
      component={UserManagement}
    />
    <Stack.Screen
      options={{headerShown: false}}
      name="UserAddFrom"
      component={UserAddFrom}
    />
    <Stack.Screen
      options={{headerShown: false}}
      name="UserDetail"
      component={UserDetail}
    />
  </Stack.Navigator>
);

const HomeStackForTab = () => (
  <Stack.Navigator initialRouteName="Home">
    {/* //message  */}
    <Stack.Screen options={{headerShown: false}} name="Home" component={Home} />
  </Stack.Navigator>
);

const ReportStack = () => (
  <Stack.Navigator initialRouteName="Report">
    {/* //message  */}
    <Stack.Screen
      options={{headerShown: false}}
      name="Report"
      component={Report}
    />
    <Stack.Screen
      options={{headerShown: false}}
      name="Delivery"
      component={Delivery}
    />
    <Stack.Screen
      options={{headerShown: false}}
      name="Consumption"
      component={Consumption}
    />
    <Stack.Screen
      options={{headerShown: false}}
      name="ScheduleCampaign"
      component={ScheduleCampaign}
    />
    <Stack.Screen
      options={{headerShown: false}}
      name="MobileReport"
      component={MobileReport}
    />
    <Stack.Screen
      options={{headerShown: false}}
      name="InvalidNumber"
      component={InvalidNumber}
    />
    <Stack.Screen
      options={{headerShown: false}}
      name="TemplateFilter"
      component={TemplateFilter}
    />
    <Stack.Screen
      options={{headerShown: false}}
      name="DeliveryFilter"
      component={DeliveryFilter}
    />
  </Stack.Navigator>
);

const ChangePasswordStack = () => (
  <Stack.Navigator initialRouteName="ChangePassword">
    {/* //message  */}
    <Stack.Screen
      options={{headerShown: false}}
      name="ChangePassword"
      component={ChangePSD}
    />
  </Stack.Navigator>
);

// const InformationStack = () => (
//     <Stack.Navigator initialRouteName='SendSms' >
//         {/* //message  */}
//         <Stack.Screen options={{ headerShown: false }} name="SendSms" component={SendSms} />
//     </Stack.Navigator>
// )

const TempScreenView = props => {
  return (
    <BaseContainer
      // onPressLeftIcon={() => props.navigation.openDrawer()}
      leftIcon="mail"
      title={props.route.name}
      headerBar={{backgroundColor: Colors.yellow}}>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>
          <Ionicons name="mail" size={20} color={'black'} />
        </Text>
      </View>
    </BaseContainer>
  );
};

const MyDrawer = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Tab"
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{
        drawerLabelStyle: {marginLeft: -24},
        drawerActiveBackgroundColor: '#FFAD33',
        drawerActiveTintColor: 'white',
        drawerInactiveTintColor: 'black',
        activeTintColor: 'white',
      }}>
      <Drawer.Screen
        name="Tab"
        component={MyTab}
        options={{
          drawerIcon: () => <AntDesign name="home" size={20} color="white" />,
          headerShown: false,
        }}
      />

      <Drawer.Screen
        name="Invalid Number"
        component={InvalidNumber}
        options={{
          drawerIcon: () => <AntDesign name="home" size={20} color="white" />,
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={Profile}
        options={{
          drawerIcon: () => <AntDesign name="user" size={20} color="white" />,
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="NotificationTemplate"
        component={NotificationTemplate}
        options={{
          drawerIcon: () => <AntDesign name="user" size={20} color="white" />,
          headerShown: false,
        }}
      />

      <Drawer.Screen
        name="CreditRequest"
        component={CreditRequest}
        options={{
          drawerIcon: () => (
            <MaterialCommunityIcons
              name="message-text-outline"
              size={20}
              color="white"
            />
          ),
          headerShown: false,
        }}
      />

      <Drawer.Screen
        name="TemplateForm"
        component={TemplateForm}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="AddCredit"
        component={AddCredit}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="TemplateDetail"
        component={TemplateDetail}
        options={{
          headerShown: false,
        }}
      />
      {/* userOperations  */}
      <Drawer.Screen
        name="Overview"
        component={OverView}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="UserRoute"
        component={UserRoute}
        options={{
          drawerIcon: () => (
            <FontAwesome name="phone-square" size={20} color="white" />
          ),
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="ServerInfo"
        component={ServerInfo}
        options={{
          drawerIcon: () => (
            <FontAwesome name="phone-square" size={20} color="white" />
          ),
          headerShown: false,
        }}
      />

      <Drawer.Screen
        name="Credit Info"
        component={CreditInfoList}
        options={{
          drawerIcon: () => (
            <FontAwesome name="phone-square" size={20} color="white" />
          ),
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Upload Document"
        component={DocUploadList}
        options={{
          drawerIcon: () => (
            <FontAwesome name="phone-square" size={20} color="white" />
          ),
          headerShown: false,
        }}
      />

      {/* gateway screen component */}

      <Drawer.Screen
        name="Smpp"
        component={SmppList}
        options={{
          drawerIcon: () => (
            <FontAwesome name="phone-square" size={20} color="white" />
          ),
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Smpp Secondary"
        component={SecondGatewayList}
        options={{
          drawerIcon: () => (
            <FontAwesome name="phone-square" size={20} color="white" />
          ),
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Dlr Code"
        component={DlrCodeList}
        options={{
          drawerIcon: () => (
            <FontAwesome name="phone-square" size={20} color="white" />
          ),
          headerShown: false,
        }}
      />
    </Drawer.Navigator>
  );
};

const _renderIcon = (routeName, selectedTab) => {
  let icon = '';
  let tab_name = '';
  switch (routeName) {
    case 'SendSmsStack':
      icon = routeName === selectedTab ? 'mail-sharp' : 'mail-outline';
      tab_name = 'SEND SMS';
      break;
    case 'InformationStack':
      icon = 'journal';
      tab_name = 'PHONE BOOK';
      break;

    case 'ReportStack':
      icon = 'ios-clipboard';
      tab_name = 'REPORT';
      break;
    case 'Notification':
      icon = 'notifications';
      tab_name = 'Notification';
      break;
  }

  return (
    <View style={{justifyContent: 'center', alignItems: 'center'}}>
      <Ionicons
        name={icon}
        size={25}
        color={routeName === selectedTab ? Colors.primary : 'gray'}
      />
      <Text
        style={[
          styles.tabTxt,
          {
            color: routeName === selectedTab ? Colors.primary : 'gray',
            marginLeft: 8,
          },
        ]}>
        {tab_name}
      </Text>
    </View>
  );
};
const renderTabBar = ({routeName, selectedTab, navigate}) => {
  return (
    <TouchableOpacity
      onPress={() => navigate(routeName)}
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {_renderIcon(routeName, selectedTab)}
    </TouchableOpacity>
  );
};

const MyTab = props => {
  // const [isBottomVisible, setVisible] =React.useState(true)
  const bottomTabRef = React.useRef();
  // function checkRef(){
  //         bottomTabRef.current.setVisible(false)
  // }
  // const route = useRoute();
  return (
    <CurvedBottomBar.Navigator
      ref={bottomTabRef}
      style={styles.bottomBar}
      strokeWidth={0.5}
      height={70}
      circleWidth={55}
      bgColor="white"
      initialRouteName="HomeStackForTab"
      renderCircle={({navigate}) => (
        <Animated.View style={styles.btnCircle}>
          <TouchableOpacity
            style={{flex: 1, justifyContent: 'center'}}
            onPress={() => {
              navigate('HomeStackForTab');
            }}>
            <Ionicons name={'apps-sharp'} color={Colors.white} size={25} />
          </TouchableOpacity>
        </Animated.View>
      )}
      tabBar={renderTabBar}>
      <CurvedBottomBar.Screen
        name="SendSmsStack"
        position="LEFT"
        component={SendSmsStack}
        options={() => ({headerShown: false})}
      />
      <CurvedBottomBar.Screen
        name="InformationStack"
        position="LEFT"
        options={() => ({headerShown: false})}
        component={InformationStack}
      />
      <CurvedBottomBar.Screen
        name="HomeStackForTab"
        position="CENTER"
        options={() => ({headerShown: false})}
        component={HomeStackForTab}
      />
      <CurvedBottomBar.Screen
        name="ReportStack"
        options={() => ({headerShown: false})}
        component={ReportStack}
        position="RIGHT"
      />
      <CurvedBottomBar.Screen
        name="Notification"
        options={() => ({headerShown: false})}
        component={Notification}
        position="RIGHT"
      />
    </CurvedBottomBar.Navigator>
  );

  // return (
  //         <Tab.Navigator initialRouteName='HomeStackForTab'
  //                 tabBarPosition='bottom'
  //                 screenOptions={{
  //                         'tabBarStyle':
  //                         {
  //                                 position: 'absolute',
  //                                 height: 100,
  //                                 borderTopRadius: 23,
  //                                 paddingTop: 20,
  //                                 left: 0,
  //                                 paddingBottom: 15,
  //                                 fontSize: 15,
  //                                 fontWeight: 'bold',
  //                                 elevation: 15,
  //                                 fontFamily: 'Poppins - Medium',
  //                                 fontSize: getProportionalFontSize(20),
  //                         },
  //                 }}
  //                 // screenOptions={{ headerShown: false }}
  //                 tabBarOptions={{
  //                         showLabel: false,
  //                 }}
  //         >
  //                 <Tab.Screen
  //                         options={({ route }) => ({
  //                                 tabBarIcon: ({ focused }) => {
  //                                         return (<View>
  //                                                 <Image source={img.sms} style={[style.tabImg, style.tabSmsImg, { tintColor: focused ? Colors.primary : 'rgba(0,0,0,0.8)', }]} />
  //                                                 {/* <Feather name='mail' size={25} color='black' /> */}
  //                                                 <Text style={[style.tabTxt, { color: focused ? Colors.primary : 'rgba(0,0,0,0.8)', }]}>Send sms</Text>
  //                                         </View>)
  //                                 },
  //                                 tabBarActiveTintColor: '#FFAD33',
  //                                 headerTitleStyle: { fontSize: 36 },
  //                                 headerTitleAlign: 'center',
  //                                 tabBarLabelPosition: true,
  //                                 headerShown: false,
  //                                 showLabel: false,
  //                         })}
  //                         name="SendSmsStack" component={SendSmsStack} />
  //                 <Tab.Screen
  //                         options={({ route }) => ({
  //                                 tabBarIcon: ({ focused, color, size }) => {
  //                                         return (
  //                                                 <View style={{ marginLeft: 3, }}><Image source={img.info} size={40} style={[style.tabImg, { tintColor: focused ? Colors.primary : 'black', marginLeft: 25 }]} />
  //                                                         <Text style={[style.tabTxt, { color: focused ? Colors.primary : 'rgba(0,0,0,0.8)', marginLeft: 8 }]}>Information</Text>
  //                                                 </View>)
  //                                 },
  //                                 tabBarActiveTintColor: '#FFAD33',
  //                                 headerTitleStyle: { fontSize: 36 },
  //                                 headerTitleAlign: 'center',
  //                                 headerShown: false,
  //                         })
  //                         }
  //                         name="InformationStack" component={InformationStack} />
  //                 <Tab.Screen
  //                         options={({ route }) => ({
  //                                 tabBarIcon: ({ focused, color, size }) => {
  //                                         return (
  //                                                 <View style={style.homeView}>
  //                                                         <ImageBackground style={[style.homeCircle, { backgroundColor: focused ? Colors.primary : 'rgba(0,0,0,0.8)' }]} >
  //                                                                 {/* <Image source={img.ellips} style={[style.homeCircle, { tintColor: focused ? Colors.primary : 'rgba(0,0,0,0.8)' }]} /> */}
  //                                                                 {/* <Image source={img.home} size={35} style={style.homeBtn} /> */}
  //                                                                 <Entypo name="home" size={35} color='white' style={style.homeIcon} />
  //                                                         </ImageBackground>
  //                                                 </View>
  //                                         )
  //                                 },
  //                                 headerShown: false,
  //                                 headerTitleStyle: { fontSize: 36 },
  //                                 headerTitleAlign: 'center',
  //                         })}
  //                         name="HomeStackForTab" component={HomeStackForTab} />
  //                 <Tab.Screen
  //                         options={({ route }) => ({
  //                                 tabBarIcon: ({ focused, color, size }) => {
  //                                         return (<View><Image source={img.report} size={40} color="black" style={[style.tabImg, { tintColor: focused ? Colors.primary : 'black' }]} />
  //                                                 <Text style={[style.tabTxt, { color: focused ? Colors.primary : 'rgba(0,0,0,0.8)' }]}>Report</Text>
  //                                         </View>)
  //                                 },
  //                                 tabBarActiveTintColor: '#FFAD33',
  //                                 headerTitleStyle: { fontSize: 36 },
  //                                 headerTitleAlign: 'center',
  //                                 headerShown: false,
  //                         })}
  //                         name="ReportStack" component={ReportStack} />
  //                 <Tab.Screen
  //                         options={({ route }) => ({
  //                                 tabBarIcon: ({ focused, color, size }) => {
  //                                         return (<View>
  //                                                 <Image source={img.password} size={70} color="black" style={[style.tabImg, { tintColor: focused ? Colors.primary : 'black' }]} />
  //                                                 <Text style={[style.tabTxt, { color: focused ? Colors.primary : 'rgba(0,0,0,0.8)' }]}>Password</Text>
  //                                         </View>
  //                                         )
  //                                 },
  //                                 tabBarActiveTintColor: '#FFAD33',
  //                                 headerTitleStyle: { fontSize: 36 },
  //                                 headerTitleAlign: 'center',
  //                                 headerShown: false,
  //                         })}
  //                         name="ChangePasswordStack" component={ChangePasswordStack} />
  //         </Tab.Navigator >
  // )
};

export default function RootNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen">
        <Stack.Screen
          options={{headerShown: false}}
          name="SplashScreen"
          component={SplashScreen}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="Login"
          component={Login}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="Forgot"
          component={Forgot}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="MyDrawer"
          component={MyDrawer}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="EditProfile"
          component={EditProfile}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="ChangePassword"
          component={ChangePassword}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="AppInfo"
          component={AppInfo}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="SmppAdd"
          component={SmppAdd}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="SmppFilter"
          component={SmppFilter}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="SmppDetail"
          component={SmppDetail}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="CreditInfoList"
          component={CreditInfoList}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="CreditInfoAdd"
          component={CreditInfoAdd}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="UploadDoc"
          component={UploadDoc}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="DocUploadList"
          component={DocUploadList}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="NotificationDetail"
          component={NotificationDetail}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
const styles = StyleSheet.create({
  homeIcon: {
    // zIndex: 2,
    tintColor: 'red',
    // marginBottom: 50,
    position: 'absolute',
    marginHorizontal: 18,
    marginVertical: 14,
    tintColor: 'white',
  },
  homeCircle: {
    // position: 'absolute',

    height: 70,
    width: 70,
    borderRadius: 100,
    tintColor: Colors.primary,
    // position: 'relative',
    elevation: 10,
    // marginHorizontal: 70,
    // marginBottom: 50,
    marginBottom: 40,
    // elevation: 10,
    // borderColor: 'white',
    // zIndex:
    // backgroundColor: '#FFAD33'
  },
  tabTxt: {
    // fontFamily: fonts.regular
    fontSize: getProportionalFontSize(10),
    // textAlign: 'center',
    // marginTop: 8
  },
  tabImg: {
    marginHorizontal: 15,
  },
  tabSmsImg: {
    height: 17,
    width: 24,
    marginBottom: 1,
    marginTop: 3,
  },
  homeView: {
    marginBottom: 40,
    // marginHorizontal: 85,
    // elevation: 15
  },

  //---------------------------------------------------------
  container: {
    flex: 1,
    padding: 20,
  },
  button: {
    marginVertical: 5,
  },
  bottomBar: {marginBottom: 0, paddingBottom: 0},
  btnCircle: {
    width: 60,
    height: 60,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0.5,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 1,
    bottom: 30,
  },
  imgCircle: {
    width: 30,
    height: 30,
    tintColor: 'gray',
  },
  img: {
    width: 30,
    height: 30,
  },
});
