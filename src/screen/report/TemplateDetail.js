import {StyleSheet, Text, View, ScrollView, TextInput} from 'react-native';
import React, {useEffect, useState} from 'react';
import BaseContainer from '../../components/BaseContainer';
import Colors from '../../assets/Colors';
import {getProportionalFontSize} from '../../Services/CommonMethods';
import {fonts} from '../../assets/Assets';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const TemplateDetail = props => {
  let {navigation} = props;
  let routeParm = props?.route?.params ?? {};
  const [detailData, setDetailData] = useState({});
  console.log(routeParm);
  useEffect(() => {
    if (routeParm?.itemId) {
      setDetailData({
        ...detailData,
        notification_for: routeParm?.itemId.notification_for,
        mail_subject: routeParm?.itemId?.dlt_template?.mail_subject,
        mail_body: routeParm?.itemId.dlt_template?.mail_body,
        notification_subject: routeParm?.itemId.notification_subject,
        notification_body: routeParm?.itemId.notification_body,
        custom_attributes: routeParm?.itemId.custom_attributes,
        save_to_database: routeParm?.itemId.save_to_database,
        status_code: routeParm?.itemId.status_code,
        route_path: routeParm?.itemId.route_path,
      });
    }
  }, []);

  return (
    <BaseContainer
      title="Template View"
      leftIcon="arrow-back"
      onPressLeftIcon={() => navigation.goBack()}
    >
      <View style={styles.container}>
        <Text style={styles.headerText}>Notification For</Text>
        <MaterialIcons
          name={'linear-scale'}
          size={40}
          color={Colors.white}
          style={{marginTop: 10}}
        />
        <Text style={[styles.headerText, {width: '45%'}]}>
          {detailData.notification_for}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingBottom: 100,
        }}
      >
        <View style={styles.innerView}>
          <Text style={[styles.userTextStyle, {paddingHorizontal: '30%'}]}>
            Custom Attribute
          </Text>
          <Text style={[styles.detailData, {textAlign: 'center'}]}>
            {detailData.custom_attributes}
          </Text>

          <Text style={styles.userTextStyle}>Route path(Link)</Text>
          <Text style={styles.detailData}>{detailData.route_path}</Text>

          {/* {detailData?.mail_subject || detailData?.mail_body ? ( */}
          <View>
            <Text style={styles.centerHeader}>Mail</Text>
            <Text style={styles.userTextStyle}>Subject</Text>
            <Text style={styles.detailData}>{detailData?.mail_subject}</Text>

            <Text style={styles.userTextStyle}>Body</Text>
            <Text style={styles.detailData}>{detailData?.mail_body}</Text>
          </View>
          {/* ) : null} */}
        </View>

        <Text style={styles.centerHeader}>Notification</Text>

        <View style={styles.innerView}>
          <Text style={styles.userTextStyle}>Subject</Text>
          <Text style={styles.detailData}>
            {detailData.notification_subject}
          </Text>

          <Text>{detailData.total_block_number}</Text>

          <Text style={styles.userTextStyle}>Body</Text>
          <Text style={styles.detailData}>{detailData.notification_body}</Text>
        </View>

        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}
        >
          <View>
            <Text style={styles.userTextStyle}>Save to data</Text>
            <Text style={{}}>
              {detailData.save_to_database == 1 ? (
                <Text style={{color: Colors.darkgreen}}>Yes</Text>
              ) : (
                <Text style={{color: Colors.secondary}}>No</Text>
              )}
            </Text>
          </View>
          <View>
            <Text style={styles.userTextStyle}>Status Code</Text>
            <Text
              style={{
                backgroundColor:
                  (detailData.status_code === 'success'
                    ? Colors.darkgreen
                    : null) ||
                  (detailData.status_code === 'error'
                    ? Colors.secondary
                    : null) ||
                  (detailData.status_code === 'warning'
                    ? Colors.primary
                    : null) ||
                  (detailData.status_code === 'info' ? Colors.info : null),
                color: Colors.white,
                fontFamily: fonts.boldItalic,
                paddingHorizontal: 10,
                borderRadius: 10,
              }}
            >
              {detailData.status_code}
            </Text>
          </View>
        </View>
      </ScrollView>
    </BaseContainer>
  );
};

export default TemplateDetail;

const styles = StyleSheet.create({
  container: {
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.black,
  },
  userTextStyle: {
    fontSize: getProportionalFontSize(15),
    color: Colors.black,
    fontFamily: fonts.semiBold,
    textTransform: 'capitalize',
    textDecorationStyle: 'solid',
  },
  detailData: {
    fontSize: getProportionalFontSize(14),
    color: Colors.black,
    marginBottom: 10,
    fontFamily: fonts.regular,
    textTransform: 'capitalize',
    backgroundColor: Colors.lightGray,
    padding: 10,
    borderRadius: 5,
  },
  headerText: {
    textAlign: 'center',
    textDecorationStyle: 'solid',
    fontFamily: fonts.bold,
    padding: 5,
    color: Colors.white,
    marginBottom: 10,
    top: 0,
    margin: 10,
    fontSize: getProportionalFontSize(16),
    textTransform: 'capitalize',
  },
  centerHeader: {
    backgroundColor: Colors.ultraLightPrimary,
    padding: 5,
    textDecorationLine: 'underline',
    textAlign: 'center',
    marginHorizontal: '30%',
    fontFamily: fonts.boldItalic,
    color: Colors.blue,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  innerView: {
    borderLeftWidth: 1,
    padding: 10,
    borderRadius: 5,
    borderLeftColor: Colors.darkPrimary,
  },
});
