import {ScrollView} from 'react-native';
import React, {useState, useEffect} from 'react';
import InputValidation from '../../components/InputValidation';
import DropDownComp from '../../components/DropDownComp';
import CustomButton from '../../components/CustomButton';

const creditType = [
  {
    id: '1',
    title: 'Transactional',
  },
  {
    id: '2',
    title: 'Promotional',
  },
  {
    id: '3',
    title: 'Two way SMS',
  },
  {
    id: '4',
    title: 'Voice',
  },
];

const AddCredit = props => {
  const {setFilterParams, setModalVisible} = props;
  const formFieldsKeys = {
    credit_request: 'credit_request',
    route_type: 'route_type',
    comment: 'comment',
  };
  const initialValues = {
    [formFieldsKeys.credit_request]: '',
    [formFieldsKeys.route_type]: '',
    [formFieldsKeys.comment]: '',
  };
  const [formValues, setFormValues] = useState(initialValues);

  const handleInputChange = (key, value) => {
    setFormValues({
      ...formValues,
      [key]: value,
    });
  };

  return (
    <ScrollView
      contentContainerStyle={{flexGrow: 1}}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      style={{
        flex: 1,
        backgroundColor: 'white',
        width: '100%',
      }}
    >
      <InputValidation
        placeHolder={'Credit Request'}
        label={'Credit Request'}
        keyboardType={'numeric'}
        value={formValues?.[formFieldsKeys?.credit_request] ?? ''}
        onChangeText={text => {
          handleInputChange(formFieldsKeys?.credit_request, text);
        }}
      />
      <DropDownComp
        data={creditType}
        onPressItem={item => {
          handleInputChange('route_type', item);
        }}
        keyToShowData="title"
        keyToCompareData="id"
        placeHolder={'Route Type'}
        isSearch={'Search route Type ...'}
      />
      <CustomButton
        title="Apply"
        onPress={() => {
          setFilterParams(formValues);
          setModalVisible(false);
        }}
      />
    </ScrollView>
  );
};

export default AddCredit;
