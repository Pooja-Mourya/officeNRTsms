import {
    StyleSheet,
    Text,
    View,
    FlatList,
    Alert,
    RefreshControl,
    TouchableOpacity,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Constants from '../../../constant/Constants';
import { useSelector, useDispatch } from 'react-redux';
import APIService from '../../../Services/APIService';
import BaseContainer from '../../../components/BaseContainer';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import EmptyList from '../../../components/EmptyList';
import FooterCompForFlatlist from '../../../components/FooterCompForFlatlist';
import { FAB, Searchbar } from 'react-native-paper';
import TransparentLoader from '../../../components/TransparentLoader';
import Colors from '../../../assets/Colors';
import ListLoader from '../../../components/ListLoader';
import { getProportionalFontSize } from '../../../Services/CommonMethods';

const BlackList = ({ navigation, props }) => {
    const userLogin = useSelector(state => state?.global_store?.userLogin);
    const [blockedNumber, setBlockedNumber] = React.useState({});
    const [page, setPage] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [paginationLoading, setPaginationLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [openFAB, setOpenFAB] = useState(false);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [search, setSearch] = useState(false);

    console.log('search', search);

    // numberlist

    const listing_number = async (page, refresh, addNumber) => {
        if (refresh) setIsRefreshing(true);
        else if (!page) setIsLoading(true);
        else setPaginationLoading(true);
        let params = {
            page: page ? page : 1,
            per_page_record: 10,
        };
        let url = Constants.apiEndPoints.block_number_create;
        let response = await APIService.postData(
            url,
            params,
            userLogin.access_token,
            null,
            'listing_number',
        );
        // return
        if (!response.errorMsg) {
            if (!page) {
                setPage(1);
                setBlockedNumber(response?.data?.data?.data);
                setIsLoading(false);
                if (refresh) setIsRefreshing(false);
            } else {
                let tempListData = [...blockedNumber];
                tempListData = tempListData.concat(response?.data?.data?.data);
                setPage(page);
                setBlockedNumber([...tempListData]);
                setPaginationLoading(false);
            }
        } else {
            if (!page) setIsLoading(false);
            else setPaginationLoading(false);
            if (refresh) setIsRefreshing(false);
            Alert.showAlert(Constants.danger, response.errorMsg);
        }
    };
    useEffect(() => {
        listing_number(null, null, true);
    }, []);
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            listing_number();
        });
        return unsubscribe;
    }, [navigation]);

    if (isLoading) {
        return <ListLoader />;
    }

    // numberDelete
    const DeleteNumber = async id => {
        let url = Constants.apiEndPoints.Add_block_number + '/' + id;
        // return
        let response = await APIService.deleteData(
            url,
            userLogin.access_token,
            null,
            'delete_block_number_API',
        );
        if (!response.errorMsg) {
            listing_number();
            Alert.alert(
                Constants.success,
                response?.data?.message ?? 'Record deleted successfully',
            );
        } else {
            Alert.alert(Constants.danger, response.errorMsg ?? 'Something went wrong');
        }
    };

    const removeFromBlaclist = async id => {
        let url = Constants.apiEndPoints.blackListAction;
        // return
        let response = await APIService.postData(
            url,
            { blacklists_id: [id] },
            userLogin.access_token,
            null,
            'removeFromBlaclist',
        );
        if (!response.errorMsg) {
            listing_number();
            Alert.alert(
                Constants.success,
                response?.data?.message ?? 'Moved to blacklist successfully',
            );
        } else {
            Alert.alert(Constants.danger, response.errorMsg ?? 'Something went wrong');
        }

    };

    const blackListAction = (id, action) => {
        Alert.alert(
            'Are you sure?',
            'Do you want to ' + action + ' remove form blacklist?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: 'OK',
                    onPress: () => removeFromBlaclist(id),
                },
            ],
            { cancelable: false },
        );
    };

    const removeAll = async () => {
        let url = Constants.apiEndPoints.block_number_create;
        // return
        let response = await APIService.deleteData(
            url,
            userLogin.access_token,
            null,
            'delete_block_number_API',
        );
        if (!response.errorMsg) {
            listing_number();
            Alert.alert(
                Constants.success,
                response?.data?.message ?? 'Record deleted successfully',
            );
        } else {
            Alert.alert(Constants.danger, response.errorMsg ?? 'Something went wrong');
        }
    };

    const renderItem = ({ item, index }) => {
        return (
            <View
                style={{
                    backgroundColor: Colors.white,
                    marginHorizontal: 10,
                    elevation: 12,
                    marginTop: 10,
                    padding: 8,
                    borderRadius: 25
                }}
            >
                <View
                    key={index}
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: 10,
                        borderBottomWidth: 1,
                        borderBottomColor: Colors.lightGray,
                    }}
                >
                    <Entypo name="block" size={18} color="black"
                        onPress={() => blackListAction(item.id, item.mobile_number)}
                        style={{ marginRight: 10 }} />

                    <Text
                        style={{
                            fontSize: getProportionalFontSize(16),
                            color: Colors.black,
                            marginLeft: 5,
                            flex: 1,
                            flexWrap: 'wrap',
                        }}>
                        {item.mobile_number}
                    </Text>

                    <TouchableOpacity
                        onPress={() => {
                            Alert.alert(
                                'Are you sure? ', + item.mobile_number +
                            'you want to delete this number?',
                                [
                                    {
                                        text: 'Cancel',
                                        onPress: () => console.log('Cancel Pressed'),
                                        style: 'cancel',
                                    },
                                    {
                                        text: 'OK',
                                        onPress: () => DeleteNumber(item.id),
                                    },
                                ],
                                { cancelable: false },
                            );
                        }}>
                        <AntDesign name="delete" color="red" size={18} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };


    return (
        <BaseContainer
            title="BlackList"
            leftIcon="arrow-back"
            onPressLeftIcon={() => navigation.goBack()}
            onPressRightIcon={() => setSearch(true)}
            rightIcon="filter-list">
            <TransparentLoader isLoading={isLoading} />
            <FlatList
                data={Array.isArray(blockedNumber) ? blockedNumber.filter
                    (item => item?.mobile_number?.toString().startsWith(searchQuery)) : []}
                renderItem={renderItem}
                ListEmptyComponent={<EmptyList />}
                contentContainerStyle={{ paddingBottom: 100 }}
                keyExtractor={(item, index) => index}
                onEndReached={() => {
                    listing_number(page + 1, null, true);
                }}
                onEndReachedThreshold={0.1}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={() => {
                            listing_number(null, true);
                        }}
                    />
                }
                ListFooterComponent={() => (
                    <FooterCompForFlatlist paginationLoading={paginationLoading} />
                )}
            />
            {search && (
                <Searchbar
                    placeholder="Search"
                    onChangeText={query => setSearchQuery(query)}
                    value={searchQuery}
                    keyboardType="number-pad"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        zIndex: 100,
                        height: 50,
                    }}
                    clearIcon={true}
                />
            )}
            {/* Cross icon */}
            {search && (
                <AntDesign
                    name="close"
                    size={20}
                    color="black"
                    style={{
                        position: 'absolute',
                        top: 15,
                        right: 5,
                        zIndex: 100,
                        marginHorizontal: 5,
                    }}
                    onPress={() => {
                        setSearchQuery('');
                        setSearch(false);
                    }}
                />
            )}

            <FAB.Group
                style={{ marginBottom: 65 }}
                actions={[
                    {
                        icon: 'import',
                        label: 'import contact',
                        onPress: () => { navigation.navigate('AddBlockNumber', { isImport: true }) },
                    },
                    {
                        icon: 'block-helper',
                        label: 'add numbers for blacked ',

                        onPress: () => { navigation.navigate('AddBlockNumber', { isImport: false }) },
                    },
                ]}
                fabStyle={{ backgroundColor: Colors.primary }}
                open={openFAB}
                icon={openFAB ? 'close' : 'plus'}
                color={Colors.white}
                onStateChange={open => {
                    if (openFAB) setOpenFAB(false);
                    else setOpenFAB(true);
                }}
            />
        </BaseContainer>
    );
};
export default BlackList;

const style = StyleSheet.create({
    centeredView: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
});
