import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';

export default function AlertComp(props) {
    const { doubleOption, error, title, message, onRequestClose } = props;
    return (
        <View style={styles.container}>
            <View style={{ ...styles.innerBox, }}>
                <Text
                    style={{
                        fontSize: 18,
                        fontWeight: '700',
                        color: error ? "red" : "#f7b82f"
                    }}>
                    {title ?? "title_not_found"}
                </Text>
                <Text
                    style={{
                        fontSize: 14,
                        fontWeight: '400',
                        marginVertical: 10,
                        textAlign: "center"
                    }}>
                    {message ?? "message_not_found"}
                </Text>
                <View
                    style={{
                        width: '100%',
                        flexDirection: 'row',
                        borderTopColor: 'gray',
                        borderTopWidth: 1,
                        paddingTop: 10,
                        justifyContent: doubleOption ? 'space-beTween' : "center",
                    }}>
                    <TouchableOpacity
                        style={{
                            // width: '50%',
                            backgroundColor: doubleOption ? "" : '#f7b82f',
                            paddingVertical: 5,
                            paddingHorizontal: 15,
                            borderRadius: 50,
                            alignItems: 'center',
                        }}
                        onPress={() => onRequestClose()}>
                        <Text
                            style={{
                                fontSize: 14,
                                fontWeight: '700',
                            }}>
                            {doubleOption ? "Cancel" : "Close"}
                        </Text>
                    </TouchableOpacity>

                    {doubleOption
                        ? <TouchableOpacity
                            style={{
                                // width: '50%',
                                backgroundColor: '#f7b82f',
                                paddingVertical: 5,
                                paddingHorizontal: 15,
                                borderRadius: 50,
                                minWidth: '30%',
                                alignItems: 'center',
                            }}>
                            <Text
                                style={{
                                    fontSize: 14,
                                    fontWeight: '700',
                                }}>
                                {doubleOption ? "Ok" : "Close"}
                            </Text>
                        </TouchableOpacity>
                        : null}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
        //  justifyContent: "center", alignItems: "center",
        paddingHorizontal: 16
    },
    innerBox: {
        width: '100%',
        // minHeight: 300, 
        backgroundColor: "#fff", paddingVertical: 15, paddingHorizontal: 16, borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        // padding: 20,
        // // paddingHorizontal: 10,
        // width: '90%',
        // borderRadius: 5,
    }
});
