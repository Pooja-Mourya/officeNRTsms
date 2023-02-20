import {
  StyleSheet,
  View,
  Modal,
  FlatList,
  Alert,
  ScrollView,
  Text,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {fonts} from '../../assets/Assets';
import BaseContainer from '../../components/BaseContainer';
import APIService from '../../Services/APIService';
import Constants from '../../constant/Constants';
import {useSelector} from 'react-redux';
import EmptyList from '../../components/EmptyList';
import {FAB, DataTable} from 'react-native-paper';
import ExportBySenderId from './ExportBySenderId';
import ExportByNumber from './ExportByNumber';
import Colors from '../../assets/Colors';
import InputValidation from '../../components/InputValidation';
import DropDownComp from '../../components/DropDownComp';
import moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {getProportionalFontSize} from '../../Services/CommonMethods';

const selectType = [
  {
    id: '1',
    type: 'Date Wise',
  },
  {
    id: '2',
    type: 'Completed',
  },
];

const Consumption = ({navigation}) => {
  const formFieldsKeys = {
    type: 'type',
    from_date: 'from_date',
    to_date: 'to_date',
    user_id: 'user_id',
  };

  const initialValues = {
    [formFieldsKeys.type]: '',
    [formFieldsKeys.from_date]: '',
    [formFieldsKeys.to_date]: '',
    [formFieldsKeys.user_id]: '',
  };
  const initialValidationObj = {
    [formFieldsKeys.type]: {
      invalid: false,
      title: 'Invalid type',
    },
    [formFieldsKeys.from_date]: {
      invalid: false,
      title: 'Invalid from date',
    },
    [formFieldsKeys.to_date]: {
      invalid: false,
      title: 'Invalid to date',
    },
    [formFieldsKeys.user_id]: {
      invalid: false,
      title: 'Invalid user id',
    },

  };


  const [formValues, setFormValues] = useState(initialValues);
  const [validationObj, setValidationObj] = useState(initialValidationObj);
  const [listData, setListData] = useState([]);
  const [senderIdModal, setSenderIdModal] = useState(false);
  const [numberModal, setNumberModal] = useState(false);
  const [openFAB, setOpenFAB] = useState(false);
  const [userData, setUserData] = useState([]); 
  const [visible, setVisible] = useState(false);
  const [visibleTo, setVisibleTo] = useState(false);
  const userLogin = useSelector(state => state.global_store.userLogin);
  const [iniitialModal, setIniitialModal] = useState(true);
 


  const validation = () => {
    let valid = true;
    let validationObj = {...initialValidationObj};
    if (formValues[formFieldsKeys.user_id] == '' || formValues[formFieldsKeys.user_id] === '') {
      validationObj[formFieldsKeys.user_id].invalid = true;
      valid = false;
    }
    if (formValues[formFieldsKeys.type] === '') {
      validationObj[formFieldsKeys.type].invalid = true;
      valid = false;
    }
    if(formValues[formFieldsKeys.type] === '1'){
    if (formValues[formFieldsKeys.from_date] === '') {
      validationObj[formFieldsKeys.from_date].invalid = true;
      valid = false;
    }
    if (formValues[formFieldsKeys.to_date] === ''){
      validationObj[formFieldsKeys.to_date].invalid = true;
      valid = false;
    }
  }
  if(formValues[formFieldsKeys.from_date] > formValues[formFieldsKeys.to_date]){
    validationObj[formFieldsKeys.to_date].invalid = true;
    valid = false;
  }
  if(formValues[formFieldsKeys.to_date]<formValues[formFieldsKeys.from_date]){
    validationObj[formFieldsKeys.from_date].invalid = true;
    valid = false;
  }
 
    setValidationObj(validationObj);
    return valid;
  }; 

  const msgConsumption = async () => {
    let params = {
      ...formValues, 
    };
    let url = Constants.apiEndPoints.msgConsumption;
    console.log('url', url, 'params', params);
    // return
    let response = await APIService.postData(
      url,
      params,
      userLogin.access_token,
      null,
      'msgConsumption',
    );
    if (!response.errorMsg) {
      let data = response.data?.data;
      let arr = [];
      Object.keys(data).map(function (key) {
        return data[key] ? arr.push(data[key]) : null;
      });
      setListData(arr);
      setIniitialModal(false);
      setFormValues(initialValues);

    } else {
      Alert.alert(Constants.danger, response.errorMsg);
      setIniitialModal(false);
    }
  };

  const UserTemplateAPI = async () => {
    let params = {};
    let url = Constants.apiEndPoints.users;
    let response = await APIService.postData(
      url,
      params,
      userLogin.access_token,
      null,
      'DltTemplateUsersAPI',
    );
    if (!response.errorMsg) {
      setUserData(response.data.data);
    } else {
      Alert.alert(response.errorMsg);
    }
  };

  const handleInputChange = (key, value) => {
    setFormValues({
      ...formValues,
      [key]: value,
    });
  };
  const removeErrorTextForInputThatUserIsTyping = uniqueKey => {
    let tempValidationObj = {...validationObj};
    tempValidationObj[uniqueKey] = initialValidationObj[uniqueKey];
    setValidationObj(tempValidationObj);
  };

  const renderItem = ({item, index}) => {
    let date = moment(item.campaign_send_date_time).format('DD-MM-YYYY');
    return (
      <DataTable>
        <DataTable.Row>
          <DataTable.Cell style={{flex: 1.5,right:15}}>{date}</DataTable.Cell>
          <DataTable.Cell numeric style={{right:50}}>{item.total_contacts}</DataTable.Cell>
          <DataTable.Cell numeric style={{right:30}}>{item.total_credit_deduct}</DataTable.Cell>
          <DataTable.Cell numeric style={{right:12}}>{item.total_history_count}</DataTable.Cell>
          <DataTable.Cell numeric style={{right:5}}>{item.total_history_count}</DataTable.Cell>
        </DataTable.Row>
      </DataTable>
    );
  };

  useEffect(() => {
    UserTemplateAPI();
  }, []);

  return (
    <BaseContainer
      title="Message Consumption"
      leftIcon="arrow-back"
      onPressLeftIcon={() => navigation.goBack()}
      rightIcon="filter-list"
      onPressRightIcon={() => setIniitialModal(true)}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={iniitialModal}
        onRequestClose={() => setIniitialModal(false)}>
        <View
          style={styles.modalStyle1}>
          <View style={styles.modalStyle}>
            <AntDesign
              name="close"
              size={20}
              color={'#000'}
              style={styles.closeIcon}
              onPress={() => setIniitialModal(false)}
            />
            <ScrollView
              showsVerticalScrollIndicator={false} 
              style={{width: '100%'}}>
              {(userLogin?.userType !== 2) && (
                <DropDownComp
                  data={userData}
                  validationObj={validationObj}
                  uniqueKey={formFieldsKeys.user_id}
                  onPressItem={item => {
                    handleInputChange(formFieldsKeys.user_id, item);
                    removeErrorTextForInputThatUserIsTyping(formFieldsKeys.user_id);
                  }}
                  value={formValues?.[formFieldsKeys?.user_id]}
                  keyToShowData="name"
                  keyToCompareData="id"
                  placeHolder="Select User"
                  isSearch="Search User..."
                  multiSelect={true}
                />
              )}
              <DropDownComp
                validationObj={validationObj}
                uniqueKey={formFieldsKeys.type}
                data={selectType}
                onPressItem={item => {
                  handleInputChange(formFieldsKeys.type, item.id);
                  removeErrorTextForInputThatUserIsTyping(formFieldsKeys.type);
                }}
                value={formValues?.[formFieldsKeys?.type]}
                keyToShowData="type"
                keyToCompareData="id"
                placeHolder="Select Type"
              />
              {formValues?.type == '1' && (
                <>
                  <InputValidation
                  editable={false}
                    validationObj={validationObj}
                    uniqueKey={formFieldsKeys.from_date}
                    label={'From'}
                    placeHolder="From"
                    value={formValues[formFieldsKeys.from_date]}
                    onChangeText={text => {
                      handleInputChange(formFieldsKeys.from_date, text); 
                    }}
                    iconRight={'calendar'}
                    onPressIcon={()=> setVisible(true)} 
                  />
                  <InputValidation
                  editable={false}
                    validationObj={validationObj}
                    uniqueKey={formFieldsKeys.to_date}
                    label={'To'}
                    placeHolder="To"
                    value={formValues[formFieldsKeys.to_date]}
                    onChangeText={text => {
                      handleInputChange(formFieldsKeys.to_date, text); 
                    }}
                    iconRight={'calendar'}
                    onPressIcon={()=> setVisibleTo(true)}
                  />
                </>
              )}
              <View style={styles.buttonView}>
                <CustomButton
                  style={styles.button}
                  titleStyle={styles.btnTitle}
                  title="Clear Filter"
                  onPress={() => setFormValues(initialValues)}
                />
                <CustomButton
                  style={styles.button}
                  titleStyle={styles.btnTitle}
                  title="Apply Filter"
                  onPress={() => {
                    if(validation()){
                    msgConsumption(); 
                    }else{
                      Alert.alert(Constants.danger, 'Validation Error');
                    }
                  }}
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
     
      {formValues?.user_id && (
      <View style={styles.heading}>
        <Text style={styles.headerText1}>Date&Time</Text>
        <Text style={styles.headerText1}>{`Total${'\n'}Contact`}</Text>
        <Text style={styles.headerText1}>{`Credit${'\n'}Deducted`}</Text>
        <Text style={styles.headerText1}>{`Credit${'\n'}Deducted`}</Text>
        <Text style={styles.headerText1}>{`Credit${'\n'}Info`}</Text> 
        </View>
)}
      <FlatList
        data={listData}
        renderItem={renderItem}
        ListEmptyComponent={<EmptyList />}
        contentContainerStyle={{
          paddingBottom: 200,
          padding: Constants.globalPadding,
        }}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
      />

      <DateTimePickerModal
        isVisible={visible}
        mode="date"
        onConfirm={date => {
          setFormValues({
            ...formValues,
            [formFieldsKeys.from_date]: moment(date).format('YYYY-MM-DD'),
          }); 
          removeErrorTextForInputThatUserIsTyping(formFieldsKeys.from_date);
          setVisible(false);
        }}
        onCancel={() => setVisible(false)}
      />

      <DateTimePickerModal
        isVisible={visibleTo}
        mode="date"
        onConfirm={date => {
          setFormValues({
            ...formValues,
            [formFieldsKeys.to_date]: moment(date).format('YYYY-MM-DD'),
          }); 
          removeErrorTextForInputThatUserIsTyping(formFieldsKeys.to_date);
          setVisibleTo(false);
        }}
        onCancel={() => setVisibleTo(false)}
      />
      <FAB.Group
        style={{marginBottom: 60}}
        actions={[
          {
            icon: 'export',
            label: 'Export By Sender Id',
            onPress: () => setSenderIdModal(true),
          },
          {
            icon: 'export',
            label: 'Export By Number',
            onPress: () => setNumberModal(true),
          },
        ]}
        fabStyle={{backgroundColor: Colors.primary}}
        open={openFAB}
        icon={openFAB ? 'close' : 'calendar-export'}
        color={Colors.white}
        onStateChange={open => {
          if (openFAB) setOpenFAB(false);
          else setOpenFAB(true);
        }}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={senderIdModal}
        onRequestClose={() => setSenderIdModal(false)}>
        <View
          style={styles.modalStyle1}>
          <View style={styles.modalStyle}>
            <AntDesign
              name="close"
              size={20}
              color={'#000'}
              style={styles.closeIcon}
              onPress={() => setSenderIdModal(false)}
            />
            <ExportBySenderId setSenderIdModal={setSenderIdModal} />
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={numberModal}
        onRequestClose={() => setNumberModal(false)}>
        <View
          style={styles.modalStyle1}>
          <View style={styles.modalStyle}>
            <AntDesign
              name="close"
              size={20}
              color={'#000'}
              style={styles.closeIcon}
              onPress={() => setNumberModal(false)}
            />
            <ExportByNumber
              numberModal={numberModal}
              setNumberModal={setNumberModal}
            />
          </View>
        </View>
      </Modal>
    </BaseContainer>
  );
};

export default Consumption;

const styles = StyleSheet.create({
  container: {
    padding: Constants.globalPadding,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  heading: { 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,   
    paddingVertical: 5,
    backgroundColor: Colors.ultraLightProPrimary, 
    borderBottomWidth: 1,
    borderBottomColor: Colors.darkPlaceHoldColor, 
  },
  btnTitle: {
    fontSize: getProportionalFontSize(14),
    lineHeight: 20,
  },
  modalStyle1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: '100%',
    height: '100%',
  },
  buttonView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  button: {width: '45%'},
  closeIcon: { 
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 50,
    padding: 5,
  },
  modalStyle: {
    width: '90%',
    height: '60%',
    borderRadius: 20,
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cartContainer: {
    backgroundColor: 'white',
    elevation: 12,
    // borderRadius: 10,
    marginVertical: 10,
    marginTop: 10,
    borderLeftWidth: 2,
  },
  rowStyle: {
    margin: 8,
    width: '50%',
  },
  headerText: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    margin: 8,
  },
  headerTextStyle: {
    fontFamily: fonts.bold,
    fontWeight: '900',
  },
  useHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 8,
    paddingBottom: 10,
    fontFamily: fonts.medium,
    color: '#995c00',
  },

  userTextStyle: {
    fontFamily: fonts.semiBold,
  },
  headerText1: {
    fontSize:getProportionalFontSize(14),
    fontFamily: fonts.bold,
    fontWeight: '900',

  },
  smsText: {
    fontFamily: fonts.regular,
    padding: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    marginVertical: 20,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 22,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 100,
  },

  detailTextStyle: {
    color: Colors.black,
    backgroundColor: Colors.cardColor,
    marginTop: 10,
    padding: 8,
    fontFamily: fonts.regular,
    marginLeft: 20,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 8,
  },
});
