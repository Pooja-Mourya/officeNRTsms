import Constants from "../constant/Constants";

import axios from 'axios';
import AsyncStorageService from "./AsyncStorageService";
import RNRestart from 'react-native-restart';
// import Alert from './Alert'
// import { Alert } from "react-native"
// const controller = new AbortController();
export default  APIService =
{
    getData: async (endPoint, token, controller, debugMsg) => {
        let url = Constants.base_url + endPoint;
        let headers = {
            'Accept': '*/*',
            'Content-Type': 'application/json'
        };
        if (token)
            headers['Authorization'] = 'Bearer ' + token;
        let configObject = {
            headers: headers,
        };
        // For cancelling API request
        if (controller) {
            configObject['signal'] = controller.signal;
        }
        console.log('token', token)
        console.log('url-get', url)

        let response = {};

        let debugMessage = debugMsg ?? "";
        try {
            response = await axios.get(url, configObject);
            if (!response?.data?.error) {
                console.log(debugMessage + ' SuccessResponse', JSON.stringify(response));
                return response;
            } else {
                console.log(debugMessage + ' FailureResponse...success value was false', response);
                response['data'] = response;
                response['errorMsg'] = (Constants.labels_for_non_react_files.something_went_wrong ? Constants.labels_for_non_react_files.something_went_wrong : "Something went wrong !!")
                return response;
            }
        }
        catch (error) {
            console.log(debugMessage + ' FailureResponse...inside catch', error?.response?.data);

            response['data'] = error?.response?.data;
            response['errorMsg'] = error?.response?.data?.message ?? Constants.labels_for_non_react_files.something_went_wrong
            return response;
        }
    },

    postData: async (endPoint, body, token, controller, debugMsg) => {

        let url = Constants.base_url + endPoint;
        let headers = {
            'Accept': '*/*',
            'Content-Type': 'application/json'
        };
        if (token) {
            console.log("token", token)
            headers['Authorization'] = 'Bearer ' + token;
        }

        let configObject = {
            headers: headers,
        };

        // For cancelling API request
        if (controller) {
            configObject['signal'] = controller.signal;
        }

        if (Array.isArray(body)) {
            body.map((obj) => {
                if (!Array.isArray(obj))
                    obj['entry_mode'] = Constants.entry_mode;
            })
        }
        // else
        //     body['entry_mode'] = Constants.entry_mode;

        console.log('token', token)
        console.log('url-post', url)
        console.log('params', JSON.stringify(body))

        let response = {};

        let debugMessage = debugMsg ?? "";

        if (!Constants.isConnected) {
            response['errorMsg'] = (Constants.labels_for_non_react_files.connect_internet_message ? Constants.labels_for_non_react_files.connect_internet_message : "Please check your internet connection !!");
            return response;
        }

        try {
            response = await axios.post(url, body, configObject);
            if (!response?.data?.error) {
                console.log(debugMessage + ' SuccessResponse', JSON.stringify(response));
                return response;
            } else {
                console.log(debugMessage + ' FailureResponse...success value was false', response);
                response['data'] = response;
                response['errorMsg'] = response?.message ?? (Constants.labels_for_non_react_files.something_went_wrong ? Constants.labels_for_non_react_files.something_went_wrong : "Something went wrong !!")
                return response;
            }
        }
        catch (error) {

            console.log(debugMessage + ' FailureResponse...inside catch', JSON.stringify(error));
            console.log(debugMessage + ' FailureResponse...inside catch code or status', JSON.stringify(error?.response?.status));

            response['data'] = error?.response?.data;
            response['errorMsg'] = error?.response?.data?.message ?? (Constants.labels_for_non_react_files.something_went_wrong ? Constants.labels_for_non_react_files.something_went_wrong : "Something went wrong !!")

            // Session is expired, re-login app logic  status
            // if (error?.response?.status == 500) {  
            //     await AsyncStorageService._removeData(Constants.asyncStorageKeys.user_login);
            //     RNRestart.Restart();
            // }

            // if (error?.response?.data?.code == 401) {
            //     //Alert.showToast(Constants.labels_for_non_react_files.session_expired)
            //     await AsyncStorageService._removeData(Constants.asyncStorageKeys.user_login);
            //     RNRestart.Restart();
            // }
            return response;
        }
    },

    putData: async (endPoint, body, token, controller, debugMsg) => {
        let url = Constants.base_url + endPoint;
        let headers = {
            'Accept': '*/*',
            'Content-Type': 'application/json'
        };
        if (token)
            headers['Authorization'] = 'Bearer ' + token;

        let configObject = {
            headers: headers,
        };

        // For cancelling API request
        if (controller) {
            configObject['signal'] = controller.signal;
        }
        if (Array.isArray(body)) {
            body.map((obj) => {
                if (!Array.isArray(obj))
                    obj['entry_mode'] = Constants.entry_mode;
            })
        }
        else
            body['entry_mode'] = Constants.entry_mode;

        console.log('token', token)
        console.log('url-put', url)
        console.log('params', JSON.stringify(body))

        let response = {};

        let debugMessage = debugMsg ?? "";

        if (!Constants.isConnected) {
            response['errorMsg'] = (Constants.labels_for_non_react_files.connect_internet_message ? Constants.labels_for_non_react_files.connect_internet_message : "Please check your internet connection !!");
            return response;
        }

        try {
            response = await axios.put(url, body, configObject);
            if (!response?.data?.error) {
                // console.log(debugMessage + ' SuccessResponse', JSON.stringify(response));
                return response;
            } else {
                // console.log(debugMessage + ' FailureResponse...success value was false', response);
                response['data'] = response;
                response['errorMsg'] = (Constants.labels_for_non_react_files.something_went_wrong ? Constants.labels_for_non_react_files.something_went_wrong : "Something went wrong !!")
                return response;
            }
        }
        catch (error) {
            // console.log(debugMessage + ' FailureResponse...inside catch', error?.response?.data);

            response['data'] = error?.response?.data;
            response['errorMsg'] = error?.response?.data?.message ?? Constants.labels_for_non_react_files.something_went_wrong;

            // Session is expired, re-login app logic  status
            if (error?.response?.status == 500) {

                // Alert.showToast(Constants.labels_for_non_react_files.session_expired)

                await AsyncStorageService._removeData(Constants.asyncStorageKeys.user_login);
                RNRestart.Restart();
            }

            // if (error?.response?.data?.code == 401) {
            //     //Alert.showToast(Constants.labels_for_non_react_files.session_expired)
            //     await AsyncStorageService._removeData(Constants.asyncStorageKeys.user_login);
            //     RNRestart.Restart();
            // }
            return response;
        }
    },

    deleteData: async (endPoint, token, controller, debugMsg) => {
        let url = Constants.base_url + endPoint;
        let headers = {
            'Accept': '*/*',
            'Content-Type': 'application/json'
        };
        if (token)
            headers['Authorization'] = 'Bearer ' + token;

        let configObject = {
            headers: headers,
        };

        // For cancelling API request
        if (controller) {
            configObject['signal'] = controller.signal;
        }

        console.log('token', token)
        console.log('url-delete', url)

        let response = {};

        let debugMessage = debugMsg ?? "";

        if (!Constants.isConnected) {
            response['errorMsg'] = (Constants.labels_for_non_react_files.connect_internet_message ? Constants.labels_for_non_react_files.connect_internet_message : "Please check your internet connection !!");
            return response;
        }

        try {
            response = await axios.delete(url, configObject);
            if (!response?.data?.error) {
                console.log(debugMessage + ' SuccessResponse', response);
                return response;
            } else {
                console.log(debugMessage + ' FailureResponse...success value was false', response);
                response['data'] = response;
                response['errorMsg'] = (Constants.labels_for_non_react_files.something_went_wrong ? Constants.labels_for_non_react_files.something_went_wrong : "Something went wrong !!")
                return response;
            }
        }
        catch (error) {
            console.log(debugMessage + ' FailureResponse...inside catch', error?.response?.data);

            response['data'] = error?.response?.data;
            response['errorMsg'] = error?.response?.data?.message ?? Constants.labels_for_non_react_files.something_went_wrong;

            // Session is expired, re-login app logic  status
            if (error?.response?.status == 500) {

                // Alert.showToast(Constants.labels_for_non_react_files.session_expired)

                await AsyncStorageService._removeData(Constants.asyncStorageKeys.user_login);
                RNRestart.Restart();
            }

            // if (error?.response?.data?.code == 401) {
            //     //Alert.showToast(Constants.labels_for_non_react_files.session_expired)
            //     await AsyncStorageService._removeData(Constants.asyncStorageKeys.user_login);
            //     RNRestart.Restart();
            // }
            return response;
        }
    },

    uploadFile: async (endpoint, singleFile, token, title, type, debugMsg,param_key="file") => {
        console.log("-----uploadFile?-----")
        console.log('singleFile', singleFile)
        let formDataRes = new FormData();
        console.log("formDataRes", formDataRes)
        // let formDataRes_new = {
        //     is_multiple: type == 0,
        //     file: singleFile
        // } 
        if (type == 'multiple') {
            formDataRes.append('file_title', title);
            formDataRes.append('is_multiple', 1);
            singleFile.map((obj, index) => {
                if (obj.uri != '') {
                    if (!obj.size)
                        obj['size'] = obj.fileSize ?? obj.size;
                    if (!obj.name)
                        obj['name'] = obj.fileName ? obj.fileName : obj.name ? obj.name : obj.uri.substr(obj.uri.lastIndexOf('/'), obj.uri.length);
                    // console.log(obj);
                    formDataRes.append(`file[${index}]`, obj);
                }
            })
        }
        else {
            console.log('file_title', title)
            formDataRes.append('file_title', title);
            formDataRes.append('is_multiple', 0);
            if (singleFile.type !== "application/pdf") {
                if (!singleFile?.size)
                    singleFile['size'] = singleFile.fileSize;
                if (!singleFile?.name)
                    singleFile['name'] = singleFile.fileName;
                if (!singleFile[0]?.file_path)
                    singleFile[0]['file_path'] = singleFile[0].uri;
            }
            formDataRes.append(param_key, singleFile[0]);
            // formDataRes.append('file_path', singleFile[0]);
        }

        let debugMessage = debugMsg ?? "";

        // return fetch(this.apiBaseUrl + endpoint, {
        //     method: 'POST',
        //     headers: headers,
        //     body: formDataRes,
        // });
        let url = Constants.base_url + endpoint
        let headers = {};
        if (token) {
            headers = {
                'Authorization': 'Bearer ' + token,
                'Accept': '*/*',
                'Content-Type': 'multipart/form-data;',
            }
        }
        else {
            headers = {
                'Accept': '*/*',
                'Content-Type': 'multipart/form-data;',
            }
        }
        // if (token)
        //     headers['Authorization'] = 'Bearer ' + token;

        let configObject = {
            headers: headers,
            // body: formDataRes,
        };
        // let configObject = {
        //     method: 'POST',
        //     headers: headers,
        //     body: formDataRes,
        // }
        let response = {}

        // console.log(' API reference -- url', "formDataRes", JSON.stringify(formDataRes))

        console.log(' API reference -- url', url, "formDataRes", JSON.stringify(formDataRes))


        // console.log('configObject', configObject)
        // return
        try {
            response = await axios.post(url, formDataRes, configObject);

            if (!response?.data?.error) {
                console.log(debugMessage + ' SuccessResponse', JSON.stringify(response));
                return response;
            } else {
                console.log(debugMessage + ' FailureResponse...success value was false', JSON.stringify(response));
                response['data'] = response;
                response['errorMsg'] = (Constants.labels_for_non_react_files.something_went_wrong ? Constants.labels_for_non_react_files.something_went_wrong : "Something went wrong !!")
                return response;
            }
        }
        catch (error) {
            console.log(debugMessage + ' FailureResponse...inside catch', error?.response?.data);
            console.log(debugMessage + ' FailureResponse...msg', error);

            response['data'] = error?.response?.data;
            response['errorMsg'] = error?.response?.data?.message ?? Constants.labels_for_non_react_files.something_went_wrong;

            // Session is expired, re-login app logic  status
            // if (error?.response?.status == 500) { 
            //     // Alert.showToast(Constants.labels_for_non_react_files.session_expired) 
            //     await AsyncStorageService._removeData(Constants.asyncStorageKeys.user_login);
            //     RNRestart.Restart();
            // }

            // if (error?.response?.data?.code == 401) {
            //     //Alert.showToast(Constants.labels_for_non_react_files.session_expired)
            //     await AsyncStorageService._removeData(Constants.asyncStorageKeys.user_login);
            //     RNRestart.Restart();
            // }
            return response;
        }
    }
}

// export default APIService;

