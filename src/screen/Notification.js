import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Alert,
    FlatList,
    Button,
    RefreshControl,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';

import { fonts } from '../assets/Assets';
import BaseContainer from '../components/BaseContainer';
import Constants from '../constant/Constants';
import APIService from '../Services/APIService';
import { useSelector } from 'react-redux';
import FooterCompForFlatlist from '../components/FooterCompForFlatlist';
import EmptyList from '../components/EmptyList';
import { Portal, Modal } from 'react-native-paper';
import Colors from '../assets/Colors';
import moment from 'moment';
import CustomButton from '../components/CustomButton';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import ListLoader from '../components/ListLoader';
import { getProportionalFontSize } from '../Services/CommonMethods';

const Notification = ({ navigation }) => {
    const [listData, setListData] = useState([]);
    const [page, setPage] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [paginationLoading, setPaginationLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [visible, setVisible] = React.useState(false);
    const [visible1, setVisible1] = React.useState(false);
    const userLogin = useSelector(state => state.global_store.userLogin);
    const [modalData, setModalData] = useState({});

    const notificationsAPI = async (page, refresh, addFilter) => {
        if (refresh) setIsRefreshing(true);
        else if (!page) setIsLoading(true);
        else setPaginationLoading(true);
        let params = {
            page: page ? page : 1,
            per_page_record: 10,
        };
        let url = Constants.apiEndPoints.notifications;
        // return
        let response = await APIService.postData(
            url,
            params,
            userLogin.access_token,
            null,
            'notificationsAPI',
        );
        // return
        if (!response.errorMsg) {
            if (!page) {
                setPage(1);
                setListData(response?.data?.data?.data);
                setIsLoading(false);
                if (refresh) setIsRefreshing(false);
            } else {
                let tempListData = [...listData];
                tempListData = tempListData.concat(response?.data?.data?.data);
                setPage(page);
                setListData([...tempListData]);
                setPaginationLoading(false);
            }
        } else {
            if (!page) setIsLoading(false);
            else setPaginationLoading(false);
            if (refresh) setIsRefreshing(false);
            Alert.showAlert(Constants.danger, response.errorMsg);
        }
    };

    const handleUnReadBtnAPI = async id => {
        let params = {};
        let url = Constants.apiEndPoints.unreadNotificationCount + '/' + id;
        console.log(url, params);
        return;
        let response = await APIService.getData(
            url,
            userLogin.access_token,
            null,
            'userDocumentDelete',
        );
        if (!response.errorMsg) {
            Alert.alert('record read successfully');
        } else {
            Alert.alert(response.errorMsg);
        }
    };

    const handleRead = async id => {
        let url = Constants.apiEndPoints.notificationRead + '/' + id;
        // return
        let response = await APIService.getData(
            url,
            userLogin.access_token,
            null,
            'userDocumentDelete',
        );
        if (!response.errorMsg) {
            notificationsAPI();
            Alert.alert(
                Constants.success,
                response.message ?? 'Record read successfully',
            );
        } else {
            Alert.alert(
                Constants.danger.response.errorMsg ?? Constants.somethingWentWrong,
            );
        }
    };

    const handleDelete = async id => {
        let url = Constants.apiEndPoints.notification + '/' + id;
        // return
        let response = await APIService.deleteData(
            url,
            userLogin.access_token,
            null,
            'handleDeleteBtnAPI',
        );

        if (!response.errorMsg) {
            notificationsAPI();
            Alert.alert(
                Constants.success,
                response.message ?? 'Notification deleted successfully',
            );
        } else {
            Alert.alert(
                Constants.danger,
                response.errorMsg ?? 'Something went wrong',
            );
        }
    };
    const handleDeleteAllBtnAPI = async () => {
        let url = Constants.apiEndPoints.userNotificationDelete;
        // return
        let response = await APIService.getData(
            url,
            userLogin.access_token,
            null,
            'handleDeleteAllBtnAPI',
        );
        if (!response.errorMsg) {
            setVisible(false);
            notificationsAPI();
            Alert.alert(
                Constants.success,
                response.message ?? 'All notifications deleted successfully',
            );
        } else {
            Alert.alert(
                Constants.danger,
                response.errorMsg ?? 'Something went wrong',
            );
        }
    };

    const handleReadAllBtnAPI = async () => {
        let url = Constants.apiEndPoints.userNotificationReadAll;
        // return
        let response = await APIService.getData(
            url,
            userLogin.access_token,
            null,
            'handleReadAllBtnAPI',
        );
        if (!response.errorMsg) {
            setVisible(false);
            notificationsAPI();
            Alert.alert(
                Constants.success,
                response.message ?? 'All notifications read successfully',
            );
        } else {
            Alert.alert(
                Constants.danger,
                response.errorMsg ?? 'Something went wrong',
            );
        }
    };

    const LeftSwipeActions = () => {
        return (
            <View
                style={[
                    styles.card,
                    {
                        backgroundColor: 'green',
                        width: '20%',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        paddingLeft: 20,
                    },
                ]}
            >
                <Ionicons name="mail-unread" size={25} color={Colors.white} />
            </View>
        );
    };

    const rightSwipeActions = () => (
        <View
            style={[
                styles.card,
                {
                    backgroundColor: 'tomato',
                    width: '20%',
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                    paddingRight: 20,
                },
            ]}
        >
            <AntDesign name="delete" size={25} color={Colors.white} />
        </View>
    );

    useEffect(() => {
        notificationsAPI(null, null, true);
    }, []);
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            notificationsAPI();
        });
        return unsubscribe;
    }, [navigation]);

    const renderItem = ({ item }) => {
        const dateTime = moment(item.created_at).fromNow();
        return (
            <View
                style={{
                    flex: 1,
                    padding: 10,
                }}
            >
                <Swipeable
                    renderLeftActions={LeftSwipeActions}
                    renderRightActions={rightSwipeActions}
                    onSwipeableRightOpen={() => handleDelete(item.id)}
                    onSwipeableLeftOpen={() => handleRead(item.id)}
                    onSwipeableRightWillClose={'right'}
                    onSwipeableLeftWillClose={'left'}
                >
                    <TouchableOpacity
                        onPress={() => {
                            setModalData(item);
                            setVisible1(true);
                        }}
                        style={{
                            ...styles.card,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Ionicons
                            style={{
                                alignContent: 'center',
                            }}
                            size={50}
                            name="notifications-circle-outline"
                            color={Colors.primary}
                        />
                        <View
                            style={{
                                width: '80%',
                                marginTop: 4,
                                alignSelf: 'flex-start',
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: fonts.bold,
                                    fontSize: getProportionalFontSize(16),
                                    marginHorizontal: 8,
                                    textAlign: 'left',
                                    textTransform: 'capitalize',
                                }}
                            >
                                {item.title}
                            </Text>
                            <Text
                                style={{
                                    fontFamily: fonts.regular,
                                    marginHorizontal: 8,
                                    textAlign: 'left',
                                    textTransform: 'capitalize',
                                    fontSize: getProportionalFontSize(14),
                                }}
                            >
                                {dateTime}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </Swipeable>
            </View>
        );
    };
    if (isLoading) {
        return <ListLoader />;
    }
    return (
        <BaseContainer
            title="Notification"
            leftIcon="arrow-back"
            onPressLeftIcon={() => navigation.goBack()}
            rightIcon="more-vert"
            onPressRightIcon={() => setVisible(true)}
        >
            <FlatList
                data={listData}
                renderItem={renderItem}
                ListEmptyComponent={<EmptyList />}
                contentContainerStyle={{ paddingBottom: 100 }}
                keyExtractor={item => item.id}
                onEndReached={() => {
                    notificationsAPI(page + 1, null, true);
                }}
                onEndReachedThreshold={0.1}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={() => {
                            notificationsAPI(null, true);
                        }}
                    />
                }
                ListFooterComponent={() => (
                    <FooterCompForFlatlist paginationLoading={paginationLoading} />
                )}
            />
            <Portal>
                <Modal
                    visible={visible}
                    onDismiss={() => setVisible(false)}
                    contentContainerStyle={styles.modalContainer}
                >
                    <Entypo
                        name="cross"
                        size={20}
                        color="black"
                        style={styles.crossIcon}
                        onPress={() => setVisible(false)}
                    />
                    <View style={{ marginBottom: 50 }}>
                        <CustomButton
                            title="Read All"
                            onPress={() => handleReadAllBtnAPI()}
                            isIcon={
                                <Ionicons name="mail-unread" size={20} color={Colors.white} />
                            }
                            titleStyle={styles.btnTextStyle}
                            style={styles.btnStyle}
                        />
                        <CustomButton
                            title="Delete All"
                            onPress={() => handleDeleteAllBtnAPI()}
                            isIcon={<AntDesign name="delete" size={20} color={Colors.white} />}
                            titleStyle={styles.btnTextStyle}
                            style={styles.btnStyle}
                        />
                    </View>
                </Modal>
            </Portal>

            <Portal>
                <Modal
                    visible={visible1}
                    onDismiss={() => setVisible1(false)}
                    contentContainerStyle={{
                        backgroundColor: 'white',
                        padding: 10,
                        marginHorizontal: 20,
                        borderRadius: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Text
                            style={{
                                fontFamily: fonts.bold,
                                fontSize: getProportionalFontSize(16),
                                textAlign: 'center',
                                textTransform: 'capitalize',
                                padding: 5,
                            }}
                        >
                            {modalData.status_code}
                        </Text>
                        <Text
                            style={{
                                fontFamily: fonts.regular,
                                fontSize: getProportionalFontSize(14),
                                textAlign: 'center',
                                textTransform: 'capitalize',
                            }}
                        >
                            {modalData.message}
                        </Text>
                    </View>
                </Modal>
            </Portal>
        </BaseContainer>
    );
};

export default Notification;

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 8,
        marginVertical: 5,
        marginHorizontal: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        padding: 5,
    },
    crossIcon: {
        position: 'absolute',
        right: 5,
        top: 5,
        zIndex: 1,
        backgroundColor: Colors.shadowColorAndroidDefault,
        borderRadius: 50,
        padding: 5,
        elevation: 5,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
    },
    btnStyle: {
        backgroundColor: Colors.sky,
        borderWidth: 1,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        width: '60%',
        height: 20,
        alignSelf: 'center',
    },
    btnTextStyle: {
        color: Colors.black,
        fontSize: getProportionalFontSize(10),
        fontFamily: fonts.semiBold,
    },

    modalContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: Colors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        alignSelf: 'center',
    },
});
