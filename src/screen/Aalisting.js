// how to write api with pagination and loader in react-native

const patientListingAPI = async (page, refresh) => {
    if (refresh)
        setIsRefreshing(true)
    else if (!page)
        setIsLoading(true);
    else
        setPaginationLoading(true)
    let params = {
        "perPage": Constants.perPage,
        "page": page ?? 1,
        "user_type_id": "6",
        "patient": param?.patient?.id ?? "",
        "name": param?.name ?? "",
        "email": param?.email ?? "",
        "contact_number": param?.contact_number ?? "",
        "patient_type_id": param?.patientType_id?.id ?? "",
        "personal_number": param?.personal_number ?? "",
        // "patientType_id": param?.patientType_id ?? "",
        // ...param
    } 
    let url = Constants.apiEndPoints.userList; 
    let response = await APIService.postData(url, params, UserLogin.access_token, null, "patientListingAPI");

    if (!response.errorMsg) { 
        if (!page) {
            setPage(1);
            setPatientList(response.data.payload.data);
            setIsLoading(false);
            if (refresh)
                setIsRefreshing(false);
        }
        else {
            let tempPatientList = [...patientList];
            tempPatientList = tempPatientList.concat(response.data.payload.data);
            setPage(page);
            setPatientList([...tempPatientList]);
            setPaginationLoading(false);
        }
    }
    else {
        if (!page)
            setIsLoading(false);
        else
            setPaginationLoading(false)
        if (refresh)
            setIsRefreshing(false);
        Alert.showAlert(Constants.danger, response.errorMsg)
    }
}

// how to write FlatList with pagination and loader in react-native

<FlatList
    data={patientList}
    ListEmptyComponent={<EmptyList />}
    renderItem={flatListRenderItem}
    contentContainerStyle={{ borderWidth: 0, paddingVertical: Constants.globalPaddingVetical, paddingHorizontal: Constants.globalPaddingHorizontal }}
    keyExtractor={item => item.id}
    onEndReached={() => { patientListingAPI(page + 1) }}
    onEndReachedThreshold={0.1}
    refreshControl={
        <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => {
                patientListingAPI(null, true)
            }}
        />
    }
    ListFooterComponent={() => <FooterCompForFlatlist paginationLoading={paginationLoading} />}
/>

// how to write EmptyList for FlatList with pagination and loader in react-native

import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import { getProportionalFontSize } from '../Services/CommonMethods';
import Assets from '../Assets/Assets';
import Constants from '../Constants/Constants';
import Colors from '../Constants/Colors';
import { useSelector, useDispatch } from 'react-redux'
import LottieView from 'lottie-react-native';

const deviceHeight = Dimensions.get('window').height;

const EmptyList = (props) => {

    const labels = useSelector(state => state.Labels);

    return (
        <View style={[styles.container, props.style]}>
            {props.noModuleMsg
                ? <LottieView
                    source={require('../Assets/images/no_module.json')}
                    autoPlay
                    loop={true}
                    style={{
                        width: "15%",
                    }}
                />
                : props.messageIcon
                    ? <IconFontAwesome name={props.messageIcon} size={50} color={Colors.lightGray} />
                    : <Icon name={"social-dropbox"} size={50} color={Colors.lightGray} />}

            <Text style={styles.text}>{props.noModuleMsg ? labels.module_inactive : props.title ? props.title : labels.no_data_found}</Text>
            {props.noModuleMsg
                ? <Text style={styles.smallText}>{labels["contact-admin"]}</Text>
                : props.shouldAddDataMessageVisible === false
                    ? null
                    : <Text style={styles.smallText}>{props.subHeading ?? labels.click_add}</Text>
            }

            {props.noModuleMsg
                ? <CustomButton
                    style={styles.nextButton}
                    titleStyle={{ color: Colors.white }}
                    onPress={() => {
                        props?.navigation?.navigate ? props?.navigation?.navigate('RequestsStack', { screen: "RequestListing", params: { addModalVisible: true } }) : null
                    }}
                    title={labels.request_admin}
                />
                : null
            }
        </View>
    );
};

export default EmptyList;

const styles = StyleSheet.create({
    container: {
        height: deviceHeight / 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: getProportionalFontSize(20),
        fontFamily: Assets.fonts.regular,
        marginTop: 20,
        letterSpacing: 1,
    },
    smallText: {
        fontSize: getProportionalFontSize(12),
        fontFamily: Assets.fonts.semiBold,
    },
    nextButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '75%',
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.primary,
        marginTop: Constants.formFieldTopMargin,
    },
});


// how to write Footer Component  for FlatList with pagination and loader in react-native


import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import React from 'react'
import Colors from '../Constants/Colors';
import LottieView from 'lottie-react-native';
// loading.json

export const FooterCompForFlatlist = (props) => {
    if (props.paginationLoading) {
        return (
            <View style={{ height: 30, width: "100%", justifyContent: "center", alignItems: "center" }}>
                {/* <ActivityIndicator size="large" color={Colors.primary} /> */}
                {props.activityIndicator
                    ? <ActivityIndicator color={Colors.primary} />
                    : <LottieView
                        source={require('../Assets/images/loading.json')}
                        autoPlay
                        loop
                        style={{
                            width: "25%",
                        }}
                    />}
            </View>
        )
    } else {
        return (
            <View style={{ height: 30, width: "100%", justifyContent: "center", alignItems: "center" }}>
                {/* <Text style={{ fontSize: 25, }}>~</Text> */}
            </View>
        )
    }

} 
 
