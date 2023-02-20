import { StyleSheet, View ,ScrollView} from 'react-native'
import React,{useState} from 'react'
import InputValidation from '../../../components/InputValidation';
import CustomButton from '../../../components/CustomButton';
import DropDownCoom from '../../../components/DropDownComp';
import { getProportionalFontSize } from '../../../Services/CommonMethods';
import Colors from '../../../assets/Colors';
const UserManageFilter = (props) => { 
    const formFieldsKeys = {
        name: 'name',
        email: 'email',
        mobile: 'mobile',
        status: 'status',
        username: 'username',
      };
    
      const initialValues = {
        [formFieldsKeys.name]: '',
        [formFieldsKeys.email]: '',
        [formFieldsKeys.mobile]: '',
        [formFieldsKeys.username]: '',
        [formFieldsKeys.status]: '',
      };


    const { setModalVisible, setFilterData } = props;
    const [formValues, setFormValues] = useState(initialValues);

      
   
      const handleInputChange = (key, value) => {
        setFormValues({
          ...formValues,
          [key]: value,
        });
      };
  return (
    <ScrollView
    style={{
        flex: 1,
        width: '100%',
        backgroundColor: Colors.white,
      }}
    contentContainerStyle={{  }}
    showsVerticalScrollIndicator={false}
  > 
    <InputValidation
      label="Name"
      value={formValues[formFieldsKeys.name]}
      placeHolder="Enter Name"
      onChangeText={value => {
        handleInputChange(formFieldsKeys.name, value);
      }}
    />
    <InputValidation
      label="Username"
      value={formValues[formFieldsKeys.username]}
      placeHolder="Enter Username"
      onChangeText={value => {
        handleInputChange(formFieldsKeys.username, value);
      }}
    />
    <InputValidation
      label="Email"
      value={formValues[formFieldsKeys.email]}
      placeHolder="Enter Email"
      onChangeText={value => {
        handleInputChange(formFieldsKeys.email, value);
      }}
    />
    <InputValidation
      label="Mobile"
      value={formValues[formFieldsKeys.mobile]}
      placeHolder="Enter Mobile"
      onChangeText={value => {
        handleInputChange(formFieldsKeys.mobile, value);
      }}
    />
    <DropDownCoom
      data={[
        { label: 'Active', value: '1' },
        { label: 'Inactive', value: 'no' },
      ]}
      onPressItem={item => {
        handleInputChange(formFieldsKeys.status, item.value);
      }}
      keyToShowData="label"
      value={formValues[formFieldsKeys.status]}
      keyToCompareData="value"
      placeHolder="Select Status"
    />
    
    <View style={styles.buttonView}>
      <CustomButton
        onPress={() => setFormValues(initialValues)}
        title={'Clear Filter'}
        style={{
          width: '45%',
        }}
        titleStyle={{
          fontSize: getProportionalFontSize(14),
          lineHeight: 20,
        }}
      />
      <CustomButton
        onPress={() => {setFilterData(formValues); setModalVisible(false);}}
        title={'Apply Filter'}
        style={{
          width: '45%',
        }}
        titleStyle={{
          fontSize: getProportionalFontSize(14),
          lineHeight: 20,
        }}
      />
    </View>
  </ScrollView> 
  )
}

export default UserManageFilter

const styles = StyleSheet.create({
    modalStyle: {
        width: '90%',
        height: '80%', 
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
      buttonView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
      },
      
})