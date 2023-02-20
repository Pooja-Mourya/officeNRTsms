import { Dimensions, Platform } from 'react-native';
const { width, height } = Dimensions.get('window');


const guidelineBaseWidth = 360;
const guidelineBaseHeight = 760;
const scale = size => (width / guidelineBaseWidth) * size;
const verticalScale = size => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) =>
    size + (scale(size) - size) * factor;


export function getProportionalFontSize(baseFontSize) {
    var initialFontSize = baseFontSize || 14;
    var fontSizeToReturnModerate = moderateScale(initialFontSize);
    var fontSizeToReturnVertical = verticalScale(initialFontSize);
    return Platform.OS == 'ios'
        ? fontSizeToReturnModerate
        : fontSizeToReturnVertical;
}

export function checkEmailFormat(email) {
    const emailCheck =
        /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
    return emailCheck.test(email);
}

export function checkMobileNumberFormat(mobileNo) {
    const mobileNoCheck = /^[0-9]{10,10}$/;
    return mobileNoCheck.test(mobileNo);
}

export function checkFileSize(file, maxSizeMB) {
    var size = 0;
    if (file.type === 'application/pdf') size = file.size;
    else size = file.fileSize ? file.fileSize : file.size;
    var sizeKB = size / 1024;
    var sizeMB = size / 1048576;
    console.log('sizeKB : ' + sizeKB + ' sizeMB : ' + sizeMB);
    if (maxSizeMB) {
        if (sizeMB <= maxSizeMB) {
            return true;
        } else {
            Alert.showAlert(Constants.warning, Constants.labels_for_non_react_files.file_variable_size_error_message + ' ' + maxSizeMB + "MB")
            return false;
        }
    }
    else {
        if (sizeMB <= 5) {
            return true;
        } else {
            Alert.showAlert(Constants.warning, Constants.labels_for_non_react_files.file_size_error_message)
            return false;
        }
    }
}


export function checkUrlFormat(str) {
    var pattern = new RegExp(
        '^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$',
        'i',
    ); // fragment locator
    return pattern.test(str);
}


export function checkPasswordFormat(password) {
    const passwordCheck = /^[A-Za-z]\w{7,14}$/;
    return passwordCheck.test(password);

}

export function checkZipCodeFormat(zipCode) {
    const zipCodeCheck = /^[0-9]{6,6}$/;
    return zipCodeCheck.test(zipCode);
}
