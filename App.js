import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
// import { LogBox } from 'react-native';
import RootNavigation from "./src/navigation/RootNavigation"
import store from './src/redux/store'
import { Provider } from 'react-redux'
import { configureFonts, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import Colors from './src/assets/Colors';
import Toast from 'react-native-toast-message'
import { Root, Popup } from 'popup-ui'
// import { LogBox } from "react-native";

// if (__DEV__) {
//   const ignoreWarns = [
//     "EventEmitter.removeListener",
//     "[fuego-swr-keys-from-collection-path]",
//     "Setting a timer for a long period of time",
//     "ViewPropTypes will be removed from React Native",
//     "AsyncStorage has been extracted from react-native",
//     "exported from 'deprecated-react-native-prop-types'.",
//     "Non-serializable values were found in the navigation state.",
//     "VirtualizedLists should never be nested inside plain ScrollViews",
//   ];

//   const warn = console.warn;
//   console.warn = (...arg) => {
//     for (const warning of ignoreWarns) {
//       if (arg[0].startsWith(warning)) {
//         return;
//       }
//     }
//     warn(...arg);
//   };

//   LogBox.ignoreLogs(ignoreWarns);
// }


export default function App() {
    const fontConfig = {
        web: {
            regular: {
                fontFamily: 'Poppins-Regular',
                fontWeight: 'normal',
            },
            medium: {
                fontFamily: 'Poppins-Medium',
                fontWeight: 'normal',
            },
            bold: {
                fontFamily: 'Poppins-Bold',
                fontWeight: 'normal',
            },
        },
        ios: {
            regular: {
                fontFamily: 'Poppins-Regular',
                fontWeight: 'normal',
            },
            medium: {
                fontFamily: 'Poppins-Medium',
                fontWeight: 'normal',
            },
            bold: {
                fontFamily: 'Poppins-Bold',
                fontWeight: 'normal',
            },
        },
        android: {
            regular: {
                fontFamily: 'Poppins-Regular',
                fontWeight: 'normal',
            },
            medium: {
                fontFamily: 'Poppins-Medium',
                fontWeight: 'normal',
            },
            bold: {
                fontFamily: 'Poppins-Bold',
                fontWeight: 'normal',
            },
        }
    };

    const theme = {
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
            primary: Colors.primary,
            error: Colors.red
            //accent: Colors.secondary,
        },
        fonts: configureFonts(fontConfig),
    };
    return (
        // <Root>
        <Provider store={store}>
            <PaperProvider theme={theme}>
                <RootNavigation />
                <Toast  />
            </PaperProvider>
        </Provider>
        // </Root>
    )
}

