import {StyleSheet, Text, View, Alert, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {fonts} from '../../assets/Assets';
import BaseContainer from '../../components/BaseContainer';
import APIService from '../../Services/APIService';
import Constants from '../../constant/Constants';
import {useSelector} from 'react-redux';
import Colors from '../../assets/Colors';
import DropDownComp from '../../components/DropDownComp';

const OverView = ({navigation}) => {
  const formFieldsKeys = {
    user_id: 'user_id',
    sender_id: 'sender_id',
  };
  const initialValues = {
    [formFieldsKeys.user_id]: '',
    [formFieldsKeys.sender_id]: '',
  };

  const handleInputChange = (key, value) => {
    setFormValues({
      ...formValues,
      [key]: value,
    });
  };

  const [formValues, setFormValues] = useState(initialValues);
  const [listData, setListData] = useState([]);
  const [selectUser, setSelectUser] = useState([]);
  const [selectSender, setSelectSender] = useState([]);

  const userLogin = useSelector(state => state.global_store.userLogin);

  const UserOperationTemplateAPI = async () => {
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
      setSelectUser(response.data.data);
    } else {
      Alert.alert(response.errorMsg);
    }
  };

  const userOperationsManageSenderIdAPI = async () => {
    let params = {
      user_id: formValues?.[formFieldsKeys.user_id]?.id,
    };
    let url = Constants.apiEndPoints.ManageSenderId;
    let response = await APIService.postData(
      url,
      params,
      userLogin.access_token,
      null,
      'userOperationsManageSenderIdAPI',
    );

    if (!response.errorMsg) {
      setSelectSender(response.data.data);
    } else {
      Alert.alert(response.errorMsg);
    }
  };

  const overviewReportByUserAPI = async (page, refresh) => {
    let params = {
      page: page ? page : 1,
      per_page_record: 15,
      user_id: [formValues?.[formFieldsKeys.user_id]?.id],
      sender_id: formValues?.[formFieldsKeys.sender_id]?.sender_id,
    };
    let url = Constants.apiEndPoints.overviewReportByUser;
    let response = await APIService.postData(
      url,
      params,
      userLogin.access_token,
      null,
      'overviewReportByUserAPI',
    );

    if (!response.errorMsg) {
      setListData(response?.data?.data);
    } else {
      alert('something went wrong');
    }
  };

  useEffect(() => {
    UserOperationTemplateAPI();
  }, []);

  useEffect(() => {
    if (formValues?.user_id?.id) {
      userOperationsManageSenderIdAPI();
    }
    if (formValues?.user_id?.id && formValues?.sender_id?.id) {
      overviewReportByUserAPI();
    }
  }, [formValues]);

  return (
    <BaseContainer
      title="Overview"
      leftIcon="arrow-back"
      onPressLeftIcon={() => navigation.goBack()}
    >
      <View style={styles.scrollContainer}>
        <View style={{flex: 1}}>
          <View style={styles.overView}>
            <DropDownComp
              data={selectUser}
              onPressItem={item => {
                setFormValues({
                  ...formValues,
                  user_id: item,
                  sender_id: '',
                });
              }}
              keyToShowData="name"
              keyToCompareData="id"
              placeHolder={'Select User'}
              value={formValues?.user_id?.name}
              isSearch={'Search route Type ...'}
            />

            {formValues?.user_id?.id && (
              <DropDownComp
                data={selectSender}
                onPressItem={item => {
                  handleInputChange('sender_id', item);
                }}
                keyToShowData="sender_id"
                keyToCompareData="sender_id"
                placeHolder={'Select Sender Id'}
                value={formValues?.sender_id?.sender_id}
              />
            )}
          </View>

          {formValues?.user_id?.id && formValues?.sender_id?.id ? (
            <View>
              <View style={styles.centerTextHeading}>
                <Text style={styles.centerHeading}>Queue</Text>
                <Text style={styles.centerHeading}>History</Text>
              </View>
            </View>
          ) : null}

          {formValues?.user_id?.id && formValues?.sender_id?.id ? (
            <ScrollView
              style={{padding: 10}}
              contentContainerStyle={{paddingBottom: 50}}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.queueStyle}>
                <View style={{width: '50%'}}>
                  <View>
                    <View style={styles.overViewDetails}>
                      <Text style={styles.overViewText}>Invalid</Text>
                      <Text>Stat : {listData?.queue?.stat ? '0' : '1'} </Text>
                      <Text>
                        Stat Count : {listData?.queue?.stat ? '0' : '1'}{' '}
                      </Text>
                      <Text>
                        Stat User Credit :{listData?.queue?.stat ? '0' : '1'}{' '}
                      </Text>
                    </View>
                  </View>
                  <View>
                    <View style={styles.overViewDetails}>
                      <Text style={styles.overViewText}>Pending</Text>
                      <Text>Stat : {listData?.queue?.stat ? '0' : '1'} </Text>
                      <Text>
                        Stat Count : {listData?.queue?.stat ? '0' : '1'}{' '}
                      </Text>
                      <Text>
                        Stat User Credit : {listData?.queue?.stat ? '0' : '1'}{' '}
                      </Text>
                    </View>
                  </View>
                  <View>
                    <View style={styles.overViewDetails}>
                      <Text style={styles.overViewText}>Black</Text>
                      <Text>Stat : {listData?.queue?.stat ? '0' : '1'}</Text>
                      <Text>
                        Stat Count : {listData?.queue?.stat ? '0' : '1'}{' '}
                      </Text>
                      <Text>
                        Stat User Credit : {listData?.queue?.stat ? '0' : '1'}{' '}
                      </Text>
                    </View>
                  </View>
                  <View>
                    <View style={styles.overViewDetails}>
                      <Text style={styles.overViewText}>Accepted</Text>
                      <Text>Stat : {listData?.queue?.stat ? '0' : '1'} </Text>
                      <Text>
                        Stat Count : {listData?.queue?.stat ? '0' : '1'}{' '}
                      </Text>
                      <Text>
                        Stat User Credit : {listData?.queue?.stat ? '0' : '1'}{' '}
                      </Text>
                    </View>
                  </View>
                  <View>
                    <View style={styles.overViewDetails}>
                      <Text style={styles.overViewText}>Delivered</Text>
                      <Text>Stat : {listData?.queue?.stat ? '0' : '1'} </Text>
                      <Text>
                        Stat Count : {listData?.queue?.stat ? '0' : '1'}{' '}
                      </Text>
                      <Text>
                        Stat User Credit : {listData?.queue?.stat ? '0' : '1'}{' '}
                      </Text>
                    </View>
                  </View>
                  <View>
                    <View style={styles.overViewDetails}>
                      <Text style={styles.overViewText}>Expired</Text>
                      <Text>Stat : {listData?.queue?.stat ? '0' : '1'} </Text>
                      <Text>
                        Stat Count : {listData?.queue?.stat ? '0' : '1'}{' '}
                      </Text>
                      <Text>
                        Stat User Credit : {listData?.queue?.stat ? '0' : '1'}{' '}
                      </Text>
                    </View>
                  </View>
                  <View>
                    <View style={styles.overViewDetails}>
                      <Text style={styles.overViewText}>Reject</Text>
                      <Text>Stat : {listData?.queue?.stat ? '0' : '1'} </Text>
                      <Text>
                        Stat Count : {listData?.queue?.stat ? '0' : '1'}{' '}
                      </Text>
                      <Text>
                        Stat User Credit : {listData?.queue?.stat ? '0' : '1'}{' '}
                      </Text>
                    </View>
                  </View>
                  <View>
                    <View style={styles.overViewDetails}>
                      <Text style={styles.overViewText}>Rejected</Text>
                      <Text>Stat : {listData?.queue?.stat ? '0' : '1'} </Text>
                      <Text>
                        Stat Count : {listData?.queue?.stat ? '0' : '1'}{' '}
                      </Text>
                      <Text>
                        Stat User Credit : {listData?.queue?.stat ? '0' : '1'}{' '}
                      </Text>
                    </View>
                  </View>
                  <View>
                    <View style={styles.overViewDetails}>
                      <Text style={styles.overViewText}>Undelivered</Text>
                      <Text>Stat : {listData?.queue?.stat ? '0' : '1'} </Text>
                      <Text>
                        Stat Count : {listData?.queue?.stat ? '0' : '1'}{' '}
                      </Text>
                      <Text>
                        Stat User Credit : {listData?.queue?.stat ? '0' : '1'}{' '}
                      </Text>
                    </View>
                  </View>
                  <View>
                    <View style={styles.overViewDetails}>
                      <Text style={styles.overViewText}>Unknown</Text>
                      <Text>Stat : {listData?.queue?.stat ? '0' : '1'} </Text>
                      <Text>
                        Stat Count : {listData?.queue?.stat ? '0' : '1'}{' '}
                      </Text>
                      <Text>
                        Stat User Credit : {listData?.queue?.stat ? '0' : '1'}{' '}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={{width: '50%'}}>
                  <View style={styles.overViewDetails}>
                    <Text style={styles.overViewText}>Invalid</Text>
                    <Text>Stat : {listData?.history?.stat ? '0' : '1'} </Text>
                    <Text>
                      Stat Count : {listData?.history?.stat ? '0' : '1'}{' '}
                    </Text>
                    <Text>
                      Stat User Credit :{listData?.history?.stat ? '0' : '1'}
                    </Text>
                  </View>
                  <View>
                    <View style={styles.overViewDetails}>
                      <Text style={styles.overViewText}>Pending</Text>
                      <Text>Stat : {listData?.history?.stat ? '0' : '1'}</Text>
                      <Text>
                        Stat Count : {listData?.history?.stat ? '0' : '1'}{' '}
                      </Text>
                      <Text>
                        Stat User Credit : {listData?.history?.stat ? '0' : '1'}{' '}
                      </Text>
                    </View>
                    <View style={styles.overViewDetails}>
                      <Text style={styles.overViewText}>Black</Text>
                      <Text>Stat : {listData?.history?.stat ? '0' : '1'}</Text>
                      <Text>
                        Stat Count : {listData?.history?.stat ? '0' : '1'}{' '}
                      </Text>
                      <Text>
                        Stat User Credit : {listData?.history?.stat ? '0' : '1'}{' '}
                      </Text>
                    </View>
                    <View style={styles.overViewDetails}>
                      <Text style={styles.overViewText}>Accepted</Text>
                      <Text>Stat : {listData?.history?.stat ? '0' : '1'} </Text>
                      <Text>
                        Stat Count : {listData?.history?.stat ? '0' : '1'}{' '}
                      </Text>
                      <Text>
                        Stat User Credit : {listData?.history?.stat ? '0' : '1'}{' '}
                      </Text>
                    </View>
                    <View style={styles.overViewDetails}>
                      <Text style={styles.overViewText}>Delivered</Text>
                      <Text>Stat : {listData?.history?.stat ? '0' : '1'} </Text>
                      <Text>
                        Stat Count : {listData?.history?.stat ? '0' : '1'}{' '}
                      </Text>
                      <Text>
                        Stat User Credit : {listData?.history?.stat ? '0' : '1'}{' '}
                      </Text>
                    </View>
                    <View style={styles.overViewDetails}>
                      <Text style={styles.overViewText}>Expired</Text>
                      <Text>Stat : {listData?.history?.stat ? '0' : '1'} </Text>
                      <Text>
                        Stat Count : {listData?.history?.stat ? '0' : '1'}{' '}
                      </Text>
                      <Text>
                        Stat User Credit : {listData?.history?.stat ? '0' : '1'}{' '}
                      </Text>
                    </View>
                    <View style={styles.overViewDetails}>
                      <Text style={styles.overViewText}>Reject</Text>
                      <Text>Stat : {listData?.history?.stat ? '0' : '1'} </Text>
                      <Text>
                        Stat Count : {listData?.history?.stat ? '0' : '1'}{' '}
                      </Text>
                      <Text>
                        Stat User Credit : {listData?.history?.stat ? '0' : '1'}{' '}
                      </Text>
                    </View>
                    <View style={styles.overViewDetails}>
                      <Text style={styles.overViewText}>Rejected</Text>
                      <Text>Stat : {listData?.history?.stat ? '0' : '1'} </Text>
                      <Text>
                        Stat Count : {listData?.history?.stat ? '0' : '1'}{' '}
                      </Text>
                      <Text>
                        Stat User Credit : {listData?.history?.stat ? '0' : '1'}{' '}
                      </Text>
                    </View>
                    <View style={styles.overViewDetails}>
                      <Text style={styles.overViewText}>Undelivered</Text>
                      <Text>Stat : {listData?.history?.stat ? '0' : '1'} </Text>
                      <Text>
                        Stat Count : {listData?.history?.stat ? '0' : '1'}{' '}
                      </Text>
                      <Text>
                        Stat User Credit : {listData?.history?.stat ? '0' : '1'}{' '}
                      </Text>
                    </View>
                    <View style={styles.overViewDetails}>
                      <Text style={styles.overViewText}>Unknown</Text>
                      <Text>Stat : {listData?.history?.stat ? '0' : '1'} </Text>
                      <Text>
                        Stat Count : {listData?.history?.stat ? '0' : '1'}{' '}
                      </Text>
                      <Text>
                        Stat User Credit : {listData?.history?.stat ? '0' : '1'}{' '}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
          ) : null}
        </View>
      </View>
    </BaseContainer>
  );
};

export default OverView;

const styles = StyleSheet.create({
  overView: {
    padding: 10,
    backgroundColor: Colors.white,
    elevation: 12,
    borderRadius: 10,
    margin: 10,
    paddingTop: -15,
  },
  overViewDetails: {
    borderRadius: 10,
    backgroundColor: Colors.white,
    padding: 5,
    elevation: 10,
    marginVertical: 1,
    marginHorizontal: 2,
  },
  overViewText: {
    fontFamily: fonts.medium,
    color: Colors.darkPrimary,
  },
  queueStyle: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderRadius: 15,
    marginTop: 15,
  },
  historyStyle: {
    borderRadius: 10,
    backgroundColor: Colors.white,
    padding: 5,
    elevation: 10,
    marginVertical: 1,
    marginHorizontal: 2,
  },
  centerHeading: {fontFamily: fonts.bold, textAlign: 'center'},
  centerTextHeading: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    marginTop: 15,
    marginBottom: 5,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: Colors.shadowColorAndroidDefault,
    overflow: 'scroll',
  },
});
