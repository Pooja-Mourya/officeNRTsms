import React, { useState } from 'react';
import { View, StyleSheet, Text, Platform, TouchableOpacity, Image } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import Colors from '../assets/Colors';
import Assets from '../assets/Assets';
import { getProportionalFontSize } from '../Services/CommonMethods';
import Constants from '../constant/Constants';
import { Divider } from 'react-native-paper';
import { img } from '../assets/Assets';

export default ListingCard = props => { 
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={{...styles.categoryTypeCard, ...props.categoryTypeCard}} 
      activeOpacity={0.9}>
      {props.transparency == props.index && props.isTreeDot ? <View style={{
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 5,
        position: 'absolute',
        borderRadius: 10,
        opacity: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center', 
      }}>
        <Entypo name="cross" size={25} color="#000"
          onPress={() => props.setTransparency(null)}
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            zIndex: 2,
            backgroundColor: Colors.white,
            borderRadius: 5,
          }}
        />
        <TouchableOpacity style={styles.iconStyle}
          onPress={() => props.viewDetails ? props.viewDetails() : props?.msgView()}
        >
          <AntDesign name="eye" size={20} color="#fff" />
          {/* <Text  style={styles.cplstyle}>{props.viewDetails?'View':'Message'}</Text> */}
        </TouchableOpacity>
        {props?.userLogin && <TouchableOpacity
          style={styles.iconStyle}
          onPress={() => props.manageCompaign ? props.manageCompaign() : null}>
          <Image source={img.manage} style={{
            width: 20,
            height: 20,
            resizeMode: 'contain',
            tintColor: Colors.white,
          }} />

          {/* <Text  style={styles.cplstyle}>Manage</Text> */}
        </TouchableOpacity>
        }
        {(props.isTrue || props.isFalse) &&props.userLogin ? <TouchableOpacity
          style={styles.iconStyle}
          onPress={() => props.completeAction ? props.completeAction() : null}>

          <Ionicons name="checkmark-done-circle" size={20} color="#fff" />
          {/* <Text  style={styles.cplstyle}>Completed</Text> */}
        </TouchableOpacity>
          : null}
        {props.isFalse && <TouchableOpacity style={styles.iconStyle}
          onPress={() => props.stopAction ? props.stopAction() : null}
        >
          <Ionicons name='stop-sharp' size={20} color="#fff" />
          {/* <Text style={styles.cplstyle}>Stop</Text> */}
        </TouchableOpacity>
        }
        {
          props?.dltEdit && <TouchableOpacity style={styles.iconStyle}
          onPress={() => props.editAction ? props.editAction() : null}
        >
          <AntDesign name='edit' size={20} color="#fff" />
          {/* <Text style={styles.cplstyle}>Edit</Text> */}
        </TouchableOpacity>
        }
        {
          props?.dltDelete && <TouchableOpacity style={styles.iconStyle}
          onPress={() => props.deleteAction ? props.deleteAction() : null}
        >
          <AntDesign name='delete' size={20} color="#fff" />
          {/* <Text style={styles.cplstyle}>Delete</Text> */}
        </TouchableOpacity>
        }

      </View> : null}

      <View
        style={{
          ...styles.innerContainer,
          backgroundColor: Colors.primary,
        }}>
        {/* title and status view */}
        <View
          style={{
            ...styles.categoryNameView,
            width: '80%',
            paddingLeft: props?.hideAvatar ? 0 : 20,
          }}>
          <View
            style={[
              styles.mainTitle,
              props.fromWorkShift ? { paddingTop: 5 } : {},
              { marginLeft: props.hideAvatar ? 0 : getProportionalFontSize(40) },
            ]}>
            {/* title or ip title or ptient name */}
            <Text
              numberOfLines={1}
              style={{
                ...styles.categoryNameText,
                // paddingLeft: getProportionalFontSize(15),
                paddingTop: props?.subTitle ? 0 : 10,
                color: Colors.white,
                right: props?.hideAvatar ? 0 : getProportionalFontSize(20),
              }}>
              {props.title}
            </Text>
          </View>
          {/* subTitle or ip category and sub category or patient age */}
          {props?.subTitle ? (
            <Text
              numberOfLines={1}
              style={[
                styles.statusValue,
                { marginTop: 20 },
                props.fromWorkShift ? { paddingLeft: 61, paddingTop: 3 } : {},
              ]}>
              {props.subTitle}
            </Text>
          ) : null}
        </View>

        {/* edit and delete icon view */}
        <View style={[styles.editDeleteIconView, { width: '20%' }]}>
          <View
            style={{
              width: '40%',
              flexDirection: 'row',
              position: 'absolute',
              top: 5,
              right: 10,
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}>
            {props.showMenu ? (
              <Ionicons
                name="ellipsis-vertical-sharp"
                size={20}
                color={'#fff'}
                onPress={
                  props.setOpenCardOptions
                    ? () => {
                      if (props.showMenu) {
                        props.onPressMenu();
                      }
                    }
                    : () => { }
                }
              />
            ) : null}
            {props.isEdit ? (
              <Feather
                name="edit"
                size={20}
                color={'#fff'}
                style={{ marginRight: 10 }}
                onPress={() => props.isEdit()}
              />
            ) : null}
            {props.isDelete ? (
              <AntDesign
                name="delete"
                size={20}
                color={'#fff'}
                onPress={() => props.isDelete()}
              />
            ) : null}
          </View>

          <View style={styles.statusMainView}>
            <Text
              numberOfLines={1}
              style={[styles.statusTitle, props.second_title_style]}>
              {props.second_title}
            </Text>
            <Text
              numberOfLines={1}
              style={[
                styles.statusValue,
                props.second_title_value_style,
                props.second_title ? { marginStart: 5 } : {},
              ]}>
              {props.second_title_value}
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          paddingHorizontal: Constants.globalPaddingHorizontal,
          paddingVertical: Constants.globalPaddingVetical,
          // marginTop: 5,
        }}>
        {props?.showSecondaryTitle ? (
          <View
            style={{
              ...styles.forRow,
              marginTop: props.hide_patient_details_text ? -15 : 0,
              width: '100%',
            }}>
            {props.hide_patient_details_text ? null : (
              <Text style={styles.patient_detail} numberOfLines={2}>
                {props.showSecondaryTitle}
              </Text>
            )}
            {props.cardLabels ? (
              <View
                style={{
                  width: props.hide_patient_details_text ? '100%' : '60%',
                  alignItems: 'flex-end',
                }}>
                <Text
                  numberOfLines={1}
                  onPress={props.StatStatusStopAPI}
                  style={{
                    fontFamily: Assets.fonts.regular,
                    fontSize: getProportionalFontSize(10),
                    backgroundColor: props.is_approved
                      ? Colors.darkgreen
                      : Colors.cardColor,
                    color: Colors.white,
                    paddingHorizontal: 5,
                    paddingVertical: 2,
                    borderRadius: 3,
                    fontWeight: 'bold',
                  }}>
                  {props.cardLabels}
                </Text>
              </View>
            ) : null}
          </View>
        ) : null}
        <View
          style={{
            bottom: 20,
          }}>
          {props.sender_id ? (
            <View style={styles.forRow}>
              <Text style={styles.labelsText}>sender_id : </Text>
              <Text numberOfLines={1} style={styles.secondrytext}>
                {props.sender_id}
              </Text>
            </View>
          ) : null}
           {props.AssignTo ? (
            <View style={styles.forRow}>
              <Text style={styles.labelsText}>Assign To  : </Text>
              <Text numberOfLines={1} style={styles.secondrytext}>
                {props.AssignTo}
              </Text>
            </View>
          ) : null}
          {props.dltId ? (
            <View style={styles.forRow}>
              <Text style={styles.labelsText}>Template ID : </Text>
              <Text numberOfLines={1} style={styles.secondrytext}>
                {props.dltId}
              </Text>
            </View>
          ) : null}
          {props.entity ? (
            <View style={styles.forRow}>
              <Text style={styles.labelsText}>Entity ID  : </Text>
              <Text numberOfLines={1} style={styles.secondrytext}>
                {props.entity}
              </Text>
            </View>
          ) : null} 
          {props.ContactInfo ? (
            <View style={styles.forRow}>
              <Text style={styles.labelsText}>Contact Info  : </Text>
              <Text numberOfLines={1} style={styles.secondrytext}>
                {props.ContactInfo}
              </Text>
            </View>
          ) : null} 
          {props.CreditInfo ? (
            <View style={styles.forRow}>
              <Text style={styles.labelsText}>Credit Info  : </Text>
              <Text numberOfLines={1} style={styles.secondrytext}>
                {props.CreditInfo}
              </Text>
            </View>
          ) : null} 
          {(props.Unicode || props.Priority) && (
            <View style={styles.forRow}>
              <View style={{flexDirection: 'row', 
            }}>
              <Text style={styles.labelsText}>Unicode  : </Text>
              <Text numberOfLines={1} style={{...styles.secondrytext,right:50}}>
                {props.Unicode}
              </Text>
              </View>
              <View  style={{flexDirection: 'row', right:150}} >
              <Text style={styles.labelsText}>Priority  : </Text>
              <Text numberOfLines={1} style={{...styles.secondrytext,right:50}}>
                {props.Priority}
              </Text>
            </View>
            </View>
          )} 
          {/* {props.Priority ? (
            <View style={styles.forRow}>
              <Text style={styles.labelsText}>Priority  : </Text>
              <Text numberOfLines={1} style={styles.secondrytext}>
                {props.Priority}
              </Text>
            </View>
          ) : null}  */}
          {props.header_id ? (
            <View style={styles.forRow}>
              <Text style={styles.labelsText}>header_id : </Text>
              <Text numberOfLines={1} style={styles.secondrytext}>
                {props.header_id}
              </Text>
            </View>
          ) : null}
          {props.entity_id ? (
            <View style={styles.forRow}>
              <Text style={styles.labelsText}>entity_id : </Text>
              <Text numberOfLines={1} style={styles.secondrytext}>
                {props.entity_id}
              </Text>
            </View>
          ) : null}
        </View>
        <View style={{bottom:15}}>
        {props.isContact ? (
          <View style={styles.forRow}>
            <Text style={styles.labelsText}>Total Contact : </Text>
            <Text numberOfLines={1} style={styles.secondrytext}>
              {props.isContact}
            </Text>
          </View>
        ) : null}

        {props.isCredit ? (
          <View style={styles.forRow}>
            <Text style={styles.labelsText}>Credit Used : </Text>
            <Text numberOfLines={1} style={styles.secondrytext}>
              {props.isCredit}
            </Text>
          </View>
        ) : null}  
        </View>
        {props.isDivider && (
          <View
            style={{
              width: '100%',  


            }}>
            {props?.messageBody()}
          </View>
        )}

        {props.isDivider ? (
          <Divider
            style={{
              backgroundColor: Colors.darkGray, 
              height: 1,
              width: '100%',
              bottom: -10,
            }}
          />
        ) : null}
        
      </View>
      {props.children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    position: 'absolute',
    top: 20,
    left: 15,
  },
  cplstyle: {
    color: Colors.white,
    fontSize: getProportionalFontSize(12),
    textAlign: 'center',
  },
  avatarImage: {
    width: Constants.avatarTextSize,
    height: Constants.avatarTextSize,
    borderRadius: 50,
  },
  avatarText: {
    borderWidth: 0,
    fontSize: getProportionalFontSize(18),
    fontFamily: Assets.fonts.semiBold,
    textTransform: 'uppercase',
    marginTop: -5,
  },
  categoryTypeCard: {
    width: '100%',
    minHeight: 80,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 10,
    elevation: 10,
    shadowColor:
      Platform.OS == 'ios'
        ? Colors.shadowColorIosDefault
        : Colors.shadowColorAndroidDefault,
    shadowRadius: 10,
    marginBottom: Constants.listItemBottomMargin,
    backgroundColor: Colors.white,
    borderRadius: 15,
    overflow: 'hidden',
  },
  categoryNameView: {
    borderWidth: 0,
  },
  categoryNameText: {
    fontFamily: Assets.fonts.bold,
    color: Colors.white,
    fontSize: getProportionalFontSize(15),
    textTransform: 'capitalize',
  },
  statusMainView: {
    flexDirection: 'row',
    paddingTop: 25,
  },
  statusTitle: {
    fontFamily: Assets.fonts.regular,
    color: Colors.white,
    fontSize: getProportionalFontSize(12),
  },
  statusValue: {
    fontFamily: Assets.fonts.regular,
    color: Colors.white,
    fontSize: getProportionalFontSize(10),
  },
  editDeleteIconView: {
    borderWidth: 0,
  },
  innerContainer: {
    flexDirection: 'row',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    width: '100%',
  },
  patient_detail: {
    fontFamily: Assets.fonts.bold,
    fontSize: getProportionalFontSize(12),
    width: '40%',
  },
  labelsText: {
    fontFamily: Assets.fonts.semiBold,
    fontSize: getProportionalFontSize(12),
    width: '40%',
  },
  secondrytext: {
    fontFamily: Assets.fonts.regular,
    fontSize: getProportionalFontSize(11),
    width: '60%',
  },
  forRow: { 
    flexDirection: 'row',   
    
  },
  mainTitle: {
    width: '100%',
    flexDirection: 'row',
    position: 'absolute',
  },
  actionContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 50,
    marginVertical: 5,
  },
  actionText: {
    fontFamily: Assets.fonts.semiBold,
    color: Colors.primary,
    fontSize: getProportionalFontSize(12),
    marginLeft: 5,
  },
  iconStyle: { 
    // alignItems: 'center',
    // justifyContent: 'center',  
    backgroundColor: Colors.primary,
    padding: 5,
    borderRadius: 5,    

  },
});
