// // import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
// // import AntDesign from 'react-native-vector-icons/AntDesign';
// // import React, { useState } from 'react'
// // import { fonts } from '../assets/Assets';

// // const Dropdown = ({ ChooseOption, onDrop, props }) => {

// //     // const APIdata = [
// //     //     {
// //     //         id: '1',
// //     //         item: 'one'
// //     //     },
// //     //     {
// //     //         id: '2',
// //     //         item: 'two'
// //     //     },
// //     //     {
// //     //         id: '3',
// //     //         item: 'three'
// //     //     }

// //     // ]
// //     const [isSelected, setIsSelected] = useState([])
// //     const [isActive, setIsActive] = useState(false)
// //     const { data, onPressItem, keyToShowData, keyToCompareData } = props
// //     console.log(isSelected)
// //     return (
// //         <>
// //             <View style={styles.container}>
// //                 {isSelected ? <Text style={styles.ChooseStyle}>{ChooseOption}</Text> : setIsSelected(!isSelected)}
// //                 {/* {isSelected ? setIsSelected(!isSelected) : <Text>{ChooseOption}</Text>} */}
// //                 <AntDesign onPress={() => setIsActive(!isActive)} name='caretdown' size={15} />
// //             </View>
// //             {isActive && (
// //                 <View style={styles.DropdownStyle}>
// //                     {userAPIdata.map((option, i) => {
// //                         // alert(option.item)
// //                         return (
// //                             <TouchableOpacity
// //                                 onPress={() => {
// //                                     // alert(option.item)
// //                                     setIsSelected(option.item),
// //                                         setIsActive(false)
// //                                     onDrop(option.item)
// //                                 }}
// //                                 data={data}
// //                                 // search
// //                                 maxHeight={300}
// //                                 labelField={keyToShowData}
// //                                 valueField={keyToCompareData}
// //                                 // placeholder="Select item"
// //                                 // searchPlaceholder="Search..."
// //                                 // value={value}
// //                                 onChange={item => {
// //                                     onPressItem(item);
// //                                     setValue(item.value);
// //                                 }}
// //                             >
// //                                 <Text key={String(i)} style={{ marginVertical: 5 }}>{option.item}</Text>
// //                                 {/* <Text>{isSelected}</Text> */}
// //                             </TouchableOpacity>
// //                         )
// //                     })}
// //                 </View>

// //             )}

// //         </>
// //     )
// // }

// // export default Dropdown

// // const styles = StyleSheet.create({
// //     container: {
// //         // flex: 1,
// //         justifyContent: 'space-between',
// //         paddingVertical: 18,
// //         flexDirection: 'row',
// //         // marginTop: 20,
// //         // elevation: 12,
// //         // backgroundColor: '#fff5e6',
// //         padding: 10,
// //         backgroundColor: 'white',
// //         borderWidth: 1,
// //         borderColor: '#ff9900',
// //         marginTop: 8,
// //         borderRadius: 5
// //     },
// //     DropdownStyle: {
// //         width: 350,
// //         // marginHorizontal: 20,
// //         marginTop: 60,
// //         backgroundColor: 'white',
// //         elevation: 12,
// //         padding: 18,
// //         position: 'absolute',
// //         // borderWidth: 2,
// //         zIndex: 2
// //     },
// //     ChooseStyle: {
// //         // color: '#1a0f00',
// //         fontFamily: fonts.regular,
// //     }
// // })



// import React, { useState } from 'react';
// import { StyleSheet } from 'react-native';
// import { Dropdown } from 'react-native-element-dropdown';
// import AntDesign from 'react-native-vector-icons/AntDesign';



// const DropdownComponent = (props) => {
//     const { onPressItem, keyToShowData, keyToCompareData, selectItem } = props
//     const [value, setValue] = useState(null);

//     const data = [
//         { label: 'Item 1', value: '1' },
//         { label: 'Item 2', value: '2' },
//         { label: 'Item 3', value: '3' },
//         { label: 'Item 4', value: '4' },
//         { label: 'Item 5', value: '5' },
//         { label: 'Item 6', value: '6' },
//         { label: 'Item 7', value: '7' },
//         { label: 'Item 8', value: '8' },
//     ];
//     return (
//         <>
//             <Dropdown
//                 style={styles.dropdown}
//                 placeholderStyle={styles.placeholderStyle}
//                 selectedTextStyle={styles.selectedTextStyle}
//                 inputSearchStyle={styles.inputSearchStyle}
//                 iconStyle={styles.iconStyle}
//                 data={data}
//                 search
//                 maxHeight={300}
//                 labelField={keyToShowData}
//                 valueField={keyToCompareData}
//                 placeholder={selectItem}
//                 searchPlaceholder="Search..."
//                 value={value}
//                 onChange={item => {
//                     onPressItem(item);
//                     setValue(item.value);
//                 }}
//                 renderLeftIcon={() => (
//                     <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
//                 )}
//             />

//         </>
//     );
// };

// export default DropdownComponent;

// const styles = StyleSheet.create({
//     dropdown: {
//         margin: 16,
//         height: 50,
//         borderBottomColor: 'gray',
//         borderBottomWidth: 0.5,
//     },
//     icon: {
//         marginRight: 5,
//     },
//     placeholderStyle: {
//         fontSize: 16,
//     },
//     selectedTextStyle: {
//         fontSize: 16,
//     },
//     iconStyle: {
//         width: 20,
//         height: 20,
//     },
//     inputSearchStyle: {
//         height: 40,
//         fontSize: 16,
//     },
// });



import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { MultiSelect } from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';

const data = [
    { label: 'Item 1', value: '1' },
    { label: 'Item 2', value: '2' },
    { label: 'Item 3', value: '3' },
    { label: 'Item 4', value: '4' },
    { label: 'Item 5', value: '5' },
    { label: 'Item 6', value: '6' },
    { label: 'Item 7', value: '7' },
    { label: 'Item 8', value: '8' },
];

const MultiSelectComponent = () => {
    const [selected, setSelected] = useState([]);

    return (
        <View style={styles.container}>
            <MultiSelect
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                search
                data={data}
                labelField="label"
                valueField="value"
                placeholder="Select item"
                searchPlaceholder="Search..."
                value={selected}
                onChange={item => {
                    setSelected(item);
                }}
                renderLeftIcon={() => (
                    <AntDesign
                        style={styles.icon}
                        color="black"
                        name="Safety"
                        size={20}
                    />
                )}
                selectedStyle={styles.selectedStyle}
            />
        </View>
    );
};

export default MultiSelectComponent;

const styles = StyleSheet.create({
    container: { padding: 16 },
    dropdown: {
        height: 50,
        backgroundColor: 'transparent',
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 14,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    icon: {
        marginRight: 5,
    },
    selectedStyle: {
        borderRadius: 12,
    },
});