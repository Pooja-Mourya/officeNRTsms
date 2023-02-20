import {
    ImageBackground,
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    Alert,
} from 'react-native';
import React from 'react';
// import { DrawerContentScrollView,  } from '@react-navigation/drawer';
import { img, fonts } from '../assets/Assets';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector, useDispatch } from 'react-redux';

import {
    useTheme,
    Avatar,
    Title,
    Caption,
    Paragraph,
    Drawer,
    Switch,
    Portal,
    Modal,
} from 'react-native-paper';

import {
    DrawerContentScrollView,
    DrawerItem,
    DrawerItemList,
} from '@react-navigation/drawer';
import Colors from '../assets/Colors';
import { getProportionalFontSize } from '../Services/CommonMethods';
import LogOutModal from '../components/LogOutModal';
import AsyncStorageService from '../Services/AsyncStorageService';
import Constants from '../constant/Constants';
import { UserLoginAction } from '../redux/reduxSlicer';
import { CommonActions } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Octicons from 'react-native-vector-icons/Octicons';

const CustomDrawer = props => {
    // redux hooks
    const dispatch = useDispatch();
    const UserLogin = useSelector(state => state.global_store.userLogin);
    const adminEmpData  = useSelector(state => state?.global_store?.adminEmpData);
    // hooks
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [isLoggingOut, setIsLoggingOut] = React.useState(false);
    const [NestedDrawerItem, setNesTedDrawerItem] = React.useState(false);
    const [NestedDrawerGateway, setNesTedDrawerGateway] = React.useState(false);
    const [userOperationsDrawer, setUserOperationsDrawer] = React.useState(false);
 

    // nestes drawer item function
    const NesDrawerGatewayFun = () => {
        if (NestedDrawerGateway == true) {
            setNesTedDrawerGateway(false);
        } else {
            setNesTedDrawerGateway(true);
        }
    };

    const NesDrawerUserOperationsFun = () => {
        if (userOperationsDrawer == true) {
            setUserOperationsDrawer(false);
        } else {
            setUserOperationsDrawer(true);
        }
    };

    const NesDrawerItemFun = () => {
        if (NestedDrawerItem == true) {
            setNesTedDrawerItem(false);
        } else {
            setNesTedDrawerItem(true);
        }
    };

    const onRequestClose = () => {
        setIsLoggingOut(false);
        setIsModalVisible(false);
    };

    const navigateToLogin = () => {
        props.navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            }),
        );
    };

    const logout = async () => {
        try {
            await AsyncStorageService._removeData(
                Constants.asyncStorageKeys.user_login,
            );
            onRequestClose();
            dispatch(UserLoginAction({}));
            navigateToLogin();
        } catch (error) {
            onRequestClose();
            Alert.alert('message_something_went_wrong');
        }
    };

 
    return (
        <DrawerContentScrollView
            {...props}
            contentContainerStyle={{ backgroundColor: '#fff', marginTop: 0 }}>
            <ImageBackground
                style={{ height: 150, width: '100%', backgroundColor: '#fff' }}>
                <Image
                    source={{ uri: (UserLogin?.userType == 0 ||UserLogin?.userType == 3)  ? Constants.base_url2 + adminEmpData?.app_logo :  Constants.base_url2 +UserLogin?.companyLogo }}

                  
                    style={{
                        height: 70,
                        width: 70,
                        borderRadius: 50,
                        marginVertical: 20,
                        left: 15,
                    }}
                />
                <Text style={{ marginLeft: 15, marginTop: 0, fontFamily: fonts.medium }}>
                    {UserLogin?.name ?? UserLogin?.username ?? UserLogin.email}
                </Text>
            </ImageBackground>

            <View style={{ backgroundColor: '#fff', paddingTop: 10, height: '100%' }}>
                {/* <DrawerItemList {...props} /> */}
                <Drawer.Section style={styles.drawerSection}>
                    <DrawerItem
                        style={{ marginTop: 0 }}
                        icon={({ color, size }) => (
                            <FontAwesome5 name="user-alt" size={20} color={Colors.primary} />
                        )}
                        labelStyle={styles.labelStyle}
                        label={'Profile'}
                        onPress={() => {
                            props.navigation.navigate('Profile');
                        }}
                    />
                    <DrawerItem
                        style={{ marginTop: 0 }}
                        icon={({ color, size }) => (
                            <FontAwesome5 name="copy" size={20} color={Colors.primary} />
                        )}
                        labelStyle={styles.labelStyle}
                        label={'Credit Info'}
                        onPress={() => {
                            props.navigation.navigate('CreditInfoList');
                        }}
                    />

                    <DrawerItem
                        style={{ marginTop: 1 }}
                        icon={({ color, size }) => (
                            <Entypo name="upload" size={20} color={Colors.primary} />
                        )}
                        labelStyle={styles.labelStyle}
                        label={'Upload Document'}
                        onPress={() => {
                            props.navigation.navigate('DocUploadList');
                        }}
                    />
                    {UserLogin?.userType === 0 ? (
                        <DrawerItem
                            style={{ marginTop: 1 }}
                            icon={({ color, size }) => (
                                <Octicons
                                    name="repo-template"
                                    size={25}
                                    color={Colors.primary}
                                    style={styles.icon}
                                />
                            )}
                            labelStyle={styles.labelStyle}
                            label={'NotificationTemplate'}
                            onPress={() => {
                                props.navigation.navigate('NotificationTemplate');
                            }}
                        />
                    ) : null}

                    <DrawerItem
                        style={{ marginTop: 1 }}
                        icon={({ color, size }) => (
                            <Octicons
                                name="credit-card"
                                size={25}
                                color={Colors.primary}
                                style={styles.icon}
                            />
                        )}
                        labelStyle={styles.labelStyle}
                        label={'Credit Request'}
                        onPress={() => {
                            props.navigation.navigate('CreditRequest');
                        }}
                    />

                    {UserLogin?.userType === 0 ? (
                        <DrawerItem
                            style={{ marginTop: 0 }}
                            icon={({ color, size }) => (
                                <MaterialIcons
                                    name="app-blocking"
                                    size={20}
                                    color={Colors.primary}
                                />
                            )}
                            labelStyle={styles.labelStyle}
                            label={'Invalid Number'}
                            onPress={() => {
                                props.navigation.navigate('Invalid Number');
                            }}
                        />
                    ) : null}

                    {/* drawer user operations start */}

                    {UserLogin?.userType === 0 ? (
                        <DrawerItem
                            style={{ marginTop: 0 }}
                            icon={({ color, size }) =>
                                NestedDrawerGateway == true ? (
                                    <AntDesign name="up" size={20} color={Colors.primary} />
                                ) : (
                                    <AntDesign name="down" size={20} color={Colors.primary} />
                                )
                            }
                            labelStyle={styles.labelStyle}
                            label={'Admin Operations'}
                            onPress={() => NesDrawerUserOperationsFun()}
                        />
                    ) : null}

                    {userOperationsDrawer == true && (
                        <DrawerItem
                            style={{ marginTop: 0, marginLeft: 35 }}
                            icon={({ color, size }) => (
                                <MaterialIcons
                                    name="streetview"
                                    size={20}
                                    color={Colors.primary}
                                />
                            )}
                            labelStyle={styles.labelStyle}
                            label={'Overview'}
                            onPress={() => {
                                props.navigation.navigate('Overview');
                            }}
                        />
                    )}
                    {userOperationsDrawer == true && (
                        <DrawerItem
                            style={{ marginTop: 0, marginLeft: 35 }}
                            icon={({ color, size }) => (
                                <MaterialCommunityIcons
                                    name="routes"
                                    size={20}
                                    color={Colors.primary}
                                />
                            )}
                            labelStyle={styles.labelStyle}
                            label={'UserRoute'}
                            onPress={() => {
                                props.navigation.navigate('UserRoute');
                            }}
                        />
                    )}
                    {userOperationsDrawer == true && (
                        <DrawerItem
                            style={{ marginTop: 0, marginLeft: 35 }}
                            icon={({ color, size }) => (
                                <Ionicons name="server" size={20} color={Colors.primary} />
                            )}
                            labelStyle={styles.labelStyle}
                            label={'ServerInfo'}
                            onPress={() => {
                                props.navigation.navigate('ServerInfo');
                            }}
                        />
                    )}

                    {/* user Operation end */}

                    {/* user GateWay Start */}

                    {/* {UserLogin?.userType === 0 ? (
            <DrawerItem
              style={{marginTop: 0}}
              icon={({color, size}) =>
                NestedDrawerGateway == true ? (
                  <AntDesign name="up" size={20} color={Colors.primary} />
                ) : (
                  <AntDesign name="down" size={20} color={Colors.primary} />
                )
              }
              labelStyle={styles.labelStyle}
              label={'Gateway'}
              onPress={() => {
                NesDrawerGatewayFun();
              }}
            />
          ) : null} */}

                    {NestedDrawerGateway == true && (
                        <DrawerItem
                            style={{ marginTop: 0, marginLeft: 35 }}
                            icon={({ color, size }) => (
                                <AntDesign name="user" size={20} color={Colors.primary} />
                            )}
                            labelStyle={styles.labelStyle}
                            label={'Smpp'}
                            onPress={() => {
                                props.navigation.navigate('Smpp');
                            }}
                        />
                    )}
                    {NestedDrawerGateway == true && (
                        <DrawerItem
                            style={{ marginTop: 0, marginLeft: 35 }}
                            icon={({ color, size }) => (
                                <AntDesign name="user" size={20} color={Colors.primary} />
                            )}
                            labelStyle={styles.labelStyle}
                            label={'Secondary Smpp'}
                            onPress={() => {
                                props.navigation.navigate('Secondary Smpp');
                            }}
                        />
                    )}
                    {NestedDrawerGateway == true && (
                        <DrawerItem
                            style={{ marginTop: 0, marginLeft: 35 }}
                            icon={({ color, size }) => (
                                <AntDesign name="user" size={20} color={Colors.primary} />
                            )}
                            labelStyle={styles.labelStyle}
                            label={'Dlr Code'}
                            onPress={() => {
                                props.navigation.navigate('Dlr Code');
                            }}
                        />
                    )}
                    {/* Logout button */}
                    <DrawerItem
                        icon={({ color, size }) => (
                            <Icon
                                name="logout"
                                color={Colors.primary}
                                size={getProportionalFontSize(24)}
                            />
                        )}
                        labelStyle={styles.labelStyle}
                        label="Log Out"
                        onPress={() => {
                            setIsLoggingOut(true);
                            // logout();
                        }}
                    />

                    {/* footer */}
                    <View
                        style={{
                            width: '100%',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <Text style={styles.footerText}>NRT-SMS </Text>
                        <Text
                            style={{
                                ...styles.footerText,
                                fontSize: getProportionalFontSize(7),
                                marginTop: -getProportionalFontSize(5),
                            }}>
                            &#169;
                        </Text>
                        <Text style={{ ...styles.footerText, marginLeft: 10 }}>V:0.0.1</Text>
                    </View>
                </Drawer.Section>

                <Portal>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        style={{}}
                        visible={isModalVisible || isLoggingOut}
                        // onRequestClose={onRequestClose}
                        onDismiss={onRequestClose}>
                        <View style={styles.modalMainView}>
                            <View style={styles.innerViewforModel}>
                                <LogOutModal
                                    logout={logout}
                                    isLoggingOut={isLoggingOut}
                                    navigation={props.navigation}
                                    onRequestClose={onRequestClose}
                                />
                            </View>
                        </View>
                    </Modal>
                </Portal>
            </View>
        </DrawerContentScrollView>
        // </View >
    );
};

export default CustomDrawer;

const styles = StyleSheet.create({
    drawerSection: {
        marginTop: 15,
        // backgroundColor: '#c4dbfd',
        borderWidth: 0,
        borderBottomColor: Colors.transparent,
    },
    labelStyle: {
        color: Colors.black,
        fontSize: getProportionalFontSize(12),
        fontFamily: fonts.bold,
    },
    modalMainView: {
        backgroundColor: Colors.transparent,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    innerViewforModel: {
        width: '100%',
        minHeight: 150,
        backgroundColor: Colors.backgroundColor,
        paddingBottom: Constants.globalPaddingHorizontal * 2,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    editFloatingView: {
        borderWidth: 1,
        borderColor: Colors.primary,
        position: 'absolute',
        top: 3,
        right: 3,
        height: 27,
        width: 27,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.white,
    },
    footerText: {
        color: Colors.primary,
        fontFamily: fonts.mediumItalic,
        fontSize: getProportionalFontSize(10),
    },
});
