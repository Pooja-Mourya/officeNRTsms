import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {img, fonts} from '../assets/Assets';
import {
  getProportionalFontSize,
  checkEmailFormat,
} from '../Services/CommonMethods';
import {useSelector, useDispatch} from 'react-redux';
import ProgressLoader from '../components/ProgressLoader';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import InputValidation from '../components/InputValidation';
import AsyncStorageService from '../Services/AsyncStorageService';
import {UserLoginAction} from '../redux/reduxSlicer';
import Constants from '../constant/Constants';
import APIService from '../Services/APIService';
import {CommonActions} from '@react-navigation/native';
import Colors from '../assets/Colors';

const Login = props => {
  // Immutable Variables
  const initialValidationObj = {
    email: {
      invalid: false,
      title: 'Invalid Email',
    },
    password: {
      invalid: false,
      title: 'Invalid Password',
    },
  };

  // REDUX hooks
  const dispatch = useDispatch();
  // const isInternetActive = useSelector(state => state.IsInternetActive);
  const UserLogin = useSelector(state => state.global_store.userLogin);
  // useState hooks
  const [validationObj, setValidationObj] = React.useState({
    ...initialValidationObj,
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [passwordVisibility, setPasswordVisibility] = useState(true);

  React.useEffect(() => {
    isUserAlreadyLoggedIn();
  }, []);

  const isUserAlreadyLoggedIn = async () => {
    try {
      let response = await AsyncStorageService._retrieveDataAsJSON(
        Constants.asyncStorageKeys.user_login,
      );
      if (response && Object.keys(response).length > 0) {
        dispatch(UserLoginAction(response));
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.log('isUserAlreadyLoggedIn....AsyncStorageService error', error);
    }
  };

  useEffect(() => {
    if (UserLogin?.access_token) {
      navigateToAuthUserStack();
    } else {
      setIsLoading(false);
    }
  }, [UserLogin]);

  const validation = () => {
    let validationObjTemp = {...validationObj};

    if (!email) {
      validationObjTemp.email.invalid = true;
      validationObjTemp.email.title = 'Email is required';
      setValidationObj(validationObjTemp);
      return false;
    } else {
      validationObjTemp['email'] = initialValidationObj['email'];
    }
    if (!checkEmailFormat(email)) {
      validationObjTemp.email.invalid = true;
      validationObjTemp.email.title = 'Email is invalid';
      setValidationObj(validationObjTemp);
      return false;
    } else {
      validationObjTemp['email'] = initialValidationObj['email'];
    }
    if (!password) {
      validationObjTemp.password.invalid = true;
      validationObjTemp.password.title = 'Password is required';
      setValidationObj(validationObjTemp);
      return false;
    } else {
      validationObjTemp['password'] = initialValidationObj['password'];
    }
    if (password?.length < 6) {
      validationObjTemp.password.invalid = true;
      validationObjTemp.password.title = 'Minimum password length should be 6';
      setValidationObj(validationObjTemp);
      return false;
    } else {
      validationObjTemp['password'] = initialValidationObj['password'];
    }
    setValidationObj(validationObjTemp);
    return true;
  };

  const navigateToAuthUserStack = () => {
    props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'MyDrawer'}],
      }),
    );
  };

  const removeErrorTextForInputThatUserIsTyping = uniqueKey => {
    let tempValidationObj = {...validationObj};
    tempValidationObj[uniqueKey] = initialValidationObj[uniqueKey];
    setValidationObj(tempValidationObj);
  };

  const saveUserInAsyncStorage = async user_login => {
    try {
      await AsyncStorageService._storeDataAsJSON(
        Constants.asyncStorageKeys.user_login,
        user_login,
      );
      onSuccessLogin();
    } catch (error) {
      onFailureLogin(error);
      console.log('saveUserInAsyncStorage....AsyncStorageService error', error);
    }
  };

  const Login = async () => {
    setIsLoading(true);
    let params = {
      email: email,
      password: password,
    };
    let url = Constants.apiEndPoints.login;
    // return
    let response = await APIService.postData(
      url,
      params,
      null,
      null,
      'loginAPI',
    );
    if (!response.errorMsg) {
      dispatch(UserLoginAction(response.data.data));
      saveUserInAsyncStorage(response.data.data);
      if (response.data.data?.access_token) {
        navigateToAuthUserStack();
      }
      setIsLoading(false);
    } else {
      setIsLoading(false);
      onFailureLogin(response.errorMsg);
    }
  };

  const onSuccessLogin = () => {
    setIsLoading(false);
  };

  const onFailureLogin = errorMsg => {
    setIsLoading(false);
    alert(errorMsg);
  };

  if (isLoading) return <ProgressLoader />;
  const handlePasswordVisibility = () => {
    setPasswordVisibility(!passwordVisibility);
  };

  const submit = () => {
    if (email && password) {
      Alert.alert('Login success fully');
    }
  };

  return (
    <View style={styles.mainViewStyle}>
      <KeyboardAwareScrollView
        style={{width: '100%', height: '100%'}}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={img.BgTop}
          style={styles.ImageBackgroundTop}
          resizeMode={'contain'}
        />

        <Image style={styles.nrtLogo} source={img.logo} />

        <View style={styles.container}>
          <InputValidation
            validationObj={validationObj}
            uniqueKey={'email'}
            value={email}
            placeHolder={'demo@email.com'}
            onChangeText={text => {
              setEmail(text.trim());
              removeErrorTextForInputThatUserIsTyping('email');
            }}
            label={'Email'}
            style={{marginTop: Constants.formFieldTopMargin}}
            inputStyle={{
              ...styles.inputStyle1,
            }}
            roundness={10}
            iconLeft={'email'}
            keyboardType={'email-address'}
          />

          <InputValidation
            validationObj={validationObj}
            uniqueKey={'password'}
            value={password}
            placeHolder={'U*0NCo6U+'}
            onChangeText={text => {
              setPassword(text.trim());
              removeErrorTextForInputThatUserIsTyping('password');
            }}
            label={'Password'}
            style={{marginTop: Constants.formFieldTopMargin}}
            inputStyle={{
              ...styles.inputStyle1,
            }}
            roundness={10}
            secureTextEntry={passwordVisibility}
            iconLeft={'lock'}
            isIconRightTouchable={true}
            onPressIcon={handlePasswordVisibility}
            iconRight={passwordVisibility ? 'eye' : 'eye-off'}
          />
          <TouchableOpacity
            style={styles.forgetBtn}
            onPress={() => {
              props.navigation.navigate('Forgot');
            }}
          >
            <Text style={styles.forgetText}>Forgot Password ? </Text>
          </TouchableOpacity>

          <LinearGradient colors={['#FFAD33', '#FF9B36']} style={styles.button}>
            <TouchableOpacity
              onPress={() => {
                if (validation()) {
                  Login();
                } else {
                  alert('in-valid');
                }
              }}
              style={styles.loginStyle}
            >
              <Text style={styles.LoginButton}>Login</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  ImageBackgroundTop: {
    width: '100%',
    top: 0,
    borderWidth: 1,
    borderColor: Colors.transparent,
  },
  nrtLogo: {
    position: 'absolute',
    width: '50%',
    height: '10%',
    left: '25%',
    top: '40%',
  },
  container: {
    paddingHorizontal: Constants.globalPaddingHorizontal,
  },
  inputStyle: {
    width: '90%',
    height: 50,
    top: 120,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#696767',
    borderRadius: 50,
    marginVertical: 10,
    paddingLeft: 70,
    marginHorizontal: 16,
    zIndex: 2,
  },
  button: {
    width: '100%',
    height: 50,
    borderRadius: 50,
    backgroundColor: '#FFAD33',
    marginBottom: 30,
  },
  LoginButton: {
    fontSize: getProportionalFontSize(18),
    padding: 10,
    color: 'white',
    fontFamily: fonts.semiBold,
    alignSelf: 'center',
    letterSpacing: getProportionalFontSize(1),
  },
  inputStyle1: {
    fontSize: getProportionalFontSize(16),
    borderColor: Colors.borderColor,
    backgroundColor: Colors.white,
  },
  loginStyle: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  forgetBtn: {
    width: '100%',
    height: '100%',
    alignItems: 'flex-end',
    height: 40,
    justifyContent: 'center',
    fontSize: getProportionalFontSize(14),
  },
  forgetText: {
    fontFamily: fonts.mediumItalic,
    color: Colors.primary,
  },
  mainViewStyle: {
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
