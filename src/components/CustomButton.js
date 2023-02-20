import React from 'react';
import { View, StyleSheet, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../assets/Colors'
import Assets from '../assets/Assets';
import { getProportionalFontSize } from '../Services/CommonMethods';
import ProgressLoader from './ProgressLoader';
import Constants from '../constant/Constants';
import AntDesign from 'react-native-vector-icons/AntDesign';    

export default CustomButton = props => {
    return (
        <TouchableOpacity
            disabled={props.disabled}
            activeOpacity={props.activeOpacity ?? (props.onPress ? 0 : 1)}
            onPress={(props.onPress && !props.isLoading) ? props.onPress : () => { }}
            style={{...styles.button, ...props.style,backgroundColor :!props.disabled?Colors.primary:Colors.backgroundGray }}>
            {props.isLoading
                ? <ProgressLoader onActivityIndicator={true} onActivityIndicatorSize='small' onActivityIndicatorColor={props?.titleStyle?.color ? props?.titleStyle?.color : Colors.white} />
                :(<View style={styles.iconContainer}><View style={{...styles.iconStyle ,...props.iconStyle}}>{props.isIcon}</View>
                
                <Text
                    numberOfLines={props.numberOfLines ?? null}
                    style={[styles.buttonTitle, props.titleStyle]}>{props.title}</Text></View>)}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        width: '100%',
        minHeight: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5, 
        paddingVertical: 5,
        marginTop: Constants.formFieldTopMargin,
        paddingHorizontal: 16,
    },
    buttonTitle: {
        fontFamily: Assets.fonts.bold,
        fontSize: getProportionalFontSize(15),
        color: Colors.white
    },
    loaderStyle: {
        position: 'relative', width: '80%', backgroundColor: "transparent"
    },
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',


    },
    iconStyle: {
        marginRight: 5,
        justifyContent: 'center',
        alignItems: 'center',

    }
});
