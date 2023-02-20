import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    color: 'red',
}

export const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        changeTextColor: (state, action) => { 
            state.color = action.payload
        },
    },
})


// Action creators are generated for each case reducer function
export const { changeTextColor } = themeSlice.actions

export default themeSlice.reducer