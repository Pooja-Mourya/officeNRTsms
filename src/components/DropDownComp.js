import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {
  Dropdown,
  MultiSelect,
  SelectCountry,
} from 'react-native-element-dropdown';
// import { MultiSelect } from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Colors from '../assets/Colors';
import {fonts} from '../assets/Assets';
import {getProportionalFontSize} from '../Services/CommonMethods';

const DropDownComp = props => {
  const {
    data,
    multiSelect,
    onPressItem,
    keyToShowData,
    keyToCompareData,
    value,
    dropDownContainer,
    inputTextStyle,
    placeHolder,
    isSearch,
  } = props;
  let label = props?.label ?? props?.placeHolder ?? false;
  let isMultiSelect = true;
  if (multiSelect == undefined || multiSelect == null || multiSelect == false)
    isMultiSelect = false;
  let Tempvalue = true;
  if (value == undefined || value == '' || value == null || value == false)
    Tempvalue = false;
  const [selected, setSelected] = useState([]);

  const isErrorTrue = () => {
    if (
      props?.validationObj &&
      props?.uniqueKey &&
      props.validationObj[props.uniqueKey].invalid === true
    )
      return true;
    return false;
  };
  return (
    <View>
      {label ? (
        <Text
          style={{
            ...styles.headingTitleStyle,
            ...props.headingTitleStyle,
            color: props.disabled
              ? Colors.placeholderTextColor
              : Colors.darkPrimary,
          }}
        >
          {props.optional === true ? label : label + '*'}
        </Text>
      ) : null}

      {!isMultiSelect ? (
        <Dropdown
          style={{
            ...styles.dropdown,
            ...dropDownContainer,
            borderColor: isErrorTrue() ? Colors.red : Colors.darkPrimary,
          }}
          placeholderStyle={{...styles.placeholderStyle, ...inputTextStyle}}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconColor={isErrorTrue() ? Colors.red : Colors.darkPrimary}
          renderRightIcon={() => (
            <AntDesign
              name="caretdown"
              size={getProportionalFontSize(14)}
              color={isErrorTrue() ? Colors.red : Colors.darkPrimary}
            />
          )}
          search={isSearch ?? false}
          data={data}
          maxHeight={300}
          labelField={keyToShowData ?? 'name'}
          valueField={keyToCompareData ?? 'id'}
          placeholder={Tempvalue ? value : placeHolder}
          searchPlaceholder={isSearch}
          value={value}
          onChange={item => {
            onPressItem(item);
          }}
        />
      ) : (
        <MultiSelect
          style={{
            ...styles.dropdown,
            ...dropDownContainer,
            borderColor: isErrorTrue() ? Colors.red : Colors.darkPrimary,
          }}
          placeholderStyle={{...styles.placeholderStyle, ...inputTextStyle}}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          iconColor={isErrorTrue() ? Colors.red : Colors.darkPrimary}
          renderRightIcon={() => (
            <AntDesign
              name="caretdown"
              size={getProportionalFontSize(14)}
              color={isErrorTrue() ? Colors.red : Colors.darkPrimary}
            />
          )}
          search
          data={data}
          labelField={keyToShowData}
          valueField={keyToCompareData}
          placeholder={placeHolder}
          searchPlaceholder={isSearch}
          value={selected}
          onChangeText={item => {}}
          onChange={item => {
            setSelected(item);
            onPressItem(item);
          }}
          selectedStyle={styles.selectedStyle}
          renderSelectedItem={(item, index) => {
            return (
              <View style={styles.selectedItem}>
                <Text style={styles.selectedItemText}>
                  {item[keyToShowData]}
                </Text>
                <AntDesign
                  name="close"
                  size={getProportionalFontSize(16)}
                  color={Colors.white}
                />
              </View>
            );
          }}

          // imageStyle={styles.imageStyle}
          // maxHeight={200}
        />
      )}
      {isErrorTrue() ? (
        <Text style={[styles.errorText, props.errorTextStyle]}>
          {props.validationObj[props.uniqueKey].title}
        </Text>
      ) : null}
    </View>
  );
};

export default DropDownComp;

const styles = StyleSheet.create({
  errorText: {
    color: Colors.red,
    fontFamily: fonts.robotoregular,
    fontSize: getProportionalFontSize(12),
    marginTop: 7,
  },
  selectedItem: {
    backgroundColor: Colors.darkPrimary,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 5,
    marginVertical: 5,
  },
  selectedItemText: {
    color: Colors.white,
    fontFamily: fonts.regular,
    fontSize: getProportionalFontSize(14),
  },
  headingTitleStyle: {
    fontFamily: fonts.robotoMedium,
    fontSize: getProportionalFontSize(15),
    // color: Colors.darkPrimary,
    // fontWeight: "4s00"
    marginTop: 15,
  },
  dropdown: {
    width: '100%',
    minHeight: 60,
    borderWidth: 1,
    // flexDirection: 'row',
    // alignItems: "center",
    // justifyContent: "space-between",
    backgroundColor: Colors.white,
    paddingHorizontal: 10,
    marginTop: 5,
    borderRadius: 5,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: getProportionalFontSize(16),
    textTransform: 'capitalize',
    // fontFamily:fonts.regular,
    // color:Colors.lightGray
  },
  selectedTextStyle: {
    fontSize: getProportionalFontSize(14),
    fontFamily: fonts.regular,
    color: Colors.gray,
  },
  iconStyle: {
    width: 20,
    height: 20,
    // alignSelf: "flex-end"
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  // container: { padding: 16 },
  selectedStyle: {
    borderRadius: 12,
  },
});
