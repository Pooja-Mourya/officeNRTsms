import { configureStore } from '@reduxjs/toolkit'
import counterSlice from './reduxSlicer'
// import counterSlice from "./reduxSlicer"
import themeReducer from '../redux/theme/ThemeSlice'
export default configureStore({
    reducer: {
        global_store: counterSlice,
        theme: themeReducer,
    }

})