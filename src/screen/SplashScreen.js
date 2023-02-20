import * as React from 'react';
import { Text, View, StyleSheet, Image, Animated } from 'react-native';
import LottieView from 'lottie-react-native';
import { img, fonts } from '../assets/Assets';
import Constants from '../constant/Constants';
import AsyncStorageService from '../Services/AsyncStorageService';
import { useSelector, useDispatch } from 'react-redux'
import { UserLoginAction } from '../redux/reduxSlicer';
import { getProportionalFontSize } from '../Services/CommonMethods';
import Colors from '../assets/Colors';
import { CommonActions } from '@react-navigation/native';

export default function SplashScreen(props) {

    // Redux Hooks
    const dispatch = useDispatch()
    //hooks
    const [isLoading, setIsLoading] = React.useState(true)
    const [userFound, setUserFound] = React.useState(false)
    const [userDetails, setUserDetails] = React.useState({})

    // check localStorage
    React.useEffect(() => {
        isUserAlreadyLoggedIn();

    }, []);
    // Helper Methods
    const isUserAlreadyLoggedIn = async () => {
        try {
            let response = await AsyncStorageService._retrieveDataAsJSON(
                Constants.asyncStorageKeys.user_login,
            );
            if (response && Object.keys(response).length > 0) {
                console.log('user found');
                setUserDetails(response)
                dispatch(UserLoginAction(response));
                navigationFunction(true)
            } else {
                setIsLoading(false);
                console.log('user not found');
                navigationFunction(false)
            }
        } catch (error) {
            setIsLoading(false);
            console.log('isUserAlreadyLoggedIn....AsyncStorageService error', error);
        }
    };
    const navigateToAuthUserStack = () => {
        props.navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'MyDrawer' }],
            }),
        );
    };

    const navigationFunction = (user_found) => {
        if (user_found) {
            ShowUserName()
            setTimeout(() => {
                navigateToAuthUserStack()
            }, 5000); // time out  can not be less then 4000
        }
        else {
            setTimeout(() => {
                props.navigation.navigate("Login")
            }, 2000); // time out  can not be less then 2000
        }
    }

    const fadeAnim = React.useRef(new Animated.Value(0)).current;
    const marginTopAnim = React.useRef(new Animated.Value(150)).current;
    const marginLeftAnim = React.useRef(new Animated.Value(0)).current;
    const logoSizeAnim = React.useRef(new Animated.Value(150)).current;
    const showUserNameAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1800,
            useNativeDriver: false
        }).start();
    }, []);

    const ShowUserName = () => {
        console.log("user found animation ---------------")
        Animated.timing(marginTopAnim, {
            toValue: 10,
            delay: 2600,
            duration: 1000,
            useNativeDriver: false
        }).start();

        Animated.timing(marginLeftAnim, {
            toValue: 260,
            delay: 2600,
            duration: 1000,
            useNativeDriver: false
        }).start();

        Animated.timing(logoSizeAnim, {
            toValue: 70,
            delay: 2600,
            duration: 1000,
            useNativeDriver: false
        }).start();

        Animated.timing(showUserNameAnim, {
            toValue: 1,
            delay: 3000,
            duration: 400,
            useNativeDriver: false
        }).start();
    }
    return (
        <View style={styles.container}>
            <Animated.View
                style={{
                    marginTop: marginTopAnim,
                    // borderWidth: 2,
                    width: logoSizeAnim,
                    marginLeft: marginLeftAnim,
                    opacity: fadeAnim,
                }}>
                <Image
                    source={img.nrt_sms_logo_transp}
                    resizeMode="contain"
                    style={{
                        width: '100%',
                    }}
                />
            </Animated.View>
            <Animated.View
                style={{
                    width: '100%',
                    position: 'absolute',
                    marginTop: 200,
                    justifyContent: 'center',
                    // alignItems: 'center',
                    opacity: showUserNameAnim,
                    paddingHorizontal: "10%"
                }}>
                <Text style={{ fontSize: getProportionalFontSize(20),fontFamily:fonts.medium, textTransform:"capitalize" }}>Hi, {userDetails?.name}</Text>
                <Text style={{ fontSize:  getProportionalFontSize(20),fontFamily:fonts.semiBold  }}>Wellcome Back</Text>

            </Animated.View>
            <View
                style={{
                    width: 100, minHeight: 100,
                    position: "absolute",
                    bottom: 70,
                    alignItems: "center"
                }}>

                <LottieView source={require('../assets/Images/init_loader.json')} autoPlay loop />
                <Text style={{ fontSize: getProportionalFontSize(14), fontFamily: fonts.medium, textTransform: "capitalize", color: Colors.white }}>Loading App</Text>
            </View>

            <Image
                source={img.splash_Screen}
                resizeMode="contain"
                style={{ 
                    zIndex: -1,
                    position: 'absolute',
                    width: '100%', 
                    left: 0,
                    right: 0,   
                    bottom: -20



                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff',
        // borderWidth: 2,
    },
});
